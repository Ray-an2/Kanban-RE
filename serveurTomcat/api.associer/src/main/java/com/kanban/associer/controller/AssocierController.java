package com.kanban.associer.controller;

import com.kanban.associer.service.impl.AssocierServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kanban.associer.dtos.AssocierDto;

import java.util.List;

@RestController
@RequestMapping("api/associer")
public class AssocierController {

  private final AssocierServiceImpl AssocierService;

  public AssocierController(AssocierServiceImpl AssocierService) {
    this.AssocierService = AssocierService;
  }

  /**
   * Liste de tous les liaisons entre les cartes et les etiquettes dans le systemes.
   * @return List<AssocierDto
   */
  @GetMapping
  public List<AssocierDto> getAllAssociers() {
    return AssocierService.getAllAssocier();
  }

  /**
   * Methode qui récupère les Associers détenu par un utilisateur en particulier.
   * @return AssocierDto
   */
  @GetMapping("/carte/{carId}")
  public List<AssocierDto> getAssociersCarte(@PathVariable String carId) {
    return AssocierService.getAssocierByCarId(carId);
  }

  /**
   * Methode qui récupère les utilisateurs avec leur roles détenu par un tableau en particulier.
   * @return RoleDto
   */
  @GetMapping("/etiquette/{etiId}")
  public List<AssocierDto> getAssociersEti(@PathVariable String etiId) {
    return AssocierService.getAssocierByEtiId(etiId);
  }

  /**
   * Associe un tableau à un utilisateur pour un role donnée.
   * @param AssocierDto :
   * @return List<AssocierDto>
   */
  @PostMapping
  public ResponseEntity<AssocierDto> createAssocier(@Valid @RequestBody AssocierDto AssocierDto) {
    AssocierDto created = AssocierService.createAssocier(AssocierDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  /**
   * Supprime l'association d'un utilisateur au tableau.
   * @param cptId : l'identifiant du compte utilisateur
   * @param tabId : l'identifiant du tableau
   * @return true si l'association est supprimée, false sinon
   */
  @DeleteMapping("/tableau/{tabId}/compte/{cptId}")
  public ResponseEntity<Void> deleteAssocier(@PathVariable String cptId, @PathVariable String tabId) {
    AssocierService.deleteAssocier(cptId, tabId);
    return ResponseEntity.noContent().build();
  }

  /**
   * Modifie l'association entre une carte et une etiquette.
   *
   * @return
   */
  /*@PutMapping("/compte/{cptId}/tableau/{tabId}")
  public ResponseEntity<RoleDto> updateRole(@PathVariable String rolRole) {
    RoleDto updated = roleService.updateRole(rolRole);
    return ResponseEntity.ok(updated);
  }*/
}
