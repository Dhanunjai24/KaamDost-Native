import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import client from '../../../shared/api/client';
import { setStoredSession, getStoredSession } from '../../../shared/storage/storage';
import { INDIAN_STATES_AND_UTS, GENDER_OPTIONS } from '../../../shared/constants/indianStates';

export default function CustomerStep4Screen({
  initialGender = '',
  initialAddresses = [],
  onComplete,
  onBack,
}) {
  // 1. Gender State
  const [selectedGender, setSelectedGender] = useState(initialGender || '');

  // 2. Saved Addresses List State
  const [savedAddresses, setSavedAddresses] = useState(initialAddresses || []);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // 3. Address Setup Modal (Add / Edit) State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formType, setFormType] = useState('home'); // 'home' | 'work' | 'other'
  const [customLabel, setCustomLabel] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Sangareddy');
  const [district, setDistrict] = useState('Sangareddy');
  const [stateName, setStateName] = useState('Telangana');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  // Address Type Duplicate warning banner
  const [duplicateTypeNotice, setDuplicateTypeNotice] = useState(null);

  // GPS & Async States
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState('');
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalErrorMessage, setModalErrorMessage] = useState('');

  // Delete Confirmation Modal State
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State Picker Modal
  const [showStateModal, setShowStateModal] = useState(false);
  const [stateSearch, setStateSearch] = useState('');

  // Validation constants
  const PINCODE_RE = /^\d{6}$/;
  const isPincodeValid = PINCODE_RE.test(pincode.trim());
  const isGenderValid = ['male', 'female', 'other'].includes(selectedGender);
  const isFormValid =
    houseNumber.trim().length > 0 &&
    street.trim().length > 0 &&
    city.trim().length > 0 &&
    district.trim().length > 0 &&
    stateName.trim().length > 0 &&
    isPincodeValid;

  // Onboarding completion readiness: gender selected AND at least 1 saved address
  const canContinue = isGenderValid && savedAddresses.length > 0 && !isContinuing;

  // ----------------------------------------------------
  // Load Saved Addresses & Gender on Startup
  // ----------------------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        const stored = await getStoredSession();
        const cust = stored?.customer || {};
        const token = stored?.token || null;

        if (cust.gender && !selectedGender) {
          setSelectedGender(cust.gender);
        }

        if (Array.isArray(cust.savedAddresses) && cust.savedAddresses.length > 0 && savedAddresses.length === 0) {
          setSavedAddresses(cust.savedAddresses);
        }

        // Fetch fresh addresses from backend if token present
        if (token) {
          setIsLoadingAddresses(true);
          const res = await client.getCustomerAddresses(token);
          if (res && res.success && Array.isArray(res.data)) {
            setSavedAddresses(res.data);
          }
        }
      } catch (e) {
        console.warn('[Step4] Failed to load saved addresses:', e);
      } finally {
        setIsLoadingAddresses(false);
      }
    }

    loadData();
  }, []);

  // ----------------------------------------------------
  // Gender Selection Handler
  // ----------------------------------------------------
  const handleSelectGender = async (genderValue) => {
    setSelectedGender(genderValue);
    if (errorMessage.includes('gender')) setErrorMessage('');

    // Persist gender to backend if session exists
    try {
      const stored = await getStoredSession();
      const token = stored?.token || null;
      if (token) {
        await client.saveCustomerGender(genderValue, token);
        const updatedCustomer = {
          ...(stored?.customer || {}),
          gender: genderValue,
        };
        await setStoredSession(updatedCustomer, token);
      }
    } catch (e) {
      // Non-blocking background sync
    }
  };

  // ----------------------------------------------------
  // Open Add Address Modal
  // ----------------------------------------------------
  const handleOpenAddAddress = () => {
    if (savedAddresses.length >= 3) {
      setErrorMessage('Maximum 3 saved addresses (Home, Work, Other) allowed.');
      return;
    }

    // Determine first available type
    const existingTypes = savedAddresses.map((a) => (a.type || a.title || '').toLowerCase());
    let nextType = 'home';
    if (existingTypes.includes('home')) {
      nextType = existingTypes.includes('work') ? 'other' : 'work';
    }

    setEditingAddressId(null);
    setFormType(nextType);
    setCustomLabel('');
    setHouseNumber('');
    setStreet('');
    setLandmark('');
    setCity('Sangareddy');
    setDistrict('Sangareddy');
    setStateName('Telangana');
    setPincode('');
    setLatitude(null);
    setLongitude(null);
    setIsDefaultAddress(savedAddresses.length === 0);
    setDuplicateTypeNotice(null);
    setModalErrorMessage('');
    setGpsSuccessMessage('');
    setShowAddressModal(true);
  };

  // ----------------------------------------------------
  // Open Edit Address Modal
  // ----------------------------------------------------
  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setFormType(addr.type || 'home');
    setCustomLabel(addr.customLabel || '');
    setHouseNumber(addr.houseNumber || '');
    setStreet(addr.street || '');
    setLandmark(addr.landmark || '');
    setCity(addr.city || 'Sangareddy');
    setDistrict(addr.district || 'Sangareddy');
    setStateName(addr.state || 'Telangana');
    setPincode(addr.pincode || '');
    setLatitude(addr.latitude || null);
    setLongitude(addr.longitude || null);
    setIsDefaultAddress(!!addr.isDefault);
    setDuplicateTypeNotice(null);
    setModalErrorMessage('');
    setGpsSuccessMessage('');
    setShowAddressModal(true);
  };

  // ----------------------------------------------------
  // Handle Address Type Selection & Duplicate Detection
  // ----------------------------------------------------
  const handleSelectAddressType = (typeKey) => {
    // If adding a new address and this type already exists, warn user
    if (!editingAddressId) {
      const existing = savedAddresses.find(
        (a) => (a.type || a.title || '').toLowerCase() === typeKey
      );
      if (existing) {
        setDuplicateTypeNotice({
          type: typeKey,
          existingAddress: existing,
        });
        return;
      }
    }

    setDuplicateTypeNotice(null);
    setFormType(typeKey);
  };

  // ----------------------------------------------------
  // GPS Location Detection Handler
  // ----------------------------------------------------
  const handleDetectLocation = () => {
    if (isDetectingGps || isSavingAddress) return;

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setModalErrorMessage("We couldn't detect your location. Please enter your address manually.");
      return;
    }

    setModalErrorMessage('');
    setGpsSuccessMessage('');
    setIsDetectingGps(true);
    setGpsStatusText('Detecting your location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = pos.coords.accuracy;

          // Section 18: Accuracy verification (> 3000m considered inaccurate)
          if (accuracy && accuracy > 3000) {
            setModalErrorMessage('Your location seems inaccurate. Please move to an open area or enter your address manually.');
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
          } else {
            setModalErrorMessage("We found your location but couldn't determine the full address. Please review or enter your address manually.");
          }
        } catch (err) {
          setModalErrorMessage("We couldn't detect your location. Please try again or enter your address manually.");
        } finally {
          setIsDetectingGps(false);
          setGpsStatusText('');
        }
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsStatusText('');
        if (err.code === 1) {
          setModalErrorMessage('Location permission was denied. You can enter your address manually.');
        } else if (err.code === 3) {
          setModalErrorMessage("We couldn't detect your location. Please try again or enter your address manually.");
        } else {
          setModalErrorMessage("We couldn't access your location. You can enter your address manually.");
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // ----------------------------------------------------
  // Save or Update Address
  // ----------------------------------------------------
  const handleSaveAddress = async () => {
    if (!isFormValid) {
      if (!isPincodeValid && pincode.trim().length > 0) {
        setModalErrorMessage('Please enter a valid 6-digit pincode.');
      } else {
        setModalErrorMessage('Please fill all required address fields marked with *');
      }
      return;
    }

    if (isSavingAddress) return;
    setIsSavingAddress(true);
    setModalErrorMessage('');

    try {
      const stored = await getStoredSession();
      const token = stored?.token || null;

      const addressPayload = {
        type: formType,
        customLabel: formType === 'other' ? customLabel.trim() : '',
        houseNumber: houseNumber.trim(),
        street: street.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        district: district.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        isDefault: isDefaultAddress || savedAddresses.length === 0,
      };

      let response;
      if (editingAddressId) {
        response = await client.updateCustomerAddress(editingAddressId, addressPayload, token);
      } else {
        response = await client.addCustomerAddress(addressPayload, token);
      }

      if (response && response.success) {
        // Fetch updated address list
        const freshRes = await client.getCustomerAddresses(token);
        const updatedList = freshRes && freshRes.success && Array.isArray(freshRes.data)
          ? freshRes.data
          : editingAddressId
            ? savedAddresses.map((a) => (a.id === editingAddressId ? { ...a, ...addressPayload } : a))
            : [...savedAddresses, response.data];

        setSavedAddresses(updatedList);

        // Update local session
        const currentCust = stored?.customer || {};
        const updatedCust = {
          ...currentCust,
          savedAddresses: updatedList,
          gender: selectedGender || currentCust.gender,
        };
        await setStoredSession(updatedCust, token);

        setShowAddressModal(false);
      } else {
        setModalErrorMessage(response?.error || "We couldn't save your address. Please try again.");
      }
    } catch (err) {
      setModalErrorMessage("We couldn't save your address. Please try again.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  // ----------------------------------------------------
  // Set Address as Default
  // ----------------------------------------------------
  const handleSetDefault = async (addrId) => {
    try {
      const stored = await getStoredSession();
      const token = stored?.token || null;

      // Optimistic UI update
      const updated = savedAddresses.map((a) => ({
        ...a,
        isDefault: a.id === addrId,
      }));
      setSavedAddresses(updated);

      if (token) {
        await client.setDefaultCustomerAddress(addrId, token);
        const currentCust = stored?.customer || {};
        await setStoredSession({ ...currentCust, savedAddresses: updated }, token);
      }
    } catch (e) {
      console.warn('Failed to set default address:', e);
    }
  };

  // ----------------------------------------------------
  // Delete Address Handler
  // ----------------------------------------------------
  const handleConfirmDelete = async () => {
    if (!deleteTargetId || isDeleting) return;
    setIsDeleting(true);

    try {
      const stored = await getStoredSession();
      const token = stored?.token || null;

      const res = await client.deleteCustomerAddress(deleteTargetId, token);
      if (res && res.success) {
        const remaining = Array.isArray(res.data)
          ? res.data
          : savedAddresses.filter((a) => a.id !== deleteTargetId);

        // Handle default reassignment if needed
        if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
          remaining[0].isDefault = true;
        }

        setSavedAddresses(remaining);
        const currentCust = stored?.customer || {};
        await setStoredSession({ ...currentCust, savedAddresses: remaining }, token);
      } else {
        setErrorMessage(res?.error || "We couldn't delete this address.");
      }
    } catch (e) {
      setErrorMessage("We couldn't delete this address. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  // ----------------------------------------------------
  // Continue to Next Step (Step 4 Completion)
  // ----------------------------------------------------
  const handleContinue = async () => {
    if (!isGenderValid) {
      setErrorMessage('Please select your gender.');
      return;
    }
    if (savedAddresses.length === 0) {
      setErrorMessage('Please add at least one service address to continue.');
      return;
    }

    if (isContinuing) return;
    setIsContinuing(true);
    setErrorMessage('');

    try {
      const stored = await getStoredSession();
      const token = stored?.token || null;

      // Ensure gender and step4 are persisted
      if (token) {
        await client.saveCustomerGender(selectedGender, token);
      }

      const existingCust = stored?.customer || {};
      const updatedCustomer = {
        ...existingCust,
        gender: selectedGender,
        savedAddresses,
        step4Complete: true,
        authenticated: true,
      };

      await setStoredSession(updatedCustomer, token);

      if (onComplete) {
        onComplete({ customer: updatedCustomer, token });
      }
    } catch (err) {
      setErrorMessage("We couldn't complete setup. Please try again.");
    } finally {
      setIsContinuing(false);
    }
  };

  // Helper to format address for display card
  const getFormattedAddress = (addr) => {
    const parts = [
      addr.houseNumber,
      addr.street,
      addr.landmark ? `Near ${addr.landmark}` : null,
      addr.city,
      addr.state ? `${addr.state} - ${addr.pincode}` : addr.pincode,
    ].filter(Boolean);
    return parts.join(', ');
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
              Set up your profile and service addresses for fast bookings
            </Text>
          </View>

          {/* SECTION 1: GENDER */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>1. Select Your Gender</Text>
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
                    onPress={() => handleSelectGender(opt.value)}
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

          {/* SECTION 2: SAVED ADDRESSES */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>2. Saved Addresses</Text>
                <Text style={styles.sectionSubtitle}>
                  Save up to 3 addresses (Home, Work, Other)
                </Text>
              </View>
              <Text style={styles.requiredTag}>* At least 1 required</Text>
            </View>

            {/* List of Saved Addresses */}
            {savedAddresses.length > 0 ? (
              <View style={styles.addressListContainer}>
                {savedAddresses.map((addr) => {
                  const typeIcon = addr.type === 'home' ? '🏠' : addr.type === 'work' ? '💼' : '📍';
                  const typeTitle =
                    addr.type === 'other' && addr.customLabel
                      ? `Other • ${addr.customLabel}`
                      : (addr.type || 'Other').toUpperCase();

                  return (
                    <View key={addr.id} style={styles.addressCard}>
                      <View style={styles.addressHeaderRow}>
                        <View style={styles.addressTypeBadge}>
                          <Text style={styles.addressTypeIcon}>{typeIcon}</Text>
                          <Text style={styles.addressTypeTitle}>{typeTitle}</Text>
                        </View>

                        {addr.isDefault ? (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleSetDefault(addr.id)}
                            style={styles.setDefaultBtn}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.setDefaultBtnText}>Set as Default</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <Text style={styles.formattedAddressText}>
                        {getFormattedAddress(addr)}
                      </Text>

                      {/* Card Action Buttons: Edit & Delete */}
                      <View style={styles.addressActionRow}>
                        <TouchableOpacity
                          style={styles.cardEditBtn}
                          onPress={() => handleOpenEditAddress(addr)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.cardEditBtnText}>✏️ Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.cardDeleteBtn}
                          onPress={() => setDeleteTargetId(addr.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.cardDeleteBtnText}>🗑️ Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              /* Empty State */
              <View style={styles.emptyAddressBox}>
                <Text style={styles.emptyAddressIcon}>📍</Text>
                <Text style={styles.emptyAddressTitle}>No saved addresses yet</Text>
                <Text style={styles.emptyAddressSubtitle}>
                  Add your Home, Work, or Other address for fast service bookings.
                </Text>
                <TouchableOpacity
                  style={styles.addAddressPrimaryBtn}
                  onPress={handleOpenAddAddress}
                  activeOpacity={0.85}
                >
                  <Text style={styles.addAddressPrimaryBtnText}>+ Add Address</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* "+ Add New Address" button if addresses exist and < 3 */}
            {savedAddresses.length > 0 && savedAddresses.length < 3 ? (
              <TouchableOpacity
                style={styles.addNewAddressBtn}
                onPress={handleOpenAddAddress}
                activeOpacity={0.85}
              >
                <Text style={styles.addNewAddressBtnText}>+ Add Another Address ({savedAddresses.length}/3)</Text>
              </TouchableOpacity>
            ) : null}

            {savedAddresses.length >= 3 ? (
              <View style={styles.maxAddressesPill}>
                <Text style={styles.maxAddressesText}>
                  ✓ Maximum 3 addresses saved (Home, Work, Other)
                </Text>
              </View>
            ) : null}
          </View>

          {/* Global Error Message */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Bottom Primary Continue Button */}
          <View style={styles.bottomCtaContainer}>
            <TouchableOpacity
              style={[
                styles.continueBtn,
                !canContinue ? styles.continueBtnDisabled : styles.continueBtnActive,
              ]}
              onPress={handleContinue}
              disabled={!canContinue}
              activeOpacity={0.85}
              accessibilityLabel="Continue"
              accessibilityRole="button"
            >
              {isContinuing ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.continueBtnText}>Saving Profile...</Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.continueBtnText,
                    !canContinue ? styles.continueBtnTextDisabled : null,
                  ]}
                >
                  Continue
                </Text>
              )}
            </TouchableOpacity>

            {!canContinue ? (
              <Text style={styles.continueHint}>
                {!isGenderValid
                  ? 'Please select your gender to continue'
                  : 'Please add at least one address to continue'}
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ==================================================== */}
      {/* ADD / EDIT ADDRESS MODAL */}
      {/* ==================================================== */}
      <Modal
        visible={showAddressModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '100%', alignItems: 'center' }}
          >
            <View style={styles.addressModalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>
                    {editingAddressId ? 'Edit Address' : 'Add New Address'}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {editingAddressId ? 'Update your saved location' : 'Save address for quick booking'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setShowAddressModal(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalScrollArea}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* 1. Address Type Selection */}
                <Text style={styles.fieldLabel}>Address Type *</Text>
                <View style={styles.typeSelectorRow}>
                  {[
                    { key: 'home', label: 'Home', icon: '🏠' },
                    { key: 'work', label: 'Work', icon: '💼' },
                    { key: 'other', label: 'Other', icon: '📍' },
                  ].map((t) => {
                    const isSelected = formType === t.key;
                    return (
                      <TouchableOpacity
                        key={t.key}
                        style={[
                          styles.typeChip,
                          isSelected ? styles.typeChipSelected : null,
                        ]}
                        onPress={() => handleSelectAddressType(t.key)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.typeChipIcon}>{t.icon}</Text>
                        <Text
                          style={[
                            styles.typeChipText,
                            isSelected ? styles.typeChipTextSelected : null,
                          ]}
                        >
                          {t.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Duplicate Address Type Warning Notice */}
                {duplicateTypeNotice ? (
                  <View style={styles.duplicateNoticeBox}>
                    <Text style={styles.duplicateNoticeText}>
                      You already have a {duplicateTypeNotice.type.toUpperCase()} address. Would you like to edit it?
                    </Text>
                    <View style={styles.duplicateActionRow}>
                      <TouchableOpacity
                        style={styles.duplicateEditBtn}
                        onPress={() => handleOpenEditAddress(duplicateTypeNotice.existingAddress)}
                      >
                        <Text style={styles.duplicateEditBtnText}>Edit Existing</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.duplicateCancelBtn}
                        onPress={() => setDuplicateTypeNotice(null)}
                      >
                        <Text style={styles.duplicateCancelBtnText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}

                {/* Custom Label for Other Type */}
                {formType === 'other' ? (
                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Custom Label (e.g. Friend's House, Site)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter a label"
                      placeholderTextColor="#94a3b8"
                      value={customLabel}
                      onChangeText={setCustomLabel}
                    />
                  </View>
                ) : null}

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

                {/* Detect Location Button */}
                <TouchableOpacity
                  style={[
                    styles.detectLocationBtn,
                    isDetectingGps ? styles.detectLocationBtnActive : null,
                  ]}
                  onPress={handleDetectLocation}
                  disabled={isDetectingGps || isSavingAddress}
                  activeOpacity={0.85}
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

                {/* OR Divider */}
                <View style={styles.orDividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR ENTER MANUALLY</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Address Form Fields */}
                <View style={styles.formGroup}>
                  <Text style={styles.fieldLabel}>House No. / Flat / Building *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter house number / plot"
                    placeholderTextColor="#94a3b8"
                    value={houseNumber}
                    onChangeText={(val) => {
                      setHouseNumber(val);
                      if (modalErrorMessage) setModalErrorMessage('');
                    }}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.fieldLabel}>Street / Locality / Area *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter street name"
                    placeholderTextColor="#94a3b8"
                    value={street}
                    onChangeText={(val) => {
                      setStreet(val);
                      if (modalErrorMessage) setModalErrorMessage('');
                    }}
                  />
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.fieldLabel}>Landmark</Text>
                    <Text style={styles.optionalTag}>(Optional)</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Near Clock Tower, Opp. Bus Stand"
                    placeholderTextColor="#94a3b8"
                    value={landmark}
                    onChangeText={setLandmark}
                  />
                </View>

                {/* City & District */}
                <View style={styles.rowTwoCols}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.fieldLabel}>City *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="City"
                      placeholderTextColor="#94a3b8"
                      value={city}
                      onChangeText={(val) => {
                        setCity(val);
                        if (modalErrorMessage) setModalErrorMessage('');
                      }}
                    />
                  </View>

                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.fieldLabel}>District *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="District"
                      placeholderTextColor="#94a3b8"
                      value={district}
                      onChangeText={(val) => {
                        setDistrict(val);
                        if (modalErrorMessage) setModalErrorMessage('');
                      }}
                    />
                  </View>
                </View>

                {/* State & 6-digit Pincode */}
                <View style={styles.rowTwoCols}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.fieldLabel}>State *</Text>
                    <TouchableOpacity
                      style={styles.stateSelectBtn}
                      onPress={() => setShowStateModal(true)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.stateSelectText} numberOfLines={1}>
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
                        if (modalErrorMessage) setModalErrorMessage('');
                      }}
                    />
                  </View>
                </View>

                {/* Set as Default Checkbox */}
                <TouchableOpacity
                  style={styles.defaultCheckboxRow}
                  onPress={() => setIsDefaultAddress(!isDefaultAddress)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      isDefaultAddress || savedAddresses.length === 0 ? styles.checkboxBoxActive : null,
                    ]}
                  >
                    {isDefaultAddress || savedAddresses.length === 0 ? (
                      <Text style={styles.checkboxCheck}>✓</Text>
                    ) : null}
                  </View>
                  <Text style={styles.checkboxLabel}>Make this my default service address</Text>
                </TouchableOpacity>

                {/* Modal Error Message */}
                {modalErrorMessage ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorText}>{modalErrorMessage}</Text>
                  </View>
                ) : null}

                {/* Save Address Button */}
                <TouchableOpacity
                  style={[
                    styles.saveAddressBtn,
                    !isFormValid || isSavingAddress ? styles.saveAddressBtnDisabled : styles.saveAddressBtnActive,
                  ]}
                  onPress={handleSaveAddress}
                  disabled={!isFormValid || isSavingAddress}
                  activeOpacity={0.85}
                >
                  {isSavingAddress ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={styles.saveAddressBtnText}>Saving Address...</Text>
                    </View>
                  ) : (
                    <Text style={styles.saveAddressBtnText}>
                      {editingAddressId ? 'Update Address' : 'Save Address'}
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* ==================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ==================================================== */}
      <Modal
        visible={Boolean(deleteTargetId)}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteTargetId(null)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.deleteDialogCard}>
            <Text style={styles.deleteDialogIcon}>🗑️</Text>
            <Text style={styles.deleteDialogTitle}>Delete Saved Address?</Text>
            <Text style={styles.deleteDialogSubtitle}>
              Are you sure you want to remove this address? If this is your default address, another address will be set as default.
            </Text>

            <View style={styles.deleteDialogActions}>
              <TouchableOpacity
                style={styles.deleteCancelBtn}
                onPress={() => setDeleteTargetId(null)}
                disabled={isDeleting}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteConfirmBtn}
                onPress={handleConfirmDelete}
                disabled={isDeleting}
                activeOpacity={0.8}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.deleteConfirmBtnText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ==================================================== */}
      {/* INDIAN STATES PICKER MODAL */}
      {/* ==================================================== */}
      <Modal
        visible={showStateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStateModal(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.stateModalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select State / UT</Text>
                <Text style={styles.modalSubtitle}>36 Indian States & Union Territories</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowStateModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearchBox}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search state..."
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
                      {isSelected ? <Text style={styles.stateItemCheckmark}>✓</Text> : null}
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
    paddingBottom: 36,
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
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f2c6e',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
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
  addressListContainer: {
    gap: 12,
    marginBottom: 12,
  },
  addressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#e2e8f0',
    ...SHADOWS.xs,
  },
  addressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressTypeIcon: {
    fontSize: 16,
  },
  addressTypeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f2c6e',
    letterSpacing: 0.3,
  },
  defaultBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#166534',
    letterSpacing: 0.5,
  },
  setDefaultBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  setDefaultBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  formattedAddressText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    marginBottom: 12,
  },
  addressActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  cardEditBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  cardEditBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  cardDeleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  cardDeleteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
  },
  emptyAddressBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    marginBottom: 8,
  },
  emptyAddressIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyAddressTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f2c6e',
    marginBottom: 4,
  },
  emptyAddressSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    maxWidth: 260,
  },
  addAddressPrimaryBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    ...SHADOWS.sm,
  },
  addAddressPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  addNewAddressBtn: {
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addNewAddressBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
  maxAddressesPill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  maxAddressesText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  bottomCtaContainer: {
    marginTop: 4,
  },
  continueBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
  continueHint: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  addressModalContent: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '90%',
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
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
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
  modalScrollArea: {
    flexGrow: 1,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  typeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  typeChipSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  typeChipIcon: {
    fontSize: 16,
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  typeChipTextSelected: {
    color: '#2563eb',
    fontWeight: '800',
  },
  duplicateNoticeBox: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  duplicateNoticeText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 8,
  },
  duplicateActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  duplicateEditBtn: {
    backgroundColor: '#f59e0b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  duplicateEditBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  duplicateCancelBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  duplicateCancelBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(239, 246, 255, 0.75)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 10,
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
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  detectLocationBtnActive: {
    backgroundColor: '#dbeafe',
  },
  detectLocationBtnText: {
    fontSize: 14,
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
    paddingHorizontal: 8,
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
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
  dropdownChevron: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '700',
    marginLeft: 4,
  },
  defaultCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#ffffff',
  },
  checkboxBoxActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkboxCheck: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  saveAddressBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  saveAddressBtnActive: {
    backgroundColor: '#2563eb',
    ...SHADOWS.md,
  },
  saveAddressBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  saveAddressBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  deleteDialogCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  deleteDialogIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  deleteDialogTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f2c6e',
    marginBottom: 6,
    textAlign: 'center',
  },
  deleteDialogSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  deleteDialogActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  deleteCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  deleteCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  deleteConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
  },
  deleteConfirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  stateModalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    ...SHADOWS.lg,
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
    marginTop: 8,
    marginBottom: 12,
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
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
