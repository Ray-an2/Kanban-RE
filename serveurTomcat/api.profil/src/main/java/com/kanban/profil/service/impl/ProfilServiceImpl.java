package com.kanban.profil.service.impl;

import com.kanban.profil.service.ProfilService;
import com.kanban.profil.dtos.ProfilDto;
import com.kanban.profil.entities.Profil;
import com.kanban.profil.repositories.ProfilRepository;
import org.springframework.stereotype.Service;

@Service("profilService")
@Transactional
public class ProfilService implements ProfilService {
  private final ProfilRepository profilRepository;
  private final ProfilMapper profilMapper;

  public ProfilService(ProfilRepository profilRepository, ProfilMapper profilMapper) {
    this.profilRepository = profilRepository;
    this.profilMapper = profilMapper;
  }

  @inheritedoc
  @Override
  public ProfilDto createProfil(ProfilDto profilDto) {
    Profil profil = profilMapper.toEntity(profilDto);
    Profil savedProfil = profilRepository.save(profil);
    return profilMapper.toDto(savedProfil);
  }

  @inheritedoc
  @Override
  @transactional(readOnly = true)
  public ProfilDto getProfilById(Long id) {
    Profil profil = profilRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Profil non trouvé avec l'id: " + id));
    return profilMapper.toDto(profil);
  }

  @inheritedoc
  @Override
  public ProfilDto updateProfil(Long id, ProfilDto profilDto) {
    Profil existingProfil = profilRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Profil non trouvé avec l'id: " + id));
    existingProfil.setNom(profilDto.getNom());
    existingProfil.setPrenom(profilDto.getPrenom());
    existingProfil.setMail(profilDto.getMail());
    existingProfil.setEtat(profilDto.getEtat());
    Profil updatedProfil = profilRepository.save(existingProfil);
    return profilMapper.toDto(updatedProfil);
    }

  @inheritedoc
  @Override
  public boolean deleteProfil(Long id) {
    profilRepository.delete(existingProfil);
    return true;
  }
}
