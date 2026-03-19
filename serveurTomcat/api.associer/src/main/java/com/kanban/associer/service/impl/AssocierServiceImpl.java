package com.kanban.associer.service.impl;

import com.kanban.associer.dtos.AssocierDto;
import com.kanban.associer.entity.Associer;
import com.kanban.associer.entity.AssocierId;
import com.kanban.associer.mappers.AssocierMapper;
import com.kanban.associer.repository.AssocierRepository;
import com.kanban.associer.service.AssocierService;
import com.kanban.carte.entity.Carte;
import com.kanban.carte.repository.CarteRepository;
import com.kanban.etiquette.entity.Etiquette;
import com.kanban.etiquette.repository.EtiquetteRepository;
import com.kanban.journal.helper.JournalAction;
import com.kanban.journal.helper.JournalHelper;
import com.kanban.liste.entity.Liste;
import com.kanban.liste.repository.ListeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("AssocierService")
@Transactional
public class AssocierServiceImpl implements AssocierService {

  private final AssocierRepository associerRepository;
  private final AssocierMapper associerMapper;
  private final CarteRepository carteRepository;
  private final EtiquetteRepository etiquetteRepository;
  private final ListeRepository listeRepository;
  private final JournalHelper journalHelper;

  public AssocierServiceImpl(AssocierRepository associerRepository,
                             AssocierMapper associerMapper,
                             CarteRepository carteRepository,
                             EtiquetteRepository etiquetteRepository,
                             ListeRepository listeRepository,
                             JournalHelper journalHelper) {
    this.associerRepository = associerRepository;
    this.associerMapper = associerMapper;
    this.carteRepository = carteRepository;
    this.etiquetteRepository = etiquetteRepository;
    this.listeRepository = listeRepository;
    this.journalHelper = journalHelper;
  }

  private String getTabId(String lisId) {
    return listeRepository.findById(lisId)
            .map(Liste::getTabId)
            .orElse(null);
  }

  @Override
  @Transactional(readOnly = true)
  public List<AssocierDto> getAllAssocier() {
    return associerRepository.findAll().stream()
            .map(associerMapper::toDto).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<AssocierDto> getAssocierByCarId(String carId) {
    return associerRepository.findByCarId(carId).stream()
            .map(associerMapper::toDto).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<AssocierDto> getAssocierByEtiId(String etiId) {
    return associerRepository.findByEtiId(etiId).stream()
            .map(associerMapper::toDto).toList();
  }

  @Override
  public AssocierDto createAssocier(AssocierDto associerDto) {
    if (associerRepository.existsByCarIdAndEtiId(associerDto.getCarId(), associerDto.getEtiId())) {
      throw new IllegalStateException(
              "La carte " + associerDto.getCarId() + " a déjà cette étiquette.");
    }
    Associer associer = associerMapper.toEntity(associerDto);
    Associer saved = associerRepository.save(associer);

    // Journal
    Carte carte = carteRepository.findById(saved.getCarId()).orElse(null);
    Etiquette etiquette = etiquetteRepository.findById(saved.getEtiId()).orElse(null);
    String carteNom     = carte != null ? carte.getNom() : saved.getCarId();
    String etiNom       = etiquette != null ? etiquette.getNom() : saved.getEtiId();
    String tabId        = carte != null ? getTabId(carte.getLisId()) : null;

    journalHelper.logCarte(
            "Ajout étiquette",
            String.format("Ajout de l'étiquette « %s » à la carte « %s »", etiNom, carteNom),
            null,
            JournalAction.ADD_LABEL,
            tabId,
            saved.getCarId()
    );

    return associerMapper.toDto(saved);
  }

  @Override
  public boolean deleteAssocier(String carId, String etiId) {
    AssocierId id = new AssocierId(carId, etiId);
    if (!associerRepository.existsById(id)) {
      throw new EntityNotFoundException(
              "Association introuvable pour la carte : " + carId + " et l'étiquette : " + etiId);
    }

    // Récupérer les infos avant suppression pour le journal
    Carte carte         = carteRepository.findById(carId).orElse(null);
    Etiquette etiquette = etiquetteRepository.findById(etiId).orElse(null);
    String carteNom     = carte != null ? carte.getNom() : carId;
    String etiNom       = etiquette != null ? etiquette.getNom() : etiId;
    String tabId        = carte != null ? getTabId(carte.getLisId()) : null;

    associerRepository.deleteById(id);

    journalHelper.logCarte(
            "Retrait étiquette",
            String.format("Retrait de l'étiquette « %s » de la carte « %s »", etiNom, carteNom),
            null,
            JournalAction.REMOVE_LABEL,
            tabId,
            carId
    );

    return true;
  }
}