package com.kanban.membre.service.impl;

import com.kanban.carte.entity.Carte;
import com.kanban.carte.repository.CarteRepository;
import com.kanban.journal.helper.JournalAction;
import com.kanban.journal.helper.JournalHelper;
import com.kanban.liste.entity.Liste;
import com.kanban.liste.repository.ListeRepository;
import com.kanban.membre.dtos.MembreDto;
import com.kanban.membre.entity.Membre;
import com.kanban.membre.entity.MembreId;
import com.kanban.membre.mappers.MembreMapper;
import com.kanban.membre.repository.MembreRepository;
import com.kanban.membre.service.MembreService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service("MembreService")
@Transactional
public class MembreServiceImpl implements MembreService {

    private final MembreRepository membreRepository;
    private final MembreMapper membreMapper;
    private final CarteRepository carteRepository;
    private final ListeRepository listeRepository;
    private final JournalHelper journalHelper;

    public MembreServiceImpl(MembreRepository membreRepository,
                             MembreMapper membreMapper,
                             CarteRepository carteRepository,
                             ListeRepository listeRepository,
                             JournalHelper journalHelper) {
        this.membreRepository = membreRepository;
        this.membreMapper = membreMapper;
        this.carteRepository = carteRepository;
        this.listeRepository = listeRepository;
        this.journalHelper = journalHelper;
    }

    /** Retrouve le tabId d'une carte via sa liste */
    private String getTabId(String lisId) {
        return listeRepository.findById(lisId)
                .map(Liste::getTabId)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MembreDto> getAllMembre() {
        return membreRepository.findAll().stream()
                .map(membreMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MembreDto> getMembreByCarId(String carId) {
        // Retourne liste vide si aucun membre — situation normale
        return membreRepository.findByCarId(carId).stream()
                .map(membreMapper::toDto)
                .toList();
    }

    @Override
    public MembreDto associerMembre(MembreDto membreDto) {
        if (membreRepository.existsByCptIdAndCarId(membreDto.getCptId(), membreDto.getCarId())) {
            throw new IllegalStateException(
                    "Le compte " + membreDto.getCptId() + " est déjà associé à cette carte.");
        }

        Membre membre = membreMapper.toEntity(membreDto);
        if (membre.getDateCreation() == null || membre.getDateCreation().isBlank()) {
            membre.setDateCreation(Instant.now().toString());
        }
        Membre saved = membreRepository.save(membre);

        // Journal
        Carte carte = carteRepository.findById(saved.getCarId()).orElse(null);
        String carteNom = carte != null ? carte.getNom() : saved.getCarId();
        String tabId    = carte != null ? getTabId(carte.getLisId()) : null;

        journalHelper.logCarte(
                "Ajout membre carte",
                String.format("Ajout du membre %s à la carte « %s »",
                        saved.getCptId(), carteNom),
                null,
                JournalAction.ADD_MEMBER,
                tabId,
                saved.getCarId()
        );

        return membreMapper.toDto(saved);
    }

    @Override
    public void deleteMembre(String cptId, String carId) {
        MembreId id = new MembreId(cptId, carId);
        if (!membreRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Association introuvable pour compte=" + cptId + " et la carte=" + carId);
        }
        membreRepository.deleteById(id);

        // Journal
        Carte carte = carteRepository.findById(carId).orElse(null);
        String carteNom = carte != null ? carte.getNom() : carId;
        String tabId    = carte != null ? getTabId(carte.getLisId()) : null;

        journalHelper.logCarte(
                "Retrait membre carte",
                String.format("Retrait du membre %s de la carte « %s »", cptId, carteNom),
                null,
                JournalAction.REMOVE_MEMBER,
                tabId,
                carId
        );
    }
}