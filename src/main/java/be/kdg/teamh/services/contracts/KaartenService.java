package be.kdg.teamh.services.contracts;

import be.kdg.teamh.entities.Commentaar;
import be.kdg.teamh.entities.Kaart;
import be.kdg.teamh.entities.Spelkaart;
import be.kdg.teamh.entities.Subthema;
import be.kdg.teamh.exceptions.CommentsNotAllowed;
import be.kdg.teamh.exceptions.notfound.GebruikerNotFound;
import be.kdg.teamh.exceptions.notfound.KaartNotFound;

import java.util.List;

public interface KaartenService {
    List<Kaart> all();

    void create(int userId, Kaart kaart) throws GebruikerNotFound;

    Kaart find(int id) throws KaartNotFound;

    void update(int id, Kaart kaart) throws KaartNotFound;

    void delete(int id) throws KaartNotFound;

    Subthema getSubthema(int id) throws KaartNotFound;

    void addSubthema(int id, Subthema subthema) throws KaartNotFound;

    List<Commentaar> allComments(int id) throws KaartNotFound;

    void createComment(int id,int userId, Commentaar commentaar) throws KaartNotFound, CommentsNotAllowed, GebruikerNotFound;

    List<Spelkaart> getSpelkaarten(int id) throws KaartNotFound;

    void addSpelkaart(int id, Spelkaart spelkaart) throws KaartNotFound;
}
