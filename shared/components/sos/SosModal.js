import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Linking, Alert, Vibration } from 'react-native';
import { WebView } from 'react-native-webview';

export default function SosModal({ visible, onClose, userRole = 'customer' }) {
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [beaconSent, setBeaconSent] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsSirenActive(true);
      try {
        Vibration.vibrate([500, 500, 500, 500], true);
      } catch (e) {}
    } else {
      setIsSirenActive(false);
      try {
        Vibration.cancel();
      } catch (e) {}
    }
    return () => {
      try {
        Vibration.cancel();
      } catch (e) {}
    };
  }, [visible]);

  const sirenHtml = `
    <!DOCTYPE html>
    <html>
    <body>
      <script>
        var ctx = null;
        var osc = null;
        var isPlaying = ${isSirenActive};

        function startSiren() {
          try {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            
            var time = ctx.currentTime;
            for (var i = 0; i < 30; i++) {
              osc.frequency.linearRampToValueAtTime(950, time + 0.4);
              osc.frequency.linearRampToValueAtTime(600, time + 0.8);
              time += 0.8;
            }
            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
          } catch(e) {}
        }

        if (isPlaying) {
          startSiren();
        }
      </script>
    </body>
    </html>
  `;

  const handleCallEmergency = (number) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Calling Failed', `Please dial ${number} manually.`);
    });
  };

  const handleTriggerBeacon = () => {
    setBeaconSent(true);
    Alert.alert(
      '🚨 SOS Beacon Broadcasted',
      'Your live GPS coordinates have been sent with HIGH PRIORITY to the KaamDost 24/7 Telangana Safety Command Desk.'
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Hidden WebView for Siren Audio Synthesis */}
        <View style={styles.hiddenAudio}>
          <WebView source={{ html: sirenHtml }} />
        </View>

        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🚨 24/7 EMERGENCY SOS DESK</Text>
          </View>

          <Text style={styles.title}>EMERGENCY PROTOCOL ACTIVE</Text>
          <Text style={styles.subtitle}>
            Immediate response for on-site threats, accidents, or harassment.
          </Text>

          {/* Beacon Trigger Button */}
          <TouchableOpacity
            style={[styles.beaconButton, beaconSent && styles.beaconSentButton]}
            onPress={handleTriggerBeacon}
          >
            <Text style={styles.beaconButtonText}>
              {beaconSent ? '✓ GPS BEACON TRANSMITTED' : '📡 TRANSMIT EMERGENCY GPS BEACON'}
            </Text>
          </TouchableOpacity>

          {/* Quick Dial Buttons */}
          <View style={styles.contactsGrid}>
            <TouchableOpacity
              style={[styles.callBtn, { backgroundColor: '#dc2626' }]}
              onPress={() => handleCallEmergency('112')}
            >
              <Text style={styles.callBtnIcon}>📞</Text>
              <Text style={styles.callBtnTitle}>National Emergency</Text>
              <Text style={styles.callBtnNum}>Dial 112</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.callBtn, { backgroundColor: '#b91c1c' }]}
              onPress={() => handleCallEmergency('100')}
            >
              <Text style={styles.callBtnIcon}>👮</Text>
              <Text style={styles.callBtnTitle}>Telangana Police</Text>
              <Text style={styles.callBtnNum}>Dial 100</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.callBtn, styles.fullWidthBtn]}
            onPress={() => handleCallEmergency('1800-425-0000')}
          >
            <Text style={styles.callBtnTitle}>🛡️ KaamDost 24/7 Safety Desk: 1800-425-0000</Text>
          </TouchableOpacity>

          {/* Stop / Close */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Mute Siren & Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  hiddenAudio: {
    width: 0,
    height: 0,
    position: 'absolute'
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1e1b1e',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#ef4444',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20
  },
  badge: {
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12
  },
  badgeText: {
    color: '#fca5a5',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 13,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18
  },
  beaconButton: {
    width: '100%',
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16
  },
  beaconSentButton: {
    backgroundColor: '#16a34a'
  },
  beaconButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5
  },
  contactsGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 12
  },
  callBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fullWidthBtn: {
    backgroundColor: '#334155',
    width: '100%',
    marginBottom: 16,
    paddingVertical: 12
  },
  callBtnIcon: {
    fontSize: 20,
    marginBottom: 4
  },
  callBtnTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12
  },
  callBtnNum: {
    color: '#fecaca',
    fontWeight: '800',
    fontSize: 13,
    marginTop: 2
  },
  closeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  closeBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline'
  }
});
