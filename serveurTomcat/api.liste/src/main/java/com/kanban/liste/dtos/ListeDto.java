package com.kanban.liste.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kanban.carte.dtos.CarteDto;
import lombok.Getter;
<parameter name="file_text">import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ListeDto {

    @JsonProperty("lis_id")
    private String id;

    @JsonProperty("lis_titre")
    private String titre;

    @JsonProperty("lis_ordre")
    private Integer ordre;

    @JsonProperty("lis_etat")
    private String etat;

    @JsonProperty("tab_id")
    private String tabId;

    @JsonProperty("cartes")
    private List<CarteDto> cartes;

    @JsonProperty("auteur")
    private String auteur;
}