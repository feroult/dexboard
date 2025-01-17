package br.com.dextra.dexboard.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import br.com.dextra.dexboard.domain.ListaProjeto;
import br.com.dextra.dexboard.domain.Projeto;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Text;

import edu.emory.mathcs.backport.java.util.Collections;
import flexjson.JSONDeserializer;
import flexjson.JSONSerializer;

public class ProjetoRepository {

	public static Projeto buscarPorId(int id, List<Projeto> projetos) {
		
		for (Projeto projeto : projetos) {
			if (projeto.getIdPma() == id)
				return projeto;
		}

		return null;
	}

	public static List<Projeto> buscaProjetos() {
		DatastoreService service = DatastoreServiceFactory.getDatastoreService();
		Key key = KeyFactory.createKey("projectData", "data");
		Entity entity;
		ListaProjeto projetos = null;
		try {
			entity = service.get(key);
			Text text = (Text) entity.getProperty("json");

			if (text != null) {
				JSONDeserializer<ListaProjeto> des = new JSONDeserializer<ListaProjeto>();
				projetos = des.deserialize(text.getValue(), ListaProjeto.class);
			}
		} catch (EntityNotFoundException e) {
			return new ArrayList<Projeto>();
		}

		return projetos.getValue();
	}

	public static void persisteProjetos(List<Projeto> projetos) {

		Collections.sort(projetos, new ProjetoComparator());
		ListaProjeto lista = new ListaProjeto(projetos);
		
		
		JSONSerializer serializer = new JSONSerializer();
		serializer.exclude("*.class");
		String data = serializer.deepSerialize(lista);

		DatastoreService service = DatastoreServiceFactory
				.getDatastoreService();
		Entity entity = new Entity("projectData", "data");
		entity.setProperty("json", new Text(data));
		entity.setProperty("lastModified", new Date().getTime());

		service.put(entity);
	}
}
