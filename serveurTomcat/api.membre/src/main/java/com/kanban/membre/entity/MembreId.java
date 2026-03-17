package com.kanban.membre.entity;


import java.io.Serializable;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class MembreId implements Serializable {
    private String cptId;
    private String carId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MembreId)) return false;
        MembreId that = (MembreId) o;
        return Objects.equals(cptId, that.cptId) && Objects.equals(carId, that.carId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cptId, carId);
    }
}
