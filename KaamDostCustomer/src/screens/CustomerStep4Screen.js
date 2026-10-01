import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import client from '../../../shared/api/client';
import { setStoredSession, getStoredSession } from '../../../shared/storage/storage';
import { INDIAN_STATES_AND_UTS, GENDER_OPTIONS } from '../../../shared/constants/indianStates';

export default function CustomerStep4Screen({
  initialGender = '',
  initialAddress = null,
  onComplete,
  onBack,
}) {
  // Gender State
  const [selectedGender, setSelectedGender] = useState(initialGender || '');

  // Address State
  const [houseNumber, setHouseNumber] = useState(initialAddress?.houseNumber || '');
  const [street, setStreet] = useState(initialAddress?.street || '');
  const [landmark, setLandmark] = useState(initialAddress?.landmark || '');
  const [city, setCity] = useState(initialAddress?.city || 'Sangareddy');
  const [district, setDistrict] = useState(initialAddress?.district || 'Sangareddy');
  const [stateName, setStateName] = useState(initialAddress?.state || 'Telangana');
  const [pincode, setPincode] = useState(initialAddress?.pincode || '');
  const [latitude, setLatitude] = useState(initialAddress?.latitude || null);
  const [longitude, setLongitude] = useState(initialAddress?.longitude || null);

  // Mode & Async States
  const [showManualForm, setShowManualForm] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState('');

  // Indian State Selector Modal State
  const [showStateModal, setShowStateModal] = useState(false);
  const [stateSearch, setStateSearch] = useState('');

  // Validation
  const PINCODE_RE = /^\d{6}$/;
  const isPincodeValid = PINCODE_RE.test(pincode.trim());
  const isGenderValid = ['male', 'female', 'other'].includes(selectedGender);
  const isAddressComplete =
    houseNumber.trim().length > 0 &&
    street.trim().length > 0 &&
    city.trim().length > 0 &&
    district.trim().length > 0 &&
    stateName.trim().length > 0 &&
    isPincodeValid;

  const isFormValid = isGenderValid && isAddressComplete;

  // Handle GPS Location Detection
  const handleDetectLocation = () => {
    if (isDetectingGps || isSaving) return;

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setErrorMessage("We couldn't detect your location. Please enter your address manually.");
      setShowManualForm(true);
      return;
    }

    setErrorMessage('');
    setGpsSuccessMessage('');
    setIsDetectingGps(true);
    setGpsStatusText('Detecting your location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = pos.coords.accuracy;

          // Section 18: Accuracy verification
          if (accuracy && accuracy > 3000) {
            setErrorMessage("Your location seems inaccurate. Please move to an open area or enter your address manually.");
            setShowManualForm(true);
            setIsDetectingGps(false);
            setGpsStatusText('');
            return;
          }

          setLatitude(lat);
          setLongitude(lng);

          setGpsStatusText('Finding your address...');
          const geoRes = await client.reverseGeocode(lat, lng);

          if (geoRes && geoRes.success && geoRes.data) {
            const d = geoRes.data;
            if (d.houseNumber) setHouseNumber(d.houseNumber);
            if (d.street) setStreet(d.street);
            if (d.landmark) setLandmark(d.landmark);
            if (d.city) setCity(d.city);
            if (d.district) setDistrict(d.district);
            if (d.state) setStateName(d.state);
            if (d.pincode && PINCODE_RE.test(d.pincode)) setPincode(d.pincode);

            setGpsSuccessMessage('✓ Location detected! Please review and customize your address below.');
            setShowManualForm(true);
          } else {
            setErrorMessage("We found your location but couldn't determine the full address. Please review or enter your address manually.");
            setShowManualForm(true);
          }
        } catch (err) {
          setErrorMessage("We couldn't detect your location. Please try again or enter your address manually.");
          setShowManualForm(true);
        } finally {
          setIsDetectingGps(false);
          setGpsStatusText('');
        }
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsStatusText('');
        if (err.code === 1) {
          // PERMISSION_DENIED
          setErrorMessage('Location permission was denied. You can enter your address manually.');
        } else if (err.code === 3) {
          // TIMEOUT
          setErrorMessage("We couldn't detect your location. Please try again or enter your address manually.");
        } else {
          setErrorMessage("We couldn't access your location. You can enter your address manually.");
        }
        setShowManualForm(true);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Handle Form Submission
  const handleContinue = async () => {
    if (!isGenderValid) {
      setErrorMessage('Please select your gender.');
      return;
    }
    if (!isAddressComplete) {
      if (!isPincodeValid && pincode.trim().length > 0) {
        setErrorMessage('Please enter a valid 6-digit pincode.');
      } else {
        setErrorMessage('Please complete your address to continue.');
      }
      return;
    }

    if (isSaving) return; // Prevent duplicate submission
    setIsSaving(true);
    setErrorMessage('');

    try {
      const stored = await getStoredSession();
      const token = stored?.token || null;

      const payload = {
        gender: selectedGender,
        houseNumber: houseNumber.trim(),
        street: street.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        district: district.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
      };

      const response = await client.saveCustomerStep4(payload, token);

      if (response && response.success) {
        const existingCust = stored?.customer || {};
        const updatedCustomer = {
          ...existingCust,
          ...(response.data || {}),
          gender: selectedGender,
          step4Complete: true,
          authenticated: true,
        };

        await setStoredSession(updatedCustomer, token);

        if (onComplete) {
          onComplete({ customer: updatedCustomer, token });
        }
      } else {
        setErrorMessage(response?.error || "We couldn't save your address. Please try again.");
      }
    } catch (err) {
      setErrorMessage("We couldn't save your address. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar with Back Button */}
          <View style={styles.topBar}>
            {onBack ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
                activeOpacity={0.7}
                accessibilityLabel="Go back"
                accessibilityRole="button"
              >
                <Text style={styles.backArrow}>‹</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 44 }} />
            )}

            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>KD</Text>
            </View>

            <View style={{ width: 44 }} />
          </View>

          {/* Heading Section */}
          <View style={styles.headerSection}>
            <Text style={styles.mainHeading}>Tell Us About You</Text>
            <Text style={styles.supportingText}>
              Select your gender and service address to get started
            </Text>
          </View>

          {/* SECTION 1: GENDER */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>1. Select Gender</Text>
              <Text style={styles.requiredTag}>* Required</Text>
            </View>

            <View style={styles.genderGrid}>
              {GENDER_OPTIONS.map((opt) => {
                const isSelected = selectedGender === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.genderCard,
                      isSelected ? styles.genderCardSelected : null,
                    ]}
                    onPress={() => {
                      setSelectedGender(opt.value);
                      if (errorMessage.includes('gender')) setErrorMessage('');
                    }}
                    activeOpacity={0.8}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={opt.label}
                  >
                    <View
                      style={[
                        styles.genderIconBox,
                        isSelected ? styles.genderIconBoxSelected : null,
                      ]}
                    >
                      <Text style={styles.genderEmoji}>{opt.icon}</Text>
                    </View>
                    <Text
                      style={[
                        styles.genderLabel,
                        isSelected ? styles.genderLabelSelected : null,
                      ]}
                    >
                      {opt.label}
                    </Text>

                    {/* Radio indicator */}
                    <View
                      style={[
                        styles.radioIndicator,
                        isSelected ? styles.radioIndicatorSelected : null,
                      ]}
                    >
                      {isSelected ? <View style={styles.radioInnerDot} /> : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* SECTION 2: SERVICE ADDRESS */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>2. Your Service Address</Text>
              <Text style={styles.requiredTag}>* Required</Text>
            </View>

            {/* GPS Detection Box */}
            <View style={styles.gpsBanner}>
              <Text style={styles.gpsIcon}>📍</Text>
              <View style={styles.gpsTextWrapper}>
                <Text style={styles.gpsHeader}>Detect Address via GPS</Text>
                <Text style={styles.gpsExplanation}>
                  We use your location to detect your address and help connect you with nearby service professionals.
                </Text>
              </View>
            </View>

            {/* GPS Detection Action Button */}
            <TouchableOpacity
              style={[
                styles.detectLocationBtn,
                isDetectingGps ? styles.detectLocationBtnActive : null,
              ]}
              onPress={handleDetectLocation}
              disabled={isDetectingGps || isSaving}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              {isDetectingGps ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#2563eb" />
                  <Text style={styles.detectLocationBtnTextActive}>
                    {gpsStatusText || 'Detecting your location...'}
                  </Text>
                </View>
              ) : (
                <View style={styles.loadingRow}>
                  <Text style={{ fontSize: 16 }}>🎯</Text>
                  <Text style={styles.detectLocationBtnText}>Use My Current Location</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* GPS Success Feedback */}
            {gpsSuccessMessage ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{gpsSuccessMessage}</Text>
              </View>
            ) : null}

            {/* Toggle Manual Entry */}
            <View style={styles.orDividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.manualToggleBtn}
              onPress={() => setShowManualForm(!showManualForm)}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={styles.manualToggleBtnText}>
                {showManualForm ? 'Hide Address Fields ▴' : 'Enter Address Manually ▾'}
              </Text>
            </TouchableOpacity>

            {/* Address Input Form Fields (Always visible if expanded or location detected) */}
            {showManualForm ? (
              <View style={styles.manualFieldsContainer}>
                {/* House No. */}
                <View style={styles.formGroup}>
                  <Text style={styles.fieldLabel}>House No. / Flat / Building *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter house number / flat / plot"
                    placeholderTextColor="#94a3b8"
                    value={houseNumber}
                    onChangeText={(val) => {
                      setHouseNumber(val);
                      if (errorMessage) setErrorMessage('');
                    }}
                    accessibilityLabel="House number input"
                  />
                </View>

                {/* Street */}
                <View style={styles.formGroup}>
                  <Text style={styles.fieldLabel}>Street / Locality / Area *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter street name"
                    placeholderTextColor="#94a3b8"
                    value={street}
                    onChangeText={(val) => {
                      setStreet(val);
                      if (errorMessage) setErrorMessage('');
                    }}
                    accessibilityLabel="Street name input"
                  />
                </View>

                {/* Landmark */}
                <View style={styles.formGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.fieldLabel}>Landmark</Text>
                    <Text style={styles.optionalTag}>(Optional)</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter landmark (e.g. Near Temple, Opp. Bus Stand)"
                    placeholderTextColor="#94a3b8"
                    value={landmark}
                    onChangeText={setLandmark}
                    accessibilityLabel="Landmark input"
                  />
                </View>

                {/* City & District (2-column row) */}
                <View style={styles.rowTwoCols}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.fieldLabel}>City *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter city"
                      placeholderTextColor="#94a3b8"
                      value={city}
                      onChangeText={(val) => {
                        setCity(val);
                        if (errorMessage) setErrorMessage('');
                      }}
                      accessibilityLabel="City input"
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.fieldLabel}>District *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter district"
                      placeholderTextColor="#94a3b8"
                      value={district}
                      onChangeText={(val) => {
                        setDistrict(val);
                        if (errorMessage) setErrorMessage('');
                      }}
                      accessibilityLabel="District input"
                    />
                  </View>
                </View>

                {/* State & Pincode (2-column row) */}
                <View style={styles.rowTwoCols}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.fieldLabel}>State *</Text>
                    <TouchableOpacity
                      style={styles.stateSelectBtn}
                      onPress={() => setShowStateModal(true)}
                      activeOpacity={0.8}
                      accessibilityLabel="Select state"
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.stateSelectText,
                          !stateName ? styles.stateSelectPlaceholder : null,
                        ]}
                        numberOfLines={1}
                      >
                        {stateName || 'Select State'}
                      </Text>
                      <Text style={styles.dropdownChevron}>▾</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.fieldLabel}>Pincode (6 Digits) *</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        pincode.length > 0 && !isPincodeValid ? styles.textInputError : null,
                      ]}
                      placeholder="502001"
                      placeholderTextColor="#94a3b8"
                      keyboardType="number-pad"
                      inputMode="numeric"
                      maxLength={6}
                      value={pincode}
                      onChangeText={(val) => {
                        const digits = val.replace(/\D/g, '').slice(0, 6);
                        setPincode(digits);
                        if (errorMessage) setErrorMessage('');
                      }}
                      accessibilityLabel="6-digit pincode input"
                    />
                  </View>
                </View>
              </View>
            ) : null}

            {/* Error Message Display */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueBtn,
                !isFormValid || isSaving ? styles.continueBtnDisabled : styles.continueBtnActive,
              ]}
              onPress={handleContinue}
              disabled={!isFormValid || isSaving}
              activeOpacity={0.85}
              accessibilityLabel="Continue"
              accessibilityRole="button"
            >
              {isSaving ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.continueBtnText}>Saving...</Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.continueBtnText,
                    !isFormValid ? styles.continueBtnTextDisabled : null,
                  ]}
                >
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Indian States and UTs Picker Modal */}
      <Modal
        visible={showStateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStateModal(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select State / UT</Text>
                <Text style={styles.modalSubtitle}>36 States & Union Territories</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowStateModal(false)}
                activeOpacity={0.7}
                accessibilityLabel="Close"
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.modalSearchBox}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search state or UT..."
                placeholderTextColor="#94a3b8"
                value={stateSearch}
                onChangeText={setStateSearch}
                autoCorrect={false}
              />
              {stateSearch ? (
                <TouchableOpacity onPress={() => setStateSearch('')}>
                  <Text style={{ color: '#94a3b8', fontSize: 16 }}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* States List */}
            <ScrollView
              style={styles.modalStateList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {INDIAN_STATES_AND_UTS
                .filter((st) => st.toLowerCase().includes(stateSearch.trim().toLowerCase()))
                .map((st) => {
                  const isSelected = stateName.toLowerCase() === st.toLowerCase();
                  return (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.stateItemRow,
                        isSelected ? styles.stateItemRowSelected : null,
                      ]}
                      onPress={() => {
                        setStateName(st);
                        setShowStateModal(false);
                        setStateSearch('');
                        if (errorMessage) setErrorMessage('');
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.stateItemText,
                          isSelected ? styles.stateItemTextSelected : null,
                        ]}
                      >
                        {st}
                      </Text>
                      {isSelected ? (
                        <Text style={styles.stateItemCheckmark}>✓</Text>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f6ff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  backArrow: {
    fontSize: 28,
    color: '#0f2c6e',
    fontWeight: '600',
    marginTop: -2,
    marginLeft: -2,
  },
  brandBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...SHADOWS.sm,
  },
  brandBadgeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2563eb',
    letterSpacing: 0.5,
  },
  headerSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f2c6e',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  supportingText: {
    fontSize: 14,
    color: '#5f7da6',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
    maxWidth: 320,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...SHADOWS.md,
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f2c6e',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  requiredTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  genderGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  genderCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    ...SHADOWS.xs,
  },
  genderCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  genderIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  genderIconBoxSelected: {
    backgroundColor: '#dbeafe',
  },
  genderEmoji: {
    fontSize: 22,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  genderLabelSelected: {
    color: '#2563eb',
  },
  radioIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioIndicatorSelected: {
    borderColor: '#2563eb',
  },
  radioInnerDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#2563eb',
  },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(239, 246, 255, 0.75)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 12,
  },
  gpsIcon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  gpsTextWrapper: {
    flex: 1,
  },
  gpsHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1d4ed8',
    marginBottom: 2,
  },
  gpsExplanation: {
    fontSize: 12,
    color: '#3b82f6',
    lineHeight: 17,
  },
  detectLocationBtn: {
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  detectLocationBtnActive: {
    backgroundColor: '#dbeafe',
  },
  detectLocationBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563eb',
  },
  detectLocationBtnTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  successContainer: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  successText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
    textAlign: 'center',
  },
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
  },
  manualToggleBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  manualToggleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
  manualFieldsContainer: {
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f2c6e',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  optionalTag: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#dbeafe',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#0f2c6e',
    ...SHADOWS.xs,
  },
  textInputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  rowTwoCols: {
    flexDirection: 'row',
  },
  stateSelectBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#dbeafe',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.xs,
  },
  stateSelectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f2c6e',
    flex: 1,
  },
  stateSelectPlaceholder: {
    color: '#94a3b8',
  },
  dropdownChevron: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '700',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f2c6e',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '700',
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.2,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
  },
  modalSearchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f2c6e',
    fontWeight: '600',
  },
  modalStateList: {
    flexGrow: 1,
  },
  stateItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 4,
  },
  stateItemRowSelected: {
    backgroundColor: '#eff6ff',
  },
  stateItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  stateItemTextSelected: {
    color: '#2563eb',
    fontWeight: '800',
  },
  stateItemCheckmark: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2563eb',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 14,
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#b91c1c',
    fontWeight: '600',
    flex: 1,
  },
  continueBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  continueBtnActive: {
    backgroundColor: '#2563eb',
    ...SHADOWS.md,
  },
  continueBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  continueBtnTextDisabled: {
    color: '#64748b',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
