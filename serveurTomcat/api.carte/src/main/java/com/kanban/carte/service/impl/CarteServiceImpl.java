package com.kanban.carte.service.impl;

import com.kanban.carte.dtos.CarteDto;
import com.kanban.carte.entity.Carte;
import com.kanban.carte.mappers.CarteMapper;
import com.kanban.carte.repository.CarteRepository;
import com.kanban.carte.service.CarteService;
import com.kanban.journal.helper.JournalAction;
import com.kanban.journal.helper.JournalHelper;
import com.kanban.liste.entity.Liste;
import com.kanban.liste.repository.ListeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service("carteService")
@Transactional
public class CarteServiceImpl implements CarteService {

  private final CarteRepository carteRepository;
  private final CarteMapper carteMapper;
  private final ListeRepository listeRepository;
  private final JournalHelper journalHelper;

  public CarteServiceImpl(CarteRepository carteRepository,
                          CarteMapper carteMapper,
                          ListeRepository listeRepository,
                          JournalHelper journalHelper) {
    this.carteRepository = carteRepository;
    this.carteMapper = carteMapper;
    this.listeRepository = listeRepository;
    this.journalHelper = journalHelper;
  }

  // -------------------------------------------------------------------------
  // Helpers privés
  // -------------------------------------------------------------------------

  /** Retrouve le tabId d'une carte via sa liste */
  private String getTabId(String lisId) {
    return listeRepository.findById(lisId)
            .map(Liste::getTabId)
            .orElse(null);
  }

  // -------------------------------------------------------------------------
  // CRUD
  // -------------------------------------------------------------------------

  @Override
  @Transactional(readOnly = true)
  public List<CarteDto> getAllCartes() {
    return carteRepository.findAll().stream().map(carteMapper::toDto).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public CarteDto getCarteById(String id) {
    return carteRepository.findById(id)
            .map(carteMapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException("La carte avec l'id " + id + " n'existe pas"));
  }

  @Override
  public CarteDto createCarte(CarteDto carteDto) {
    Carte carte = carteMapper.toEntity(carteDto);
    carte.setId(UUID.randomUUID().toString());
    carte.setDateCreation(Instant.now().toString());
    if (carte.getArchiver() == null) carte.setArchiver("N");
    if (carte.getTerminer() == null) carte.setTerminer("N");
    if (carte.getOrdre() == null)    carte.setOrdre("0");
    if (carte.getPriorite() == null) carte.setPriorite(0);
    var saved = carteRepository.save(carte);

    journalHelper.logCarte(
            "Création carte",
            String.format("Création de la carte « %s »", saved.getNom()),
            carteDto.getAuteur(),
            JournalAction.CREATE_CARD,
            getTabId(saved.getLisId()),
            saved.getId()
    );
    return carteMapper.toDto(saved);
  }

  @Override
  public CarteDto updateCarte(String id, CarteDto carteDto) {
    Carte carte = carteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("La carte avec l'id " + id + " n'existe pas"));
    carte.setNom(carteDto.getNom());
    carte.setDescription(carteDto.getDescription());
    carte.setArchiver(carteDto.getArchiver());
    carte.setTerminer(carteDto.getTerminer());
    carte.setOrdre(carteDto.getOrdre());
    carte.setPriorite(carteDto.getPriorite());
    carte.setDateDebut(carteDto.getDateDebut());
    carte.setDateFin(carteDto.getDateFin());
    carte.setCouverture(carteDto.getCouverture());
    carte.setLisId(carteDto.getLisId());
    var saved = carteRepository.save(carte);

    journalHelper.logCarte(
            "Modification carte",
            String.format("Modification de la carte « %s »", saved.getNom()),
            carteDto.getAuteur(),
            JournalAction.UPDATE_CARD,
            getTabId(saved.getLisId()),
            id
    );
    return carteMapper.toDto(saved);
  }

  @Override
  public boolean deleteCarte(String id) {
    Carte carte = carteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("La carte avec l'id " + id + " n'existe pas"));
    String nom   = carte.getNom();
    String tabId = getTabId(carte.getLisId());
    carteRepository.deleteById(id);

    journalHelper.logCarte(
            "Suppression carte",
            String.format("Suppression de la carte « %s »", nom),
            null,
            JournalAction.DELETE_CARD,
            tabId,
            id
    );
    return true;
  }

  // -------------------------------------------------------------------------
  // Déplacement
  // -------------------------------------------------------------------------

  @Override
  public CarteDto moveCarteToList(String carId, String newLisId) {
    Carte carte = carteRepository.findById(carId)
            .orElseThrow(() -> new EntityNotFoundException("La carte avec l'id " + carId + " n'existe pas"));
    String ancienLisId = carte.getLisId();
    carte.setLisId(newLisId);
    var saved = carteRepository.save(carte);

    journalHelper.logCarte(
            "Déplacement carte",
            String.format("Déplacement de la carte « %s » vers une autre liste", saved.getNom()),
            null,
            JournalAction.MOVE_CARD,
            getTabId(newLisId),
            carId
    );
    return carteMapper.toDto(saved);
  }

  @Override
  public CarteDto moveCarteOrdre(String carId, String newLisId, Integer newOrdre) {
    Carte carte = carteRepository.findById(carId)
            .orElseThrow(() -> new EntityNotFoundException("La carte avec l'id " + carId + " n'existe pas"));
    carte.setLisId(newLisId);
    carte.setOrdre(String.valueOf(newOrdre));
    return carteMapper.toDto(carteRepository.save(carte));
    // Note : le journal détaillé est géré par DragDropServiceImpl
  }

  // -------------------------------------------------------------------------
  // Statuts
  // -------------------------------------------------------------------------

  @Override
  public CarteDto terminer(String carId) {
    Carte carte = carteRepository.findById(carId)
            .orElseThrow(() -> new EntityNotFoundException("La carte avec l'id " + carId + " n'existe pas"));
    boolean estTerminee = "T".equals(carte.getTerminer());
    carte.setTerminer(estTerminee ? "N" : "T");
    var saved = carteRepository.save(carte);

    journalHelper.logCarte(
            estTerminee ? "Carte non terminée" : "Carte terminée",
            String.format("La carte « %s » est marquée comme %s",
                    saved.getNom(), estTerminee ? "non terminée" : "terminée"),
            null,
            JournalAction.COMPLETE_CARD,
            getTabId(saved.getLisId()),
            carId
    );
    return carteMapper.toDto(saved);
  }

  @Override
  public CarteDto archiver(String carId) {
    Carte carte = carteRepository.findById(carId)
            .orElseThrow(() -> new EntityNotFoundException("La carte avec l'id " + carId + " n'existe pas"));
    boolean estArchivee = "O".equals(carte.getArchiver());
    carte.setArchiver(estArchivee ? "N" : "O");
    var saved = carteRepository.save(carte);

    journalHelper.logCarte(
            estArchivee ? "Désarchivage carte" : "Archivage carte",
            String.format("La carte « %s » est %s",
                    saved.getNom(), estArchivee ? "désarchivée" : "archivée"),
            null,
            JournalAction.ARCHIVE_CARD,
            getTabId(saved.getLisId()),
            carId
    );
    return carteMapper.toDto(saved);
  }

  // -------------------------------------------------------------------------
  // Cartes archivées, comptage, retard
  // -------------------------------------------------------------------------

  @Override
  @Transactional(readOnly = true)
  public List<CarteDto> getCartesArchivees(String tabId) {
    return carteRepository.findArchiveesByTabId(tabId).stream().map(carteMapper::toDto).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public Long countByLisId(String lisId) {
    return carteRepository.countByLisId(lisId);
  }

  @Override
  @Transactional(readOnly = true)
  public Boolean isEnRetard(String carId) {
    String now = Instant.now().toString();
    Boolean result = carteRepository.isEnRetard(carId, now);
    return result != null && result;
  }
}