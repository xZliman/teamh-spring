package be.kdg.teamh.repositories;

import be.kdg.teamh.entities.Cirkelsessie;
import be.kdg.teamh.entities.Deelname;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeelnameRepository extends JpaRepository<Deelname, Integer> {
    Deelname findByCirkelsessie(Cirkelsessie id);
    //
}
