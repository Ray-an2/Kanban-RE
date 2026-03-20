package com.kanban.tableau.controller;

import com.kanban.tableau.dtos.TableauDto;
import com.kanban.tableau.service.Impl.TableauServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tableau")
public class TableauController {

  private final TableauServiceImpl tableauService;

  public TableauController(TableauServiceImpl tableauService) {
    this.tableauService = tableauService;
  }

  /** GET /api/tableau — tous les tableaux */
  @GetMapping
  public List<TableauDto> getTableaux() {
    return tableauService.getAllTab();
  }

  /** GET /api/tableau/nombre — nombre de tableaux */
  @GetMapping("/nombre")
  public Long getNombreTableaux() {
    return tableauService.getNombreTab();
  }

  /** GET /api/tableau/:id — un tableau par son id */
  @GetMapping("/{id}")
  public TableauDto getTableau(@PathVariable String id) {
    return tableauService.getTabById(id);
  }

  /** GET /api/tableau/compte/:cptId — tableaux d'un utilisateur */
  @GetMapping("/compte/{cptId}")
  public List<TableauDto> getTableauxByCompte(@PathVariable String cptId) {
    return tableauService.getTabByCompteId(cptId);
  }

  /** POST /api/tableau — créer un tableau */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public TableauDto createTab(@RequestBody TableauDto tableauDto) {
    return tableauService.createTab(tableauDto);
  }

  /** PUT /api/tableau/:id — modifier un tableau */
  @PutMapping("/{id}")
  public TableauDto updateTab(@PathVariable String id, @RequestBody TableauDto tableauDto) {
    return tableauService.updateTab(id, tableauDto);
  }

  /** DELETE /api/tableau/:id — supprimer un tableau */
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public boolean deleteTab(@PathVariable String id) {
    return tableauService.deleteTab(id);
  }

  /**
   * GET /api/tableau/tri?tri=rec|alp
   * Retourne tous les tableaux triés par date (rec) ou alphabétiquement (alp).
   */
  @GetMapping("/tri")
  public List<TableauDto> getTableauxTries(@RequestParam String tri) {
    return tableauService.getAllTabTries(tri);
  }

  /**
   * GET /api/tableau/recherche?search=...
   * Recherche des tableaux dont le nom contient la chaîne donnée.
   */
  @GetMapping("/recherche")
  public List<TableauDto> searchTableaux(@RequestParam String search) {
    return tableauService.searchByNom(search);
  }

  /**
   * PATCH /api/tableau/:id/fermer
   * Ferme un tableau et archive toutes ses listes et cartes.
   */
  @PatchMapping("/{id}/fermer")
  public TableauDto fermerTableau(@PathVariable String id) {
    return tableauService.fermerTableau(id);
  }

  /**
   * PATCH /api/tableau/:id/ouvrir
   * Ouvre un tableau et restaure toutes ses listes et cartes.
   */
  @PatchMapping("/{id}/ouvrir")
  public TableauDto ouvrirTableau(@PathVariable String id) {
    return tableauService.ouvrirTableau(id);
  }
}