package com.kanban.membre.service.impl;

import com.kanban.membre.entity.*;
import com.kanban.membre.dtos.MembreDto;
import com.kanban.membre.mappers.MembreMapper;
import com.kanban.membre.repository.MembreRepository;
import com.kanban.membre.service.MembreService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("MembreService")
@Transactional
public class MembreServiceImpl implements MembreService {

    private final MembreRepository membreRepository;
    private  final MembreMapper membreMapper;

    public MembreServiceImpl(MembreRepository membreRepository, MembreMapper membreMapper){
        this.membreMapper = membreMapper;
        this.membreRepository = membreRepository;
    }

    /**
     * Retourne tous les liaisons présent dans le systemes
     * @return List des membres.
     */
    @Override
    @Transactional(readOnly = true)
    public List<MembreDto> getAllMembre() {
        return membreRepository.findAll().stream()
                .map(membreMapper::toDto)
                .toList();
    }

    /**
     * Retourne tous les membres présent dans une carte donnée.
     * @param carId : identifiant de la carte.
     * @return La liste des membres au sein de la carte
     */
    @Override
    public List<MembreDto> getMembreByCarId(String carId) {
        List<Membre> membres = membreRepository.findByCarId(carId);
        if (membres.isEmpty()) {
            throw new EntityNotFoundException("Aucun membre trouvé pour la carte : " + carId);
        }
        return membres.stream().map(membreMapper::toDto).toList();
    }

    @Override
    public MembreDto associerMembre(MembreDto membreDto) {
        if (membreRepository.existsByCptIdAndCarId(membreDto.getCptId(), membreDto.getCarId())) {
            throw new IllegalStateException(
                    "Le compte " + membreDto.getCptId() + " est déjà associé à cette carte."
            );
        }
        Membre membre = membreMapper.toEntity(membreDto);
        Membre saved = membreRepository.save(membre);
        return membreMapper.toDto(saved);
    }

    @Override
    public void deleteMembre(String cptId, String carId) {
        MembreId id = new MembreId(cptId, carId);
        if (!membreRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Association introuvable pour compte=" + cptId + " et la carte=" + carId
            );
        }
        membreRepository.deleteById(id);
    }
}
