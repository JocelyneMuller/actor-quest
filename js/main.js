//i am going to code a new project here//
// Create a web application using html, css and javascript that lets you search for an actor and display information about that actor or actress, display a list of his or her films, display images of actors/actresses, and keep a history of consultations.
//these are the MAIN FEATURES :
//Search for an actor or actress Display information about this person 
//Display list of films
//Display actors' images
//Save consultation history

import { TOKEN } from "./env";
import { URL } from "./env";

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const actorNameInput = document.getElementById('actor-name');
    const resultsContainer = document.getElementById('results-container');
    const displayContainer = document.getElementById('display-container');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const actorName = actorNameInput.value.trim();
        if (actorName !== '') {
            searchActor(actorName);
        }
    });

    // Fonction pour rechercher un acteur dans l'API TMDb
    function searchActor(name) {
        // Exemple d'URL de requête API (remplacez `YOUR_API_KEY` par votre clé API TMDb)
        const url = `https://api.themoviedb.org/3/search/person?api_key=YOUR_API_KEY&query=${encodeURIComponent(name)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayResults(data.results);
            })
            .catch(error => {
                console.error('Erreur lors de la requête API:', error);
                resultsContainer.innerHTML = '<p>Erreur lors de la recherche. Veuillez réessayer.</p>';
            });
    }

    // Fonction pour afficher les résultats de la recherche
    function displayResults(results) {
        resultsContainer.innerHTML = ''; // Efface les résultats précédents

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
            return;
        }

        results.forEach(actor => {
            const actorItem = document.createElement('div');
            actorItem.classList.add('actor-item');
            actorItem.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w185${actor.profile_path || ''}" alt="${actor.name}" onerror="this.src='default-image.jpg';">
                <h3>${actor.name}</h3>
            `;
            actorItem.addEventListener('click', () => displayActorDetails(actor));
            resultsContainer.appendChild(actorItem);
        });
    }

    function displayActorDetails(actor) {
        displayContainer.innerHTML = `
            <h2>${actor.name}</h2>
            <p>Age: Calculer l'âge ici (exemple)</p>
            <p>Biographie: ${actor.biography || 'Biographie non disponible.'}</p>
            <!-- Autres informations pertinentes -->
        `;
    }
});
