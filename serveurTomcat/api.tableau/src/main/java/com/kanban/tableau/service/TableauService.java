package com.kanban.tableau.service;

import com.kanban.tableau.dtos.TableauDto;

import java.util.List;

public interface TableauService {


  /**
   * Création d'un tableau
   * @param tableauDto
   * @return
   */
  TableauDto createTab(TableauDto tableauDto);

  /**
   * Récupération d'un tableau par son id
   * @param id : identifiant du tableau
   * @return
   */
  TableauDto getTabById(String id);

  /**
   * Suppression d'un tableau
   * @param id : identifiant du tableau
   * @return true si le tableau est supprimé, false sinon
   */
  boolean deleteTab(String id);

  /**
   * Récupère tous les tableaux
   * @return Liste<TableauDto> : Liste de tous les tableaux.
   */
  List<TableauDto> getAllTab();

  /**
   * Retourne le nombre de tableau.
   * @return le nombre de tableau.
   */
  Long getNombreTab();

  /**
   * Met à jour un tableau
   * @param id : identifiant du tableau
   * @param tableauDto : nouvelle information du tableau
   * @return
   */
  TableauDto updateTab(String id, TableauDto tableauDto);

  /**
   * Liste les tableaux d'un compte
   * @param cptId : identifiant du compte
   * @return La liste des tableaux du compte
   */
  List<TableauDto> getTabByCompteId(String cptId);

  /**
   * Recherche un tableau par son nom
   * @param search : nom du tableau
   * @return La liste des tableaux qui correspond à la recherche.
   */
  List<TableauDto> searchByNom(String search);

  /**
   * Trie les tableau selon une méthode de tri (pas implémenter)
   * @param tri : mode de trie (alphabetique | date)
   * @return Liste<TableauDto> : Liste de tableau selon le tri
   */
  List<TableauDto> getAllTabTries(String tri);

  /**
   * Ferme un tableau
   * @param id : identifiant du tableau
   * @return
   */
  TableauDto fermerTableau(String id);

  /**
   * Ouvre un tableau.
   * @param id : identifiant du tableau
   * @return
   */
  TableauDto ouvrirTableau(String id);
}