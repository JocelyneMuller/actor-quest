//i am going to code a new project here//
// Create a web application using html, css and javascript that lets you search for an actor and display information about that actor or actress, display a list of his or her films, display images of actors/actresses, and keep a history of consultations.
//these are the MAIN FEATURES :
//Search for an actor or actress Display information about this person 
//Display list of films
//Display actors' images
//Save consultation history
import { TOKEN } from "./env.js";
import { URL } from "./env.js";

const defaultImage = '../assets/images/default-image.jpg'; // Image par défaut

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const actorNameInput = document.getElementById('actor-name');
    const resultsContainer = document.getElementById('results-container');
    const detailsContainer = document.getElementById('details-container');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const actorName = actorNameInput.value.trim();
        if (actorName !== '') {
            searchActor(actorName);
        } else {
            resultsContainer.innerHTML = '<p>Veuillez entrer un nom d\'acteur.</p>';
        }
    });

    function searchActor(name) {
        const url = `${URL}/search/person?api_key=${TOKEN}&query=${encodeURIComponent(name)}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.results) {
                    displayResults(data.results);
                } else {
                    resultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
                }
            })
            .catch(error => {
                console.error('Erreur lors de la requête API:', error);
                resultsContainer.innerHTML = '<p>Erreur lors de la recherche. Veuillez réessayer.</p>';
            });
    }

    function displayResults(results) {
        resultsContainer.innerHTML = '';
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
            return;
        }

        results.forEach(actor => {
            const actorItem = document.createElement('div');
            actorItem.classList.add('actor-item');
            const actorImage = actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : defaultImage;
            actorItem.innerHTML = `
                <img src="${actorImage}" alt="${actor.name}" onerror="this.src='${defaultImage}';">
                <h3>${actor.name}</h3>
            `;
            actorItem.addEventListener('click', () => {
                displayActorDetails(actor.id);
                highlightSelectedActor(actorItem);
            });
            resultsContainer.appendChild(actorItem);
        });
    }

    function displayActorDetails(actorId) {
        const url = `${URL}/person/${actorId}?api_key=${TOKEN}&language=fr-FR`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data) {
                    throw new Error('Les détails de l\'acteur sont introuvables.');
                }
                detailsContainer.innerHTML = `
                    <h2>${data.name}</h2>
                    <img src="${data.profile_path ? `https://image.tmdb.org/t/p/w185${data.profile_path}` : defaultImage}" alt="${data.name}">
                    <p><strong>Âge :</strong> ${calculateAge(data.birthday, data.deathday)}</p>
                    <p><strong>Biographie :</strong> ${data.biography || 'Biographie non disponible.'}</p>
                `;
            })
            .catch(error => {
                console.error('Erreur lors de la requête API:', error);
                detailsContainer.innerHTML = '<p>Erreur lors de l\'affichage des détails. Veuillez réessayer.</p>';
            });
    }

    function calculateAge(birthday, deathday) {
        if (!birthday) return 'Non disponible';
        const birthDate = new Date(birthday);
        const endDate = deathday ? new Date(deathday) : new Date();
        let age = endDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = endDate.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} ans`;
    }

    function highlightSelectedActor(selectedItem) {
        const allActors = document.querySelectorAll('.actor-item');
        allActors.forEach(item => item.classList.remove('selected'));
        selectedItem.classList.add('selected');
    }
});
