package com.kanban.etiquette.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class EtiquetteDto {
    private String id;
    private String nom;
    private String couleur;
}