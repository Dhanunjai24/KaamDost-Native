import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassTab({
  tabs = [],
  activeTab,
  onSelectTab,
  scrollable = false,
  style
}) {
  const { theme } = useTheme();

  const renderTabs = () => (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundSecondary,
          borderColor: theme.border
        },
        style
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              isActive && [
                styles.tabActive,
                {
                  backgroundColor: theme.glassSurfaceStrong,
                  borderColor: theme.borderStrong
                }
              ]
            ]}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: isActive ? theme.textPrimary : theme.textSecondary,
                  fontWeight: isActive ? '800' : '600'
                }
              ]}
            >
              {tab.label}
              {tab.count !== undefined && (
                <Text style={{ color: isActive ? theme.accentPrimary : theme.textMuted }}>
                  {' '}({tab.count})
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {renderTabs()}
      </ScrollView>
    );
  }

  return renderTabs();
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4
  },
  scroll: {
    paddingVertical: 2
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabActive: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1
  },
  tabText: {
    fontSize: 13,
    letterSpacing: -0.2
  }
});
