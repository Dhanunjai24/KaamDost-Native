import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const { width } = Dimensions.get('window');

export default function GlassAlertDialog({
  visible = false,
  type = 'info', // 'success', 'warning', 'danger', 'info'
  icon,
  title,
  message,
  primaryText = 'OK',
  secondaryText = null,
  onPrimary,
  onSecondary,
  onClose
}) {
  const { theme, shadows } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  let accentColor = '#2563EB';
  let accentBg = 'rgba(37, 99, 235, 0.15)';
  let defaultIcon = 'ℹ️';

  if (type === 'success') {
    accentColor = '#22C55E';
    accentBg = 'rgba(34, 197, 94, 0.18)';
    defaultIcon = '🚀';
  } else if (type === 'warning') {
    accentColor = '#F59E0B';
    accentBg = 'rgba(245, 158, 11, 0.18)';
    defaultIcon = '⚡';
  } else if (type === 'danger') {
    accentColor = '#EF4444';
    accentBg = 'rgba(239, 68, 68, 0.18)';
    defaultIcon = '⚠️';
  }

  const handlePrimary = () => {
    if (onPrimary) onPrimary();
    else if (onClose) onClose();
  };

  const handleSecondary = () => {
    if (onSecondary) onSecondary();
    else if (onClose) onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose || handlePrimary}
    >
      <Pressable style={styles.overlay} onPress={onClose || handlePrimary}>
        <Animated.View
          style={[
            styles.dialogCard,
            {
              backgroundColor: theme.glassSurfaceStrong || '#FFFFFF',
              borderColor: theme.borderStrong || 'rgba(11, 35, 65, 0.18)',
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }]
            },
            shadows?.large || styles.defaultShadow
          ]}
        >
          {/* Top Decorative Icon */}
          <View style={[styles.iconWrap, { backgroundColor: accentBg, borderColor: accentColor }]}>
            <Text style={styles.iconEmoji}>{icon || defaultIcon}</Text>
          </View>

          {/* Title */}
          {title ? (
            <Text style={[styles.title, { color: theme.textPrimary || '#0F172A' }]}>
              {title}
            </Text>
          ) : null}

          {/* Message */}
          {message ? (
            <Text style={[styles.message, { color: theme.textSecondary || '#475569' }]}>
              {message}
            </Text>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            {secondaryText ? (
              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.secondaryBtn,
                  {
                    backgroundColor: theme.glassSurface || 'rgba(255,255,255,0.8)',
                    borderColor: theme.border || '#CBD5E1'
                  }
                ]}
                onPress={handleSecondary}
                activeOpacity={0.8}
              >
                <Text style={[styles.secondaryBtnText, { color: theme.textSecondary || '#475569' }]}>
                  {secondaryText}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[
                styles.btn,
                styles.primaryBtn,
                { backgroundColor: theme.buttonPrimary || accentColor }
              ]}
              onPress={handlePrimary}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {primaryText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  dialogCard: {
    width: Math.min(width - 48, 380),
    borderRadius: 26,
    borderWidth: 1.5,
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
    elevation: 12
  },
  defaultShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  iconEmoji: {
    fontSize: 32
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
    paddingHorizontal: 4
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryBtn: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  secondaryBtn: {
    borderWidth: 1.2
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700'
  }
});
