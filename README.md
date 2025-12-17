# 🎬 Actor Quest

**Actor Quest** est une application web interactive permettant de rechercher des acteurs et actrices, consulter leurs informations biographiques, explorer leur filmographie et conserver un historique des consultations.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Fonctionnement](#-fonctionnement)
- [API utilisée](#-api-utilisée)

## ✨ Fonctionnalités

- 🔍 **Recherche d'acteurs/actrices** : Recherche par nom avec suggestions multiples
- 👤 **Affichage des informations** : Biographie, photo de profil et détails de la personne
- 🎥 **Filmographie** : Liste des 10 derniers films de l'acteur/actrice
- 🖼️ **Images** : Affichage des photos de profil des acteurs
- 📜 **Historique** : Sauvegarde des 3 dernières consultations (avec sessionStorage)
- 🎨 **Interface responsive** : Design moderne et intuitif

## 🛠 Technologies utilisées

- **HTML5** : Structure de l'application
- **CSS3** : Styles et mise en page responsive
- **JavaScript (ES6+)** : Logique applicative et modules
- **API TMDb** : The Movie Database API pour les données cinématographiques
- **Fetch API** : Requêtes HTTP asynchrones
- **SessionStorage** : Gestion de l'historique des consultations

## 📁 Structure du projet

```
actor-quest/
│
├── index.html              # Page principale de l'application
├── README.md              # Documentation du projet
│
├── assets/
│   └── images/
│       └── default-image.jpg  # Image par défaut si pas de photo
│
├── css/
│   └── styles.css         # Feuille de styles de l'application
│
├── data/
│   └── history.json       # Fichier pour l'historique (non utilisé actuellement)
│
└── js/
    ├── api.js             # Module API (vide - réservé pour futures fonctions)
    ├── main.js            # Logique principale de l'application
    └── env.js             # Configuration API (à créer - non versionné)
```

## 🚀 Installation

1. **Cloner le projet** ou télécharger les fichiers dans votre serveur local (MAMP, WAMP, XAMPP, etc.)

```bash
git clone https://github.com/JocelyneMuller/actor-quest.git
cd actor-quest
```

2. **Placer le projet** dans le dossier `htdocs` de votre serveur (ex: MAMP)

```
/Applications/MAMP/htdocs/actor-quest/
```

## ⚙️ Configuration

### 1. Obtenir une clé API TMDb

1. Créez un compte sur [The Movie Database (TMDb)](https://www.themoviedb.org/)
2. Accédez à votre profil → Paramètres → API
3. Demandez une clé API (gratuite)
4. Notez votre **API Key** et l'URL de base : `https://api.themoviedb.org/3`

### 2. Créer le fichier de configuration

Dans le dossier `js/`, créez un fichier nommé **`env.js`** avec le contenu suivant :

```javascript
const TOKEN = "********************************";
const URL = "********************************";

export { TOKEN, URL };
```

**⚠️ Important :** Remplacez les astérisques par votre véritable clé API TMDb et l'URL de base de l'API (`https://api.themoviedb.org/3`).

> **Note de sécurité** : Le fichier `env.js` ne doit pas être versionné (ajoutez-le dans `.gitignore`). Ne partagez jamais votre clé API publiquement.

## 💻 Utilisation

1. **Démarrer votre serveur local** (MAMP, WAMP, etc.)

2. **Accéder à l'application** via votre navigateur :
   ```
   http://localhost:8888/actor-quest/
   ```
   *(Le port peut varier selon votre configuration)*

3. **Rechercher un acteur** :
   - Entrez le nom d'un acteur/actrice dans la barre de recherche
   - Cliquez sur le bouton de recherche 🔍
   - Sélectionnez l'acteur souhaité dans les résultats

4. **Consulter l'historique** :
   - Les 3 dernières consultations apparaissent en bas de page
   - Cliquez sur un nom dans l'historique pour recharger ses informations

## 🔧 Fonctionnement

### Architecture de l'application

L'application utilise une architecture modulaire basée sur les **ES6 Modules** :

- **main.js** : Gère toute la logique de l'application
  - Recherche d'acteurs via l'API TMDb
  - Affichage des résultats et détails
  - Gestion de l'historique avec sessionStorage
  - Événements utilisateur

- **env.js** : Contient les variables d'environnement (API key et URL)

- **api.js** : Réservé pour des fonctions API futures (actuellement vide)

### Flux de données

1. L'utilisateur saisit un nom d'acteur
2. Une requête est envoyée à l'API TMDb (`/search/person`)
3. Les résultats sont affichés sous forme de liste avec photos
4. Au clic sur un acteur :
   - Récupération des détails (`/person/{id}`)
   - Récupération de la filmographie (`/person/{id}/movie_credits`)
   - Mise à jour de l'historique (sessionStorage)
5. L'historique conserve les 3 dernières consultations

### Gestion de l'historique

- Stockage dans **sessionStorage** (persiste pendant la session du navigateur)
- Limitation à **3 acteurs maximum**
- Si un acteur déjà consulté est re-sélectionné, il remonte en premier
- Affichage avec photo miniature et nom cliquable

## 🌐 API utilisée

**The Movie Database (TMDb) API v3**

Endpoints utilisés :
- `GET /search/person` : Recherche d'acteurs
- `GET /person/{person_id}` : Détails d'un acteur
- `GET /person/{person_id}/movie_credits` : Filmographie

Documentation : [https://developers.themoviedb.org/3](https://developers.themoviedb.org/3)

---

**Développé par** : Jocelyne Muller  
**Date** : Décembre 2025  
**Licence** : MIT