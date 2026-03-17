package com.kanban.membre.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kanban.membre.dtos.MembreDto;
import com.kanban.membre.service.impl.MembreServiceImpl;

import java.util.List;

@RestController
@RequestMapping("api/membre")
public class MembreController {
    private final MembreServiceImpl membreService;

    public MembreController(MembreServiceImpl membreService) {
        this.membreService = membreService;
    }

    /**
     * Liste de tous les roles du sytemes.
     * @return List<RoleDto
     */
    @GetMapping
    public List<MembreDto> getAllMembres() {
        return membreService.getAllMembre();
    }

    /**
     * Methode qui récupère les utilisateurs détenu par une carte en particulier.
     * @return RoleDto
     */
    @GetMapping("/carte/{carId}")
    public List<MembreDto> getMembresCarte(@PathVariable String carId) {
        return membreService.getMembreByCarId(carId);
    }

    /**
     * Associe une carte à un utilisateur.
     * @param membreDto :
     * @return un nouveau membre est créer.
     */
    @PostMapping
    public ResponseEntity<MembreDto> associeMembre(@Valid @RequestBody MembreDto membreDto) {
        MembreDto created = membreService.associerMembre(membreDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Supprime l'association d'un utilisateur à une carte.
     * @param cptId : l'identifiant du compte utilisateur
     * @param carId : l'identifiant du tableau
     * @return true si l'association est supprimée, false sinon
     */
    @DeleteMapping("/Carte/{carId}/compte/{cptId}")
    public ResponseEntity<Void> deleteMembre(@PathVariable String cptId, @PathVariable String carId) {
        membreService.deleteMembre(cptId, carId);
        return ResponseEntity.noContent().build();
    }
}
