import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassModal({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 360,
  animationType = 'fade'
}) {
  const { theme, shadows } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.dialog,
            {
              maxWidth,
              backgroundColor: theme.glassSurfaceStrong,
              borderColor: theme.borderStrong
            },
            shadows.large
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={[styles.headerRow, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.titleCol}>
              {title ? (
                <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
              ) : null}
              {subtitle ? (
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
              ) : null}
            </View>
            {onClose ? (
              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeBtn, { backgroundColor: theme.primaryLight }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.closeIcon, { color: theme.textPrimary }]}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Body */}
          <View style={styles.body}>{children}</View>

          {/* Footer */}
          {footer ? <View style={[styles.footer, { borderTopColor: theme.borderLight }]}>{footer}</View> : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 35, 65, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  dialog: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1.2,
    overflow: 'hidden'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1
  },
  titleCol: {
    flex: 1
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
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
    fontWeight: '700'
  },
  body: {
    padding: 20
  },
  footer: {
    padding: 16,
    borderTopWidth: 1
  }
});
