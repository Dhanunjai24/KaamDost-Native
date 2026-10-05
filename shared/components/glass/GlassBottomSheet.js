import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassBottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = '80%',
  animationType = 'slide'
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
            styles.sheet,
            {
              maxHeight,
              backgroundColor: theme.glassSurfaceStrong,
              borderColor: theme.borderStrong
            },
            shadows.large
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Top Grab Handle */}
          <View style={styles.handleContainer}>
            <View style={[styles.grabHandle, { backgroundColor: theme.borderStrong }]} />
          </View>

          {/* Header */}
          {(title || subtitle) && (
            <View style={[styles.header, { borderBottomColor: theme.borderLight }]}>
              <View style={styles.headerInfo}>
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
                  <Text style={[styles.closeText, { color: theme.textPrimary }]}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 35, 65, 0.25)',
    justifyContent: 'flex-end'
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.2,
    borderBottomWidth: 0,
    paddingBottom: 24,
    overflow: 'hidden'
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10
  },
  grabHandle: {
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
  closeText: {
    fontSize: 14,
    fontWeight: '700'
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 12
  }
});
