package com.kanban.profil.service.impl;

import com.kanban.profil.dtos.ProfilDto;
import com.kanban.profil.entity.Profil;
import com.kanban.profil.mappers.ProfilMapper;
import com.kanban.profil.repository.ProfilRepository;
import com.kanban.profil.service.ProfilService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service("profilService")
@Transactional
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

    // Injecter les valeurs par défaut si absentes
    if (profil.getEtat() == null || profil.getEtat().isBlank()) {
      profil.setEtat("A");
    }
    if (profil.getDateCreation() == null || profil.getDateCreation().isBlank()) {
      profil.setDateCreation(Instant.now().toString());
    }

    return profilMapper.toDto(profilRepository.save(profil));
  }

  @Override
  @Transactional(readOnly = true)
  public ProfilDto getProfilById(String id) {
    Profil profil = profilRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                    "Profil non trouvé avec l'id: " + id));
    return profilMapper.toDto(profil);
  }

  @Override
  public ProfilDto updateProfil(String id, ProfilDto profilDto) {
    Profil existing = profilRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                    "Profil non trouvé avec l'id: " + id));

    if (profilDto.getNom() != null)    existing.setNom(profilDto.getNom());
    if (profilDto.getPrenom() != null) existing.setPrenom(profilDto.getPrenom());
    if (profilDto.getMail() != null)   existing.setMail(profilDto.getMail());
    if (profilDto.getEtat() != null)   existing.setEtat(profilDto.getEtat());

    return profilMapper.toDto(profilRepository.save(existing));
  }

  @Override
  public boolean deleteProfil(String id) {
    if (!profilRepository.existsById(id)) {
      throw new EntityNotFoundException("Profil non trouvé avec l'id: " + id);
    }
    profilRepository.deleteById(id);
    return true;
  }
}