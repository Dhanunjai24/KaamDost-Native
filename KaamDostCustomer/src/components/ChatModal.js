import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function ChatModal({ visible, partnerName = 'Ramesh Reddy', onClose }) {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Namaste! I am on my way to your location.', sender: 'partner', time: '10:14 AM' },
    { id: '2', text: 'Great, please call when you reach the main gate.', sender: 'user', time: '10:15 AM' },
    { id: '3', text: 'Sure sir, I will be there in 10 minutes.', sender: 'partner', time: '10:16 AM' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: String(Date.now()),
      text: input.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Chat Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{partnerName}</Text>
            <Text style={styles.status}>● Online</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isMe = item.sender === 'user';
            return (
              <View style={[styles.bubble, isMe ? styles.bubbleUser : styles.bubblePartner]}>
                <Text style={[styles.msgText, isMe ? styles.msgTextUser : styles.msgTextPartner]}>
                  {item.text}
                </Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            );
          }}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textMuted}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOWS.small
  },
  backBtn: {
    paddingRight: 12
  },
  backText: {
    fontSize: 22,
    color: COLORS.secondary,
    fontWeight: '700'
  },
  headerInfo: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  status: {
    fontSize: 11,
    color: COLORS.onlineGreen,
    fontWeight: '600'
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  callIcon: {
    fontSize: 16
  },
  list: {
    padding: 16,
    gap: 10
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 14
  },
  bubbleUser: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2
  },
  bubblePartner: {
    backgroundColor: COLORS.surface,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18
  },
  msgTextUser: {
    color: COLORS.textWhite
  },
  msgTextPartner: {
    color: COLORS.textPrimary
  },
  timeText: {
    fontSize: 9,
    color: COLORS.textMuted,
    alignSelf: 'flex-end',
    marginTop: 4
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginRight: 8
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendIcon: {
    color: COLORS.textWhite,
    fontSize: 16
  }
});
