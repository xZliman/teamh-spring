package be.kdg.teamh;

import be.kdg.teamh.entities.Gebruiker;
import be.kdg.teamh.entities.Organisatie;
import com.google.gson.Gson;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.util.NestedServletException;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebAppConfiguration
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(Application.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class OrganisatieTest {
    private MockMvc mvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private Gson gson;

    @Mock
    private Gebruiker gebruiker;

    @Before
    public void setUp() throws Exception {
        this.mvc = MockMvcBuilders.webAppContextSetup(this.context).build();
    }

    @Test
    public void indexOrganisatie() throws Exception {
        this.mvc.perform(get("/api/organisaties").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void createOrganisatie() throws Exception {
        String json = gson.toJson(new Organisatie("NaamOrganisatie", "Beschrijving", gebruiker));

        this.mvc.perform(post("/api/organisaties").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated());

        this.mvc.perform(get("/api/organisaties").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].naam", is("NaamOrganisatie")))
                .andExpect(jsonPath("$[0].beschrijving", is("Beschrijving")));
    }

    @Test(expected = NestedServletException.class)
    public void createOrganisatie_nullInput() throws Exception {
        String json = gson.toJson(new Organisatie(null, null, gebruiker));

        this.mvc.perform(post("/api/organisaties").contentType(MediaType.APPLICATION_JSON).content(json));
    }

    @Test
    public void showOrganisatie() throws Exception {
        String json = gson.toJson(new Organisatie("NaamOrganisatie", "Beschrijving", gebruiker));

        this.mvc.perform(post("/api/organisaties").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated());

        this.mvc.perform(get("/api/organisaties/1").contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.naam", is("NaamOrganisatie")))
                .andExpect(jsonPath("$.beschrijving", is("Beschrijving")));
    }

    @Test
    public void updateOrganisatie() throws Exception {
        String json = gson.toJson(new Organisatie("NaamOrganisatie", "Beschrijving", gebruiker));

        this.mvc.perform(post("/api/organisaties").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated());

        json = gson.toJson(new Organisatie("NieuweNaamOrganisatie", "Beschrijving", gebruiker));

        this.mvc.perform(put("/api/organisaties/1").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isOk());

        this.mvc.perform(get("/api/organisaties/1").contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.naam", is("NieuweNaamOrganisatie")))
                .andExpect(jsonPath("$.beschrijving", is("Beschrijving")));
    }

    @Test(expected = NestedServletException.class)
    public void updateOrganisatie_nullInput() throws Exception {
        String json = gson.toJson(new Organisatie("NieuweNaamOrganisatie", "KdG", gebruiker));

        this.mvc.perform(post("/api/organisaties").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated());

        json = gson.toJson(new Organisatie(null, null, gebruiker));

        this.mvc.perform(put("/api/organisaties/1")
                .contentType(MediaType.APPLICATION_JSON).content(json));
    }

    @Test(expected = NestedServletException.class)
    public void updateOrganisatie_nonExistingOrganisatie() throws Exception {
        String json = gson.toJson(new Organisatie("Organisatie", "KdG", gebruiker));

        this.mvc.perform(post("/api/organisaties").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated());

        json = gson.toJson(new Organisatie("NieuweNaamOrganisatie", "Beschrijving", gebruiker));

        this.mvc.perform(put("/api/organisaties/2")
                .contentType(MediaType.APPLICATION_JSON).content(json));
    }

    @Test
    public void deleteOrganisatie() throws Exception {
        String json = gson.toJson(new Organisatie("teVerwijderenOrganisatie", "Beschrijving", gebruiker));

        this.mvc.perform(post("/api/organisaties").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated());

        this.mvc.perform(get("/api/organisaties/1"))
                .andExpect(status().isOk());

        this.mvc.perform(delete("/api/organisaties/1"))
                .andExpect(status().isOk());

        this.mvc.perform(get("/api/organisaties").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test(expected = NestedServletException.class)
    public void deleteOrganisatie_nonExistingOrganisatie() throws Exception {
        String json = gson.toJson(new Organisatie("KdG Organisatie", "KdG", gebruiker));

        this.mvc.perform(post("/api/organisaties").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated());

        this.mvc.perform(delete("/api/organisaties/2"));
    }
}
