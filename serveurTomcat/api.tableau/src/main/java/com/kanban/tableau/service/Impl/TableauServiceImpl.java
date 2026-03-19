package com.kanban.tableau.service.Impl;

import com.kanban.carte.entity.Carte;
import com.kanban.carte.repository.CarteRepository;
import com.kanban.journal.helper.JournalAction;
import com.kanban.journal.helper.JournalHelper;
import com.kanban.liste.entity.Liste;
import com.kanban.liste.repository.ListeRepository;
import com.kanban.tableau.dtos.TableauDto;
import com.kanban.tableau.mappers.TableauMapper;
import com.kanban.tableau.repository.TableauRepository;
import com.kanban.tableau.service.TableauService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service("TabService")
@Transactional
public class TableauServiceImpl implements TableauService {

  private final TableauRepository tableauRepository;
  private final TableauMapper tableauMapper;
  private final ListeRepository listeRepository;
  private final CarteRepository carteRepository;
  private final JournalHelper journalHelper;

  public TableauServiceImpl(TableauRepository tableauRepository,
                            TableauMapper tableauMapper,
                            ListeRepository listeRepository,
                            CarteRepository carteRepository,
                            JournalHelper journalHelper) {
    this.tableauRepository = tableauRepository;
    this.tableauMapper = tableauMapper;
    this.listeRepository = listeRepository;
    this.carteRepository = carteRepository;
    this.journalHelper = journalHelper;
  }

  // -------------------------------------------------------------------------
  // CRUD de base
  // -------------------------------------------------------------------------

  @Override
  public TableauDto createTab(TableauDto tableauDto) {
    var tableau = tableauMapper.toEntity(tableauDto);
    tableau.setId(UUID.randomUUID().toString());
    tableau.setDate(Instant.now().toString());
    if (tableau.getEtat() == null) tableau.setEtat("O");
    var saved = tableauRepository.save(tableau);

    journalHelper.logTableau(
            "Création tableau",
            String.format("Création du tableau « %s »", saved.getNom()),
            tableauDto.getAuteur(),
            JournalAction.CREATE_BOARD,
            saved.getId()
    );
    return tableauMapper.toDto(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public TableauDto getTabById(String id) {
    return tableauRepository.findById(id)
            .map(tableauMapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException("Tableau non trouvé avec l'id: " + id));
  }

  @Override
  public boolean deleteTab(String id) {
    var tableau = tableauRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Tableau non trouvé avec l'id: " + id));
    String nom = tableau.getNom();
    tableauRepository.deleteById(id);

    journalHelper.logTableau(
            "Suppression tableau",
            String.format("Suppression du tableau « %s »", nom),
            null,
            JournalAction.DELETE_BOARD,
            id
    );
    return true;
  }

  @Override
  @Transactional(readOnly = true)
  public List<TableauDto> getAllTab() {
    return tableauRepository.findAll().stream().map(tableauMapper::toDto).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public Long getNombreTab() {
    return tableauRepository.count();
  }

  @Override
  public TableauDto updateTab(String id, TableauDto tableauDto) {
    var tableau = tableauRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Tableau non trouvé avec l'id: " + id));
    if (tableauDto.getNom() != null && !tableauDto.getNom().isBlank())
      tableau.setNom(tableauDto.getNom());
    if (tableauDto.getDescription() != null)
      tableau.setDescription(tableauDto.getDescription());
    if (tableauDto.getImage() != null)
      tableau.setImage(tableauDto.getImage());
    var saved = tableauRepository.save(tableau);

    journalHelper.logTableau(
            "Modification tableau",
            String.format("Modification du tableau « %s »", saved.getNom()),
            tableauDto.getAuteur(),
            JournalAction.UPDATE_BOARD,
            id
    );
    return tableauMapper.toDto(saved);
  }

  // -------------------------------------------------------------------------
  // Filtres
  // -------------------------------------------------------------------------

  @Override
  @Transactional(readOnly = true)
  public List<TableauDto> getTabByCompteId(String cptId) {
    return tableauRepository.findByCompteId(cptId).stream().map(tableauMapper::toDto).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<TableauDto> searchByNom(String search) {
    if (search == null || search.isBlank()) return getAllTab();
    return tableauRepository.findByNomContaining(search).stream().map(tableauMapper::toDto).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<TableauDto> getAllTabTries(String tri) {
    return switch (tri.toLowerCase()) {
      case "rec" -> tableauRepository.findAllByOrderByDateDesc().stream().map(tableauMapper::toDto).toList();
      case "alp" -> tableauRepository.findAllByOrderByNomAsc().stream().map(tableauMapper::toDto).toList();
      default -> throw new IllegalArgumentException("Paramètre de tri invalide : utiliser 'rec' ou 'alp'");
    };
  }

  // -------------------------------------------------------------------------
  // État ouvert / fermé
  // -------------------------------------------------------------------------

  @Override
  public TableauDto fermerTableau(String id) {
    var tableau = tableauRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Tableau non trouvé avec l'id: " + id));
    tableau.setEtat("F");
    tableauRepository.save(tableau);

    for (Liste liste : listeRepository.findByTabId(id)) {
      liste.setEtat("A");
      listeRepository.save(liste);
      for (Carte carte : carteRepository.findByLisId(liste.getId())) {
        carte.setArchiver("O");
        carteRepository.save(carte);
      }
    }

    journalHelper.logTableau(
            "Fermeture tableau",
            String.format("Fermeture du tableau « %s »", tableau.getNom()),
            null,
            JournalAction.CLOSE_BOARD,
            id
    );
    return tableauMapper.toDto(tableau);
  }

  @Override
  public TableauDto ouvrirTableau(String id) {
    var tableau = tableauRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Tableau non trouvé avec l'id: " + id));
    tableau.setEtat("O");
    tableauRepository.save(tableau);

    for (Liste liste : listeRepository.findByTabId(id)) {
      liste.setEtat("P");
      listeRepository.save(liste);
      for (Carte carte : carteRepository.findByLisId(liste.getId())) {
        carte.setArchiver("N");
        carteRepository.save(carte);
      }
    }

    journalHelper.logTableau(
            "Ouverture tableau",
            String.format("Ouverture du tableau « %s »", tableau.getNom()),
            null,
            JournalAction.OPEN_BOARD,
            id
    );
    return tableauMapper.toDto(tableau);
  }
}