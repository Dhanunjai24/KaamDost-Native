import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassButton from '../../../shared/components/glass/GlassButton';
import { useResponsive } from '../utils/responsive';
import { t } from '../../../shared/i18n';

export default function BookingModal({
  visible,
  trade,
  worker,
  customer,
  onClose,
  onConfirmBooking,
  onChangeTrade
}) {
  const { theme, shadows } = useTheme();
  const { isSmallScreen, isTablet } = useResponsive();
  const [days, setDays] = useState(1);
  const [urgency, setUrgency] = useState('instant'); // 'instant' or 'scheduled'
  const [workNotes, setWorkNotes] = useState('');
  const [images, setImages] = useState([]);

  const getInitialAddress = () => {
    if (customer?.address) {
      const a = customer.address;
      if (typeof a === 'string') return a;
      return [a.houseNo, a.street, a.landmark, a.city, a.pincode].filter(Boolean).join(', ');
    }
    return '';
  };

  const [address, setAddress] = useState(getInitialAddress());
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setAddress(getInitialAddress());
      setWorkNotes('');
      setImages([]);
    }
  }, [visible, customer]);

  const handleLaunchCamera = async () => {
    if (images.length >= 4) {
      Alert.alert('Photo Limit', 'You can upload a maximum of 4 photos for this work.');
      return;
    }
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'KaamDost requires camera access to take pictures of the work site.',
            buttonPositive: 'Grant'
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Camera permission is needed to capture photos.');
          return;
        }
      } catch (e) {
        // proceed
      }
    }

    launchCamera(
      { mediaType: 'photo', quality: 0.85, saveToPhotos: false },
      (res) => {
        if (res.didCancel || !res.assets || !res.assets[0]?.uri) return;
        setImages((prev) => [...prev, res.assets[0].uri]);
      }
    );
  };

  const handleLaunchGallery = () => {
    if (images.length >= 4) {
      Alert.alert('Photo Limit', 'You can upload a maximum of 4 photos for this work.');
      return;
    }
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.85, selectionLimit: 4 - images.length },
      (res) => {
        if (res.didCancel || !res.assets) return;
        const newUris = res.assets.map((a) => a.uri).filter(Boolean);
        setImages((prev) => [...prev, ...newUris].slice(0, 4));
      }
    );
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const dailyRate = worker?.dailyRate || trade?.dailyRate || 850;
  const subtotal = dailyRate * days;
  const platformFee = 49;
  const gst = Math.round(platformFee * 0.18);
  const total = subtotal + platformFee + gst;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const bookingId = 'BK-' + Date.now();
      onConfirmBooking({
        id: bookingId,
        trade: trade?.id || worker?.trade || 'masonry',
        tradeName: trade?.name || worker?.tradeName || 'Mason',
        workerId: worker?.id || null,
        workerName: worker?.name || 'Assigned Partner',
        workerPhone: worker?.phone || '',
        workerRating: worker?.rating || 4.9,
        days,
        dailyRate,
        totalAmount: total,
        address,
        workNotes,
        images,
        status: 'ARRIVING',
        startOtp: String(Math.floor(1000 + Math.random() * 9000)),
        estimatedArrival: '15 mins'
      });
      onClose();
    }, 250);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: theme.glassSurfaceStrong,
                borderColor: theme.borderStrong,
                maxWidth: isTablet ? 580 : undefined
              },
              shadows.large
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: theme.borderStrong }]} />
            </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.headerInfo}>
              <View style={styles.tradeTitleRow}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  Book {trade?.name || worker?.name || 'Dost'}
                </Text>
                {onChangeTrade && (
                  <TouchableOpacity
                    style={[
                      styles.changeTradePill,
                      {
                        backgroundColor: theme.primaryLight,
                        borderColor: theme.border
                      }
                    ]}
                    onPress={onChangeTrade}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.changeTradeText, { color: theme.accentPrimary }]}>
                      Select Trade ▾
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Telangana Labour Standard Daily Rate • Zero Worker Cut
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.primaryLight }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeIcon, { color: theme.textPrimary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.contentScroll}>
            {/* Duration Selector */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                SELECT DURATION (DAYS)
              </Text>
              <View
                style={[
                  styles.counterRow,
                  {
                    backgroundColor: theme.glassSurface,
                    borderColor: theme.border
                  }
                ]}
              >
                <TouchableOpacity
                  style={[styles.counterBtn, { backgroundColor: theme.primaryLight }]}
                  onPress={() => setDays(Math.max(1, days - 1))}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.counterBtnText, { color: theme.textPrimary }]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.counterValue, { color: theme.textPrimary }]}>
                  {days} Day{days > 1 ? 's' : ''}
                </Text>
                <TouchableOpacity
                  style={[styles.counterBtn, { backgroundColor: theme.primaryLight }]}
                  onPress={() => setDays(days + 1)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.counterBtnText, { color: theme.textPrimary }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Urgency */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                DISPATCH SPEED
              </Text>
              <View style={styles.urgencyRow}>
                <TouchableOpacity
                  style={[
                    styles.urgencyBtn,
                    {
                      backgroundColor: urgency === 'instant' ? theme.buttonPrimary : theme.glassSurface,
                      borderColor: urgency === 'instant' ? theme.buttonPrimary : theme.border
                    }
                  ]}
                  onPress={() => setUrgency('instant')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      {
                        color: urgency === 'instant' ? theme.buttonPrimaryText : theme.textPrimary,
                        fontWeight: urgency === 'instant' ? '800' : '600'
                      }
                    ]}
                  >
                    ⚡ Instant (Within 60s)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.urgencyBtn,
                    {
                      backgroundColor: urgency === 'scheduled' ? theme.buttonPrimary : theme.glassSurface,
                      borderColor: urgency === 'scheduled' ? theme.buttonPrimary : theme.border
                    }
                  ]}
                  onPress={() => setUrgency('scheduled')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      {
                        color: urgency === 'scheduled' ? theme.buttonPrimaryText : theme.textPrimary,
                        fontWeight: urgency === 'scheduled' ? '800' : '600'
                      }
                    ]}
                  >
                    📅 Schedule Tomorrow
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Service Address */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                SERVICE ADDRESS
              </Text>
              <View
                style={[
                  styles.inputBox,
                  {
                    backgroundColor: theme.glassSurface,
                    borderColor: theme.border
                  }
                ]}
              >
                <Text style={styles.pin}>📍</Text>
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter complete house address"
                  placeholderTextColor={theme.textMuted}
                />
              </View>
            </View>

            {/* Work Notes */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                WORK DETAILS & SPECIAL REQUIREMENTS
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: theme.glassSurface,
                    borderColor: theme.border,
                    color: theme.textPrimary
                  }
                ]}
                placeholder="e.g. Bring own welding machine, 20 bags of cement ready..."
                placeholderTextColor={theme.textMuted}
                value={workNotes}
                onChangeText={setWorkNotes}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Work & Site Images */}
            <View style={styles.section}>
              <View style={styles.uploadHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginBottom: 0 }]}>
                    WORK & SITE PHOTOS (OPTIONAL)
                  </Text>
                  <Text style={[styles.imageCountBadge, { backgroundColor: theme.primaryLight, color: theme.textPrimary }]}>
                    {images.length}/4
                  </Text>
                </View>
                <Text style={[styles.uploadHintText, { color: theme.textMuted }]}>
                  Max 4 photos
                </Text>
              </View>

              {/* Instant Action Buttons Row */}
              {images.length < 4 && (
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.instantBtn,
                      {
                        backgroundColor: theme.glassSurface,
                        borderColor: theme.border
                      }
                    ]}
                    onPress={handleLaunchCamera}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.instantBtnIcon}>📷</Text>
                    <View style={styles.instantBtnTexts}>
                      <Text style={[styles.instantBtnTitle, { color: theme.textPrimary }]}>
                        Take Photo
                      </Text>
                      <Text style={[styles.instantBtnSub, { color: theme.textMuted }]}>
                        Use Camera
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.instantBtn,
                      {
                        backgroundColor: theme.glassSurface,
                        borderColor: theme.border
                      }
                    ]}
                    onPress={handleLaunchGallery}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.instantBtnIcon}>🖼️</Text>
                    <View style={styles.instantBtnTexts}>
                      <Text style={[styles.instantBtnTitle, { color: theme.textPrimary }]}>
                        Choose Photos
                      </Text>
                      <Text style={[styles.instantBtnSub, { color: theme.textMuted }]}>
                        From Gallery
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {/* Large Image Thumbnails Scroll */}
              {images.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.imagesScroll}
                >
                  {images.map((uri, index) => (
                    <View
                      key={index}
                      style={[
                        styles.imageThumbContainer,
                        {
                          borderColor: theme.border,
                          backgroundColor: theme.glassSurface
                        }
                      ]}
                    >
                      <Image source={{ uri }} style={styles.imageThumb} resizeMode="cover" />
                      <TouchableOpacity
                        style={styles.removeImageBtn}
                        onPress={() => handleRemoveImage(index)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.removeImageText}>✕</Text>
                      </TouchableOpacity>
                      <View style={styles.photoIndexBadge}>
                        <Text style={styles.photoIndexText}>#{index + 1}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text style={[styles.emptyPhotosText, { color: theme.textMuted }]}>
                  Upload photos of the site or problem so workers bring the right tools.
                </Text>
              )}
            </View>

            {/* Bill Summary - Prominent Numbers */}
            <View
              style={[
                styles.billCard,
                {
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.border
                }
              ]}
            >
              <Text style={[styles.billTitle, { color: theme.textPrimary }]}>
                Price Estimate Breakdown
              </Text>

              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: theme.textSecondary }]}>
                  Daily Wage (₹{dailyRate} × {days} days)
                </Text>
                <Text style={[styles.billVal, { color: theme.textPrimary }]}>
                  ₹{subtotal}
                </Text>
              </View>

              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: theme.textSecondary }]}>
                  Govt Standard Safety & Admin Fee
                </Text>
                <Text style={[styles.billVal, { color: theme.textPrimary }]}>
                  ₹{platformFee}
                </Text>
              </View>

              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: theme.textSecondary }]}>
                  GST (18% on Admin Fee)
                </Text>
                <Text style={[styles.billVal, { color: theme.textPrimary }]}>
                  ₹{gst}
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.billRowTotal}>
                <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>
                  Total Payable Amount
                </Text>
                <Text style={[styles.totalVal, { color: theme.textPrimary }]}>
                  ₹{total}
                </Text>
              </View>

              <Text style={[styles.guaranteeText, { color: theme.success }]}>
                ✓ 100% Escrow Protection: Workers paid only after OTP start & work completion.
              </Text>
            </View>
          </ScrollView>

          {/* Footer CTAs */}
          <View style={[styles.footer, { borderTopColor: theme.borderLight }]}>
            <TouchableOpacity
              style={[
                styles.cancelBtn,
                {
                  backgroundColor: theme.glassSurface,
                  borderColor: theme.border,
                  borderWidth: 1
                }
              ]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <GlassButton
              title={isSubmitting ? 'Confirming Dispatch...' : `⚡ Confirm & Book (₹${total})`}
              onPress={handleConfirm}
              variant="primary"
              size="md"
              loading={isSubmitting}
              style={{ flex: 1 }}
            />
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Pressable>
  </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 35, 65, 0.25)',
    justifyContent: 'flex-end'
  },
  keyboardAvoid: {
    width: '100%',
    justifyContent: 'flex-end'
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.2,
    borderBottomWidth: 0,
    maxHeight: '85%',
    overflow: 'hidden',
    width: '100%',
    alignSelf: 'center'
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1
  },
  headerInfo: {
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  tradeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  changeTradePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1
  },
  changeTradeText: {
    fontSize: 11,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  closeIcon: {
    fontSize: 14,
    fontWeight: '700'
  },
  contentScroll: {
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  section: {
    marginBottom: 16
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    borderRadius: 14,
    borderWidth: 1
  },
  counterBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  counterBtnText: {
    fontSize: 20,
    fontWeight: '700'
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '800'
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 8
  },
  urgencyBtn: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center'
  },
  urgencyText: {
    fontSize: 12
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 3
  },
  pin: {
    fontSize: 16,
    marginRight: 6
  },
  input: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 8
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 70
  },
  billCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1
  },
  billTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  billLabel: {
    fontSize: 12
  },
  billVal: {
    fontSize: 12,
    fontWeight: '700'
  },
  divider: {
    height: 1,
    marginVertical: 8
  },
  billRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '900'
  },
  totalVal: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  guaranteeText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    lineHeight: 16
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelText: {
    fontWeight: '700',
    fontSize: 13
  },
  uploadHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  imageCountBadge: {
    fontSize: 10.5,
    fontWeight: '800',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden'
  },
  uploadHintText: {
    fontSize: 11,
    fontWeight: '600'
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10
  },
  instantBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.2
  },
  instantBtnIcon: {
    fontSize: 22,
    marginRight: 10
  },
  instantBtnTexts: {
    flex: 1
  },
  instantBtnTitle: {
    fontSize: 12.5,
    fontWeight: '800'
  },
  instantBtnSub: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1
  },
  imagesScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4
  },
  imageThumbContainer: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative'
  },
  imageThumb: {
    width: '100%',
    height: '100%'
  },
  removeImageBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF'
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 12
  },
  photoIndexBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  photoIndexText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800'
  },
  emptyPhotosText: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
    fontStyle: 'italic'
  }
});
