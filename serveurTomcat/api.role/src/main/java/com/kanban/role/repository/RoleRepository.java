@Repository
public interface RoleRepository extends JpaRepository<Role, RoleId> {

  List<Role> findByIdCptId(String cptId);

  List<Role> findByIdTabId(String tabId);

  boolean existsByIdCptIdAndIdTabId(String cptId, String tabId);
}