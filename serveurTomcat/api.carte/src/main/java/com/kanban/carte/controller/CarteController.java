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

  /**
   * Récupère tous les cartes
   * @return List<CarteDto> : Liste de toutes les cartes.
   */
  @GetMapping
  public List<CarteDto> getAllCartes() {
    return carteService.getAllCartes();
  }

  /**
   * Récupère une carte par son id
   * @param carId : identifiant de la carte
   * @return
   */
  @GetMapping("/{carId}")
  public CarteDto getCarte(@PathVariable String carId) {
    return carteService.getCarteById(carId);
  }

  /**
   * Création d'une carte
   * @param carteDto : informations de la carte (nom, description, date limite, etc.)
   * @return CarteDto : nouvelle carte créer
   */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CarteDto createCarte(@RequestBody CarteDto carteDto) {
    return carteService.createCarte(carteDto);
  }

  /**
   * Met à jour une carte
   * @param carId : identifiant de la carte
   * @param carteDto : Information de la carte
   * @return CarteDto : carte mis à jour
   */
  @PutMapping("/{carId}")
  public CarteDto updateCarte(@PathVariable String carId, @RequestBody CarteDto carteDto) {
    return carteService.updateCarte(carId, carteDto);
  }

  /**
   * Suppression d'une carte.
   * @param carId
   * @return true si la carte est supprimé, false sinon.
   */
  @DeleteMapping("/{carId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public boolean deleteCarte(@PathVariable String carId) {
    return carteService.deleteCarte(carId);
  }


  /**
   * Basculer l'archivage d'une carte.
   * @param carId : identifiant de la carte
   * @return A si la carte n'était pas archivé, N si la carte était archivé.
   */
  @PatchMapping("/{carId}/archiver")
  public CarteDto archiver(@PathVariable String carId) {
    return carteService.archiver(carId);
  }

  /**
   * Basculer l'état d'avancement de la carte.
   * @param carId : identifiant de la carte
   * @return T si la carte n'était pas terminé, N si la carte était terminé.
   */
  @PatchMapping("/{carId}/terminer")
  public CarteDto terminer(@PathVariable String carId) {
    return carteService.terminer(carId);
  }

  /**
   * déplace une carte vers une autre liste (sans changer l'ordre).
   * @param carId : identifiant de la carte
   * @param newLisId : identifiant de la nouvelle liste
   * @return CarteDto : La liste de la carte est mis à jour.
   */
  @PatchMapping("/{carId}/move-liste")
  public CarteDto moveCarteToList(@PathVariable String carId,
                                  @RequestParam String newLisId) {
    return carteService.moveCarteToList(carId, newLisId);
  }

  /**
   * Déplace d'une carte et met à jour l'ordre des cartes dans les listes.
   * @param carId : identifiant de la carte
   * @param moveCarteDto : contient sourceLisId, targetLisId et newOrdre
   * @return
   */
  @PatchMapping("/{carId}/deplacer")
  public CarteDto moveCarteOrdre(@PathVariable String carId,
                                 @RequestBody MoveCarteDto moveCarteDto) {
    return carteService.moveCarteOrdre(carId, moveCarteDto.getNewLisId(), moveCarteDto.getNewOrdre());
  }

  /**
   * Retourne tous les cartes dont l'etat de la carte est A.
   * @param tabId : identifiant du tableau
   * @return List<CarteDTO> : Liste de tous les cartes archivée.
   */
  @GetMapping("/tableau/{tabId}/archivees")
  public List<CarteDto> getCartesArchivees(@PathVariable String tabId) {
    return carteService.getCartesArchivees(tabId);
  }

  /**
   * Retourne le nombre de cartes dans une liste.
   * @param lisId : identifiant de la liste
   * @return : nombre de cartes dans la liste.
   */
  @GetMapping("/liste/{lisId}/count")
  public Long countByLisId(@PathVariable String lisId) {
    return carteService.countByLisId(lisId);
  }

  /**
   * GET /api/carte/:carId/retard
   * Retourne true si la date de fin de la carte est dépassée.
   */
  /**
   * Verifie si la date de fin est dépassé.
   * @param carId : identifiant de la carte
   * @return Retourne true si la date de fin de la carte est dépassée. Sinon false.
   */
  @GetMapping("/{carId}/retard")
  public Boolean isEnRetard(@PathVariable String carId) {
    return carteService.isEnRetard(carId);
  }
}