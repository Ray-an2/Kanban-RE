package com.kanban.compte.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kanban.compte.service.CompteService;

@RestController
@RequestMapping("api/users")
public class CompteController {

}
  private final CompteService compteService;

  public CompteController(CompteService compteService) {
    this.compteService = compteService;
  }

  /**
   * Récupère la liste de tous les comptes.
   *
   * @return une liste de CompteDto représentant tous les comptes
   */
  @GetMapping
  public List<CompteDto> getComptes(){
    return compteService.getAll();
  }

  /**
   * Récupère un compte par son identifiant.
   *
   * @param id l'identifiant du compte à récupérer
   * @return le CompteDto correspondant à l'identifiant fourni, ou null si aucun compte n'est trouvé
   */
  @GetMapping("/{id}")
  public CompteDto getCompteById(@PathVariable Long id) {
    return compteService.getCompte(id);
  }
  /**
   * Crée un nouveau compte.
   *
   * @param compteDto les données du compte à créer
   * @return le CompteDto du compte créé, ou null si la création a échoué
   */
  @PostMapping
  public CompteDto createCompte(@RequestBody CompteDto compteDto) {
    return compteService.create(compteDto);
  }

  /**
   * Met à jour un compte existant.
   *
   * @param id l'identifiant du compte à mettre à jour
   * @param compteDto les données du compte à mettre à jour
   * @return le CompteDto du compte mis à jour, ou null si aucun compte n'est trouvé avec l'id fourni
   */
  @PutMapping("/{id}/pseudo")
  public CompteDto updateCompte(@PathVariable Long id, @RequestBody CompteDto compteDto) {
    compteDto.setPseudo(compteDto.getPseudo());
    return compteService.update(compteDto);
  }

  /**
   * Met à jour le rôle d'un compte existant.
   *
   * @param id l'identifiant du compte à mettre à jour
   * @param compteDto les données du compte à mettre à jour
   * @return le CompteDto du compte mis à jour, ou null si aucun compte n'est trouvé avec l'id fourni
   */
  @PutMapping("/{id}/role")
  public CompteDto updateRole(@PathVariable Long id, @RequestBody CompteDto compteDto) {
    compteDto.setRole(compteDto.getRole());
    return compteService.update(compteDto);
  }


  /**
   * Supprime un compte.
   *
   * @param id l'identifiant du compte à supprimer
   * @return true si la suppression a réussi, false sinon
   */
  @DeleteMapping("/{id}")
  public boolean deleteCompte(@PathVariable Long id) {
    return compteService.delete(id);


}
