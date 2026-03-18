package com.kanban.tableau.service;

import com.kanban.tableau.dtos.TableauDto;

import java.util.List;

public interface TableauService {
  TableauDto createTab(TableauDto tableauDto);
  TableauDto getTabById(String id);
  boolean deleteTab(String id);
  List<TableauDto> getAllTab();
  Long getNombreTab();
  List<TableauDto> getTabByCompteId(String cptId);  // ← NOUVEAU
  TableauDto updateTab(String id, TableauDto tableauDto);  // ← NOUVEAU
}