package com.parking.smartparking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.parking.smartparking.model.ParkingSpot;
import com.parking.smartparking.repository.ParkingSpotRepository;

import java.util.List;

@Service
public class ParkingService {

    @Autowired
    private ParkingSpotRepository repo;

    // Get all parking spots
    public List<ParkingSpot> getAllSpots() {
        return repo.findAll();
    }

    // Add new parking spot
    public ParkingSpot addSpot(ParkingSpot spot) {
        return repo.save(spot);
    }

    // Reserve a parking spot
    public ParkingSpot reserveSpot(Long id) {
        ParkingSpot spot = repo.findById(id).orElseThrow();
        spot.setReserved(true);
        return repo.save(spot);
    }
    
    // Delete a parking spot
    public void deleteSpot(Long id) {
        repo.deleteById(id);
    }
}