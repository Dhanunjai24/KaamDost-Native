import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function CustomerSupportScreen({ onBack }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Namaste! I am KaamDost AI Support Assistant. How can I help you today with your booking, worker dispatch, or payment in Telangana?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    'How do I cancel a booking?',
    'What is daily wage for mason?',
    'Worker hasn’t arrived yet',
    'Payment invoice copy'
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      let botReply = "Our Telangana support desk has logged your request. A customer care Dost will contact you shortly.";
      const lower = query.toLowerCase();
      if (lower.includes('cancel')) {
        botReply = "You can cancel free of charge within 3 minutes of booking from the Live Tracking screen by tapping the 'Cancel' button.";
      } else if (lower.includes('mason') || lower.includes('wage')) {
        botReply = "The standard daily wage for a verified Mason in Telangana is ₹950/day as per state labour guidelines.";
      } else if (lower.includes('arrived') || lower.includes('late')) {
        botReply = "You can call the worker directly using the call button on the Tracking screen or our emergency desk at 1800-KAAMDOST.";
      }

      const botMsg = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>24/7 AI Support Desk</Text>
          <Text style={styles.headerSub}>● Instant Telangana Assistance</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
              <Text style={[styles.msgText, isUser ? styles.msgTextUser : styles.msgTextBot]}>
                {item.text}
              </Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          );
        }}
      />

      {/* Quick Prompts */}
      <View style={styles.promptsContainer}>
        {quickPrompts.map((p, idx) => (
          <TouchableOpacity key={idx} style={styles.promptPill} onPress={() => handleSend(p)}>
            <Text style={styles.promptText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask anything about KaamDost..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  backBtn: {
    paddingRight: 8
  },
  backText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.secondary
  },
  headerInfo: {
    flex: 1
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  headerSub: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '600'
  },
  list: {
    padding: 16,
    gap: 10
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 14
  },
  bubbleUser: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2
  },
  bubbleBot: {
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
  msgTextBot: {
    color: COLORS.textPrimary
  },
  timeText: {
    fontSize: 9,
    color: COLORS.textMuted,
    alignSelf: 'flex-end',
    marginTop: 4
  },
  promptsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 6
  },
  promptPill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primarySoft
  },
  promptText: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '600'
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
  sendText: {
    color: COLORS.textWhite,
    fontSize: 16
  }
});
