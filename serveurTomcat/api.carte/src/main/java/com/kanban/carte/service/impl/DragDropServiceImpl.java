package com.kanban.carte.service.impl;

import com.kanban.carte.dtos.DragDropDto;
import com.kanban.carte.entity.Carte;
import com.kanban.carte.repository.CarteRepository;
import com.kanban.carte.service.DragDropService;
import com.kanban.journal.helper.JournalAction;
import com.kanban.journal.helper.JournalHelper;
import com.kanban.liste.dtos.ListeDto;
import com.kanban.liste.entity.Liste;
import com.kanban.liste.mappers.ListeMapper;
import com.kanban.liste.repository.ListeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class DragDropServiceImpl implements DragDropService {

    private final CarteRepository carteRepository;
    private final ListeRepository listeRepository;
    private final ListeMapper listeMapper;
    private final JournalHelper journalHelper;

    public DragDropServiceImpl(CarteRepository carteRepository,
                               ListeRepository listeRepository,
                               ListeMapper listeMapper,
                               JournalHelper journalHelper) {
        this.carteRepository = carteRepository;
        this.listeRepository = listeRepository;
        this.listeMapper = listeMapper;
        this.journalHelper = journalHelper;
    }

    @Override
    public List<ListeDto> deplacerCarte(String carId, DragDropDto dto) {

        Carte carte = carteRepository.findById(carId)
                .orElseThrow(() -> new EntityNotFoundException("Carte non trouvée avec l'id: " + carId));

        Liste source = listeRepository.findById(dto.getSourceLisId())
                .orElseThrow(() -> new EntityNotFoundException("Liste source non trouvée : " + dto.getSourceLisId()));
        Liste cible = listeRepository.findById(dto.getTargetLisId())
                .orElseThrow(() -> new EntityNotFoundException("Liste cible non trouvée : " + dto.getTargetLisId()));

        boolean memeList = dto.getSourceLisId().equals(dto.getTargetLisId());

        if (memeList) {
            reordonnerDansMemeList(carte, dto.getNewOrdre());
        } else {
            deplacerVersAutreListe(carte, dto.getSourceLisId(), dto.getTargetLisId(), dto.getNewOrdre());
        }

        // Journal
        String description = memeList
                ? String.format("Réorganisation de la carte « %s » dans la liste « %s »",
                carte.getNom(), source.getTitre())
                : String.format("Déplacement de la carte « %s » de « %s » vers « %s »",
                carte.getNom(), source.getTitre(), cible.getTitre());

        journalHelper.logCarte(
                "Déplacement carte",
                description,
                null,
                JournalAction.MOVE_CARD,
                source.getTabId(),
                carId
        );

        // Retourner les listes affectées mises à jour
        List<ListeDto> result = new ArrayList<>();
        result.add(listeMapper.toDto(listeRepository.findById(dto.getSourceLisId()).orElseThrow()));
        if (!memeList) {
            result.add(listeMapper.toDto(listeRepository.findById(dto.getTargetLisId()).orElseThrow()));
        }
        return result;
    }

    // -------------------------------------------------------------------------
    // Réorganisation dans la même liste
    // -------------------------------------------------------------------------

    private void reordonnerDansMemeList(Carte carte, int newOrdre) {
        String lisId = carte.getLisId();
        int oldOrdre = Integer.parseInt(carte.getOrdre());
        if (oldOrdre == newOrdre) return;

        List<Carte> cartes = carteRepository.findByLisIdOrderByOrdre(lisId);
        cartes.remove(carte);
        int clamped = Math.min(newOrdre, cartes.size());
        cartes.add(clamped, carte);

        for (int i = 0; i < cartes.size(); i++) {
            cartes.get(i).setOrdre(String.valueOf(i));
            carteRepository.save(cartes.get(i));
        }
    }

    // -------------------------------------------------------------------------
    // Déplacement vers une autre liste
    // -------------------------------------------------------------------------

    private void deplacerVersAutreListe(Carte carte, String sourceLisId, String targetLisId, int newOrdre) {
        // Retirer de la source et renuméroter
        List<Carte> cartesSource = carteRepository.findByLisIdOrderByOrdre(sourceLisId);
        cartesSource.remove(carte);
        for (int i = 0; i < cartesSource.size(); i++) {
            cartesSource.get(i).setOrdre(String.valueOf(i));
            carteRepository.save(cartesSource.get(i));
        }

        // Insérer dans la cible
        List<Carte> cartesCible = carteRepository.findByLisIdOrderByOrdre(targetLisId);
        int clamped = Math.min(newOrdre, cartesCible.size());
        for (int i = clamped; i < cartesCible.size(); i++) {
            cartesCible.get(i).setOrdre(String.valueOf(i + 1));
            carteRepository.save(cartesCible.get(i));
        }

        carte.setLisId(targetLisId);
        carte.setOrdre(String.valueOf(clamped));
        carteRepository.save(carte);
    }
}