package com.kanban.carte.service.impl;

import com.kanban.carte.dtos.DragDropDto;
import com.kanban.carte.entity.Carte;
import com.kanban.carte.repository.CarteRepository;
import com.kanban.carte.service.DragDropService;
import com.kanban.liste.dtos.ListeDto;
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

    public DragDropServiceImpl(CarteRepository carteRepository,
                               ListeRepository listeRepository,
                               ListeMapper listeMapper) {
        this.carteRepository = carteRepository;
        this.listeRepository = listeRepository;
        this.listeMapper = listeMapper;
    }

    /**
     * Déplace une carte et renuméroter les cartes des listes affectées.
     *
     * Algorithme :
     *  1. Retirer la carte de la liste source (renuméroter les cartes restantes).
     *  2. Insérer la carte dans la liste cible à la position newOrdre
     *     (décaler les cartes à partir de cette position de +1).
     *  3. Si source == cible, c'est un simple réordonnancement dans la même liste.
     *  4. Retourner les listes mises à jour.
     */
    @Override
    public List<ListeDto> deplacerCarte(String carId, DragDropDto dto) {

        // --- Validation ---
        Carte carte = carteRepository.findById(carId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Carte non trouvée avec l'id: " + carId));

        if (!listeRepository.existsById(dto.getSourceLisId())) {
            throw new EntityNotFoundException(
                    "Liste source non trouvée : " + dto.getSourceLisId());
        }
        if (!listeRepository.existsById(dto.getTargetLisId())) {
            throw new EntityNotFoundException(
                    "Liste cible non trouvée : " + dto.getTargetLisId());
        }

        boolean memeList = dto.getSourceLisId().equals(dto.getTargetLisId());

        if (memeList) {
            reordonnerDansMemeList(carte, dto.getNewOrdre());
        } else {
            deplacerVersAutreListe(carte, dto.getSourceLisId(), dto.getTargetLisId(), dto.getNewOrdre());
        }

        // --- Retourner les listes affectées mises à jour ---
        List<ListeDto> result = new ArrayList<>();
        result.add(listeMapper.toDto(
                listeRepository.findById(dto.getSourceLisId())
                        .orElseThrow()));

        if (!memeList) {
            result.add(listeMapper.toDto(
                    listeRepository.findById(dto.getTargetLisId())
                            .orElseThrow()));
        }

        return result;
    }

    // -------------------------------------------------------------------------
    // Réorganisation dans la même liste
    // -------------------------------------------------------------------------

    /**
     * Déplace une carte à une nouvelle position dans sa propre liste.
     *
     * Exemple — liste avec cartes [A(0), B(1), C(2), D(3)], on déplace B à l'ordre 3 :
     *  → Retirer B : [A(0), C(1), D(2)]
     *  → Insérer B en position 3 : [A(0), C(1), D(2), B(3)]
     */
    private void reordonnerDansMemeList(Carte carte, int newOrdre) {
        String lisId = carte.getLisId();
        int oldOrdre = Integer.parseInt(carte.getOrdre());

        if (oldOrdre == newOrdre) return; // rien à faire

        List<Carte> cartes = carteRepository.findByLisIdOrderByOrdre(lisId);

        // Retirer la carte de la liste en mémoire
        cartes.remove(carte);

        // Clamp newOrdre pour éviter les débordements
        int clamped = Math.min(newOrdre, cartes.size());

        // Insérer à la bonne position
        cartes.add(clamped, carte);

        // Renuméroter et sauvegarder
        for (int i = 0; i < cartes.size(); i++) {
            Carte c = cartes.get(i);
            c.setOrdre(String.valueOf(i));
            carteRepository.save(c);
        }
    }

    // -------------------------------------------------------------------------
    // Déplacement vers une autre liste
    // -------------------------------------------------------------------------

    /**
     * Retire la carte de la liste source, la place dans la liste cible
     * à la position newOrdre, et renuméroter les deux listes.
     */
    private void deplacerVersAutreListe(Carte carte,
                                        String sourceLisId,
                                        String targetLisId,
                                        int newOrdre) {

        // --- Retirer de la liste source et renuméroter ---
        List<Carte> cartesSource = carteRepository.findByLisIdOrderByOrdre(sourceLisId);
        cartesSource.remove(carte);
        for (int i = 0; i < cartesSource.size(); i++) {
            Carte c = cartesSource.get(i);
            c.setOrdre(String.valueOf(i));
            carteRepository.save(c);
        }

        // --- Insérer dans la liste cible à la bonne position ---
        List<Carte> cartesCible = carteRepository.findByLisIdOrderByOrdre(targetLisId);

        // Clamp
        int clamped = Math.min(newOrdre, cartesCible.size());

        // Décaler les cartes à partir de la position d'insertion
        for (int i = clamped; i < cartesCible.size(); i++) {
            Carte c = cartesCible.get(i);
            c.setOrdre(String.valueOf(i + 1));
            carteRepository.save(c);
        }

        // Mettre à jour la carte déplacée
        carte.setLisId(targetLisId);
        carte.setOrdre(String.valueOf(clamped));
        carteRepository.save(carte);
    }
}