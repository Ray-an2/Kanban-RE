package com.kanban.tableau.service;

import com.kanban.tableau.dtos.TableauDto;
import java.util.List;

public interface TableauService {

  List<TableauDto> getAllTab();

  TableauDto createTab(TableauDto tableauDto);

  boolean deleteTab(String id);

  Long getNombreTab();

  TableauDto getTabById(String id);
}