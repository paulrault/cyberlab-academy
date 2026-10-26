
# CyberLab Academy V5

Plateforme pédagogique personnelle consacrée aux systèmes, réseaux et à la cybersécurité défensive, notamment dans le cadre du BTS SIO SISR.

## Fonctionnalités

- Tableau de bord avec niveaux, XP et statistiques
- 7 parcours de formation avec leçons et exercices
- 12 missions pratiques avec indices et corrections
- Quiz aléatoires et historique des résultats
- Calculateur de sous-réseaux IPv4/CIDR
- Console réseau simulée
- Supervision pédagogique de serveurs fictifs
- Glossaire informatique avec recherche
- Journal de révision et comptes rendus
- Thèmes clair et sombre
- Export et import JSON
- Sauvegarde locale dans le navigateur
- Interface responsive

## Arborescence

```text
CyberLab-Academy-V5/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── data.js
    ├── storage.js
    ├── lab.js
    └── app.js
```

## Démarrage

Ouvre `index.html` dans un navigateur récent ou utilise un serveur HTTP local.

## Publication sur GitHub Pages

1. Crée un dépôt GitHub nommé `CyberLab-Academy-V5`, ou utilise un dépôt existant.
2. Ajoute les fichiers en conservant exactement l'arborescence.
3. Ouvre **Settings → Pages**.
4. Dans **Build and deployment**, sélectionne **Deploy from a branch**.
5. Choisis la branche `main` et le dossier `/ (root)`.
6. Clique sur **Save**.
7. Attends la fin du déploiement, puis ouvre l'adresse indiquée dans la section Pages.

## Stockage

Les données sont stockées dans le navigateur avec `localStorage`.

- Aucune base de données distante.
- Aucune synchronisation automatique entre appareils.
- L'effacement des données du navigateur peut supprimer la progression.
- L'export JSON permet de conserver une sauvegarde manuelle.

## Limites pédagogiques

La console et la supervision sont fictives. Aucun paquet réseau n'est envoyé et aucun serveur réel n'est interrogé. Les missions sont validées manuellement ; la plateforme ne vérifie pas les manipulations sur une véritable infrastructure.

## Sécurité

Ne publie pas de mots de passe, clés privées, jetons d'accès ou informations confidentielles dans le dépôt.

## Licence

Projet pédagogique personnel. Ajoute une licence si tu souhaites définir les conditions de réutilisation.
```

---

## 9. Publier CyberLab Academy V5

<list marker="number" gap={2}>
  <list-item>**Crée le dossier sur ton PC.** Dans `CyberLab-Academy-V5`, crée les dossiers `css` et `js` puis les huit fichiers présentés ci-dessus.</list-item>
  <list-item>**Copie les codes.** Vérifie que les extensions sont correctes : par exemple `style.css`, et non `style.css.txt`.</list-item>
  <list-item>**Ajoute les fichiers à GitHub.** Tu peux créer chaque fichier avec **Add file → Create new file**. Pour les fichiers dans des sous-dossiers, utilise des chemins tels que `js/data.js` ou `css/style.css`.</list-item>
  <list-item>**Active Pages.** Dans le dépôt, ouvre **Settings → Pages**, sélectionne `Deploy from a branch`, choisis `main` et `/(root)`, puis clique sur **Save**.</list-item>
  <list-item>**Contrôle le site publié.** Vérifie les boutons de navigation, les formations, les missions, le quiz, le calculateur IPv4 et l'export JSON. En cas d'erreur, ouvre les outils de développement avec `F12`, puis consulte l'onglet Console.</list-item>
</list>

## 10. Ce qu'il faut retenir sur cette V5

- **Progression :** les leçons rapportent 25 XP, les missions rapportent les XP affichés et les quiz rapportent 10 XP par bonne réponse.
- **Données :** la progression est enregistrée localement, sans synchronisation entre plusieurs appareils.
- **Supervision :** les serveurs affichés sont fictifs et ne correspondent pas à ton laboratoire réel.
- **Validation :** le code source est fourni dans la conversation, mais je n'ai pas exécuté les fichiers dans un navigateur ni vérifié leur syntaxe automatiquement. Il faut donc tester les interactions avant de considérer la V5 comme validée.

Pour conserver les données de la V4, garde d'abord son export JSON : le format de stockage de la V5 est différent, et l'import d'une ancienne sauvegarde peut ne pas restituer tous les éléments de progression.

La V5 constitue une base plus complète pour développer ensuite des fiches de dépannage, des examens blancs par domaine, des rapports de progression exportables et des scénarios de laboratoire plus avancés.
