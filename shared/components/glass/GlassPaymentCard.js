import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import GlassButton from './GlassButton';

export default function GlassPaymentCard({
  balance = 100,
  bonusAmount = 100,
  onAddMoney,
  style
}) {
  const { theme, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.glassSurfaceStrong,
          borderColor: theme.border
        },
        shadows.glass,
        style
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.balanceInfo}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            KaamDost Wallet Balance
          </Text>
          <View style={styles.amountRow}>
            <Text style={[styles.amount, { color: theme.textPrimary }]}>
              ₹{balance}
            </Text>
            {bonusAmount > 0 && (
              <View style={[styles.bonusTag, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.bonusText, { color: theme.textPrimary }]}>
                  ₹{bonusAmount} Joining Bonus Active
                </Text>
              </View>
            )}
          </View>
        </View>

        {onAddMoney ? (
          <GlassButton
            title="+ Add Funds"
            onPress={onAddMoney}
            variant="primary"
            size="sm"
          />
        ) : null}
      </View>

      <View style={[styles.featuresRow, { borderTopColor: theme.borderLight }]}>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>⚡</Text>
          <Text style={[styles.featureText, { color: theme.textSecondary }]}>
            Instant UPI
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>🛡️</Text>
          <Text style={[styles.featureText, { color: theme.textSecondary }]}>
            100% Escrow Protected
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>₹</Text>
          <Text style={[styles.featureText, { color: theme.textSecondary }]}>
            Zero Booking Fee
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 16,
    marginVertical: 6
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  balanceInfo: {
    flex: 1
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.2
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap'
  },
  amount: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginRight: 8
  },
  bonusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  bonusText: {
    fontSize: 10,
    fontWeight: '700'
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 10
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  featureEmoji: {
    fontSize: 12,
    marginRight: 4
  },
  featureText: {
    fontSize: 11,
    fontWeight: '500'
  }
});
