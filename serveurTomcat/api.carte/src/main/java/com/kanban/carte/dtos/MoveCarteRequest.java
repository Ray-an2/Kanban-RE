package com.kanban.carte.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MoveCarteRequest {

  @JsonProperty("newLisId")
  private String newLisId;

  @JsonProperty("newOrdre")
  private Integer newOrdre;
}
