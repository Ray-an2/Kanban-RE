package com.kanban.journal.dtos;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Setter
@Getter
public class JournalDto {
    @NotBlank(message="L'identifiant du journal est obligatoire")
    private String id;
    @NotBlank(message="Le titre du journal est obligatoire")
    private String titre;
    @NotBlank(message="La description du journal est obligatoire")
    private String description;
    @NotBlank(message="L'auteur du journal est obligatoire")
    private String auteur;
    @NotBlank(message="L'action du journal est obligatoire")
    private String action;
    @NotBlank(message="La date du journal est obligatoire")
    private String date;
    @NotBlank(message="L'etat du journal est obligatoire")
    private String etat;
    @NotBlank(message="Le tableau du journal est obligatoire")
    private String tabId;
    @NotBlank(message="La carte du journal est obligatoire")
    private String carId;
}
