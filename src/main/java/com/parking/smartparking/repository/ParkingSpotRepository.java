package com.parking.smartparking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.parking.smartparking.model.ParkingSpot;

public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {
}
