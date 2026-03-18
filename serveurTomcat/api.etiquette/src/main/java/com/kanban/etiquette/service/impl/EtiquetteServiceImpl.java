package com.kanban.etiquette.service.impl;

import com.kanban.etiquette.dtos.EtiquetteDto;
import com.kanban.etiquette.entity.Etiquette;
import com.kanban.etiquette.mappers.EtiquetteMapper;
import com.kanban.etiquette.repository.EtiquetteRepository;
import com.kanban.etiquette.service.EtiquetteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EtiquetteServiceImpl implements EtiquetteService {

    private final EtiquetteRepository etiquetteRepository;
    private final EtiquetteMapper etiquetteMapper;

    public EtiquetteServiceImpl(EtiquetteRepository etiquetteRepository, EtiquetteMapper etiquetteMapper) {
        this.etiquetteRepository = etiquetteRepository;
        this.etiquetteMapper = etiquetteMapper;
    }

    @Override
    public EtiquetteDto createEtiquette(EtiquetteDto etiquetteDto) {
        Etiquette etiquette = etiquetteMapper.toEntity(etiquetteDto);
        etiquette.setId(UUID.randomUUID().toString());
        return etiquetteMapper.toDto(etiquetteRepository.save(etiquette));
    }

    @Override
    public EtiquetteDto getEtiquetteById(String id) {
        return etiquetteRepository.findById(id)
                .map(etiquetteMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Etiquette non trouvée avec l'id: " + id));
    }

    @Override
    public List<EtiquetteDto> getAllEtiquettes() {
        return etiquetteRepository.findAll()
                .stream().map(etiquetteMapper::toDto).toList();
    }

    @Override
    public List<EtiquetteDto> getEtiquettesByNom(String nom) {
        return etiquetteRepository.findByNom(nom)
                .stream().map(etiquetteMapper::toDto).toList();
    }

    @Override
    public List<EtiquetteDto> getEtiquettesByCouleur(String couleur) {
        return etiquetteRepository.findByCouleur(couleur)
                .stream().map(etiquetteMapper::toDto).toList();
    }

    @Override
    public EtiquetteDto updateEtiquette(String id, EtiquetteDto etiquetteDto) {
        Etiquette etiquette = etiquetteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Etiquette non trouvée avec l'id: " + id));
        etiquette.setNom(etiquetteDto.getNom());
        etiquette.setCouleur(etiquetteDto.getCouleur());
        return etiquetteMapper.toDto(etiquetteRepository.save(etiquette));
    }

    @Override
    public void deleteEtiquette(String id) {
        if (!etiquetteRepository.existsById(id)) {
            throw new EntityNotFoundException("Etiquette non trouvée avec l'id: " + id);
        }
        etiquetteRepository.deleteById(id);
    }
}