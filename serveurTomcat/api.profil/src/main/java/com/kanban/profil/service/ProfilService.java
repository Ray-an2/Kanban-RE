package com.kanban.profil.service;

import com.kanban.profil.dto.ProfilDto;

import java.util.List;

@Service
public interface ProfilService {
  /**
   * Créer a nouveau profile
   * @param profilDto
   * @return Un profil est crée et son id est lié à l'id du compte.
   */
  ProfilDto createProfil(ProfilDto profilDto);

  /**
   * Récupérer un profil en particulier à partir de l'id du compte
   * @param Compteid
   * @return profil trouvé
   * @throws ProfilNotFoundException si le profil n'existe pas
   */
  ProfilDto getProfilById(Long Compteid);

  /**
   * Modifier un profil existant à partir de l'id du compte
   * @param Compteid
   * @param profilDto
   * @return profil modifié
   * @throws ProfilNotFoundException si le profil n'existe pas
   */
  PofilDto updateProfil(Long Compteid, ProfilDto profilDto);

  /**
   * Supprimer un profil à partir de l'id du compte
   * @param Compteid
   * @return true si le profil a été supprimé avec succès, sinon false
   * @throws ProfilNotFoundException si le profil n'existe pas
   */
  boolean deleteProfil(Long Compteid);

}
