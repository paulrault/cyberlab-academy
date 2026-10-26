
# CyberLab Academy V4

Plateforme pédagogique personnelle consacrée au BTS SIO SISR.

## Fonctionnalités

- Tableau de bord avec XP, niveaux et progression
- Parcours de cours informatiques
- Simulateur de sous-réseaux IPv4
- Console pédagogique simulée
- Missions avec indices et corrections
- Quiz avec historique des résultats
- Supervision fictive de serveurs
- Glossaire informatique
- Journal de révision
- Thèmes clair et sombre
- Export et import JSON de la progression
- Interface responsive pour ordinateur, tablette et mobile

## Structure

```text
CyberLab-Academy-V4/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── storage.js
    ├── data.js
    ├── lab.js
    ├── missions.js
    ├── supervision.js
    └── app.js
```

## Lancer le site

Ouvre `index.html` dans un navigateur récent.

Pour un fonctionnement plus proche de la publication, tu peux également utiliser un serveur HTTP local.

## Publication sur GitHub Pages

1. Crée ou ouvre un dépôt GitHub.
2. Ajoute `index.html`, `README.md`, `css/style.css` et les fichiers du dossier `js`.
3. Conserve exactement la structure de dossiers indiquée ci-dessus.
4. Ouvre **Settings → Pages** dans le dépôt.
5. Dans **Build and deployment**, choisis **Deploy from a branch**.
6. Sélectionne la branche `main` et le dossier `/ (root)`.
7. Clique sur **Save**.
8. Attends la fin du déploiement et ouvre l'adresse affichée dans la section Pages.

## Stockage et confidentialité

Les données sont enregistrées dans le stockage local du navigateur.
Il n'y a ni serveur applicatif ni synchronisation automatique.
L'export JSON permet de sauvegarder manuellement la progression.

Ne place pas de mots de passe, de jetons d'accès ou d'informations sensibles
dans les fichiers publiés.

## Limites pédagogiques

Les commandes réseau et la supervision sont simulées.
Aucun paquet réseau n'est envoyé et aucun serveur réel n'est supervisé.

## Licence

Projet pédagogique personnel. Ajoute une licence si tu souhaites préciser
les conditions de réutilisation du code.
```
