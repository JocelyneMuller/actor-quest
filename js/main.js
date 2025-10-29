//i am going to code a new project here//
// Create a web application using html, css and javascript that lets you search for an actor and display information about that actor or actress, display a list of his or her films, display images of actors/actresses, and keep a history of consultations.
//these are the MAIN FEATURES :
//Search for an actor or actress Display information about this person
//Display list of films
//Display actors' images
//Save consultation history
import { TOKEN } from "./env.js";
import { URL } from "./env.js";

const defaultImage = '../assets/images/default-image.jpg';

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const actorNameInput = document.getElementById('actor-name');
    const resultsContainer = document.getElementById('results-container');
    const detailsContainer = document.getElementById('details-container');
    const actorInfoContainer = document.getElementById('actor-info');
    const filmographyList = document.getElementById('filmography-list');
    const historyList = document.getElementById('history-list');

    // Charger l'historique au démarrage
    loadHistory();

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const actorName = actorNameInput.value.trim();
        if (actorName) {
            searchActor(actorName);
        } else {
            resultsContainer.innerHTML = '<p>Please enter a name.</p>';
        }
    });

    function searchActor(name) {
        const url = `${URL}/search/person?api_key=${TOKEN}&query=${encodeURIComponent(name)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    displayResults(data.results);
                } else {
                    resultsContainer.innerHTML = '<p>No actors found.</p>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultsContainer.innerHTML = '<p>Error fetching data.</p>';
            });
    }

    function displayResults(results) {
        resultsContainer.innerHTML = '';
        results.forEach(actor => {
            const actorItem = document.createElement('div');
            actorItem.classList.add('actor-item');
            actorItem.innerHTML = `
                <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : defaultImage}" alt="${actor.name}">
                <p>${actor.name}</p>
            `;
            actorItem.addEventListener('click', () => {
                displayActorDetails(actor.id);
                highlightSelectedActor(actorItem);
            });
            resultsContainer.appendChild(actorItem);
        });
    }

    function displayActorDetails(actorId) {
        const actorUrl = `${URL}/person/${actorId}?api_key=${TOKEN}&language=en-US`;
        const creditsUrl = `${URL}/person/${actorId}/movie_credits?api_key=${TOKEN}&language=en-US`;

        fetch(actorUrl)
            .then(response => response.json())
            .then(actor => {
                actorInfoContainer.innerHTML = `
                    <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : defaultImage}" alt="${actor.name}">
                    <h2>${actor.name}</h2>
                    <p>${actor.biography || 'Biography not available.'}</p>
                `;

                // Mettre à jour l'historique avec l'acteur consulté
                updateHistory(actor.name, actor.id, actor.profile_path);
            })
            .catch(error => console.error('Error fetching actor details:', error));

        fetch(creditsUrl)
            .then(response => response.json())
            .then(credits => {
                displayFilmography(credits.cast);
            })
            .catch(error => console.error('Error fetching filmography:', error));
    }

    function displayFilmography(movies) {
        filmographyList.innerHTML = '';
        movies.slice(0, 10).forEach(movie => {
            const listItem = document.createElement('li');
            listItem.textContent = `${movie.title || 'Unknown title'} (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})`;
            filmographyList.appendChild(listItem);
        });
    }

    function highlightSelectedActor(selectedItem) {
        document.querySelectorAll('.actor-item').forEach(item => item.classList.remove('selected'));
        selectedItem.classList.add('selected');
    }

    // === FONCTIONS HISTORIQUE ===

    function updateHistory(actorName, actorId, profilePath) {
        // Récupérer l'historique actuel depuis sessionStorage
        let history = JSON.parse(sessionStorage.getItem('actorHistory')) || [];

        // Créer l'objet acteur
        const actorData = {
            name: actorName,
            id: actorId,
            profile_path: profilePath
        };

        // Vérifier si l'acteur existe déjà (par ID)
        const existingIndex = history.findIndex(actor => actor.id === actorId);

        if (existingIndex !== -1) {
            // Si l'acteur existe déjà, le retirer de sa position actuelle
            history.splice(existingIndex, 1);
        }

        // Ajouter l'acteur au début de l'historique
        history.unshift(actorData);

        // Limiter l'historique à 3 acteurs
        if (history.length > 3) {
            history = history.slice(0, 3);
        }

        // Sauvegarder l'historique mis à jour dans le sessionStorage
        sessionStorage.setItem('actorHistory', JSON.stringify(history));

        // Mettre à jour l'affichage de l'historique
        displayHistory(history);
    }

    function loadHistory() {
        // Charger l'historique depuis le sessionStorage
        const history = JSON.parse(sessionStorage.getItem('actorHistory')) || [];
        displayHistory(history);
    }

    function displayHistory(history) {
        // Effacer l'historique actuel affiché
        historyList.innerHTML = '';

        if (history.length === 0) {
            historyList.innerHTML = '<li style="color: #999;">Aucun historique</li>';
            return;
        }

        // Afficher chaque acteur dans la liste avec photo
        history.forEach(actor => {
            const listItem = document.createElement('li');
            listItem.classList.add('history-item');
            listItem.innerHTML = `
                <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w45${actor.profile_path}` : defaultImage}" alt="${actor.name}">
                <span>${actor.name}</span>
            `;

            // Rendre l'historique cliquable pour recharger l'acteur
            listItem.style.cursor = 'pointer';
            listItem.addEventListener('click', () => {
                displayActorDetails(actor.id);
            });

            historyList.appendChild(listItem);
        });
    }
});
