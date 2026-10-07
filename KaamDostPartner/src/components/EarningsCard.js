import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';

export default function EarningsCard({
  todayEarnings = 1850,
  onRequestPayout
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: 'rgba(26, 38, 57, 0.72)',
            borderColor: 'rgba(255, 255, 255, 0.16)'
          }
        ]}
      >
        {/* Title */}
        <Text style={styles.title}>Today's Earnings</Text>

        {/* Amount */}
        <Text style={styles.amount}>₹{todayEarnings.toLocaleString('en-IN')}</Text>

        {/* Instant UPI Transfer Button */}
        <TouchableOpacity
          style={styles.upiBtn}
          onPress={onRequestPayout}
          activeOpacity={0.85}
        >
          <View style={styles.upiLogoBox}>
            <Text style={styles.upiText}>UPI</Text>
          </View>
          <Text style={styles.upiBtnLabel}>Instant UPI Transfer 💸</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 16,
    marginVertical: 8
  },
  card: {
    borderRadius: 24,
    borderWidth: 1.2,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 0
  },
  title: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.1
  },
  amount: {
    color: '#FF6B00',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginVertical: 8
  },
  upiBtn: {
    backgroundColor: '#FF6B00',
    width: '100%',
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    elevation: 0
  },
  upiLogoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginRight: 8
  },
  upiText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    fontStyle: 'italic'
  },
  upiBtnLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  }
});
