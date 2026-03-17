package com.kanban.compte.controller;

import com.kanban.compte.dtos.CompteDto;
import com.kanban.compte.service.CompteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/compte")
public class CompteController {

  private final CompteService compteService;

  public CompteController(CompteService compteService) {
    this.compteService = compteService;
  }

  @GetMapping
  public List<CompteDto> getComptes() {
    return compteService.getAll();
  }

  @GetMapping("/{id}")
  public CompteDto getCompteById(@PathVariable String id) {
    return compteService.getCompte(id);
  }

  @PostMapping
  public CompteDto createCompte(@RequestBody CompteDto compteDto) {
    return compteService.create(compteDto);
  }

  @PutMapping("/{id}/pseudo")
  public CompteDto updatePseudo(@PathVariable String id, @RequestBody CompteDto compteDto) {
    return compteService.update(id, compteDto);
  }

  @PutMapping("/{id}/role")
  public CompteDto updateRole(@PathVariable String id, @RequestBody CompteDto compteDto) {
    return compteService.update(id, compteDto);
  }

  @DeleteMapping("/{id}")
  public boolean deleteCompte(@PathVariable String id) {
    return compteService.delete(id);
  }
}