import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { getBaseUrl } from '../../api/client';

export default function VoicePlayer({ text, lang = 'te', label = 'వాయిస్ వినండి (Listen Voice)' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const baseUrl = getBaseUrl();
  const audioUrl = `${baseUrl}/api/tts?lang=${lang}&text=${encodeURIComponent(text || '')}`;

  const audioHtml = `
    <!DOCTYPE html>
    <html>
    <body>
      <audio id="player" src="${audioUrl}" autoplay onended="window.ReactNativeWebView.postMessage('ended')" onerror="window.ReactNativeWebView.postMessage('error')"></audio>
    </body>
    </html>
  `;

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      {isPlaying && (
        <View style={styles.hiddenAudio}>
          <WebView
            source={{ html: audioHtml }}
            onMessage={(e) => {
              if (e.nativeEvent.data === 'ended' || e.nativeEvent.data === 'error') {
                setIsPlaying(false);
              }
            }}
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, isPlaying && styles.buttonActive]}
        onPress={handleTogglePlay}
        activeOpacity={0.8}
      >
        <Text style={styles.icon}>{isPlaying ? '🔊' : '🗣️'}</Text>
        <Text style={styles.label}>{isPlaying ? 'ప్లే అవుతోంది... (Playing)' : label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4
  },
  hiddenAudio: {
    width: 0,
    height: 0,
    position: 'absolute'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(234,88,12,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(234,88,12,0.3)',
    alignSelf: 'flex-start'
  },
  buttonActive: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderColor: 'rgba(34,197,94,0.4)'
  },
  icon: {
    fontSize: 16
  },
  label: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '700'
  }
});
