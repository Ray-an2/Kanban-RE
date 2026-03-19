package com.kanban.membre.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kanban.membre.dtos.MembreDto;
import com.kanban.membre.service.impl.MembreServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/membre")
public class MembreController {

    private final MembreServiceImpl membreService;

    public MembreController(MembreServiceImpl membreService) {
        this.membreService = membreService;
    }

    /** GET /api/membre — tous les membres */
    @GetMapping
    public List<MembreDto> getAllMembres() {
        return membreService.getAllMembre();
    }

    /** GET /api/membre/carte/:carId — membres d'une carte */
    @GetMapping("/carte/{carId}")
    public List<MembreDto> getMembresCarte(@PathVariable String carId) {
        return membreService.getMembreByCarId(carId);
    }

    /** POST /api/membre — associer un membre à une carte */
    @PostMapping
    public ResponseEntity<MembreDto> associeMembre(@Valid @RequestBody MembreDto membreDto) {
        MembreDto created = membreService.associerMembre(membreDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * DELETE /api/membre/carte/:carId/compte/:cptId
     */
    @DeleteMapping("/carte/{carId}/compte/{cptId}")
    public ResponseEntity<Void> deleteMembre(
            @PathVariable String cptId,
            @PathVariable String carId) {
        membreService.deleteMembre(cptId, carId);
        return ResponseEntity.noContent().build();
    }
}