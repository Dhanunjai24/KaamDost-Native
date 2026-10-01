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
      icon: '📍',
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
      street: 'Add a new address',
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
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
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

        {/* Continue Button matching screen_14 */}
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
    backgroundColor: '#f0f7ff',
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
    marginBottom: 20,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d4ed8',
    marginTop: -3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f294a',
  },
  scrollContent: {
    gap: 14,
    paddingBottom: 20,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
  },
  addressCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
    ...SHADOWS.medium,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCircleSelected: {
    backgroundColor: '#dbeafe',
  },
  iconEmoji: {
    fontSize: 20,
  },
  textCol: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f294a',
  },
  addressLabelSelected: {
    color: '#1d4ed8',
    fontWeight: '800',
  },
  streetText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
  },
  chevron: {
    fontSize: 24,
    color: '#94a3b8',
    fontWeight: '600',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
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
  footer: {
    paddingTop: 10,
  },
  continueBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.buttonGlow,
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
