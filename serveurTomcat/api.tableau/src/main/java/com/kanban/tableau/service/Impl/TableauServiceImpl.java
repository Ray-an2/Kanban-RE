package com.kanban.tableau.service.Impl;

import com.kanban.carte.entity.Carte;
import com.kanban.carte.repository.CarteRepository;
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

  public TableauServiceImpl(TableauRepository tableauRepository,
                            TableauMapper tableauMapper,
                            ListeRepository listeRepository,
                            CarteRepository carteRepository) {
    this.tableauRepository = tableauRepository;
    this.tableauMapper = tableauMapper;
    this.listeRepository = listeRepository;
    this.carteRepository = carteRepository;
  }

  // -------------------------------------------------------------------------
  // CRUD de base
  // -------------------------------------------------------------------------

  @Override
  public TableauDto createTab(TableauDto tableauDto) {
    var tableau = tableauMapper.toEntity(tableauDto);
    tableau.setId(UUID.randomUUID().toString());
    tableau.setDate(Instant.now().toString());
    if (tableau.getEtat() == null) {
      tableau.setEtat("O");
    }
    return tableauMapper.toDto(tableauRepository.save(tableau));
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
    if (!tableauRepository.existsById(id)) {
      throw new EntityNotFoundException("Tableau non trouvé avec l'id: " + id);
    }
    tableauRepository.deleteById(id);
    return true;
  }

  @Override
  @Transactional(readOnly = true)
  public List<TableauDto> getAllTab() {
    return tableauRepository.findAll()
            .stream()
            .map(tableauMapper::toDto)
            .toList();
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
    if (tableauDto.getNom() != null && !tableauDto.getNom().isBlank()) {
      tableau.setNom(tableauDto.getNom());
    }
    if (tableauDto.getDescription() != null) {
      tableau.setDescription(tableauDto.getDescription());
    }
    if (tableauDto.getImage() != null) {
      tableau.setImage(tableauDto.getImage());
    }
    return tableauMapper.toDto(tableauRepository.save(tableau));
  }

  // -------------------------------------------------------------------------
  // Filtres
  // -------------------------------------------------------------------------

  @Override
  @Transactional(readOnly = true)
  public List<TableauDto> getTabByCompteId(String cptId) {
    return tableauRepository.findByCompteId(cptId)
            .stream()
            .map(tableauMapper::toDto)
            .toList();
  }

  /**
   * Recherche les tableaux dont le nom contient la chaîne donnée.
   */
  @Override
  @Transactional(readOnly = true)
  public List<TableauDto> searchByNom(String search) {
    if (search == null || search.isBlank()) {
      return getAllTab();
    }
    return tableauRepository.findByNomContaining(search)
            .stream()
            .map(tableauMapper::toDto)
            .toList();
  }

  /**
   * Retourne tous les tableaux triés.
   * @param tri "rec" pour plus récent, "alp" pour alphabétique
   */
  @Override
  @Transactional(readOnly = true)
  public List<TableauDto> getAllTabTries(String tri) {
    return switch (tri.toLowerCase()) {
      case "rec" -> tableauRepository.findAllByOrderByDateDesc()
              .stream().map(tableauMapper::toDto).toList();
      case "alp" -> tableauRepository.findAllByOrderByNomAsc()
              .stream().map(tableauMapper::toDto).toList();
      default -> throw new IllegalArgumentException(
              "Paramètre de tri invalide : utiliser 'rec' ou 'alp'");
    };
  }

  // -------------------------------------------------------------------------
  // État ouvert / fermé
  // -------------------------------------------------------------------------

  /**
   * Ferme un tableau : passe son état à 'F', archive toutes ses listes
   * et toutes les cartes associées.
   */
  @Override
  public TableauDto fermerTableau(String id) {
    var tableau = tableauRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Tableau non trouvé avec l'id: " + id));

    tableau.setEtat("F");
    tableauRepository.save(tableau);

    // Archiver toutes les listes du tableau
    List<Liste> listes = listeRepository.findByTabId(id);
    for (Liste liste : listes) {
      liste.setEtat("A");
      listeRepository.save(liste);

      // Archiver toutes les cartes de chaque liste
      List<Carte> cartes = carteRepository.findByLisId(liste.getId());
      for (Carte carte : cartes) {
        carte.setArchiver("O");
        carteRepository.save(carte);
      }
    }

    return tableauMapper.toDto(tableau);
  }

  /**
   * Ouvre un tableau : passe son état à 'O', restaure toutes ses listes
   * et toutes les cartes associées.
   */
  @Override
  public TableauDto ouvrirTableau(String id) {
    var tableau = tableauRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Tableau non trouvé avec l'id: " + id));

    tableau.setEtat("O");
    tableauRepository.save(tableau);

    // Restaurer toutes les listes du tableau
    List<Liste> listes = listeRepository.findByTabId(id);
    for (Liste liste : listes) {
      liste.setEtat("P");
      listeRepository.save(liste);

      // Restaurer toutes les cartes de chaque liste
      List<Carte> cartes = carteRepository.findByLisId(liste.getId());
      for (Carte carte : cartes) {
        carte.setArchiver("N");
        carteRepository.save(carte);
      }
    }

    return tableauMapper.toDto(tableau);
  }
}