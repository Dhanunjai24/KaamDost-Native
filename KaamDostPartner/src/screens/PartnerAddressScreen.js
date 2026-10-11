import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';
import api from '../../../shared/api/client';

export default function PartnerAddressScreen({ lang = 'te', partnerData, onContinue, onBack }) {
  const isTe = lang === 'te';
  const [gender, setGender] = useState('male');
  const [baseType, setBaseType] = useState('Workshop');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState(partnerData?.city || '');
  const [pincode, setPincode] = useState('');
  const [serviceRadiusKm, setServiceRadiusKm] = useState('15');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUseGps = async () => {
    setIsDetectingGps(true);
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        ]);
      } catch (e) {}
    }

    Geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude, {
            headers: { 'User-Agent': 'KaamDostPartner/1.0' }
          });
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            setStreet(addr.road || addr.suburb || addr.neighbourhood || '');
            setLandmark(addr.amenity || addr.building || '');
            setCity(addr.city || addr.town || addr.village || addr.state_district || (isTe ? 'హైదరాబాద్' : 'Hyderabad'));
            if (addr.postcode) setPincode(addr.postcode);
          }
        } catch (e) {}
        setIsDetectingGps(false);
      },
      () => {
        setIsDetectingGps(false);
        Alert.alert(
          isTe ? 'జీపీఎస్ లొకేషన్' : 'GPS Location',
          isTe ? 'లొకేషన్ గుర్తించలేకపోయాము. దయచేసి జీపీఎస్ ఆన్‌లో ఉందో లేదో చూడండి.' : 'Unable to detect position. Please ensure GPS is enabled.'
        );
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 30000 }
    );
  };

  const handleNext = async () => {
    if (!street || !city || pincode.length !== 6) {
      setErrorMsg(isTe ? 'దయచేసి వీధి చిరునామా, నగరం మరియు 6 అంకెల పిన్ కోడ్ నమోదు చేయండి' : 'Please enter street address, city and valid 6-digit PIN code');
      return;
    }

    setErrorMsg('');
    const addressData = {
      gender,
      baseType,
      street,
      landmark,
      city,
      pincode,
      serviceRadiusKm: Number(serviceRadiusKm)
    };

    try {
      await api.saveWorkerLocation(addressData);
    } catch (e) {}

    onContinue(addressData);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F4F8FC' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F8FC" />
      <GlassBackground>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
          {/* Stepper Header */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepBadge}>{isTe ? 'దశ 4 / 6' : 'Step 4 of 6'}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '66.6%' }]} />
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>{isTe ? 'సర్వీస్ స్థావరం & లొకేషన్' : 'Service Base & Location'}</Text>
            <Text style={styles.subtext}>
              {isTe ? 'సమీపంలోని రోజువారీ పనులను పొందడానికి మీ వర్క్‌షాప్ లేదా ఇంటి లొకేషన్ సెట్ చేయండి' : 'Set your workshop or home base to receive nearby daily jobs'}
            </Text>
          </View>

          {/* Gender Selection */}
          <GlassCard style={styles.card}>
            <Text style={styles.label}>{isTe ? 'లింగము' : 'Gender'}</Text>
            <View style={styles.pillRow}>
              {[
                { id: 'male', label: isTe ? '👨 పురుషుడు' : '👨 Male' },
                { id: 'female', label: isTe ? '👩 స్త్రీ' : '👩 Female' },
                { id: 'other', label: isTe ? '⚧ ఇతర' : '⚧ Other' }
              ].map(g => (
                <TouchableOpacity
                  key={g.id}
                  style={[styles.pill, gender === g.id && styles.pillActive]}
                  onPress={() => setGender(g.id)}
                >
                  <Text style={[styles.pillText, gender === g.id && styles.pillTextActive]}>
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          {/* Base Type Selection */}
          <GlassCard style={styles.card}>
            <Text style={styles.label}>{isTe ? 'స్థావరం రకం' : 'Base Location Type'}</Text>
            <View style={styles.pillRow}>
              {[
                { id: 'Workshop', label: isTe ? 'వర్క్‌షాప్' : 'Workshop' },
                { id: 'Warehouse', label: isTe ? 'వేర్‌హౌస్' : 'Warehouse' },
                { id: 'Home Base', label: isTe ? 'ఇంటి స్థావరం' : 'Home Base' }
              ].map(b => (
                <TouchableOpacity
                  key={b.id}
                  style={[styles.pill, baseType === b.id && styles.pillActive]}
                  onPress={() => setBaseType(b.id)}
                >
                  <Text style={[styles.pillText, baseType === b.id && styles.pillTextActive]}>{b.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          {/* GPS Auto-Detect Button */}
          <TouchableOpacity
            style={styles.gpsBtn}
            onPress={handleUseGps}
            disabled={isDetectingGps}
          >
            <Text style={styles.gpsIcon}>📍</Text>
            <Text style={styles.gpsBtnText}>
              {isDetectingGps
                ? (isTe ? 'లొకేషన్ గుర్తిస్తోంది...' : 'Detecting GPS Coordinates...')
                : (isTe ? 'ప్రస్తుత జీపీఎస్ లొకేషన్‌ను ఉపయోగించండి' : 'Use Current GPS Location')}
            </Text>
          </TouchableOpacity>

          {/* Address Fields */}
          <GlassCard style={styles.card}>
            <Text style={styles.inputLabel}>{isTe ? 'వీధి / కాలనీ చిరునామా *' : 'Workshop / Street Address *'}</Text>
            <TextInput
              style={styles.input}
              value={street}
              onChangeText={setStreet}
              placeholder={isTe ? 'షాప్ నం, వీధి, రోడ్, కాలనీ' : 'Shop No, Street, Road, Colony'}
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.inputLabel}>{isTe ? 'ల్యాండ్‌మార్క్' : 'Landmark'}</Text>
            <TextInput
              style={styles.input}
              value={landmark}
              onChangeText={setLandmark}
              placeholder={isTe ? 'బస్ స్టాప్, గుడి, చౌక్ దగ్గర' : 'Near bus stop, temple, chowk'}
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>{isTe ? 'నగరం / జిల్లా *' : 'City / District *'}</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder={isTe ? 'సంగారెడ్డి' : 'Sangareddy'}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>{isTe ? 'పిన్ కోడ్ (6 అంకెలు) *' : 'PIN Code (6 digits) *'}</Text>
                <TextInput
                  style={styles.input}
                  value={pincode}
                  onChangeText={setPincode}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholder="502001"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </GlassCard>

          {/* Job Dispatch Radius */}
          <GlassCard style={styles.card}>
            <Text style={styles.label}>{isTe ? 'పని స్వీకరించే పరిధి' : 'Job Dispatch Radius'}</Text>
            <View style={styles.pillRow}>
              {['5', '10', '15', '25'].map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.pill, serviceRadiusKm === r && styles.pillActive]}
                  onPress={() => setServiceRadiusKm(r)}
                >
                  <Text style={[styles.pillText, serviceRadiusKm === r && styles.pillTextActive]}>
                    {r} {isTe ? 'కి.మీ' : 'km'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* Next Button */}
          <View style={styles.footer}>
            <GlassButton
              title={isTe ? 'దశ 5 కి కొనసాగించండి: ధృవీకరణ →' : 'Continue to Step 5: KYC Verification →'}
              onPress={handleNext}
              variant="primary"
              size="large"
            />
          </View>
        </ScrollView>
      </GlassBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  stepBadge: { fontSize: 12, fontWeight: '700', color: '#173F6B', textTransform: 'uppercase', letterSpacing: 0.5 },
  progressBar: { flex: 1, height: 6, backgroundColor: 'rgba(11, 35, 65, 0.1)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#0B2341', borderRadius: 3 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#0B2341', letterSpacing: 0.3 },
  subtext: { fontSize: 12, color: '#48627D', marginTop: 4 },
  card: { padding: 16, marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '700', color: '#0B2341', marginBottom: 10 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#0B2341', marginTop: 8, marginBottom: 6 },
  pillRow: { flexDirection: 'row', gap: 10 },
  pill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: 'rgba(11, 35, 65, 0.12)'
  },
  pillActive: { backgroundColor: '#0B2341', borderColor: '#0B2341' },
  pillText: { fontSize: 13, fontWeight: '700', color: '#48627D' },
  pillTextActive: { color: '#FFFFFF' },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(23, 63, 107, 0.08)',
    borderWidth: 1.2,
    borderColor: 'rgba(23, 63, 107, 0.25)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 8
  },
  gpsIcon: { fontSize: 18 },
  gpsBtnText: { fontSize: 13, fontWeight: '700', color: '#173F6B' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: 'rgba(11, 35, 65, 0.18)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#0B2341',
    fontSize: 14
  },
  row: { flexDirection: 'row', gap: 12 },
  halfCol: { flex: 1 },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 8 },
  footer: { marginTop: 10 }
});
