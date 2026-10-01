import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { LANGUAGES, setLanguage, getLanguage, t } from '../../../shared/i18n';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function LanguageSelectModal({ visible, onClose, onSelect }) {
  const currentLang = getLanguage();

  const handleChoose = (code) => {
    setLanguage(code);
    if (onSelect) onSelect(code);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Select Your Language / భాష</Text>
            <Text style={styles.subtitle}>Choose your preferred language for KaamDost</Text>
          </View>

          <View style={styles.list}>
            {LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.langItem, isSelected && styles.selectedItem]}
                  onPress={() => handleChoose(lang.code)}
                  activeOpacity={0.7}
                >
                  <View>
                    <Text style={[styles.langName, isSelected && styles.selectedText]}>
                      {lang.name}
                    </Text>
                    <Text style={styles.langLabel}>{lang.label}</Text>
                  </View>
                  <View style={styles.badgeWrapper}>
                    <Text style={styles.badgeText}>{lang.badge}</Text>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%'
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16
  },
  header: {
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  list: {
    gap: 8,
    marginBottom: 16
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  selectedItem: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight
  },
  langName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  selectedText: {
    color: COLORS.primaryDark
  },
  langLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.textMuted
  },
  checkmark: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '800'
  },
  closeBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    borderRadius: 12
  },
  closeBtnText: {
    color: COLORS.textSecondary,
    fontWeight: '700'
  }
});
