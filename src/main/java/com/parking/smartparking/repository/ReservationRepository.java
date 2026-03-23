package com.parking.smartparking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.parking.smartparking.model.Reservation;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findBySpotId(Long spotId);
    List<Reservation> findByStatus(String status);
}