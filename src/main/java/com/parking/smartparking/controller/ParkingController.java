package com.parking.smartparking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.parking.smartparking.model.ParkingSpot;
import com.parking.smartparking.model.Reservation;
import com.parking.smartparking.model.User;
import com.parking.smartparking.service.ParkingService;
import com.parking.smartparking.service.UserService;
import com.parking.smartparking.repository.ReservationRepository;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/parking")
@CrossOrigin(origins = "*")
public class ParkingController {

    @Autowired
    private ParkingService service;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ReservationRepository reservationRepository;

    // GET all parking spots
    @GetMapping("/spots")
    public ResponseEntity<List<ParkingSpot>> getAllSpots() {
        return ResponseEntity.ok(service.getAllSpots());
    }
    
    // GET available parking spots
    @GetMapping("/spots/available")
    public ResponseEntity<List<ParkingSpot>> getAvailableSpots() {
        List<ParkingSpot> allSpots = service.getAllSpots();
        List<ParkingSpot> available = allSpots.stream()
            .filter(s -> !s.isReserved())
            .toList();
        return ResponseEntity.ok(available);
    }

    // POST add new parking spot
    @PostMapping("/spots/add")
    public ResponseEntity<Map<String, Object>> addSpot(@RequestBody ParkingSpot spot) {
        ParkingSpot saved = service.addSpot(spot);
        Map<String, Object> response = new HashMap<>();
        response.put("success", saved != null);
        response.put("spot", saved);
        return ResponseEntity.ok(response);
    }
    
    // DELETE parking spot
    @DeleteMapping("/spots/{id}")
    public ResponseEntity<Map<String, Object>> deleteSpot(@PathVariable Long id) {
        service.deleteSpot(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    // POST reserve a spot
    @PostMapping("/reserve/{id}")
    public ResponseEntity<ParkingSpot> reserveSpot(@PathVariable Long id) {
        return ResponseEntity.ok(service.reserveSpot(id));
    }
    
    // GET all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    // GET all reservations
    @GetMapping("/reservations")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }
}