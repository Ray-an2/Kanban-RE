package com.kanban.tableau.controller;

import com.kanban.tableau.dtos.TableauDto;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.kanban.tableau.service.Impl.TableauServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/tableau")
public class TableauController {
  private final TableauServiceImpl tableauService;

  public TableauController(TableauServiceImpl tableauService){
    this.tableauService = tableauService;
  }

  /**
   * Récupère tous les tableaux du systemes
   */
  GetMapping
  List<TableauDto> getTableaux(){
    return tableauService.getAllTab();
  }

  /**
   * Retourne le nombre de tableaux dans le systeme
   * @return
   */
  GetMapping("/nombre")
  public Long getNombreTableaux(){
    return tableauService.getNombreTab();
  }

  /**
   * Récupère un tableau par son id
   * @param id : id du tableau
   * @return TableauDto
   */
  @GetMapping("/{id}")
  public TableauDto getTableau(@PathVariable Long id){
    return tableauService.getTabById(id);
  }

  /**
   * Crée un nouveau tableau
   * @param tableauDto : corps de la requetes.
   * @return TableauDto
   */
  @PostMapping
  public TableauDto createTab(final @RequestBody TableauDto tableauDto){
    return tableauService.createTab(tableauDto);
  }

  /**
   * Supprime un tableau
   * @param id : id du tableau
   * @return true si le tableau a été supprimé, false sinon.
   */
  @DeleteMapping("/{id}")
  public boolean deleteTab(@PathVariable Long id){
    return tableauService.deleteTab(id);
  }
}
