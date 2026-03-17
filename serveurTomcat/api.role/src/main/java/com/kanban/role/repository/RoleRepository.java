package com.kanban.role.repository;

import com.kanban.role.entity.Role;
import com.kanban.role.entity.RoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, RoleId> {

  List<Role> findByCptId(String cptId);

  List<Role> findByTabId(String tabId);

  boolean existsByCptIdAndTabId(String cptId, String tabId);
}
