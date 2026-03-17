package com.kanban.membre.repository;

import com.kanban.membre.entity.Membre;
import com.kanban.role.entity.Role;
import com.kanban.role.entity.RoleId;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembreRepository extends JpaRepository<Role, RoleId>  {

    List<Membre> findByCarId(String carId);

    boolean existsByCptIdAndCarId(String cptId, String carId);
}
