
# CyberLab Academy V3

Plateforme pédagogique destinée à l'apprentissage des systèmes et réseaux, notamment pour le BTS SIO SISR.

## Fonctionnalités

- Tableau de bord et suivi de progression
- Parcours Windows Server, réseaux, Linux, cybersécurité, Docker et virtualisation
- Laboratoire réseau IPv4 simulé
- Six missions pratiques avec corrections
- Centre de supervision avec équipements et journaux fictifs
- Quiz avec correction et historique des résultats
- Thème sombre et thème clair
- Export et import de la progression au format JSON
- Stockage local dans le navigateur

## Arborescence

```text
CyberLab-Academy-V3/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── storage.js
    ├── lab.js
    ├── missions.js
    ├── supervision.js
    └── app.js
```

## Tester en local

1. Créer les dossiers `css` et `js`.
2. Placer chaque fichier au bon emplacement.
3. Ouvrir `index.html` dans un navigateur.
4. Tester les menus, les missions, le quiz et le laboratoire réseau.

Pour un environnement de développement plus proche d'un serveur web, utiliser l'extension Live Server de Visual Studio Code.

## Publier sur GitHub Pages

1. Créer un dépôt GitHub nommé `cyberlab-academy-v3`.
2. Envoyer tous les fichiers et dossiers à la racine du dépôt.
3. Ouvrir Settings > Pages.
4. Dans Build and deployment, sélectionner Deploy from a branch.
5. Choisir la branche `main` et le dossier `/ (root)`.
6. Enregistrer et attendre la publication.

L'adresse sera généralement :

https://TON-PSEUDO.github.io/cyberlab-academy-v3/

Remplacer `TON-PSEUDO` par son identifiant GitHub.

## Stockage et limites

Les données de progression sont stockées localement dans le navigateur. Elles ne sont pas automatiquement synchronisées entre plusieurs appareils.

Le laboratoire et le centre de supervision sont des simulations pédagogiques. Ils ne configurent pas de véritables équipements.

## Licence

Projet personnel à adapter et à enrichir.
