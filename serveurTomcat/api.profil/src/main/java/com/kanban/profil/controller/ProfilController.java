package com.kanban.profil.controller;

import com.kanban.profil.Dto.ProfilDto;
import com.kanban.profil.service.impl.ProfilService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/profil")
public class ProfilController {
  private final ProfilService profilService;

  public ProfilController(ProfilService profilService) {
    this.profilService = profilService;
  }

  /**
   * Récupérer un profil en particulier à partir de l'id du compte
   * @param id
   * @return profil trouvé
   */
  @GetMapping("/{id}")
  public ProfilDto getProfilById(@PathVariable Long Compteid) {
    return profilService.getProfilById(Compteid);
  }

  /**
   * Créer a nouveau profile
   * @param profilDto
   * @return Un profil est crée et son id est lié à l'id du compte.
   */
  @PostMapping
  public ProfilDto createProfil(@RequestBody ProfilDto profilDto) {
    return profilService.createProfil(profilDto);
  }

  /**
   * Modifier un profil existant à partir de l'id du compte
   * @param id
   * @param profilDto
   * @return profil modifié
   */
  @PutMapping("/{id}")
  public ProfilDto updateProfil(@PathVariable Long id, @RequestBody ProfilDto profilDto) {
    return profilService.updateProfil(id, profilDto);
  }

  /**
   * Supprimer un profil à partir de l'id du compte
   * @param id
   * @return true si le profil a été supprimé avec succès, sinon false
   */
  @DeleteMapping("/{id}")
  public boolean deleteProfil(@PathVariable Long id) {
    return profilService.deleteProfil(id);
  }

}
