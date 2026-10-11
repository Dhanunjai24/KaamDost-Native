/**
 * KaamDost - Realtime WebSocket Client Service
 * Shared between KaamDostCustomer and KaamDostPartner apps.
 * Provides unified real-time handling for:
 * 1. Booking alerts & job acceptance
 * 2. In-app live chat
 * 3. Live worker GPS location & radar
 * 4. Online VoIP / voice call signaling
 */

import { Platform } from 'react-native';
let _APP_ENV = 'development';
let _SOCKET_URL = null;
try {
  const env = require('@env');
  _APP_ENV = env.APP_ENV || _APP_ENV;
  _SOCKET_URL = env.SOCKET_SERVER_URL || null;
} catch (e) {
  if (typeof process !== 'undefined' && process.env) {
    _APP_ENV = process.env.APP_ENV || _APP_ENV;
    _SOCKET_URL = process.env.SOCKET_SERVER_URL || null;
  }
}

class RealtimeService {
  constructor() {
    this.ws = null;
    this.userId = null;
    this.role = null;
    this.trade = null;
    this.activeBookingId = null;
    this.isConnected = false;
    this.listeners = new Map(); // eventName -> Set of callbacks
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
  }

  getGatewayUrl() {
    if (_SOCKET_URL) {
      const formatted = _SOCKET_URL.replace(/^http/, 'ws');
      return formatted.endsWith('/realtime') ? formatted : `${formatted}/realtime`;
    }
    if (_APP_ENV === 'production') {
      return 'wss://kaamdost.onrender.com/realtime';
    }
    const host = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
    return `ws://${host}:3000/realtime`;
  }

  connect({ userId, role = 'customer', trade = null, bookingId = null, serverUrl = null } = {}) {
    if (userId) this.userId = userId;
    if (role) this.role = role;
    if (trade) this.trade = trade;
    if (bookingId) this.activeBookingId = bookingId;

    if (this.ws && (this.ws.readyState === 0 || this.ws.readyState === 1)) {
      // Already connected or connecting; re-register session
      this.register(this.userId, this.role, this.trade, this.activeBookingId);
      return;
    }

    const targetUrl = serverUrl || this.getGatewayUrl();

    try {
      this.ws = new WebSocket(targetUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.register(this.userId, this.role, this.trade, this.activeBookingId);
        this.emitLocal('connection_status', { isConnected: true });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncoming(data);
        } catch (e) {}
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.stopHeartbeat();
        this.emitLocal('connection_status', { isConnected: false });
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnected = false;
      };
    } catch (err) {
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 15000);
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      this.connect({
        userId: this.userId,
        role: this.role,
        trade: this.trade,
        bookingId: this.activeBookingId
      });
    }, delay);
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'PING' });
    }, 20000);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }

  register(userId, role, trade, bookingId) {
    this.userId = userId || this.userId;
    this.role = role || this.role;
    this.trade = trade || this.trade;
    if (bookingId) this.activeBookingId = bookingId;

    this.send({
      type: 'REGISTER',
      userId: this.userId,
      role: this.role,
      trade: this.trade,
      bookingId: this.activeBookingId
    });
  }

  send(data) {
    if (this.ws && this.ws.readyState === 1) {
      try {
        this.ws.send(JSON.stringify(data));
      } catch (e) {}
    }
  }

  handleIncoming(data) {
    const { type } = data;
    switch (type) {
      case 'NEW_BOOKING_ALERT':
        this.emitLocal('new_booking_alert', data.booking);
        break;
      case 'BOOKING_ACCEPTED':
        this.emitLocal('booking_accepted', data);
        break;
      case 'JOB_STATUS_UPDATED':
        this.emitLocal('job_status_updated', data);
        break;
      case 'BOOKING_UPDATED':
        this.emitLocal('booking_updated', data.booking);
        break;
      case 'CHAT_MESSAGE':
        this.emitLocal('chat_message', data.message);
        break;
      case 'WORKER_LOCATION_UPDATE':
        this.emitLocal('worker_location_update', data);
        break;
      case 'INCOMING_CALL':
        this.emitLocal('incoming_call', data);
        break;
      case 'CALL_SIGNAL':
        this.emitLocal('call_signal', data.signal);
        break;
      case 'CALL_ANSWERED':
        this.emitLocal('call_answered', data);
        break;
      case 'CALL_ENDED':
        this.emitLocal('call_ended', data);
        break;
      default:
        this.emitLocal(type.toLowerCase(), data);
    }
  }

  // ─── HIGH LEVEL ACTIONS ──────────────────────────────────
  bookOrder(booking) {
    this.activeBookingId = booking?.id;
    this.send({
      type: 'BOOK_ORDER',
      booking
    });
  }

  acceptBooking(bookingId, workerId, workerDetails) {
    this.activeBookingId = bookingId;
    this.send({
      type: 'ACCEPT_BOOKING',
      bookingId,
      workerId,
      workerDetails
    });
  }

  sendChatMessage(bookingId, text, senderRole, senderName) {
    this.send({
      type: 'SEND_CHAT',
      bookingId: bookingId || this.activeBookingId,
      text,
      senderRole: senderRole || this.role,
      senderName
    });
  }

  sendLocationUpdate(bookingId, coords = {}) {
    this.send({
      type: 'UPDATE_LOCATION',
      bookingId: bookingId || this.activeBookingId,
      latitude: coords.latitude,
      longitude: coords.longitude,
      heading: coords.heading || 0,
      speed: coords.speed || 0,
      etaMinutes: coords.etaMinutes,
      distanceKm: coords.distanceKm
    });
  }

  initiateCall(bookingId, callerName, callerRole) {
    this.send({
      type: 'CALL_INITIATE',
      bookingId: bookingId || this.activeBookingId,
      callerName,
      callerRole: callerRole || this.role
    });
  }

  sendCallSignal(bookingId, signal) {
    this.send({
      type: 'CALL_SIGNAL',
      bookingId: bookingId || this.activeBookingId,
      signal
    });
  }

  answerCall(bookingId) {
    this.send({
      type: 'CALL_ANSWER',
      bookingId: bookingId || this.activeBookingId
    });
  }

  endCall(bookingId, reason = 'Call ended') {
    this.send({
      type: 'CALL_END',
      bookingId: bookingId || this.activeBookingId,
      reason
    });
  }

  // ─── SUBSCRIPTION LISTENERS ──────────────────────────────
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);
    return () => {
      if (this.listeners.has(eventName)) {
        this.listeners.get(eventName).delete(callback);
      }
    };
  }

  emitLocal(eventName, payload) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).forEach((cb) => {
        try { cb(payload); } catch (e) {}
      });
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
    }
    this.isConnected = false;
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService;
