package com.parking.smartparking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.parking.smartparking.model.Reservation;
import com.parking.smartparking.model.ParkingSpot;
import com.parking.smartparking.repository.ReservationRepository;
import com.parking.smartparking.repository.ParkingSpotRepository;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepo;

    @Autowired
    private ParkingSpotRepository spotRepo;

    public Reservation createReservation(Reservation reservation) {
        // Calculate total price
        if (reservation.getStartTime() != null && reservation.getEndTime() != null) {
            long hours = java.time.temporal.ChronoUnit.HOURS.between(
                reservation.getStartTime(), 
                reservation.getEndTime()
            );
            ParkingSpot spot = spotRepo.findById(reservation.getSpotId()).orElse(null);
            if (spot != null && spot.getPricePerHour() != null) {
                reservation.setTotalPrice(spot.getPricePerHour() * hours);
            }
        }

        reservation.setStatus("ACTIVE");
        reservation.setPaymentStatus("PENDING");
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());
        
        return reservationRepo.save(reservation);
    }

    public List<Reservation> getUserReservations(Long userId) {
        return reservationRepo.findByUserId(userId);
    }

    public Reservation getReservationById(Long id) {
        return reservationRepo.findById(id).orElse(null);
    }

    public Reservation cancelReservation(Long id) {
        Reservation reservation = reservationRepo.findById(id).orElse(null);
        if (reservation != null) {
            reservation.setStatus("CANCELLED");
            reservation.setUpdatedAt(LocalDateTime.now());
            return reservationRepo.save(reservation);
        }
        return null;
    }

    public Reservation markPaymentAsPaid(Long id) {
        Reservation reservation = reservationRepo.findById(id).orElse(null);
        if (reservation != null) {
            reservation.setPaymentStatus("PAID");
            // Move paid reservations to completed state so UI tabs remain consistent.
            reservation.setStatus("COMPLETED");
            reservation.setUpdatedAt(LocalDateTime.now());
            return reservationRepo.save(reservation);
        }
        return null;
    }

    public Reservation updateReservation(Long id, Reservation reservation) {
        Reservation existing = reservationRepo.findById(id).orElse(null);
        if (existing != null) {
            existing.setStartTime(reservation.getStartTime());
            existing.setEndTime(reservation.getEndTime());
            existing.setStatus(reservation.getStatus());
            existing.setPaymentStatus(reservation.getPaymentStatus());
            existing.setUpdatedAt(LocalDateTime.now());
            return reservationRepo.save(existing);
        }
        return null;
    }

    public void deleteReservation(Long id) {
        reservationRepo.deleteById(id);
    }

    public List<Reservation> getReservationsBySpot(Long spotId) {
        return reservationRepo.findBySpotId(spotId);
    }
}
