//i am going to code a new project here//
// Create a web application using html, css and javascript that lets you search for an actor and display information about that actor or actress, display a list of his or her films, display images of actors/actresses, and keep a history of consultations.
//these are the MAIN FEATURES :
//Search for an actor or actress Display information about this person 
//Display list of films
//Display actors' images
//Save consultation history
// js/main.js
import { TOKEN } from "./env.js";
import { URL } from "./env.js";

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const actorNameInput = document.getElementById('actor-name');
    const resultsContainer = document.getElementById('results-container');
    const defaultImage = 'default-image.jpg'; // Chemin de l'image par défaut

    // Écouteur d'événement pour le formulaire de recherche
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        const actorName = actorNameInput.value.trim(); // Récupère et nettoie l'entrée de l'utilisateur
        if (actorName !== '') {
            searchActor(actorName); // Appelle la fonction pour lancer la recherche
        }
    });

    // Fonction pour rechercher un acteur dans l'API TMDb
    function searchActor(name) {
        // Utilisation de URL et TOKEN pour construire l'URL de l'API
        const url = `${URL}/search/person?api_key=${TOKEN}&query=${encodeURIComponent(name)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayResults(data.results); // Affiche les résultats obtenus
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
                <img src="https://image.tmdb.org/t/p/w185${actor.profile_path || ''}" alt="${actor.name}" onerror="this.src='${defaultImage}';">
                <h3>${actor.name}</h3>
            `;
            resultsContainer.appendChild(actorItem);
        });
    }
});
