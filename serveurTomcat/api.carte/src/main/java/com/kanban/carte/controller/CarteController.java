package com.kanban.carte.controller;

import com.kanban.carte.dtos.CarteDto;
import com.kanban.carte.dtos.MoveCarteRequest;
import com.kanban.carte.service.impl.CarteServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carte")
public class CarteController {

  private final CarteServiceImpl carteService;

  public CarteController(CarteServiceImpl carteService) {
    this.carteService = carteService;
  }

  @GetMapping
  public List<CarteDto> getAllCartes() {
    return carteService.getAllCartes();
  }

  @GetMapping("/{carId}")
  public CarteDto getCarte(@PathVariable String carId) {
    return carteService.getCarteById(carId);
  }

  @PostMapping
  public CarteDto createCarte(@RequestBody CarteDto carteDto) {
    return carteService.createCarte(carteDto);
  }

  @PutMapping("/{carId}")
  public CarteDto updateCarte(@PathVariable String carId, @RequestBody CarteDto carteDto) {
    return carteService.updateCarte(carId, carteDto);
  }

  @PatchMapping("/{carId}/archiver")
  public CarteDto archiver(@PathVariable String carId) {
    return carteService.archiver(carId);
  }

  @PatchMapping("/{carId}/terminer")
  public CarteDto terminer(@PathVariable String carId) {
    return carteService.terminer(carId);
  }

  @DeleteMapping("/{carId}")
  public boolean deleteCarte(@PathVariable String carId) {
    return carteService.deleteCarte(carId);
  }

  @PatchMapping("/{carId}/move")
  public CarteDto moveCarte(
          @PathVariable String carId,
          @RequestBody MoveCarteRequest request) {
    return carteService.moveCarte(carId, request.getNewLisId(), request.getNewOrdre());
  }
}
