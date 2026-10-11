import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function LeafletMapView({
  customerLocation = { lat: 17.6190, lng: 78.0805, title: 'Customer Site' }, // Default Sangareddy
  workerLocation = { lat: 17.6250, lng: 78.0890, title: 'Assigned Worker' },
  height = 240,
  zoom = 14
}) {
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #0f172a; }
        .custom-popup .leaflet-popup-content-wrapper {
          background: #1e293b; color: #f8fafc; font-family: sans-serif; font-size: 12px; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .custom-popup .leaflet-popup-tip { background: #1e293b; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var custLat = ${customerLocation.lat || 17.6190};
        var custLng = ${customerLocation.lng || 78.0805};
        var workLat = ${workerLocation.lat || 17.6250};
        var workLng = ${workerLocation.lng || 78.0890};

        var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([custLat, custLng], ${zoom});

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        // Customer Marker (Orange)
        var custIcon = L.divIcon({
          html: '<div style="background:#ea580c;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(234,88,12,0.8);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:11px;">📍</div>',
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker([custLat, custLng], { icon: custIcon }).addTo(map).bindPopup('<b>Customer Site</b>', { className: 'custom-popup' });

        // Worker Marker (Green)
        var workIcon = L.divIcon({
          html: '<div style="background:#16a34a;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(22,163,74,0.8);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:11px;">👷</div>',
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker([workLat, workLng], { icon: workIcon }).addTo(map).bindPopup('<b>Worker Live GPS</b>', { className: 'custom-popup' });

        // Draw Route Line
        var polyline = L.polyline([
          [custLat, custLng],
          [workLat, workLng]
        ], {
          color: '#ea580c',
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 8'
        }).addTo(map);

        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color="#ea580c" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
