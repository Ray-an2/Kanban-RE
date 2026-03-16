package com.kanban.tableau.service.Impl;

import com.kanban.tableau.dtos.TableauDto;
import com.kanban.tableau.mappers.TableauMapper;
import com.kanban.tableau.repository.TableauRepository;
import com.kanban.tableau.service.TableauService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import org.springframework.stereotype.Service;

@Service("TabService")
public class TableauServiceImpl extends TableauService {
  private final TableauRepository tableauRepository;
  private final TableauMapper tableauMapper;

  public TableauServiceImpl(TableauRepository tableauRepository, TableauMapper tableauMapper){
    this.tableauRepository = tableauRepository;
    this.tableauMapper = tableauMapper;
  }

  /**
   * Crée un nouveau tableau
   * @param tableauDto : corps de la requetes.
   * @return TableauDto
   */
  public TableauDto createTab(TableauDto tableauDto){
    var tableau = tableauMapper.toEntity(tableauDto);
    var savedTab = tableauRepository.save(tableau);
    return tableauMapper.toDto(savedTab);
  }

  /**
   * Récupère un tableau par son id
   * @param id : id du tableau
   * @return TableauDto
   */
  public TableauDto getTabById(Long id){
    var tableau = tableauRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Tableau non trouvé avec l'id: " + id));
    return tableauMapper.toDto(tableau);
  }

  /**
   * Supprime un tableau
   * @param id : id du tableau
   * @return true si le tableau a été supprimé, false sinon.
   */
  public boolean deleteTab(Long id) {
    tableauRepository.deleteById(id);
    return true;
  }

  /**
   * Récupère tous les tableaux du systemes
   * @return List<TableauDto>
   */
  public List<TableauDto> getAllTab(){
    return tableauRepository.findAll().stream().map(tableauMapper::toDto).toList();
  }

  /**
   * Retourne le nombre de tableaux dans le systeme
   * @return le nombre de tableaux
   */
  public Long getNombreTab(){
    return tableauRepository.count();
  }
}
