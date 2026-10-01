import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function SelectAddressScreen({
  currentSelected = 'Home',
  onBack,
  onSelectAddress,
}) {
  const [selected, setSelected] = useState(currentSelected);

  const addressOptions = [
    {
      id: 'Home',
      label: 'Home',
      street: '123 Green Park, New Delhi',
      icon: '🏠',
    },
    {
      id: 'Work',
      label: 'Work',
      street: 'Tech Park, Gurgaon',
      icon: '🏢',
    },
    {
      id: 'Other',
      label: 'Other',
      street: '+ Add a new address',
      icon: '📍',
      isAddAction: true,
    },
  ];

  const handleContinue = () => {
    const item = addressOptions.find((a) => a.id === selected) || addressOptions[0];
    if (onSelectAddress) {
      onSelectAddress(item);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <View style={styles.container}>
        {/* Header matching screen_14 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Address</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {addressOptions.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.addressCard,
                  isSelected && styles.addressCardSelected,
                ]}
                onPress={() => setSelected(opt.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.iconCircle,
                      isSelected && styles.iconCircleSelected,
                    ]}
                  >
                    <Text style={styles.iconEmoji}>{opt.icon}</Text>
                  </View>
                  <View style={styles.textCol}>
                    <Text
                      style={[
                        styles.addressLabel,
                        isSelected && styles.addressLabelSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text style={styles.streetText}>{opt.street}</Text>
                  </View>
                </View>

                {opt.isAddAction ? (
                  <Text style={styles.chevron}>›</Text>
                ) : (
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            activeOpacity={0.88}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f6ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f2c6e',
    marginTop: -3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f2c6e',
  },
  scrollContent: {
    paddingBottom: 20,
    gap: 12,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...SHADOWS.sm,
  },
  addressCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  iconCircleSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  iconEmoji: {
    fontSize: 20,
  },
  textCol: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f2c6e',
    marginBottom: 3,
  },
  addressLabelSelected: {
    color: '#2563eb',
  },
  streetText: {
    fontSize: 13,
    color: '#5f7da6',
    fontWeight: '500',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  radioCircleSelected: {
    borderColor: '#2563eb',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563eb',
  },
  chevron: {
    fontSize: 24,
    color: '#94a3b8',
    fontWeight: '600',
    marginLeft: 10,
  },
  footer: {
    paddingTop: 8,
  },
  continueBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.primaryBtn,
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
