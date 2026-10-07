import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';

export default function ActiveJobCard({
  job,
  onStatusChange,
  onOpenChat
}) {
  const { theme } = useTheme();
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // If no job is active, show the incoming lead alert from Screenshot 2
  const currentTask = job || {
    id: 'lead_901',
    tradeName: 'New Masonry Task',
    location: 'Sangareddy',
    distance: '2.4 km away',
    dailyRate: 950,
    status: 'INCOMING'
  };

  const handleAccept = () => {
    Alert.alert('Task Accepted!', 'You have accepted the Masonry Task in Sangareddy. Proceeding to location.');
    if (onStatusChange) {
      onStatusChange('ARRIVING');
    }
  };

  const handleStartWork = () => {
    if (!enteredOtp || enteredOtp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter the 4-digit start OTP provided by the customer.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      Alert.alert('OTP Verified!', 'Work started successfully.');
      if (onStatusChange) onStatusChange('STARTED');
    }, 800);
  };

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: 'rgba(26, 38, 57, 0.72)',
            borderColor: 'rgba(255, 255, 255, 0.16)'
          }
        ]}
      >
        {/* Header Row: Task Icon + Title + Location */}
        <View style={styles.topRow}>
          <View style={styles.iconBadge}>
            <Text style={styles.toolEmoji}>🔨</Text>
          </View>
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>
              {currentTask.tradeName || 'New Masonry Task'}
            </Text>
            <View style={styles.locationRow}>
              <Text style={styles.locIcon}>📍</Text>
              <Text style={styles.locText}>
                {currentTask.location || currentTask.address || 'Sangareddy'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Row: Distance & Action Button */}
        <View style={styles.bottomRow}>
          <View style={styles.distanceRow}>
            <Text style={styles.distPin}>📍</Text>
            <Text style={styles.distText}>
              {currentTask.distance || '2.4 km away'}
            </Text>
          </View>

          {(!job || job.status === 'INCOMING') ? (
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={handleAccept}
              activeOpacity={0.85}
            >
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
          ) : job.status === 'ARRIVING' ? (
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => onStatusChange('STARTED')}
              activeOpacity={0.85}
            >
              <Text style={styles.acceptBtnText}>Start Work</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.acceptBtn, { backgroundColor: '#10B981' }]}
              onPress={() => onStatusChange('COMPLETED')}
              activeOpacity={0.85}
            >
              <Text style={styles.acceptBtnText}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 16,
    marginVertical: 6
  },
  card: {
    borderRadius: 22,
    borderWidth: 1.2,
    padding: 16,
    elevation: 0
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  toolEmoji: {
    fontSize: 22
  },
  taskInfo: {
    flex: 1
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3
  },
  locIcon: {
    fontSize: 12,
    marginRight: 4
  },
  locText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600'
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 6
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  distPin: {
    fontSize: 14,
    marginRight: 4
  },
  distText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600'
  },
  acceptBtn: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  }
});
