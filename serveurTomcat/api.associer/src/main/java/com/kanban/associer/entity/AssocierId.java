package com.kanban.associer.entity;

import java.io.Serializable;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class AssocierId implements Serializable {

  private String carId;
  private String etiId;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof AssocierId)) return false;
    AssocierId that = (AssocierId) o;
    return Objects.equals(carId, that.carId) && Objects.equals(etiId, that.etiId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(carId, etiId);
  }
}