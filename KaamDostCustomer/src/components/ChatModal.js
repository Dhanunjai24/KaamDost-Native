import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, StyleSheet, Linking, Alert } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import socketService from '../services/socketService';

export default function ChatModal({
  visible,
  partnerName = 'Partner',
  partnerPhone = '',
  bookingId = 'BK-LIVE',
  onClose
}) {
  const { theme, shadows } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Initial welcome message from partner and live socket listener
  useEffect(() => {
    if (!visible) return;

    if (messages.length === 0) {
      setMessages([
        {
          id: 'init_1',
          text: `Namaste! I am ${partnerName}, your assigned KaamDost partner. I am en route to your location.`,
          sender: 'partner',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }

    const unsubscribe = socketService.onChatMessage((incomingMsg) => {
      setMessages(prev => [...prev, incomingMsg]);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [visible, partnerName]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: String(Date.now()),
      text: input.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    socketService.sendChatMessage(bookingId, newMsg);
    setInput('');
  };

  const handleCallPartner = () => {
    socketService.initiateOnlineCall(bookingId, 'Customer');
    Alert.alert('In-App Online Call 📞', 'Calling partner online via real-time VoIP audio session.');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.backgroundPrimary }]}>
        {/* Chat Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.glassSurfaceStrong,
              borderBottomColor: theme.border
            },
            shadows.small
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={[styles.backText, { color: theme.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{partnerName}</Text>
            <Text style={[styles.status, { color: theme.success }]}>● Active on Live Duty</Text>
          </View>
          <TouchableOpacity
            style={[styles.callBtn, { backgroundColor: theme.primaryLight }]}
            onPress={handleCallPartner}
            activeOpacity={0.7}
          >
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isMe = item.sender === 'user';
            return (
              <View
                style={[
                  styles.bubble,
                  isMe
                    ? [styles.bubbleUser, { backgroundColor: theme.accentPrimary }]
                    : [styles.bubblePartner, { backgroundColor: theme.glassSurfaceStrong, borderColor: theme.borderLight }]
                ]}
              >
                <Text
                  style={[
                    styles.msgText,
                    isMe
                      ? { color: '#FFFFFF' }
                      : { color: theme.textPrimary }
                  ]}
                >
                  {item.text}
                </Text>
                <Text
                  style={[
                    styles.timeText,
                    { color: isMe ? 'rgba(255,255,255,0.7)' : theme.textMuted }
                  ]}
                >
                  {item.time}
                </Text>
              </View>
            );
          }}
        />

        {/* Input Bar */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.glassSurfaceStrong,
              borderTopColor: theme.borderLight
            }
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
                color: theme.textPrimary
              }
            ]}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message (e.g., landmark, gate code)..."
            placeholderTextColor={theme.textMuted}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: theme.accentPrimary }]}
            onPress={sendMessage}
            activeOpacity={0.8}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1.2
  },
  backBtn: {
    paddingRight: 14,
    paddingVertical: 4
  },
  backText: {
    fontSize: 22,
    fontWeight: '800'
  },
  headerInfo: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: '800'
  },
  status: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  callIcon: {
    fontSize: 16
  },
  list: {
    padding: 16,
    paddingBottom: 30,
    gap: 12
  },
  bubble: {
    maxWidth: '78%',
    padding: 12,
    borderRadius: 16
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4
  },
  bubblePartner: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1.2
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500'
  },
  timeText: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
    fontWeight: '600'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1.2
  },
  textInput: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13,
    marginRight: 10
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 2
  }
});
