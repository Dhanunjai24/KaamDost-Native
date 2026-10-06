---
name: websocket
description: Standards for live communication, SSE streams, and WebSocket gateways.
---

# Real-Time Streams & WebSocket Skill

## Purpose
Govern real-time communication between customers, service workers, and admin dispatchers for live job alerts, tracking, and messaging.

## When to Use
- Managing Server-Sent Events (SSE) endpoints (`/api/workers/:id/job-stream`, `/api/bookings/:id/stream`).
- Implementing or upgrading WebSocket connections (`ws` or `Socket.IO`).
- Handling real-time GPS telemetry updates for active jobs.
- Implementing live chat between customers and partners.

## Technical Standards
- Implement heartbeat / keep-alive pings every 30 seconds to prevent proxy disconnects.
- Handle unexpected disconnections with client-side exponential backoff reconnection.
- Authenticate connections during the initial handshake via JWT token or query parameter.
- Clean up connection handles and event listeners on socket close to prevent memory leaks.
- Ensure event payloads are small, serialized JSON packets.

## Common Mistakes
- Unbounded memory growth by retaining closed connection objects in listener arrays.
- Broadcasting private messages to unauthorized channels (missing room authorization).
- Blocking the Node.js event loop with synchronous operations inside message handlers.
- Failing to handle connection drops gracefully on mobile networks.

## Validation Requirements
- Simulate client connection, message exchange, and clean disconnection.
- Verify heartbeat packets arrive consistently without dropping the stream.
- Test client behavior when switching from Wi-Fi to cellular data.

## Security Considerations
- Enforce strict authorization before joining a booking room or receiving worker telemetry.
- Rate-limit message sending to prevent denial-of-service through socket floods.
- Sanitize chat messages against XSS before relaying to other clients.
