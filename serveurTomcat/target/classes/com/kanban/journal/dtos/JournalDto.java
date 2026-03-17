package com.kanban.journal.dtos;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class JournalDto {

    private String id;
    private String titre;
    private String description;
    private String auteur;
    private String action;
    private String date;
    private String etat;
    private String tabId;
    private String carId;
}
