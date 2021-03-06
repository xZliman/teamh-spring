package be.kdg.teamh.services;

import be.kdg.teamh.dtos.request.HoofdthemaRequest;
import be.kdg.teamh.entities.Gebruiker;
import be.kdg.teamh.entities.Hoofdthema;
import be.kdg.teamh.entities.Organisatie;
import be.kdg.teamh.entities.Subthema;
import be.kdg.teamh.exceptions.gebruiker.GebruikerNietGevonden;
import be.kdg.teamh.exceptions.hoofdthema.HoofdthemaNietGevonden;
import be.kdg.teamh.exceptions.organisatie.OrganisatieNietGevonden;
import be.kdg.teamh.repositories.GebruikerRepository;
import be.kdg.teamh.repositories.HoofdthemaRepository;
import be.kdg.teamh.repositories.OrganisatieRepository;
import be.kdg.teamh.services.contracts.HoofdthemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class HoofdthemaServiceImpl implements HoofdthemaService
{
    private HoofdthemaRepository repository;
    private OrganisatieRepository organisaties;
    private GebruikerRepository gebruikers;

    @Autowired
    public HoofdthemaServiceImpl(HoofdthemaRepository repository, OrganisatieRepository organisaties, GebruikerRepository gebruikers)
    {
        this.repository = repository;
        this.organisaties = organisaties;
        this.gebruikers = gebruikers;
    }

    @Override
    public List<Hoofdthema> all()
    {
        return repository.findAll();
    }

    @Override
    public void create(HoofdthemaRequest dto) throws OrganisatieNietGevonden, GebruikerNietGevonden
    {
        Gebruiker gebruiker = gebruikers.findOne(dto.getGebruiker());

        if (gebruiker == null)
        {
            throw new GebruikerNietGevonden();
        }

        Organisatie organisatie = organisaties.findOne(dto.getOrganisatie());

        if (organisatie == null)
        {
            throw new OrganisatieNietGevonden();
        }

        Hoofdthema hoofdthema = new Hoofdthema();
        hoofdthema.setNaam(dto.getNaam());
        hoofdthema.setBeschrijving(dto.getBeschrijving());
        hoofdthema.setOrganisatie(organisatie);
        hoofdthema.setGebruiker(gebruiker);
        repository.save(hoofdthema);

        organisatie.addHoofdthema(hoofdthema);
        organisaties.saveAndFlush(organisatie);

        gebruiker.addHoofdthema(hoofdthema);
        gebruikers.saveAndFlush(gebruiker);
    }

    @Override
    public Hoofdthema find(int id) throws HoofdthemaNietGevonden
    {
        Hoofdthema hoofdthema = repository.findOne(id);

        if (hoofdthema == null)
        {
            throw new HoofdthemaNietGevonden();
        }

        return hoofdthema;
    }

    @Override
    public void update(int id, HoofdthemaRequest dto) throws HoofdthemaNietGevonden, OrganisatieNietGevonden, GebruikerNietGevonden
    {
        Gebruiker gebruiker = gebruikers.findOne(dto.getGebruiker());

        if (gebruiker == null)
        {
            throw new GebruikerNietGevonden();
        }

        Organisatie organisatie = organisaties.findOne(dto.getOrganisatie());

        if (organisatie == null)
        {
            throw new OrganisatieNietGevonden();
        }

        Hoofdthema hoofdthema = repository.findOne(id);

        if (hoofdthema == null)
        {
            throw new HoofdthemaNietGevonden();
        }

        hoofdthema.setNaam(dto.getNaam());
        hoofdthema.setBeschrijving(dto.getBeschrijving());
        hoofdthema.setOrganisatie(organisatie);
        hoofdthema.setGebruiker(gebruiker);

        repository.saveAndFlush(hoofdthema);
    }

    @Override
    public void delete(int id) throws HoofdthemaNietGevonden
    {
        Hoofdthema hoofdthema = repository.findOne(id);

        if (hoofdthema == null)
        {
            throw new HoofdthemaNietGevonden();
        }

        repository.delete(hoofdthema);
    }

    @Override
    public Organisatie findOrganisatie(int id) throws HoofdthemaNietGevonden
    {

        Hoofdthema hoofdthema = repository.findOne(id);

        if (hoofdthema == null)
        {
            throw new HoofdthemaNietGevonden();
        }

        return hoofdthema.getOrganisatie();
    }

    @Override
    public List<Subthema> findSubthemas(int id) throws HoofdthemaNietGevonden
    {

        Hoofdthema hoofdthema = repository.findOne(id);

        if (hoofdthema == null)
        {
            throw new HoofdthemaNietGevonden();
        }

        return hoofdthema.getSubthemas();
    }
}
