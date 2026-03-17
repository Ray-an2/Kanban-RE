package com.kanban.associer.service.impl;

import com.kanban.associer.dtos.AssocierDto;
import com.kanban.associer.entity.Associer;
import com.kanban.associer.entity.AssocierId;
import com.kanban.associer.repository.AssocierRepository;
import com.kanban.associer.service.AssocierService;
import com.kanban.associer.mappers.AssocierMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;


@Service("AssocierService")
@Transactional
public class AssocierServiceImpl implements AssocierService {

  private final AssocierRepository associerRepository;
  private final AssocierMapper associerMapper;

  public AssocierServiceImpl(AssocierRepository roleRepository, AssocierMapper roleMapper) {
    this.associerRepository = roleRepository;
    this.associerMapper = roleMapper;
  }


  @Override
  public List<AssocierDto> getAllAssocier() {
    /**
     * A finir d'implémenter
     */

    return List.of();
  }

  @Override
  public List<AssocierDto> getAllByCarId(String carId) {
    /**
     * A finir d'implémenter
     */

    return List.of();
  }

  @Override
  public List<AssocierDto> getAllByEtiId(String etiId) {
    /**
     * A finir d'implémenter
     */

    return List.of();
  }

  @Override
  public AssocierDto createAssocier(AssocierDto associerDto) {
    /**
     * A finir d'implémenter
     */

    return null;
  }

  @Override
  public void deleteAssocier(String carId, String etiId) {
    /**
     * A finir d'implémenter
     */

  }
}