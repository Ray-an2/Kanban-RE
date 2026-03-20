package com.kanban.associer.controller;

import com.kanban.associer.service.AssocierService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kanban.associer.dtos.AssocierDto;

import java.util.List;

@RestController
@RequestMapping("/api/associer")
public class AssocierController {

  private final AssocierService associerService;

  public AssocierController(AssocierService associerService) {
    this.associerService = associerService;
  }

  /**
   * Liste tous les liaisons entre les cartes et les etiquettes dans le systeme.
   * @return List<AssocierDto> : Liste de liaisons entre la carte et les etiquettes.
   */
  @GetMapping
  public List<AssocierDto> getAllAssociers() {
    return associerService.getAllAssocier();
  }

  /**
   * Methode qui récupère les Associers détenu par un utilisateur en particulier.
   * @return List<AssocierDto> : Liste de liaisons entre la carte et les etiquettes.
   */
  @GetMapping("/carte/{carId}")
  public List<AssocierDto> getAssociersCarte(@PathVariable String carId) {
    return associerService.getAssocierByCarId(carId);
  }

  /**
   * Methode qui récupère les liaisions détenu par une étiquette en particulier.
   * @return List<AssocierDto> : Liste de liaisons entre la carte et les etiquettes.
   */
  @GetMapping("/etiquette/{etiId}")
  public List<AssocierDto> getAssociersEti(@PathVariable String etiId) {
    return associerService.getAssocierByEtiId(etiId);
  }

  /**
   * Associe une carte à une etiquette.
   * @param associerDto :
   * @return List<AssocierDto> : Liste de liaisons entre la carte et les etiquettes.
   */
  @PostMapping
  public ResponseEntity<AssocierDto> createAssocier(@Valid @RequestBody AssocierDto associerDto) {
    AssocierDto created = associerService.createAssocier(associerDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  /**
   * Supprime l'association d'une carte à une etiquette.
   * @param carId : l'identifiant d'une carte
   * @param etiId : l'identifiant d'une etiquette
   * @return true si l'association est supprimée, false sinon
   */
  @DeleteMapping("/carte/{carId}/etiquette/{etiId}")
  public ResponseEntity<Void> deleteAssocier(@PathVariable String carId, @PathVariable String etiId) {
    associerService.deleteAssocier(carId, etiId);
    return ResponseEntity.noContent().build();
  }
}
