package be.kdg.teamh.services;


import be.kdg.teamh.entities.Comment;
import be.kdg.teamh.entities.Kaart;
import be.kdg.teamh.exceptions.CommentsNotAllowed;
import be.kdg.teamh.exceptions.KaartNotFoundException;

import java.util.List;

public interface KaartenService {

    List<Kaart> all();

    void create(Kaart kaart);

    Kaart find(int id) throws KaartNotFoundException;

    void update(int id, Kaart kaart) throws KaartNotFoundException;

    void delete(int id) throws KaartNotFoundException;

    void createComment(int id, Comment comment) throws CommentsNotAllowed;

    List<Comment> allComments(int id);
}