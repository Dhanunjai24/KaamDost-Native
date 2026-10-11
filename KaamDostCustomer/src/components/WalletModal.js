import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassButton from '../../../shared/components/glass/GlassButton';

export default function WalletModal({
  visible,
  customer,
  onClose,
  onUpdateCustomer,
  onOpenDashboard
}) {
  const { theme, shadows } = useTheme();
  const currentBalance = customer?.walletBalance || 0;
  const [selectedTopUp, setSelectedTopUp] = useState(500);
  const [isProcessing, setIsProcessing] = useState(false);

  const topUpAmounts = [200, 500, 1000, 2000];

  const handleRecharge = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      const newBalance = currentBalance + selectedTopUp;
      const updatedCust = {
        ...(customer || {}),
        walletBalance: newBalance
      };

      try {
        await AsyncStorage.setItem('@kaamdost_user', JSON.stringify(updatedCust));
      } catch (e) {}

      if (onUpdateCustomer) {
        onUpdateCustomer(updatedCust);
      }
      setIsProcessing(false);
      Alert.alert(
        'Top-Up Successful! 🎉',
        `₹${selectedTopUp} has been added to your KaamDost Wallet via instant UPI. Current Balance: ₹${newBalance}`
      );
      onClose();
    }, 400);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: theme.glassSurfaceStrong,
              borderColor: theme.borderStrong
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
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                👛 KaamDost Customer Wallet
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                100% Protected • Zero Platform Cut • Instant UPI Recharge
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

          {/* Balance Card */}
          <View
            style={[
              styles.balanceCard,
              {
                backgroundColor: theme.primaryLight,
                borderColor: theme.border
              }
            ]}
          >
            <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
              Available Balance
            </Text>
            <Text style={[styles.balanceAmount, { color: theme.textPrimary }]}>
              ₹{currentBalance}
            </Text>
            <View style={styles.benefitRow}>
              <Text style={[styles.benefitText, { color: theme.accentPrimary }]}>
                ✓ Fast 1-Tap Booking Checkout & Automatic Worker OTP Settling
              </Text>
            </View>
          </View>

          {/* Top-up Selection */}
          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
            Select Recharge Amount
          </Text>
          <View style={styles.amountGrid}>
            {topUpAmounts.map((amt) => {
              const isSelected = selectedTopUp === amt;
              return (
                <TouchableOpacity
                  key={amt}
                  style={[
                    styles.amountChip,
                    {
                      backgroundColor: isSelected ? theme.accentPrimary : theme.glassSurface,
                      borderColor: isSelected ? theme.accentPrimary : theme.border
                    }
                  ]}
                  onPress={() => setSelectedTopUp(amt)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.amountText,
                      { color: isSelected ? '#FFFFFF' : theme.textPrimary }
                    ]}
                  >
                    + ₹{amt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Recharge Action */}
          <GlassButton
            title={isProcessing ? 'Processing UPI Recharge...' : `Recharge ₹${selectedTopUp} Instantly`}
            onPress={handleRecharge}
            disabled={isProcessing}
            variant="primary"
            size="lg"
            style={{ marginTop: 18 }}
          />

          {/* View Dashboard Link */}
          <TouchableOpacity
            style={styles.moreOptionsBtn}
            onPress={() => {
              onClose();
              if (onOpenDashboard) onOpenDashboard();
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.moreOptionsText, { color: theme.textSecondary }]}>
              View Full Transaction History & Account Settings →
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end'
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.2,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '80%'
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12
  },
  handle: {
    width: 44,
    height: 4.5,
    borderRadius: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1
  },
  headerInfo: {
    flex: 1,
    paddingRight: 10
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeIcon: {
    fontSize: 14,
    fontWeight: '700'
  },
  balanceCard: {
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    alignItems: 'center'
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600'
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginVertical: 4
  },
  benefitRow: {
    marginTop: 4
  },
  benefitText: {
    fontSize: 11,
    fontWeight: '700'
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 18,
    marginBottom: 10
  },
  amountGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  amountChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800'
  },
  moreOptionsBtn: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8
  },
  moreOptionsText: {
    fontSize: 12,
    fontWeight: '600'
  }
});
