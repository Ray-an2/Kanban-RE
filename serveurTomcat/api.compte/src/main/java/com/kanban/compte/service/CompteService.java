package com.kanban.compte.service;
import Dto.CompteDto;
import java.util.List;

@Service
public interface CompteService {

  /**
   * Crée un nouveau compte
   * @param compteDto : le compte à créer, doit contenir un id null ou non défini
   * @return le compte créé avec son id généré, ou null si la création a échoué
   */
  CompteDto create(CompteDto compteDto);

  /**
   * Met à jour un compte existant
   * @param compteDto : le compte à mettre à jour, doit contenir un id valide
   * @return le compte mis à jour, ou null si aucun compte n'est trouvé avec l'id fourni
   */
  CompteDto update(CompteDto compteDto);

  /**
   * Récupère un compte par son id
   * @param compteId : identifiant du compte à récupérer
   * @return le compte correspondant à l'id fourni, ou null si aucun compte n'est trouvé
   */
  CompteDto getCompte(Long compteId);

  /**
   * Supprime un compte
   * @param compteId l'id du compte à supprimer
   * @return true si la suppression a réussi, false sinon
   */
  boolean delete(Long compteId);

  /**
   * Récupère tous les comptes
   * @return la listes des comptes
   */
  List<CompteDto> getAll();

}
