package com.kanban.liste.service.impl;

import com.kanban.liste.dtos.ListeDto;
import com.kanban.liste.entity.Liste;
import com.kanban.liste.mappers.ListeMapper;
import com.kanban.liste.repository.ListeRepository;
import com.kanban.liste.service.ListeService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ListeServiceImpl implements ListeService {

    private final ListeRepository listeRepository;
    private final ListeMapper listeMapper;

    public ListeServiceImpl(ListeRepository listeRepository, ListeMapper listeMapper) {
        this.listeRepository = listeRepository;
        this.listeMapper = listeMapper;
    }

    @Override
    public ListeDto createListe(ListeDto listeDto) {
        Liste liste = listeMapper.toEntity(listeDto);
        liste.setId(UUID.randomUUID().toString());
        return listeMapper.toDto(listeRepository.save(liste));
    }

    @Override
    public ListeDto getListeById(String id) {
        return listeRepository.findById(id)
                .map(listeMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Liste non trouvée avec l'id: " + id));
    }

    @Override
    public List<ListeDto> getListesByTabId(String tabId) {
        return listeRepository.findByTabIdOrderByOrdre(tabId)
                .stream().map(listeMapper::toDto).toList();
    }

    @Override
    public boolean deleteListe(String id) {
        if (!listeRepository.existsById(id)) {
            throw new EntityNotFoundException("Liste non trouvée avec l'id: " + id);
        }
        listeRepository.deleteById(id);
        return true;
    }
}