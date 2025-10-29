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
        movies.slice(0, 5).forEach(movie => {
            const listItem = document.createElement('li');
            listItem.textContent = `${movie.title || 'Unknown title'}`;
            filmographyList.appendChild(listItem);
        });
    }

    function highlightSelectedActor(selectedItem) {
        document.querySelectorAll('.actor-item').forEach(item => item.classList.remove('selected'));
        selectedItem.classList.add('selected');
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('history-container');
    const historyList = document.getElementById('history-list');

    // Charger l'historique à partir du sessionStorage
    loadHistory();

    function updateHistory(actorName) {
        // Récupérer l'historique actuel
        let history = JSON.parse(sessionStorage.getItem('actorHistory')) || [];

        // Ajouter le nouvel acteur au début (si ce n'est pas un doublon)
        if (!history.includes(actorName)) {
            history.unshift(actorName);
        }

        // Limiter l'historique à 3 acteurs
        if (history.length > 3) {
            history.pop();
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

        // Afficher chaque acteur dans la liste
        history.forEach(actor => {
            const listItem = document.createElement('li');
            listItem.textContent = actor;
            historyList.appendChild(listItem);
        });
    }

    // Appeler `updateHistory` après avoir affiché les détails de l'acteur
    function displayActorDetails(actorId) {
        const actorUrl = `${URL}/person/${actorId}?api_key=${TOKEN}&language=en-US`;

        fetch(actorUrl)
            .then(response => response.json())
            .then(actor => {
                // Afficher les détails de l'acteur
                detailsContainer.innerHTML = `
                    <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : defaultImage}" alt="${actor.name}">
                    <h2>${actor.name}</h2>
                    <p>${actor.biography || 'Biography not available.'}</p>
                `;

                // Mettre à jour l'historique avec le nom de l'acteur
                updateHistory(actor.name);
            })
            .catch(error => console.error('Error fetching actor details:', error));
    }
});
