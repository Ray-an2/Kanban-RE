package com.kanban.compte.controller;

import com.kanban.compte.dtos.CompteCreateDto;
import com.kanban.compte.dtos.CompteDto;
import com.kanban.compte.dtos.CompteUpdateMdpDto;
import com.kanban.compte.service.CompteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compte")
public class CompteController {

  private final CompteService compteService;

  public CompteController(CompteService compteService) {
    this.compteService = compteService;
  }

  // -------------------------------------------------------------------------
  // Lecture
  // -------------------------------------------------------------------------

  /** GET /api/compte — tous les comptes (admin) */
  @GetMapping
  public List<CompteDto> getComptes() {
    return compteService.getAll();
  }

  /** GET /api/compte/:id — un compte par son id */
  @GetMapping("/{id}")
  public CompteDto getCompteById(@PathVariable String id) {
    return compteService.getCompte(id);
  }

  /**
   * GET /api/compte/pseudo/:pseudo/disponible
   * Vérifie si un pseudo est disponible avant inscription.
   * Retourne { "disponible": true/false }
   */
  @GetMapping("/pseudo/{pseudo}/disponible")
  public java.util.Map<String, Boolean> isPseudoDisponible(@PathVariable String pseudo) {
    return java.util.Map.of("disponible", compteService.isPseudoDisponible(pseudo));
  }

  // -------------------------------------------------------------------------
  // Création
  // -------------------------------------------------------------------------

  /**
   * POST /api/compte
   * Crée un compte et son profil associé.
   * Le mot de passe dans le body doit déjà être haché par Deno.
   * Retourne le CompteDto public (sans mot de passe).
   */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CompteDto createCompte(@Valid @RequestBody CompteCreateDto compteCreateDto) {
    return compteService.create(compteCreateDto);
  }

  // -------------------------------------------------------------------------
  // Mises à jour
  // -------------------------------------------------------------------------

  /**
   * PATCH /api/compte/:id/pseudo
   * Met à jour le pseudo d'un compte.
   * Body : { "pseudo": "nouveauPseudo" }
   */
  @PatchMapping("/{id}/pseudo")
  public CompteDto updatePseudo(@PathVariable String id,
                                @RequestBody java.util.Map<String, String> body) {
    String pseudo = body.get("pseudo");
    if (pseudo == null || pseudo.isBlank()) {
      throw new IllegalArgumentException("Le pseudo ne peut pas être vide");
    }
    return compteService.updatePseudo(id, pseudo);
  }

  /**
   * PATCH /api/compte/:id/role
   * Met à jour le rôle d'un compte (admin uniquement).
   * Body : { "role": "A" }
   */
  @PatchMapping("/{id}/role")
  public CompteDto updateRole(@PathVariable String id,
                              @RequestBody java.util.Map<String, String> body) {
    String role = body.get("role");
    if (role == null || role.isBlank()) {
      throw new IllegalArgumentException("Le rôle ne peut pas être vide");
    }
    return compteService.updateRole(id, role);
  }

  /**
   * PATCH /api/compte/:id/mdp
   * Met à jour le mot de passe d'un compte.
   * Le nouveau mot de passe dans le body doit déjà être haché par Deno.
   * Ne retourne rien (204 No Content).
   */
  @PatchMapping("/{id}/mdp")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void updateMdp(@PathVariable String id,
                        @Valid @RequestBody CompteUpdateMdpDto mdpDto) {
    compteService.updateMdp(id, mdpDto.getMdp());
  }

  // -------------------------------------------------------------------------
  // Suppression
  // -------------------------------------------------------------------------

  /** DELETE /api/compte/:id — supprimer un compte */
  @DeleteMapping("/{id}")
  public boolean deleteCompte(@PathVariable String id) {
    return compteService.delete(id);
  }
}