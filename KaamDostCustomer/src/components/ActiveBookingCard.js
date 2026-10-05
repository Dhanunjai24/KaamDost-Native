import React from 'react';
import GlassBookingCard from '../../../shared/components/glass/GlassBookingCard';

export default function ActiveBookingCard({ booking, onTrackBooking, onNewBooking }) {
  return (
    <GlassBookingCard
      booking={booking}
      onTrackBooking={onTrackBooking}
      onNewBooking={onNewBooking}
    />
  );
}
