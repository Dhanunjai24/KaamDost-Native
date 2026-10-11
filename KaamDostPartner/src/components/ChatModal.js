import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, StyleSheet, Alert } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import realtimeService from '../../../shared/services/realtimeService';

export default function ChatModal({ visible, bookingId = null, partnerName = 'Customer', onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!visible) return;

    // Listen for incoming customer messages in real-time
    const unsub = realtimeService.on('chat_message', (msg) => {
      if (msg && (msg.sender === 'customer' || msg.sender === 'user')) {
        setMessages((prev) => [...prev, {
          id: msg.id || String(Date.now()),
          text: msg.text,
          sender: 'partner', // from partner's POV, customer is other party
          time: msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    });

    return () => unsub();
  }, [visible, bookingId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const text = input.trim();
    const newMsg = {
      id: String(Date.now()),
      text,
      sender: 'user', // me (the worker)
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Transmit to customer via live websocket
    realtimeService.sendChatMessage(bookingId, text, 'worker', 'Partner');
  };

  const handleCall = () => {
    Alert.alert(
      'In-App Voice Call',
      'Calling customer online...',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            realtimeService.initiateCall(bookingId, 'Partner', 'worker');
            Alert.alert('Calling...', 'Connecting high-definition WebRTC voice session to customer.');
          }
        }
      ]
    );
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
            <Text style={styles.status}>🟢 Online</Text>
          </View>
          <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
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
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>Direct in-app live chat active with customer</Text>
            </View>
          }
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message to customer..."
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
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.secondary
  },
  status: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600'
  },
  callBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#EEF2FF'
  },
  callIcon: {
    fontSize: 18
  },
  list: {
    padding: 16,
    flexGrow: 1
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 40
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4
  },
  bubblePartner: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20
  },
  msgTextUser: {
    color: '#FFF'
  },
  msgTextPartner: {
    color: COLORS.secondary
  },
  timeText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-end',
    marginTop: 4
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.secondary
  },
  sendBtn: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendIcon: {
    color: '#FFF',
    fontSize: 16
  }
});
