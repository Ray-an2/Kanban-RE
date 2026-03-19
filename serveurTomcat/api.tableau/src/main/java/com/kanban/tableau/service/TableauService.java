package com.kanban.tableau.service;

import com.kanban.tableau.dtos.TableauDto;

import java.util.List;

public interface TableauService {

  // --- CRUD de base ---
  TableauDto createTab(TableauDto tableauDto);
  TableauDto getTabById(String id);
  boolean deleteTab(String id);
  List<TableauDto> getAllTab();
  Long getNombreTab();
  TableauDto updateTab(String id, TableauDto tableauDto);

  // --- Filtres ---
  List<TableauDto> getTabByCompteId(String cptId);
  List<TableauDto> searchByNom(String search);
  List<TableauDto> getAllTabTries(String tri);

  // --- État ---
  TableauDto fermerTableau(String id);
  TableauDto ouvrirTableau(String id);
}