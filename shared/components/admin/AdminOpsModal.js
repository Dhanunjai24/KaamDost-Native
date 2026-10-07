import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { getBaseUrl } from '../../api/client';

export default function AdminOpsModal({ visible, onClose }) {
  const baseUrl = getBaseUrl();
  const adminUrl = `${baseUrl}/#admin`;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerIcon}>🛡️</Text>
            <View>
              <Text style={styles.headerTitle}>KaamDost Operations Console</Text>
              <Text style={styles.headerSub}>Telangana Field Ops & Fraud Monitor</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕ Close</Text>
          </TouchableOpacity>
        </View>

        <WebView
          originWhitelist={['*']}
          source={{ uri: adminUrl }}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#ea580c" />
              <Text style={styles.loadingText}>Loading KaamDost Admin Command Desk...</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  headerIcon: {
    fontSize: 22
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800'
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 11
  },
  closeBtn: {
    padding: 6
  },
  closeBtnText: {
    color: '#f97316',
    fontWeight: '800',
    fontSize: 14
  },
  webview: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12
  },
  loadingText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600'
  }
});
