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

  if (!job) {
    return (
      <View style={styles.cardWrapper}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.glassSurfaceStrong || 'rgba(255, 255, 255, 0.90)',
              borderColor: theme.border || 'rgba(11, 35, 65, 0.12)',
              paddingVertical: 20
            }
          ]}
        >
          <View style={styles.topRow}>
            <View style={[styles.iconBadge, { backgroundColor: theme.primaryLight || 'rgba(23, 63, 107, 0.10)', borderColor: theme.border || 'rgba(11, 35, 65, 0.15)' }]}>
              <Text style={styles.toolEmoji}>⏳</Text>
            </View>
            <View style={styles.taskInfo}>
              <Text style={[styles.taskTitle, { color: theme.textPrimary || '#0B2341' }]}>Ready for Dispatch</Text>
              <Text style={[styles.locText, { color: theme.textSecondary || '#48627D' }]}>Keep duty ON to receive nearby customer bookings.</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  const currentTask = job;

  const handleAccept = () => {
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
            backgroundColor: theme.glassSurfaceStrong || 'rgba(255, 255, 255, 0.90)',
            borderColor: theme.border || 'rgba(11, 35, 65, 0.12)'
          }
        ]}
      >
        {/* Header Row: Task Icon + Title + Location */}
        <View style={styles.topRow}>
          <View style={[styles.iconBadge, { backgroundColor: theme.primaryLight || 'rgba(23, 63, 107, 0.10)', borderColor: theme.border || 'rgba(11, 35, 65, 0.15)' }]}>
            <Text style={styles.toolEmoji}>🔨</Text>
          </View>
          <View style={styles.taskInfo}>
            <Text style={[styles.taskTitle, { color: theme.textPrimary || '#0B2341' }]}>
              {currentTask.tradeName || currentTask.serviceName || 'Active Task'}
            </Text>
            <View style={styles.locationRow}>
              <Text style={styles.locIcon}>📍</Text>
              <Text style={[styles.locText, { color: theme.textSecondary || '#48627D' }]}>
                {currentTask.location || currentTask.address || 'Customer Location'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Row: Distance & Action Button */}
        <View style={styles.bottomRow}>
          <View style={styles.distanceRow}>
            <Text style={styles.distPin}>📍</Text>
            <Text style={[styles.distText, { color: theme.textSecondary || '#48627D' }]}>
              {currentTask.distance || 'Assigned'}
            </Text>
          </View>

          {currentTask.status === 'INCOMING' ? (
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={handleAccept}
              activeOpacity={0.85}
            >
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
          ) : currentTask.status === 'ARRIVING' ? (
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => onStatusChange && onStatusChange('STARTED')}
              activeOpacity={0.85}
            >
              <Text style={styles.acceptBtnText}>Start Work</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.acceptBtn, { backgroundColor: '#10B981' }]}
              onPress={() => onStatusChange && onStatusChange('COMPLETED')}
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
    backgroundColor: 'rgba(23, 63, 107, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(11, 35, 65, 0.15)',
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
    color: '#0B2341',
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
    color: '#48627D',
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
    color: '#48627D',
    fontSize: 13,
    fontWeight: '600'
  },
  acceptBtn: {
    backgroundColor: '#0B2341',
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
