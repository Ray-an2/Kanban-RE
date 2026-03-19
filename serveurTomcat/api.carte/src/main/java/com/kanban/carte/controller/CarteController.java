package com.kanban.carte.controller;

import com.kanban.carte.dtos.CarteDto;
import com.kanban.carte.dtos.MoveCarteDto;
import com.kanban.carte.service.impl.CarteServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carte")
public class CarteController {

  private final CarteServiceImpl carteService;

  public CarteController(CarteServiceImpl carteService) {
    this.carteService = carteService;
  }

  // -------------------------------------------------------------------------
  // CRUD de base
  // -------------------------------------------------------------------------

  /** GET /api/carte — toutes les cartes */
  @GetMapping
  public List<CarteDto> getAllCartes() {
    return carteService.getAllCartes();
  }

  /** GET /api/carte/:carId — une carte par son id */
  @GetMapping("/{carId}")
  public CarteDto getCarte(@PathVariable String carId) {
    return carteService.getCarteById(carId);
  }

  /** POST /api/carte — créer une carte */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CarteDto createCarte(@RequestBody CarteDto carteDto) {
    return carteService.createCarte(carteDto);
  }

  /** PUT /api/carte/:carId — mettre à jour une carte */
  @PutMapping("/{carId}")
  public CarteDto updateCarte(@PathVariable String carId, @RequestBody CarteDto carteDto) {
    return carteService.updateCarte(carId, carteDto);
  }

  /** DELETE /api/carte/:carId — supprimer une carte */
  @DeleteMapping("/{carId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public boolean deleteCarte(@PathVariable String carId) {
    return carteService.deleteCarte(carId);
  }

  // -------------------------------------------------------------------------
  // Statuts
  // -------------------------------------------------------------------------

  /** PATCH /api/carte/:carId/archiver — basculer l'archivage */
  @PatchMapping("/{carId}/archiver")
  public CarteDto archiver(@PathVariable String carId) {
    return carteService.archiver(carId);
  }

  /** PATCH /api/carte/:carId/terminer — basculer l'état terminé */
  @PatchMapping("/{carId}/terminer")
  public CarteDto terminer(@PathVariable String carId) {
    return carteService.terminer(carId);
  }

  // -------------------------------------------------------------------------
  // Déplacement
  // -------------------------------------------------------------------------

  /**
   * PATCH /api/carte/:carId/move-liste?newLisId=...
   * Déplace une carte vers une autre liste (sans changer l'ordre).
   */
  @PatchMapping("/{carId}/move-liste")
  public CarteDto moveCarteToList(@PathVariable String carId,
                                  @RequestParam String newLisId) {
    return carteService.moveCarteToList(carId, newLisId);
  }

  /**
   * PATCH /api/carte/:carId/deplacer
   * Déplace une carte avec mise à jour de la liste cible et de l'ordre.
   * Body : { "newLisId": "...", "newOrdre": 2 }
   */
  @PatchMapping("/{carId}/deplacer")
  public CarteDto moveCarteOrdre(@PathVariable String carId,
                                 @RequestBody MoveCarteDto moveCarteDto) {
    return carteService.moveCarteOrdre(carId, moveCarteDto.getNewLisId(), moveCarteDto.getNewOrdre());
  }

  // -------------------------------------------------------------------------
  // Cartes archivées
  // -------------------------------------------------------------------------

  /**
   * GET /api/carte/tableau/:tabId/archivees
   * Retourne toutes les cartes archivées d'un tableau.
   */
  @GetMapping("/tableau/{tabId}/archivees")
  public List<CarteDto> getCartesArchivees(@PathVariable String tabId) {
    return carteService.getCartesArchivees(tabId);
  }

  // -------------------------------------------------------------------------
  // Comptage & date limite
  // -------------------------------------------------------------------------

  /**
   * GET /api/carte/liste/:lisId/count
   * Compte le nombre de cartes dans une liste.
   */
  @GetMapping("/liste/{lisId}/count")
  public Long countByLisId(@PathVariable String lisId) {
    return carteService.countByLisId(lisId);
  }

  /**
   * GET /api/carte/:carId/retard
   * Retourne true si la date de fin de la carte est dépassée.
   */
  @GetMapping("/{carId}/retard")
  public Boolean isEnRetard(@PathVariable String carId) {
    return carteService.isEnRetard(carId);
  }
}