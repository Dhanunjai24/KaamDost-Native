import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Animated,
  ScrollView,
  Platform,
  PermissionsAndroid,
  NativeModules,
  DeviceEventEmitter
} from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import { parseQueryWithLLM, extractKeywordsFromText, TRADE_ICONS } from '../services/llmVoiceSearch';

const { SpeechRecognitionModule } = NativeModules;

const SAMPLE_VOICE_QUERIES = [
  { label: '💧 Water tank kadagali', query: 'water tank kadagali' },
  { label: '⚡ Switchboard kaalindi fan thiragadam ledu', query: 'switchboard kaalindi fan thiragadam ledu' },
  { label: '🚰 Tap leak avtundi pipe karuthondi', query: 'bathroom tap leak avtundi pipe karuthondi' },
  { label: '🎨 Illu rangu veyyali', query: 'illu mottam rangu veyyali putty tho' },
  { label: '🪚 Carpenter kavali talupu irigindi', query: 'door talupu irigindi carpenter kavali' },
  { label: '❄️ AC cooling ravadam ledu', query: 'AC cooling ravadam ledu service cheyali' },
  { label: '🧱 Centering mestri kavali', query: 'slabu veyadaniki centering mestri kavali' },
  { label: '👷 Hamali / Coolie samaan dimpali', query: 'samaan dimpali hamali coolie labour kavali' },
  { label: '🚜 Bore motor aagipoyindi', query: 'borewell motor aagipoyindi నీటి మోటార్' }
];

const SUPPORTED_LANGUAGES = [
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'en-IN', label: 'English / Hinglish' },
  { code: 'hi-IN', label: 'हिंदी (Hindi)' }
];

export default function VoiceSearchModal({ visible, onClose, onSelectResult }) {
  const { theme, shadows } = useTheme();

  // State
  const [selectedLang, setSelectedLang] = useState('te-IN');
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveKeywords, setLiveKeywords] = useState([]);
  const [llmResult, setLlmResult] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [speechStatus, setSpeechStatus] = useState('idle');

  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rmsAnim = useRef(new Animated.Value(1)).current;
  const countdownTimerRef = useRef(null);
  const autoLoopAnim = useRef(null);

  // Pulse animation loop
  const startPulseAnimation = () => {
    if (autoLoopAnim.current) autoLoopAnim.current.stop();
    autoLoopAnim.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 700,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true
        })
      ])
    );
    autoLoopAnim.current.start();
  };

  const stopPulseAnimation = () => {
    if (autoLoopAnim.current) {
      autoLoopAnim.current.stop();
      autoLoopAnim.current = null;
    }
    pulseAnim.setValue(1);
    rmsAnim.setValue(1);
  };

  // Request Android Audio Permission
  const requestAudioPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'KaamDost Voice Search Permission',
          message: 'KaamDost needs microphone access to convert your voice to text for trade search.',
          buttonPositive: 'Grant Mic'
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Audio permission request failed:', err);
      return false;
    }
  };

  // Start Speech Recognition
  const startListening = async (lang = selectedLang) => {
    // Clear countdown if running
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
      setCountdown(null);
    }

    setLlmResult(null);
    setLiveKeywords([]);
    setInputText('');
    setSpeechStatus('requesting');

    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      setSpeechStatus('permission_denied');
      return;
    }

    if (SpeechRecognitionModule && SpeechRecognitionModule.startListening) {
      try {
        setIsListening(true);
        setSpeechStatus('listening');
        startPulseAnimation();
        await SpeechRecognitionModule.startListening(lang);
      } catch (err) {
        console.warn('Native speech recognition start failed:', err);
        setSpeechStatus('service_unavailable');
        setIsListening(false);
        stopPulseAnimation();
      }
    } else {
      setSpeechStatus('mock_listening');
      setIsListening(true);
      startPulseAnimation();
    }
  };

  // Stop Speech Recognition
  const stopListening = async () => {
    setIsListening(false);
    stopPulseAnimation();
    if (SpeechRecognitionModule && SpeechRecognitionModule.stopListening) {
      try {
        await SpeechRecognitionModule.stopListening();
      } catch (e) {
        // Ignore
      }
    }
    if (inputText.trim()) {
      handleProcessQuery(inputText);
    }
  };

  // Native Speech Event Listeners
  useEffect(() => {
    if (!visible) return;

    const subReady = DeviceEventEmitter.addListener('onSpeechReady', () => {
      setSpeechStatus('ready');
    });

    const subStart = DeviceEventEmitter.addListener('onSpeechStart', () => {
      setSpeechStatus('listening');
    });

    const subRms = DeviceEventEmitter.addListener('onSpeechRmsChanged', (e) => {
      if (e && typeof e.rms === 'number') {
        const scale = Math.max(1, Math.min(1.4, 1 + e.rms / 20));
        Animated.timing(rmsAnim, {
          toValue: scale,
          duration: 100,
          useNativeDriver: true
        }).start();
      }
    });

    const subPartial = DeviceEventEmitter.addListener('onSpeechPartialResults', (e) => {
      if (e && e.text) {
        setInputText(e.text);
        const kws = extractKeywordsFromText(e.text);
        setLiveKeywords(kws);
      }
    });

    const subResults = DeviceEventEmitter.addListener('onSpeechResults', (e) => {
      stopPulseAnimation();
      setIsListening(false);
      setSpeechStatus('processing');
      const finalTranscript = e?.text || inputText;
      if (finalTranscript) {
        setInputText(finalTranscript);
        const kws = extractKeywordsFromText(finalTranscript);
        setLiveKeywords(kws);
        handleProcessQuery(finalTranscript);
      }
    });

    const subEnd = DeviceEventEmitter.addListener('onSpeechEnd', () => {
      setIsListening(false);
      stopPulseAnimation();
      setSpeechStatus('processing');
    });

    const subError = DeviceEventEmitter.addListener('onSpeechError', (e) => {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
      stopPulseAnimation();
      setSpeechStatus('error');
    });

    // Auto-start listening on open
    startListening(selectedLang);

    return () => {
      subReady.remove();
      subStart.remove();
      subRms.remove();
      subPartial.remove();
      subResults.remove();
      subEnd.remove();
      subError.remove();

      if (SpeechRecognitionModule && SpeechRecognitionModule.destroy) {
        SpeechRecognitionModule.destroy().catch(() => {});
      }
      stopPulseAnimation();
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [visible, selectedLang]);

  // Process Query via LLM & Auto-Display Trade
  const handleProcessQuery = async (queryText) => {
    const q = queryText || inputText;
    if (!q || !q.trim()) return;

    setIsAnalyzing(true);
    setIsListening(false);
    stopPulseAnimation();

    try {
      const result = await parseQueryWithLLM(q);
      setLlmResult(result);
      setLiveKeywords(result.detectedKeywords || []);

      // Start 3-second auto-navigate countdown
      setCountdown(3);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

      let currentSec = 3;
      countdownTimerRef.current = setInterval(() => {
        currentSec -= 1;
        setCountdown(currentSec);
        if (currentSec <= 0) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
          // Auto-confirm & display trade workers
          if (onSelectResult) {
            onSelectResult(result.tradeId, result.tradeName, result.query);
            onClose();
          }
        }
      }, 1000);
    } catch (err) {
      console.warn('LLM Trade classification error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmResult = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (llmResult && onSelectResult) {
      onSelectResult(llmResult.tradeId, llmResult.tradeName, llmResult.query);
      onClose();
    }
  };

  const handleCancelCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
      setCountdown(null);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.glassSurfaceStrong,
              borderColor: theme.borderStrong
            },
            shadows.large
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.aiTag}>
              <Text style={styles.aiTagText}>✨ KAAMDOST AI VOICE & LLM</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                handleCancelCountdown();
                onClose();
              }}
              style={styles.closeBtn}
            >
              <Text style={[styles.closeText, { color: theme.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Title & Pipeline Steps Bar */}
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Voice & Colloquial Slang Search
          </Text>

          {/* Visual 4-Step Pipeline Indicator */}
          <View style={styles.stepsBar}>
            <View style={[styles.stepItem, isListening && styles.stepItemActive]}>
              <Text style={[styles.stepNum, isListening && styles.stepNumActive]}>1</Text>
              <Text style={[styles.stepLabel, isListening && styles.stepLabelActive]}>Voice Input</Text>
            </View>
            <Text style={styles.stepArrow}>›</Text>
            <View style={[styles.stepItem, inputText && !llmResult && styles.stepItemActive]}>
              <Text style={[styles.stepNum, inputText && !llmResult && styles.stepNumActive]}>2</Text>
              <Text style={[styles.stepLabel, inputText && !llmResult && styles.stepLabelActive]}>Speech-to-Text</Text>
            </View>
            <Text style={styles.stepArrow}>›</Text>
            <View style={[styles.stepItem, liveKeywords.length > 0 && styles.stepItemActive]}>
              <Text style={[styles.stepNum, liveKeywords.length > 0 && styles.stepNumActive]}>3</Text>
              <Text style={[styles.stepLabel, liveKeywords.length > 0 && styles.stepLabelActive]}>Keywords</Text>
            </View>
            <Text style={styles.stepArrow}>›</Text>
            <View style={[styles.stepItem, llmResult && styles.stepItemActive]}>
              <Text style={[styles.stepNum, llmResult && styles.stepNumActive]}>4</Text>
              <Text style={[styles.stepLabel, llmResult && styles.stepLabelActive]}>Auto-Display Trade</Text>
            </View>
          </View>

          {/* Language Selection Chips */}
          <View style={styles.langSelectorRow}>
            {SUPPORTED_LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[
                  styles.langChip,
                  selectedLang === l.code && {
                    backgroundColor: theme.accentPrimary,
                    borderColor: theme.accentPrimary
                  }
                ]}
                onPress={() => {
                  setSelectedLang(l.code);
                  startListening(l.code);
                }}
              >
                <Text
                  style={[
                    styles.langChipText,
                    selectedLang === l.code
                      ? { color: '#FFFFFF', fontWeight: '800' }
                      : { color: theme.textSecondary }
                  ]}
                >
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 1. User Voice Input: Animated Mic Wave Area */}
          <View style={styles.micSection}>
            <Animated.View
              style={[
                styles.micPulse,
                {
                  transform: [
                    { scale: isListening ? Animated.multiply(pulseAnim, rmsAnim) : 1 }
                  ],
                  borderColor: isListening ? theme.accentPrimary : theme.border,
                  backgroundColor: isListening ? theme.primaryLight : theme.glassSurface
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.micButton,
                  { backgroundColor: isListening ? '#EF4444' : theme.accentPrimary }
                ]}
                onPress={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    startListening(selectedLang);
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.micEmoji}>{isListening ? '⏹️' : '🎙️'}</Text>
              </TouchableOpacity>
            </Animated.View>

            <Text style={[styles.listeningStatusText, { color: theme.textPrimary }]}>
              {isAnalyzing
                ? '🤖 LLM analyzing voice transcription & keywords...'
                : isListening
                ? '🎙️ Listening... Speak naturally in Telugu or English'
                : speechStatus === 'permission_denied'
                ? '⚠️ Microphone permission needed. Tap samples below.'
                : 'Tap mic to speak or select a query below'}
            </Text>
          </View>

          {/* 2. Speech-to-Text: Live Transcript Area */}
          <View
            style={[
              styles.transcriptBox,
              {
                backgroundColor: theme.surface,
                borderColor: isListening ? theme.accentPrimary : theme.border
              }
            ]}
          >
            <View style={styles.transcriptHeader}>
              <Text style={styles.transcriptTag}>
                {isListening ? '🔴 LIVE TRANSCRIPTION' : '📝 SPEECH INPUT'}
              </Text>
            </View>
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="e.g. water tank kadagali / switchboard kaalindi..."
              placeholderTextColor={theme.textMuted}
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
                setLiveKeywords(extractKeywordsFromText(text));
              }}
              onSubmitEditing={() => handleProcessQuery(inputText)}
            />
            {inputText ? (
              <TouchableOpacity
                style={[styles.searchGoBtn, { backgroundColor: theme.accentPrimary }]}
                onPress={() => handleProcessQuery(inputText)}
              >
                <Text style={styles.searchGoText}>Detect Trade ➜</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* 3. Keyword Detection: Real-Time Tag Bubbles */}
          {liveKeywords.length > 0 ? (
            <View style={styles.keywordsSection}>
              <Text style={[styles.keywordHeading, { color: theme.textSecondary }]}>
                ⚡ DETECTED KEYWORDS:
              </Text>
              <View style={styles.keywordChipsRow}>
                {liveKeywords.map((kw, i) => (
                  <View key={i} style={styles.detectedKeywordBadge}>
                    <Text style={styles.detectedKeywordText}>🏷️ {kw}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* 4. Auto-Display Trade Card */}
          {isAnalyzing ? (
            <View style={styles.analyzingCard}>
              <ActivityIndicator size="small" color={theme.accentPrimary} />
              <Text style={[styles.analyzingText, { color: theme.accentPrimary }]}>
                Matching slang keywords to trade catalogue...
              </Text>
            </View>
          ) : llmResult ? (
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor: '#ECFDF5',
                  borderColor: '#10B981'
                }
              ]}
            >
              <View style={styles.resultHeader}>
                <View style={styles.resultBadgeWrap}>
                  <Text style={styles.resultBadge}>🎯 AUTO-DETECTED TRADE</Text>
                  <Text style={styles.confidenceBadge}>
                    {llmResult.confidence}% Match
                  </Text>
                </View>
                <Text style={styles.resultLang}>🗣️ {llmResult.detectedLanguage}</Text>
              </View>

              <View style={styles.tradeTitleRow}>
                <Text style={styles.tradeIcon}>{llmResult.icon || '🛠️'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultTradeName}>{llmResult.tradeName}</Text>
                  <Text style={styles.tradeRate}>
                    Standard Wage: ₹{llmResult.matchedTrade?.dailyRate || 850}/day
                  </Text>
                </View>
              </View>

              <Text style={styles.resultExplanation}>{llmResult.explanation}</Text>

              {/* Auto-display Countdown Progress */}
              {countdown !== null && (
                <View style={styles.countdownBanner}>
                  <Text style={styles.countdownText}>
                    ⚡ Auto-displaying workers in {countdown}s...
                  </Text>
                  <TouchableOpacity
                    onPress={handleCancelCountdown}
                    style={styles.cancelCountdownBtn}
                  >
                    <Text style={styles.cancelCountdownText}>Pause</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: theme.accentPrimary }]}
                onPress={handleConfirmResult}
                activeOpacity={0.85}
              >
                <Text style={styles.actionBtnText}>
                  View {llmResult.tradeName} Workers ➜
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Quick Voice Chips (Telugu & Hinglish Slang) */}
          <Text style={[styles.sampleTitle, { color: theme.textSecondary }]}>
            💡 Or tap common Telugu & Hinglish voice queries:
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {SAMPLE_VOICE_QUERIES.map((sq, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.chip,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border
                  }
                ]}
                onPress={() => {
                  setInputText(sq.query);
                  const kws = extractKeywordsFromText(sq.query);
                  setLiveKeywords(kws);
                  handleProcessQuery(sq.query);
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, { color: theme.textPrimary }]}>
                  {sq.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end'
  },
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.2,
    padding: 20,
    maxHeight: '92%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  aiTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE'
  },
  aiTagText: {
    color: '#4338CA',
    fontSize: 10,
    fontWeight: '800'
  },
  closeBtn: {
    padding: 6
  },
  closeText: {
    fontSize: 18,
    fontWeight: '700'
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8
  },
  stepsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.5
  },
  stepItemActive: {
    opacity: 1
  },
  stepNum: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#9CA3AF',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 16
  },
  stepNumActive: {
    backgroundColor: '#2563EB'
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563'
  },
  stepLabelActive: {
    color: '#1D4D9F',
    fontWeight: '800'
  },
  stepArrow: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '700'
  },
  langSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10
  },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB'
  },
  langChipText: {
    fontSize: 11,
    fontWeight: '600'
  },
  micSection: {
    alignItems: 'center',
    marginVertical: 6
  },
  micPulse: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  micButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  micEmoji: {
    fontSize: 24
  },
  listeningStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center'
  },
  transcriptBox: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 6
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  transcriptTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5
  },
  input: {
    fontSize: 13,
    paddingVertical: 4
  },
  searchGoBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 4
  },
  searchGoText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  keywordsSection: {
    marginVertical: 4
  },
  keywordHeading: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  keywordChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  detectedKeywordBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  detectedKeywordText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E'
  },
  analyzingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginVertical: 6
  },
  analyzingText: {
    fontSize: 12,
    fontWeight: '700'
  },
  resultCard: {
    borderRadius: 14,
    borderWidth: 1.8,
    padding: 14,
    marginVertical: 8
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  resultBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  resultBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669'
  },
  confidenceBadge: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  resultLang: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46'
  },
  tradeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4
  },
  tradeIcon: {
    fontSize: 32
  },
  resultTradeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46'
  },
  tradeRate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857'
  },
  resultExplanation: {
    fontSize: 11,
    color: '#047857',
    marginVertical: 4
  },
  countdownBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 6
  },
  countdownText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46'
  },
  cancelCountdownBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#A7F3D0'
  },
  cancelCountdownText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46'
  },
  actionBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  sampleTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 6
  },
  chipsScroll: {
    gap: 8,
    paddingBottom: 6
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600'
  }
});
