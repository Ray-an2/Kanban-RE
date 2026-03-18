package com.kanban.tableau.service.Impl;

import com.kanban.tableau.dtos.TableauDto;
import com.kanban.tableau.mappers.TableauMapper;
import com.kanban.tableau.repository.TableauRepository;
import com.kanban.tableau.service.TableauService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service("TabService")
public class TableauServiceImpl implements TableauService {

  private final TableauRepository tableauRepository;
  private final TableauMapper tableauMapper;

  public TableauServiceImpl(TableauRepository tableauRepository, TableauMapper tableauMapper) {
    this.tableauRepository = tableauRepository;
    this.tableauMapper = tableauMapper;
  }

  public TableauDto createTab(TableauDto tableauDto) {
    var tableau = tableauMapper.toEntity(tableauDto);
    tableau.setId(UUID.randomUUID().toString());
    return tableauMapper.toDto(tableauRepository.save(tableau));
  }

  public TableauDto getTabById(String id) {
    return tableauRepository.findById(id)
            .map(tableauMapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException("Tableau non trouvé avec l'id: " + id));
  }

  public boolean deleteTab(String id) {
    tableauRepository.deleteById(id);
    return true;
  }

  public List<TableauDto> getAllTab() {
    return tableauRepository.findAll().stream().map(tableauMapper::toDto).toList();
  }

  public Long getNombreTab() {
    return tableauRepository.count();
  }

  // ← NOUVEAU : tableaux d'un utilisateur
  public List<TableauDto> getTabByCompteId(String cptId) {
    return tableauRepository.findByCompteId(cptId)
            .stream().map(tableauMapper::toDto).toList();
  }

  // ← NOUVEAU : modifier un tableau
  public TableauDto updateTab(String id, TableauDto tableauDto) {
    var tableau = tableauRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Tableau non trouvé avec l'id: " + id));
    tableau.setNom(tableauDto.getNom());
    tableau.setDescription(tableauDto.getDescription());
    tableau.setEtat(tableauDto.getEtat());
    return tableauMapper.toDto(tableauRepository.save(tableau));
  }
}