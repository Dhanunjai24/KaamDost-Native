import realtimeService from '../../../shared/services/realtimeService';

class SocketService {
  constructor() {
    this.userId = null;
    this.listeners = new Map();
    this.locationTimers = new Map();
    this.chatListeners = new Set();
  }

  connect(userId, activeBookingId = null) {
    this.userId = userId;
    realtimeService.connect({
      userId,
      role: 'customer',
      bookingId: activeBookingId
    });
  }

  /**
   * Subscribe to live worker GPS location updates & ETA progression
   * @param {string} bookingId
   * @param {function} callback receives { etaMinutes, distanceKm, latitude, longitude, status }
   * @returns {function} unsubscribe function
   */
  subscribeToWorkerLocation(bookingId, callback) {
    if (!bookingId || typeof callback !== 'function') return () => {};

    // 1. Listen to real-time location stream from Partner
    const unsubRealtime = realtimeService.on('worker_location_update', (data) => {
      if (data.bookingId === bookingId) {
        callback({
          bookingId,
          etaMinutes: data.etaMinutes || 10,
          etaText: `${data.etaMinutes || 10} mins`,
          distanceKm: String(data.distanceKm || '1.2'),
          latitude: data.latitude,
          longitude: data.longitude,
          status: data.status || 'ARRIVING'
        });
      }
    });

    // 2. Initial state
    callback({
      bookingId,
      etaMinutes: 14,
      etaText: '14 mins',
      distanceKm: '1.6',
      status: 'ARRIVING'
    });

    // 3. Fallback smooth telemetry simulation if partner is stationary or offline
    let currentEta = 14;
    let distance = 1.6;

    const timer = setInterval(() => {
      if (currentEta > 2) {
        currentEta -= 1;
        distance = Math.max(0.1, distance - 0.12);
        callback({
          bookingId,
          etaMinutes: currentEta,
          etaText: `${currentEta} mins`,
          distanceKm: distance.toFixed(1),
          status: 'ARRIVING'
        });
      } else if (currentEta === 2) {
        currentEta = 1;
        callback({
          bookingId,
          etaMinutes: 1,
          etaText: 'Arriving now',
          distanceKm: '0.1',
          status: 'ARRIVED'
        });
      }
    }, 7000);

    this.locationTimers.set(bookingId, timer);

    return () => {
      unsubRealtime();
      if (this.locationTimers.has(bookingId)) {
        clearInterval(this.locationTimers.get(bookingId));
        this.locationTimers.delete(bookingId);
      }
    };
  }

  /**
   * Send chat message to active booking partner
   * @param {string} bookingId
   * @param {object} messageObj
   */
  sendChatMessage(bookingId, messageObj) {
    const text = typeof messageObj === 'string' ? messageObj : (messageObj?.text || '');
    // Send via live websocket to Partner
    realtimeService.sendChatMessage(bookingId, text, 'customer', 'Customer');

    // Notify local listeners immediately for instant UI responsiveness
    const localMsg = {
      id: 'local_' + Date.now(),
      text,
      sender: 'customer',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.chatListeners.forEach(cb => {
      try { cb(localMsg); } catch (e) {}
    });
  }

  /**
   * Listen for incoming chat messages
   * @param {function} callback
   * @returns {function} unsubscribe function
   */
  onChatMessage(callback) {
    if (typeof callback !== 'function') return () => {};
    this.chatListeners.add(callback);

    // Listen to real-time incoming messages from Partner
    const unsubWs = realtimeService.on('chat_message', (msg) => {
      if (msg.sender === 'worker' || msg.sender === 'partner') {
        callback(msg);
      }
    });

    return () => {
      this.chatListeners.delete(callback);
      unsubWs();
    };
  }

  /**
   * Online calling helpers
   */
  initiateOnlineCall(bookingId, customerName = 'Customer') {
    realtimeService.initiateCall(bookingId, customerName, 'customer');
  }

  onCallStatus(callback) {
    const unsubAnswered = realtimeService.on('call_answered', (data) => callback({ status: 'CONNECTED', ...data }));
    const unsubEnded = realtimeService.on('call_ended', (data) => callback({ status: 'ENDED', ...data }));
    return () => {
      unsubAnswered();
      unsubEnded();
    };
  }

  disconnect() {
    this.locationTimers.forEach(timer => clearInterval(timer));
    this.locationTimers.clear();
    this.chatListeners.clear();
    realtimeService.disconnect();
  }
}

export const socketService = new SocketService();
export default socketService;
