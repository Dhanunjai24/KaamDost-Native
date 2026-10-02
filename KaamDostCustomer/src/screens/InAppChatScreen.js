import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function InAppChatScreen({
  bookingId = null,
  worker = null,
  workerName = null,
  onBack,
  initialMessages = null,
  onSendMessage = null,
  isChatClosed = false,
}) {
  const resolvedWorkerName = worker?.name || workerName || 'Rohit Kumar';
  const resolvedTrade = worker?.trade || 'Partner';

  const defaultSeedMessages = [
    {
      id: 1,
      sender: 'worker',
      text: 'Hi! I am on my way. I will reach in 10 minutes.',
      time: '10:30 AM',
    },
    {
      id: 2,
      sender: 'customer',
      text: 'Great! Please let me know when you arrive.',
      time: '10:31 AM',
    },
  ];

  const [messages, setMessages] = useState(
    Array.isArray(initialMessages) && initialMessages.length > 0
      ? initialMessages
      : defaultSeedMessages
  );
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim() || isChatClosed) return;
    const trimmed = inputText.trim();
    const newMsg = {
      id: Date.now(),
      sender: 'customer',
      text: trimmed,
      time: 'Just now',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    if (typeof onSendMessage === 'function') {
      onSendMessage(trimmed);
      return;
    }

    // Simulated reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'worker',
          text: 'Sure, I am entering your street now!',
          time: 'Just now',
        },
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Header matching screen_19 */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>

            <View style={styles.workerProfileCol}>
              <View style={styles.workerAvatar}>
                <Text style={styles.avatarEmoji}>👨‍🔧</Text>
              </View>
              <View>
                <Text style={styles.workerName}>{resolvedWorkerName}</Text>
                <Text style={styles.onlineStatus}>{isChatClosed ? 'Chat Closed' : 'Online'}</Text>
              </View>
            </View>

            <View style={{ width: 42 }} />
          </View>

          {/* Messages Area matching screen_19 */}
          <ScrollView
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    isCustomer ? styles.customerRow : styles.workerRow,
                  ]}
                >
                  {!isCustomer && (
                    <View style={styles.miniAvatar}>
                      <Text style={styles.miniEmoji}>👨‍🔧</Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isCustomer ? styles.customerBubble : styles.workerBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isCustomer ? styles.customerText : styles.workerText,
                      ]}
                    >
                      {msg.text}
                    </Text>
                    <Text
                      style={[
                        styles.messageTime,
                        isCustomer ? styles.customerTime : styles.workerTime,
                      ]}
                    >
                      {msg.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Input Bar matching screen_19 */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#94a3b8"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSend}
              activeOpacity={0.8}
            >
              <Text style={styles.sendArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e0edfd',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d4ed8',
    marginTop: -3,
  },
  workerProfileCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f294a',
  },
  onlineStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },
  messagesContainer: {
    paddingVertical: 18,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  workerRow: {
    justifyContent: 'flex-start',
  },
  customerRow: {
    justifyContent: 'flex-end',
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  miniEmoji: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...SHADOWS.small,
  },
  workerBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#e0edfd',
  },
  customerBubble: {
    backgroundColor: '#dbeafe',
    borderBottomRightRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  workerText: {
    color: '#0f294a',
  },
  customerText: {
    color: '#1e3a8a',
  },
  messageTime: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  workerTime: {
    color: '#94a3b8',
  },
  customerTime: {
    color: '#3b82f6',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f294a',
    paddingVertical: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.buttonGlow,
  },
  sendArrow: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
});
