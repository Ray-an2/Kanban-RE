package com.kanban.liste.service.impl;

import com.kanban.carte.entity.Carte;
import com.kanban.carte.repository.CarteRepository;
import com.kanban.journal.helper.JournalAction;
import com.kanban.journal.helper.JournalHelper;
import com.kanban.liste.dtos.ListeDto;
import com.kanban.liste.dtos.OrdreCarteDto;
import com.kanban.liste.dtos.OrdreListeDto;
import com.kanban.liste.entity.Liste;
import com.kanban.liste.mappers.ListeMapper;
import com.kanban.liste.repository.ListeRepository;
import com.kanban.liste.service.ListeService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ListeServiceImpl implements ListeService {

    private final ListeRepository listeRepository;
    private final ListeMapper listeMapper;
    private final CarteRepository carteRepository;
    private final JournalHelper journalHelper;

    public ListeServiceImpl(ListeRepository listeRepository,
                            ListeMapper listeMapper,
                            CarteRepository carteRepository,
                            JournalHelper journalHelper) {
        this.listeRepository = listeRepository;
        this.listeMapper = listeMapper;
        this.carteRepository = carteRepository;
        this.journalHelper = journalHelper;
    }

    // -------------------------------------------------------------------------
    // CRUD
    // -------------------------------------------------------------------------

    @Override
    public ListeDto createListe(ListeDto listeDto) {
        Liste liste = listeMapper.toEntity(listeDto);
        liste.setId(UUID.randomUUID().toString());
        if (liste.getEtat() == null) liste.setEtat("P");
        var saved = listeRepository.save(liste);

        journalHelper.logTableau(
                "Création liste",
                String.format("Création de la liste « %s »", saved.getTitre()),
                listeDto.getAuteur(),
                JournalAction.CREATE_LIST,
                saved.getTabId()
        );
        return listeMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ListeDto getListeById(String id) {
        return listeRepository.findById(id)
                .map(listeMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Liste non trouvée avec l'id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListeDto> getListesByTabId(String tabId) {
        return listeRepository.findByTabIdOrderByOrdre(tabId).stream()
                .filter(l -> "P".equals(l.getEtat()))
                .map(listeMapper::toDto).toList();
    }

    @Override
    public ListeDto updateListe(String id, ListeDto listeDto) {
        Liste liste = listeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Liste non trouvée avec l'id: " + id));
        if (listeDto.getTitre() != null && !listeDto.getTitre().isBlank())
            liste.setTitre(listeDto.getTitre());
        var saved = listeRepository.save(liste);

        journalHelper.logTableau(
                "Modification liste",
                String.format("Modification de la liste « %s »", saved.getTitre()),
                listeDto.getAuteur(),
                JournalAction.UPDATE_LIST,
                saved.getTabId()
        );
        return listeMapper.toDto(saved);
    }

    @Override
    public boolean deleteListe(String id) {
        Liste liste = listeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Liste non trouvée avec l'id: " + id));
        String titre = liste.getTitre();
        String tabId = liste.getTabId();
        listeRepository.deleteById(id);

        journalHelper.logTableau(
                "Suppression liste",
                String.format("Suppression de la liste « %s »", titre),
                null,
                JournalAction.DELETE_LIST,
                tabId
        );
        return true;
    }

    // -------------------------------------------------------------------------
    // Archivage
    // -------------------------------------------------------------------------

    @Override
    public ListeDto archiverListe(String id) {
        Liste liste = listeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Liste non trouvée avec l'id: " + id));
        liste.setEtat("A");
        listeRepository.save(liste);

        for (Carte carte : carteRepository.findByLisId(id)) {
            if (!"O".equals(carte.getArchiver())) {
                carte.setArchiver("O");
                carteRepository.save(carte);
            }
        }

        journalHelper.logTableau(
                "Archivage liste",
                String.format("Archivage de la liste « %s »", liste.getTitre()),
                null,
                JournalAction.ARCHIVE_LIST,
                liste.getTabId()
        );
        return listeMapper.toDto(liste);
    }

    @Override
    public ListeDto desarchiverListe(String id) {
        Liste liste = listeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Liste non trouvée avec l'id: " + id));
        liste.setEtat("P");
        listeRepository.save(liste);

        for (Carte carte : carteRepository.findByLisId(id)) {
            if ("O".equals(carte.getArchiver())) {
                carte.setArchiver("N");
                carteRepository.save(carte);
            }
        }

        journalHelper.logTableau(
                "Désarchivage liste",
                String.format("Désarchivage de la liste « %s »", liste.getTitre()),
                null,
                JournalAction.UNARCHIVE_LIST,
                liste.getTabId()
        );
        return listeMapper.toDto(liste);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListeDto> getListesArchivees(String tabId) {
        return listeRepository.findByTabIdAndEtat(tabId, "A").stream()
                .map(listeMapper::toDto).toList();
    }

    // -------------------------------------------------------------------------
    // Réorganisation
    // -------------------------------------------------------------------------

    @Override
    public void updateOrdreListes(String tabId, List<OrdreListeDto> ordres) {
        for (OrdreListeDto ordreDto : ordres) {
            Liste liste = listeRepository.findById(ordreDto.getLisId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Liste non trouvée avec l'id: " + ordreDto.getLisId()));
            if (!liste.getTabId().equals(tabId))
                throw new IllegalArgumentException(
                        "La liste " + ordreDto.getLisId() + " n'appartient pas au tableau " + tabId);
            liste.setOrdre(ordreDto.getOrdre());
            listeRepository.save(liste);
        }

        journalHelper.logTableau(
                "Réorganisation listes",
                "Réorganisation de l'ordre des listes",
                null,
                JournalAction.REORDER_LIST,
                tabId
        );
    }

    @Override
    public void updateOrdreCartes(String lisId, List<OrdreCarteDto> ordres) {
        if (!listeRepository.existsById(lisId))
            throw new EntityNotFoundException("Liste non trouvée avec l'id: " + lisId);

        for (OrdreCarteDto ordreDto : ordres) {
            Carte carte = carteRepository.findById(ordreDto.getCarId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Carte non trouvée avec l'id: " + ordreDto.getCarId()));
            carte.setLisId(lisId);
            carte.setOrdre(String.valueOf(ordreDto.getOrdre()));
            carteRepository.save(carte);
        }
    }
}