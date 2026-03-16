package com.kanban.tableau.service;

import com.kanban.tableau.dtos.TableauDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TableauService {

  List<TableauDto> getAllTableaux();

  TableauDto createTab(TableauDto tableauDto);

  boolean deleteTab(Long id);

  Long getNombreTab();

  TableauDto getTabById(Long id);
}
