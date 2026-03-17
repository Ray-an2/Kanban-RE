package com.kanban.profil.service.impl;

import com.kanban.profil.dtos.ProfilDto;
import com.kanban.profil.entity.Profil;
import com.kanban.profil.mappers.ProfilMapper;
import com.kanban.profil.repository.ProfilRepository;
import com.kanban.profil.service.ProfilService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("profilService")
public class ProfilServiceImpl implements ProfilService {
  private final ProfilRepository profilRepository;
  private final ProfilMapper profilMapper;

  public ProfilServiceImpl(ProfilRepository profilRepository, ProfilMapper profilMapper) {
    this.profilRepository = profilRepository;
    this.profilMapper = profilMapper;
  }

  @Override
  public ProfilDto createProfil(ProfilDto profilDto) {
    Profil profil = profilMapper.toEntity(profilDto);
    Profil savedProfil = profilRepository.save(profil);
    return profilMapper.toDto(savedProfil);
  }

  @Override
  @Transactional(readOnly = true)
  public ProfilDto getProfilById(String id) {
    Profil profil = profilRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Profil non trouvé avec l'id: " + id));
    return profilMapper.toDto(profil);
  }

  @Override
  public ProfilDto updateProfil(String id, ProfilDto profilDto) {
    Profil existingProfil = profilRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Profil non trouvé avec l'id: " + id));
    existingProfil.setNom(profilDto.getNom());
    existingProfil.setPrenom(profilDto.getPrenom());
    existingProfil.setMail(profilDto.getMail());
    existingProfil.setEtat(profilDto.getEtat());
    return profilMapper.toDto(profilRepository.save(existingProfil));
  }

  @Override
  public boolean deleteProfil(String id) {
    profilRepository.deleteById(id);
    return true;
  }
}