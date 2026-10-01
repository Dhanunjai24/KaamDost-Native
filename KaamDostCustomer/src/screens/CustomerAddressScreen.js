import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function CustomerAddressScreen({ onContinue, onBack }) {
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [addresses, setAddresses] = useState([
    {
      id: 'home',
      label: 'Home',
      street: '123 Green Park, New Delhi',
      city: 'New Delhi',
      icon: '📍',
    },
    {
      id: 'work',
      label: 'Work',
      street: 'Tech Park, Gurgaon',
      city: 'Gurgaon',
      icon: '🏢',
    },
    {
      id: 'other',
      label: 'Other',
      street: 'Add a new address',
      city: '',
      icon: '📍',
      isAddAction: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('New Delhi');

  const handleSelect = (addr) => {
    if (addr.isAddAction) {
      setShowAddModal(true);
    } else {
      setSelectedAddress(addr.id);
    }
  };

  const handleSaveNewAddress = () => {
    if (!newStreet.trim()) return;
    const newId = 'addr_' + Date.now();
    const newObj = {
      id: newId,
      label: newLabel,
      street: newStreet,
      city: newCity,
      icon: '📍',
    };
    setAddresses([newObj, ...addresses]);
    setSelectedAddress(newId);
    setShowAddModal(false);
    setNewStreet('');
  };

  const handleNext = () => {
    const active = addresses.find((a) => a.id === selectedAddress) || addresses[0];
    if (onContinue) {
      onContinue({
        address: {
          label: active.label,
          street: active.street,
          city: active.city || 'New Delhi',
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Top Back Navigation Arrow */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Heading Section */}
          <View style={styles.header}>
            <View style={styles.headerIconBox}>
              <Text style={styles.headerIcon}>📍</Text>
            </View>
            <Text style={styles.title}>Manage Your Addresses</Text>
            <Text style={styles.subtitle}>Save your frequently used addresses</Text>
          </View>

          {/* Address Cards List matching screen_05 */}
          <View style={styles.addressList}>
            {addresses.map((addr) => {
              const isSelected = selectedAddress === addr.id;
              return (
                <TouchableOpacity
                  key={addr.id}
                  style={[
                    styles.addressCard,
                    isSelected && styles.addressCardSelected,
                  ]}
                  onPress={() => handleSelect(addr)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardLeft}>
                    <View
                      style={[
                        styles.iconCircle,
                        isSelected && styles.iconCircleSelected,
                      ]}
                    >
                      <Text style={styles.pinEmoji}>{addr.icon}</Text>
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.addressLabel,
                          isSelected && styles.addressLabelSelected,
                        ]}
                      >
                        {addr.label}
                      </Text>
                      <Text style={styles.streetText}>{addr.street}</Text>
                    </View>
                  </View>

                  {/* Radio or Arrow indicator */}
                  {addr.isAddAction ? (
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
          </View>
        </ScrollView>

        {/* Action Buttons matching screen_05 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addAddressBtn}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.addAddressText}>Add Address</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleNext}
            activeOpacity={0.88}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Add Address Modal */}
        <Modal visible={showAddModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Address</Text>

              <Text style={styles.modalFieldLabel}>Label (e.g. Home, Office, Site)</Text>
              <TextInput
                style={styles.modalInput}
                value={newLabel}
                onChangeText={setNewLabel}
                placeholder="Home"
              />

              <Text style={styles.modalFieldLabel}>Street Address</Text>
              <TextInput
                style={styles.modalInput}
                value={newStreet}
                onChangeText={setNewStreet}
                placeholder="House No, Street, Landmark"
              />

              <Text style={styles.modalFieldLabel}>City</Text>
              <TextInput
                style={styles.modalInput}
                value={newCity}
                onChangeText={setNewCity}
                placeholder="New Delhi"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleSaveNewAddress}
                >
                  <Text style={styles.modalSaveText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 24,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.small,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d4ed8',
    marginTop: -3,
  },
  scroll: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 26,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerIcon: {
    fontSize: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f294a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    fontWeight: '500',
  },
  addressList: {
    gap: 14,
    marginBottom: 20,
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
    paddingRight: 12,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCircleSelected: {
    backgroundColor: '#dbeafe',
  },
  pinEmoji: {
    fontSize: 20,
  },
  textContainer: {
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
    marginTop: 4,
    lineHeight: 18,
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
    gap: 12,
    paddingTop: 10,
  },
  addAddressBtn: {
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAddressText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '700',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    ...SHADOWS.large,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f294a',
    marginBottom: 18,
  },
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: '#f8faff',
    borderWidth: 1.5,
    borderColor: '#dbeafe',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f294a',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  modalCancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  modalCancelText: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 14,
  },
  modalSaveBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  modalSaveText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
});
