import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../shared/theme/ThemeContext';
import { useResponsive } from '../utils/responsive';
import GlassButton from '../../../shared/components/glass/GlassButton';

const ADDRESS_TYPES = [
  { id: 'Home', label: 'Home', icon: '🏠' },
  { id: 'Work', label: 'Work', icon: '💼' },
  { id: 'Site', label: 'Job Site', icon: '🏗️' },
  { id: 'Other', label: 'Other', icon: '📍' }
];

export default function EditAddressModal({
  visible,
  customer,
  onClose,
  onUpdateCustomer
}) {
  const { theme, shadows } = useTheme();
  const { isTablet } = useResponsive();

  const [addressType, setAddressType] = useState('Home');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      const a = customer?.address;
      if (a) {
        setAddressType(a.addressType || a.type || 'Home');
        setHouseNo(a.houseNo || '');
        setStreet(a.street || '');
        setLandmark(a.landmark || '');
        setCity(a.city || '');
        setPincode(a.pincode || '');
      } else {
        setHouseNo('');
        setStreet('');
        setLandmark('');
        setCity('Hyderabad');
        setPincode('');
      }
      setErrorMsg('');
    }
  }, [visible, customer]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        ]);
        return (
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const handleUseGps = async () => {
    setErrorMsg('');
    const hasPerm = await requestLocationPermission();
    if (!hasPerm) {
      setErrorMsg('Location permission is required to detect your GPS position.');
      return;
    }

    setIsDetectingGps(true);
    Geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 7000);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              signal: controller.signal,
              headers: { 'User-Agent': 'KaamDostCustomer/1.0 (contact@kaamdost.in)' }
            }
          );
          clearTimeout(timeoutId);
          const data = await res.json();
          const addr = data.address || {};

          if (addr.road || addr.suburb || addr.neighbourhood) {
            setStreet(addr.road || addr.suburb || addr.neighbourhood);
          }
          if (addr.city || addr.town || addr.county || addr.state_district) {
            setCity(addr.city || addr.town || addr.county || addr.state_district);
          }
          if (addr.postcode) {
            setPincode(addr.postcode.replace(/\D/g, '').slice(0, 6));
          }
        } catch (e) {
          // Fallback if reverse geocode times out
          setCity('Telangana');
        } finally {
          setIsDetectingGps(false);
        }
      },
      (err) => {
        setIsDetectingGps(false);
        setErrorMsg('Unable to retrieve GPS coordinates. Please enter your address manually.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleSave = async () => {
    if (!street.trim()) {
      setErrorMsg('Please enter your Street / Area name.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Please enter your City or District.');
      return;
    }
    if (pincode && pincode.trim().length !== 6) {
      setErrorMsg('Please enter a valid 6-digit Pincode.');
      return;
    }

    setSaving(true);
    try {
      const newAddress = {
        addressType,
        type: addressType,
        houseNo: houseNo.trim(),
        street: street.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        pincode: pincode.trim()
      };

      const updatedCustomer = {
        ...(customer || {}),
        address: newAddress
      };

      await AsyncStorage.setItem('@kaamdost_user', JSON.stringify(updatedCustomer));

      if (onUpdateCustomer) {
        onUpdateCustomer(updatedCustomer);
      }
      setSaving(false);
      onClose();
    } catch (e) {
      setSaving(false);
      setErrorMsg('Failed to save address. Please try again.');
    }
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
                maxWidth: isTablet ? 560 : undefined
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
                  Change or Edit Address
                </Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Verified destination where skilled workers will arrive
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

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
              {/* GPS Instant Locate Button */}
              <TouchableOpacity
                style={[
                  styles.gpsBtn,
                  {
                    backgroundColor: theme.primaryLight,
                    borderColor: theme.accentPrimary
                  }
                ]}
                onPress={handleUseGps}
                disabled={isDetectingGps}
                activeOpacity={0.75}
              >
                {isDetectingGps ? (
                  <ActivityIndicator size="small" color={theme.accentPrimary} style={{ marginRight: 8 }} />
                ) : (
                  <Text style={styles.gpsIcon}>📍</Text>
                )}
                <View style={styles.gpsTexts}>
                  <Text style={[styles.gpsTitle, { color: theme.accentPrimary }]}>
                    {isDetectingGps ? 'Locating with GPS...' : 'Use Current GPS Location'}
                  </Text>
                  <Text style={[styles.gpsSubtitle, { color: theme.textSecondary }]}>
                    Auto-detect area, city, and pincode via satellite
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Address Type Selector */}
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                  ADDRESS TYPE
                </Text>
                <View style={styles.typeRow}>
                  {ADDRESS_TYPES.map((t) => {
                    const isSelected = addressType === t.id;
                    return (
                      <TouchableOpacity
                        key={t.id}
                        style={[
                          styles.typeChip,
                          {
                            backgroundColor: isSelected ? theme.buttonPrimary : theme.glassSurface,
                            borderColor: isSelected ? theme.buttonPrimary : theme.border
                          }
                        ]}
                        onPress={() => setAddressType(t.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.typeIcon}>{t.icon}</Text>
                        <Text
                          style={[
                            styles.typeLabel,
                            { color: isSelected ? theme.buttonPrimaryText : theme.textPrimary }
                          ]}
                        >
                          {t.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Form Input Fields */}
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                  HOUSE / FLAT / BUILDING NUMBER
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.glassSurface,
                      borderColor: theme.border,
                      color: theme.textPrimary
                    }
                  ]}
                  placeholder="e.g. Flat 302, Sri Sai Nilayam, Plot 14"
                  placeholderTextColor={theme.textMuted}
                  value={houseNo}
                  onChangeText={setHouseNo}
                />
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                  STREET / AREA / COLONY *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.glassSurface,
                      borderColor: theme.border,
                      color: theme.textPrimary
                    }
                  ]}
                  placeholder="e.g. Gandhi Nagar, Main Road, Gachibowli"
                  placeholderTextColor={theme.textMuted}
                  value={street}
                  onChangeText={setStreet}
                />
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                  LANDMARK (OPTIONAL)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.glassSurface,
                      borderColor: theme.border,
                      color: theme.textPrimary
                    }
                  ]}
                  placeholder="e.g. Near Water Tank, Beside Govt High School"
                  placeholderTextColor={theme.textMuted}
                  value={landmark}
                  onChangeText={setLandmark}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.section, { flex: 1, marginRight: 10 }]}>
                  <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                    CITY / MANDAL *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.glassSurface,
                        borderColor: theme.border,
                        color: theme.textPrimary
                      }
                    ]}
                    placeholder="e.g. Sangareddy, Hyderabad"
                    placeholderTextColor={theme.textMuted}
                    value={city}
                    onChangeText={setCity}
                  />
                </View>

                <View style={[styles.section, { flex: 1 }]}>
                  <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                    PINCODE
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.glassSurface,
                        borderColor: theme.border,
                        color: theme.textPrimary
                      }
                    ]}
                    placeholder="e.g. 502295"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={pincode}
                    onChangeText={(val) => setPincode(val.replace(/\D/g, ''))}
                  />
                </View>
              </View>

              {errorMsg ? (
                <Text style={[styles.errorText, { color: theme.danger }]}>
                  ⚠️ {errorMsg}
                </Text>
              ) : null}

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Footer Buttons */}
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
                title={saving ? 'Saving...' : 'Save & Set Address ✓'}
                onPress={handleSave}
                variant="primary"
                size="md"
                loading={saving}
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
    backgroundColor: 'rgba(11, 35, 65, 0.45)',
    justifyContent: 'flex-end'
  },
  keyboardAvoid: {
    width: '100%',
    justifyContent: 'flex-end'
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    maxHeight: '90%',
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
    fontWeight: '800'
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 14
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.2,
    marginBottom: 16
  },
  gpsIcon: {
    fontSize: 22,
    marginRight: 10
  },
  gpsTexts: {
    flex: 1
  },
  gpsTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  gpsSubtitle: {
    fontSize: 10.5,
    marginTop: 1
  },
  section: {
    marginBottom: 14
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8
  },
  typeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4
  },
  typeIcon: {
    fontSize: 13
  },
  typeLabel: {
    fontSize: 11.5,
    fontWeight: '800'
  },
  input: {
    borderWidth: 1.2,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13
  },
  row: {
    flexDirection: 'row'
  },
  errorText: {
    fontSize: 12,
    fontWeight: '700',
    marginVertical: 4
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
  }
});
