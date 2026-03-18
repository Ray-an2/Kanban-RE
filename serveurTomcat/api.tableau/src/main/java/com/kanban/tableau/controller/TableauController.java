package com.kanban.tableau.controller;

import com.kanban.tableau.dtos.TableauDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.kanban.tableau.service.Impl.TableauServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/tableau")
public class TableauController {
  private final TableauServiceImpl tableauService;

  public TableauController(TableauServiceImpl tableauService) {
    this.tableauService = tableauService;
  }

  @GetMapping
  public List<TableauDto> getTableaux() {
    return tableauService.getAllTab();
  }

  @GetMapping("/nombre")
  public Long getNombreTableaux() {
    return tableauService.getNombreTab();
  }

  @GetMapping("/{id}")
  public TableauDto getTableau(@PathVariable String id) {
    return tableauService.getTabById(id);
  }

  // ← NOUVEAU : tableaux d'un utilisateur
  @GetMapping("/compte/{cptId}")
  public List<TableauDto> getTableauxByCompte(@PathVariable String cptId) {
    return tableauService.getTabByCompteId(cptId);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public TableauDto createTab(@RequestBody TableauDto tableauDto) {
    return tableauService.createTab(tableauDto);
  }

  // ← NOUVEAU : modifier un tableau
  @PutMapping("/{id}")
  public TableauDto updateTab(@PathVariable String id, @RequestBody TableauDto tableauDto) {
    return tableauService.updateTab(id, tableauDto);
  }

  @DeleteMapping("/{id}")
  public boolean deleteTab(@PathVariable String id) {
    return tableauService.deleteTab(id);
  }
}