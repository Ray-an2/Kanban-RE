package com.kanban.journal.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class JournalDto {
    @JsonProperty("jou_id")
    private String id;

    @JsonProperty("jou_titre")
    private String titre;

    @JsonProperty("jou_description")
    private String description;

    @JsonProperty("jou_auteur")
    private String auteur;

    @JsonProperty("jou_action")
    private String action;

    @JsonProperty("jou_date")
    private String date;

    @JsonProperty("jou_etat")
    private String etat;

    @JsonProperty("tab_id")
    private String tabId;

    @JsonProperty("car_id")
    private String carId;
}