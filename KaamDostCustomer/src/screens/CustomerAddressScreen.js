import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { GENDER_OPTIONS, TELANGANA_CITIES } from '../../../shared/constants/cities';
import { t } from '../../../shared/i18n';

export default function CustomerAddressScreen({ onContinue }) {
  const [gender, setGender] = useState('');
  const [addressType, setAddressType] = useState('Home');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsDetectedAddress, setGpsDetectedAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

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

  const reverseGeocode = async (latitude, longitude) => {
    // 1. Try OpenStreetMap Nominatim
    try {
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
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          const road = addr.road || addr.street || addr.neighbourhood || addr.suburb || addr.residential || '';
          const lmark = addr.amenity || addr.building || addr.suburb || addr.neighbourhood || '';
          const cityName = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'Hyderabad';
          const postCode = addr.postcode || '';
          return {
            street: road,
            landmark: lmark,
            city: cityName,
            pincode: postCode
          };
        }
      }
    } catch (e) {
      console.warn('Nominatim reverse geocode error:', e);
    }

    // 2. Fallback to BigDataCloud
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      if (res.ok) {
        const data = await res.json();
        if (data) {
          return {
            street: data.locality || data.principalSubdivision || '',
            landmark: '',
            city: data.city || data.locality || 'Hyderabad',
            pincode: data.postcode || ''
          };
        }
      }
    } catch (e2) {
      console.warn('BigDataCloud reverse geocode error:', e2);
    }

    return null;
  };

  const handleUseGps = async () => {
    setErrorMsg('');
    setIsDetectingGps(true);

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setIsDetectingGps(false);
      Alert.alert(
        'Location Permission Needed',
        'Please grant location permissions to detect your doorstep address via GPS.'
      );
      return;
    }

    const tryGetPosition = (enableHighAccuracy = false) => {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const geo = await reverseGeocode(latitude, longitude);

          setIsDetectingGps(false);
          if (geo) {
            if (geo.street) setStreet(geo.street);
            if (geo.landmark) setLandmark(geo.landmark);
            if (geo.city) setCity(geo.city);
            if (geo.pincode) setPincode(geo.pincode);
            setGpsDetectedAddress(`${geo.street ? geo.street + ', ' : ''}${geo.city}`);
          } else {
            setCity('Hyderabad');
            setGpsDetectedAddress(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
          }
        },
        (error) => {
          if (!enableHighAccuracy) {
            setIsDetectingGps(false);
            console.warn('Geolocation error:', error);
            Alert.alert(
              'GPS Detection Issue',
              'Unable to detect GPS position. Please make sure Location/GPS is turned ON on your phone and try again.'
            );
          } else {
            // Retry with network location (fast & indoor-friendly)
            tryGetPosition(false);
          }
        },
        {
          enableHighAccuracy,
          timeout: enableHighAccuracy ? 6000 : 12000,
          maximumAge: 30000
        }
      );
    };

    // Attempt location with GPS first, then automatic network fallback
    tryGetPosition(true);
  };

  const handleNext = () => {
    if (!gender) {
      setErrorMsg('Please select your gender');
      return;
    }
    if (!houseNo || !street || !city || !pincode) {
      setErrorMsg('Please complete all address fields');
      return;
    }
    setErrorMsg('');
    onContinue({
      gender,
      address: {
        type: addressType,
        houseNo,
        street,
        landmark,
        city,
        state: 'Telangana',
        pincode
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Stepper Header */}
        <View style={styles.stepperRow}>
          <Text style={styles.stepText}>Step 4 of 6</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Gender & Service Address</Text>
          <Text style={styles.subtitle}>Help us match nearby Dosts and dispatch services to your exact doorstep</Text>
        </View>

        {/* 1. Gender Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Select Gender</Text>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((g) => {
              const active = gender === g.value;
              return (
                <TouchableOpacity
                  key={g.value}
                  style={[styles.genderBtn, active && styles.genderBtnActive]}
                  onPress={() => setGender(g.value)}
                >
                  <Text style={[styles.genderText, active && styles.genderTextActive]}>
                    {g.value === 'male' ? '👨 Male' : g.value === 'female' ? '👩 Female' : '👤 Others'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 2. Address Form */}
        <View style={styles.card}>
          <View style={styles.addrHeaderRow}>
            <Text style={styles.sectionTitle}>2. Service Address</Text>
            <TouchableOpacity
              style={[styles.gpsBtn, isDetectingGps && styles.gpsBtnLoading]}
              onPress={handleUseGps}
              disabled={isDetectingGps}
              activeOpacity={0.7}
            >
              {isDetectingGps ? (
                <View style={styles.gpsLoadingRow}>
                  <ActivityIndicator size="small" color={COLORS.primaryDark} style={{ marginRight: 4 }} />
                  <Text style={styles.gpsText}>Detecting GPS...</Text>
                </View>
              ) : (
                <Text style={styles.gpsText}>📍 Use Current Location</Text>
              )}
            </TouchableOpacity>
          </View>

          {gpsDetectedAddress ? (
            <View style={styles.gpsSuccessBanner}>
              <Text style={styles.gpsSuccessText}>✓ Auto-detected via GPS: {gpsDetectedAddress}</Text>
            </View>
          ) : null}

          {/* Address Type Tags */}
          <View style={styles.typeRow}>
            {['Home', 'Work', 'Other'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeBtn, addressType === t && styles.typeBtnActive]}
                onPress={() => setAddressType(t)}
              >
                <Text style={[styles.typeText, addressType === t && styles.typeTextActive]}>
                  {t === 'Home' ? '🏠 Home' : t === 'Work' ? '🏢 Work' : '📍 Other'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>House / Flat / Door Number *</Text>
            <TextInput
              style={styles.input}
              value={houseNo}
              onChangeText={setHouseNo}
              placeholder="e.g. Plot 42 / Flat 301"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Street / Colony / Area *</Text>
            <TextInput
              style={styles.input}
              value={street}
              onChangeText={setStreet}
              placeholder="e.g. Near Old Bus Stand Road"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Landmark (Optional)</Text>
            <TextInput
              style={styles.input}
              value={landmark}
              onChangeText={setLandmark}
              placeholder="e.g. Opposite SBI Bank"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>District / City *</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="District / City"
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Pincode *</Text>
              <TextInput
                style={styles.input}
                value={pincode}
                onChangeText={setPincode}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="6-digit Pincode"
              />
            </View>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity style={styles.submitBtn} onPress={handleNext}>
            <Text style={styles.submitBtnText}>Save Address & Continue →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  container: {
    padding: 20
  },
  stepperRow: {
    marginBottom: 16
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.borderLight,
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary
  },
  header: {
    marginBottom: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.secondary
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 14,
    ...SHADOWS.small
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 10
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center'
  },
  genderBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight
  },
  genderText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary
  },
  genderTextActive: {
    color: COLORS.primaryDark
  },
  addrHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  gpsBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  gpsBtnLoading: {
    opacity: 0.8
  },
  gpsLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  gpsText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  gpsSuccessBanner: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  gpsSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46'
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center'
  },
  typeBtnActive: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  typeTextActive: {
    color: COLORS.textWhite
  },
  field: {
    marginBottom: 12
  },
  row: {
    flexDirection: 'row'
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '600'
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    ...SHADOWS.small
  },
  submitBtnText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: '800'
  }
});
