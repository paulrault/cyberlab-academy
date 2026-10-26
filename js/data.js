
"use strict";

window.CyberData = {
  courses: [
    {
      id: "network", icon: "🌐", title: "Réseaux informatiques",
      category: "Réseau", level: "Débutant → Intermédiaire",
      description: "IPv4, sous-réseaux, VLAN, routage, DNS et DHCP.",
      lessons: [
        {
          id: "net-ip", title: "Comprendre IPv4", duration: "15 min",
          content: [
            "Une adresse IPv4 identifie une interface réseau. Elle comporte 32 bits, généralement présentés sous la forme de quatre nombres décimaux séparés par des points.",
            "Le masque de sous-réseau indique quelle partie de l'adresse correspond au réseau et quelle partie correspond à l'hôte. Le préfixe /24 correspond au masque 255.255.255.0."
          ],
          task: "Avec le calculateur du laboratoire, détermine le réseau correspondant à 192.168.10.25/24."
        },
        {
          id: "net-vlan", title: "VLAN et segmentation", duration: "20 min",
          content: [
            "Un VLAN permet de séparer logiquement des équipements au niveau 2. Deux VLAN différents constituent généralement des domaines de diffusion distincts.",
            "La communication entre VLAN nécessite habituellement un équipement de couche 3 et des règles de routage. Les trunks transportent plusieurs VLAN entre des équipements compatibles."
          ],
          task: "Dessine un réseau avec un VLAN Clients, un VLAN Techniciens et un VLAN Serveurs. Identifie les flux qui doivent être autorisés."
        },
        {
          id: "net-dns", title: "DNS et DHCP", duration: "20 min",
          content: [
            "Le DNS permet notamment de résoudre des noms en adresses IP. Le DHCP distribue automatiquement des paramètres réseau comme l'adresse IP, le masque, la passerelle et les serveurs DNS.",
            "Pour diagnostiquer un problème, distingue l'absence d'adresse, une mauvaise passerelle et un échec de résolution DNS : ces symptômes n'indiquent pas la même cause."
          ],
          task: "Écris une checklist de diagnostic pour un poste qui accède à une adresse IP mais ne résout pas un nom de domaine."
        }
      ]
    },
    {
      id: "windows", icon: "🖥️", title: "Windows Server",
      category: "Systèmes", level: "Débutant → Intermédiaire",
      description: "Active Directory, DNS, DHCP, utilisateurs et partages.",
      lessons: [
        {
          id: "win-ad", title: "Active Directory et OU", duration: "25 min",
          content: [
            "Active Directory Domain Services centralise l'identité et l'administration des objets d'un domaine. Les unités d'organisation (OU) servent notamment à organiser les objets et à déléguer l'administration.",
            "Les stratégies de groupe (GPO) permettent d'appliquer des paramètres à des utilisateurs et ordinateurs selon leur emplacement et les règles d'héritage."
          ],
          task: "Propose une arborescence d'OU pour les utilisateurs Clients et Techniciens d'une entreprise fictive."
        },
        {
          id: "win-dhcp", title: "DHCP sous Windows Server", duration: "20 min",
          content: [
            "Une étendue DHCP définit une plage d'adresses pouvant être attribuées aux clients. Il faut planifier les exclusions, les réservations et les options de configuration.",
            "Une configuration incorrecte de la passerelle ou du DNS peut laisser un poste avec une adresse valide, mais empêcher certains accès."
          ],
          task: "Conçois une étendue pour le réseau 192.168.10.0/24 et précise les adresses que tu réserverais aux serveurs."
        },
        {
          id: "win-share", title: "Partages et permissions", duration: "20 min",
          content: [
            "Les droits de partage et les permissions NTFS sont deux couches distinctes. L'accès effectif dépend de leur combinaison et du contexte d'accès.",
            "Applique le principe du moindre privilège : accorde uniquement les droits nécessaires et vérifie l'accès avec un compte de test."
          ],
          task: "Définis des permissions adaptées pour un dossier partagé par les techniciens et un dossier de documents clients."
        }
      ]
    },
    {
      id: "linux", icon: "🐧", title: "Linux & Debian",
      category: "Linux", level: "Débutant → Intermédiaire",
      description: "Terminal, utilisateurs, services, journaux et permissions.",
      lessons: [
        {
          id: "lin-files", title: "Fichiers et permissions", duration: "15 min",
          content: [
            "Linux organise les ressources dans une arborescence unique. Les permissions classiques distinguent le propriétaire, le groupe et les autres utilisateurs.",
            "Les permissions de lecture, écriture et exécution sont souvent représentées par r, w et x, ou par une notation numérique comme 644 ou 755."
          ],
          task: "Explique la différence entre les permissions 644 et 755 et donne un exemple d'utilisation pour chacune."
        },
        {
          id: "lin-service", title: "Services et journaux", duration: "20 min",
          content: [
            "Sur les distributions utilisant systemd, systemctl permet d'inspecter et de gérer les services. journalctl aide à consulter les journaux système.",
            "Avant de redémarrer un service, relève son état, consulte les erreurs et vérifie si une modification récente explique le problème."
          ],
          task: "Rédige une procédure de diagnostic d'un service qui ne démarre pas sur une machine de laboratoire."
        },
        {
          id: "lin-network", title: "Diagnostic réseau Linux", duration: "20 min",
          content: [
            "Les commandes ip address et ip route affichent respectivement les interfaces et les routes. Les outils de résolution DNS permettent ensuite de séparer les problèmes IP des problèmes de noms.",
            "Adapte toujours les commandes au système et à l'environnement. Une commande d'inspection n'a pas les mêmes effets qu'une commande qui modifie la configuration."
          ],
          task: "Prépare une checklist pour vérifier l'adresse, la route par défaut et la résolution DNS sur Debian."
        }
      ]
    },
    {
      id: "security", icon: "🛡️", title: "Cybersécurité défensive",
      category: "Sécurité", level: "Fondamentaux",
      description: "Durcissement, mises à jour, journaux et gestion des incidents.",
      lessons: [
        {
          id: "sec-hardening", title: "Durcissement des systèmes", duration: "20 min",
          content: [
            "Le durcissement réduit la surface d'attaque : mises à jour, désactivation des services inutiles, comptes maîtrisés, authentification robuste et permissions adaptées.",
            "Documente les changements et conserve un moyen de retour arrière. Teste les modifications dans un environnement autorisé avant de les généraliser."
          ],
          task: "Établis une checklist de durcissement pour un nouveau serveur de laboratoire."
        },
        {
          id: "sec-logs", title: "Lire des journaux", duration: "20 min",
          content: [
            "Un journal apporte des éléments de contexte : heure, source, type d'événement et résultat. Un événement isolé ne suffit pas toujours à prouver qu'un incident a eu lieu.",
            "Corrèle les événements, vérifie les horodatages et distingue les faits observés des hypothèses. Respecte les procédures de conservation des preuves."
          ],
          task: "À partir d'un incident fictif, prépare une chronologie qui sépare faits, hypothèses et actions à mener."
        },
        {
          id: "sec-backup", title: "Sauvegarde et reprise", duration: "20 min",
          content: [
            "Une sauvegarde n'est utile que si elle peut être restaurée. Définis les données critiques, la fréquence, la rétention et les personnes autorisées à accéder aux copies.",
            "Le RPO représente la perte de données maximale visée. Le RTO représente le délai de rétablissement visé. Ils se définissent en fonction des besoins du service."
          ],
          task: "Propose un plan de sauvegarde et un test de restauration pour un serveur de fichiers fictif."
        }
      ]
    },
    {
      id: "docker", icon: "📦", title: "Docker & conteneurs",
      category: "DevOps", level: "Intermédiaire",
      description: "Images, conteneurs, volumes, ports et réseaux.",
      lessons: [
        {
          id: "dock-basics", title: "Images et conteneurs", duration: "20 min",
          content: [
            "Une image est un modèle servant à créer des conteneurs. Un conteneur est une instance exécutée à partir d'une image avec sa propre configuration.",
            "Un conteneur n'est pas une machine virtuelle complète. Il partage le noyau de l'hôte et doit être géré avec des règles de sécurité adaptées."
          ],
          task: "Explique la différence entre une image, un conteneur et un volume."
        },
        {
          id: "dock-network", title: "Ports, volumes et réseaux", duration: "25 min",
          content: [
            "La publication d'un port rend un service accessible via l'hôte. Un volume permet de conserver des données au-delà du cycle de vie d'un conteneur.",
            "Les réseaux Docker permettent aux services de communiquer. Évite d'exposer publiquement un service d'administration sans contrôle d'accès approprié."
          ],
          task: "Dessine une architecture composée d'un proxy inverse et de deux services internes."
        }
      ]
    },
    {
      id: "virtual", icon: "☁️", title: "Virtualisation",
      category: "Infrastructure", level: "Intermédiaire",
      description: "Machines virtuelles, ressources, snapshots et sauvegardes.",
      lessons: [
        {
          id: "virt-basics", title: "Principes de virtualisation", duration: "20 min",
          content: [
            "Un hyperviseur permet d'exécuter plusieurs machines virtuelles sur un hôte physique. Chaque VM dispose de ressources virtuelles et d'un système d'exploitation invité.",
            "Le dimensionnement doit tenir compte de la mémoire, du processeur, du stockage et des besoins réseau. Une surallocation excessive peut dégrader les performances."
          ],
          task: "Propose un plan de ressources pour trois VM de laboratoire et justifie tes choix."
        },
        {
          id: "virt-backup", title: "Snapshots et sauvegardes", duration: "20 min",
          content: [
            "Un snapshot est utile pour revenir à un état antérieur dans certaines situations, mais il ne remplace pas une sauvegarde indépendante.",
            "Une stratégie fiable inclut des copies adaptées aux risques, une surveillance des tâches et des essais réguliers de restauration."
          ],
          task: "Décris comment protéger une VM importante et comment tester sa restauration."
        }
      ]
    },
    {
      id: "monitoring", icon: "📊", title: "Supervision & incidents",
      category: "Exploitation", level: "Intermédiaire",
      description: "Disponibilité, seuils, alertes, métriques et comptes rendus.",
      lessons: [
        {
          id: "mon-metrics", title: "Métriques et alertes", duration: "20 min",
          content: [
            "Les métriques CPU, mémoire, espace disque et disponibilité aident à détecter les dégradations. Un seuil doit être interprété dans son contexte et dans la durée.",
            "Une alerte doit préciser la ressource concernée, la gravité, l'heure, l'impact probable et les premières vérifications."
          ],
          task: "Écris une fiche d'incident fictif avec impact, priorité, hypothèses et étapes de diagnostic."
        },
        {
          id: "mon-report", title: "Compte rendu d'incident", duration: "15 min",
          content: [
            "Un bon compte rendu distingue les faits, les actions effectuées, les résultats observés et les actions restantes.",
            "Reste factuel, indique les horaires et les impacts connus, et ne présente pas une hypothèse comme une cause confirmée."
          ],
          task: "Rédige un compte rendu concis d'une indisponibilité fictive d'un serveur de fichiers."
        }
      ]
    }
  ],

  missions: [
    { id:"m1", title:"Poste sans accès réseau", category:"Réseau", difficulty:"Débutant", xp:50, description:"Un poste ne communique plus avec les ressources internes.", hint:"Commence par le lien, l'adresse, le masque et la passerelle.", correction:"Vérifier le lien réseau, relever l'adresse et le masque, contrôler la passerelle, tester la connectivité puis la résolution DNS. Noter chaque résultat avant de modifier la configuration." },
    { id:"m2", title:"Résolution DNS en échec", category:"Réseau", difficulty:"Débutant", xp:50, description:"Une adresse IP répond, mais le nom d'un service ne se résout pas.", hint:"Compare un test vers l'IP avec une requête DNS.", correction:"Vérifier le serveur DNS configuré, la connectivité vers ce serveur, les enregistrements et les journaux. Distinguer une panne DNS d'une panne du service cible." },
    { id:"m3", title:"Compte utilisateur bloqué", category:"Windows Server", difficulty:"Intermédiaire", xp:75, description:"Un utilisateur ne parvient plus à ouvrir une session dans le domaine.", hint:"Vérifie l'état du compte, l'heure, le réseau et les événements.", correction:"Confirmer l'identité selon la procédure, vérifier l'état du compte et les événements d'authentification, puis appliquer la procédure autorisée de déblocage ou de réinitialisation." },
    { id:"m4", title:"Partage réseau inaccessible", category:"Windows Server", difficulty:"Intermédiaire", xp:75, description:"Un collaborateur ne peut plus ouvrir un partage.", hint:"Distingue connectivité, droits de partage et permissions NTFS.", correction:"Vérifier le chemin, la connectivité, l'identité utilisée, les droits de partage et les permissions NTFS. Tester avec un compte autorisé et consigner les changements." },
    { id:"m5", title:"Service Debian arrêté", category:"Linux", difficulty:"Intermédiaire", xp:75, description:"Un service fictif ne répond plus.", hint:"Observe l'état du service et ses journaux avant d'agir.", correction:"Vérifier l'état du service, les journaux, les ressources et la configuration. Évaluer l'impact avant un redémarrage et vérifier le résultat ensuite." },
    { id:"m6", title:"Disque presque plein", category:"Supervision", difficulty:"Intermédiaire", xp:75, description:"La capacité disponible d'un serveur passe sous un seuil critique.", hint:"Identifie les systèmes de fichiers et les répertoires concernés.", correction:"Confirmer la métrique, identifier les données qui occupent l'espace, vérifier les journaux et la politique de rétention, puis proposer un nettoyage contrôlé ou une extension." },
    { id:"m7", title:"Conteneur indisponible", category:"Docker", difficulty:"Intermédiaire", xp:75, description:"Une application conteneurisée n'est plus accessible.", hint:"Vérifie l'état, les journaux, les ports et les dépendances.", correction:"Contrôler l'état du conteneur, les logs, les ports publiés, les volumes, le réseau et les dépendances. Éviter de supprimer un conteneur ou un volume avant d'avoir protégé les données." },
    { id:"m8", title:"Sauvegarde non confirmée", category:"Sauvegarde", difficulty:"Avancé", xp:100, description:"Une tâche de sauvegarde n'a pas fourni de résultat exploitable.", hint:"Un statut vert ne suffit pas : cherche la preuve de restauration.", correction:"Examiner les journaux de tâche, la destination, la capacité et l'intégrité des copies. Planifier un test de restauration isolé et consigner son résultat." },
    { id:"m9", title:"Alerte CPU", category:"Supervision", difficulty:"Intermédiaire", xp:75, description:"La charge CPU simulée reste élevée.", hint:"Cherche la durée, la tendance et les processus concernés.", correction:"Confirmer la métrique, examiner la tendance et les processus, corréler avec les tâches planifiées et mesurer l'impact avant toute action." },
    { id:"m10", title:"Plan de segmentation", category:"Réseau", difficulty:"Avancé", xp:100, description:"Une petite entreprise souhaite séparer clients, techniciens et serveurs.", hint:"Commence par les besoins, puis définis les flux nécessaires.", correction:"Proposer des VLAN et sous-réseaux distincts, un routage contrôlé, des règles de filtrage minimales, une documentation et un plan de tests." },
    { id:"m11", title:"Préparer une reprise", category:"Infrastructure", difficulty:"Avancé", xp:100, description:"Un serveur essentiel doit pouvoir être restauré après incident.", hint:"Définis les priorités, le RPO, le RTO et les tests.", correction:"Identifier les données et dépendances, fixer des objectifs de reprise réalistes, protéger les sauvegardes, documenter les étapes et tester régulièrement." },
    { id:"m12", title:"Rapport d'incident", category:"Méthode", difficulty:"Débutant", xp:50, description:"Un responsable demande un compte rendu après un incident.", hint:"Sépare faits, impact, actions, résultats et prochaines étapes.", correction:"Rédiger une chronologie factuelle, préciser les services touchés, les actions réalisées et leurs résultats, les hypothèses restantes et les mesures préventives." }
  ],

  questions: [
    { q:"Quel service traduit couramment un nom de domaine en adresse IP ?", options:["DHCP","DNS","NTP","SSH"], answer:1, explanation:"DNS assure la résolution de noms." },
    { q:"Quel service distribue automatiquement une configuration IP ?", options:["DHCP","DNS","HTTP","SMTP"], answer:0, explanation:"DHCP fournit des paramètres réseau aux clients." },
    { q:"Que signifie un préfixe IPv4 /24 ?", options:["24 octets d'hôtes","24 bits de réseau","24 VLAN","24 passerelles"], answer:1, explanation:"Le préfixe indique le nombre de bits du réseau." },
    { q:"À quoi sert un VLAN ?", options:["À chiffrer un disque","À segmenter logiquement un réseau de niveau 2","À remplacer DNS","À sauvegarder un serveur"], answer:1, explanation:"Un VLAN sépare logiquement des domaines de diffusion." },
    { q:"Quel outil Linux consulte souvent les journaux systemd ?", options:["journalctl","mkdir","chmod","echo"], answer:0, explanation:"journalctl permet de consulter les journaux gérés par journald." },
    { q:"Quelle est la fonction d'une OU Active Directory ?", options:["Remplacer le DNS","Organiser des objets et faciliter la délégation","Créer des VLAN physiques","Chiffrer les sauvegardes"], answer:1, explanation:"Les OU structurent les objets et peuvent servir à déléguer l'administration." },
    { q:"Un conteneur Docker est principalement créé à partir…", options:["D'une image","D'un VLAN","D'une GPO","D'un enregistrement DNS"], answer:0, explanation:"Une image sert de modèle pour créer un conteneur." },
    { q:"Un snapshot remplace-t-il une sauvegarde indépendante ?", options:["Toujours","Oui, pour tous les serveurs","Non","Uniquement sur Linux"], answer:2, explanation:"Un snapshot ne remplace pas une stratégie de sauvegarde indépendante." },
    { q:"Que mesure le RTO ?", options:["La perte maximale de données visée","Le délai de rétablissement visé","La charge CPU","La durée d'un bail DHCP"], answer:1, explanation:"Le RTO représente le délai de rétablissement visé." },
    { q:"Quel principe guide l'attribution des permissions ?", options:["Tout autoriser","Le moindre privilège","Partager tous les comptes","Désactiver les journaux"], answer:1, explanation:"Le moindre privilège limite les droits à ce qui est nécessaire." },
    { q:"Quelle étape est importante après une sauvegarde ?", options:["Supprimer la copie","Tester la restauration","Désactiver les alertes","Partager le mot de passe"], answer:1, explanation:"Une restauration testée aide à confirmer que les sauvegardes sont exploitables." },
    { q:"Que faire en premier devant une alerte de supervision ?", options:["Redémarrer immédiatement","Effacer les journaux","Confirmer l'alerte et évaluer l'impact","Ignorer l'alerte"], answer:2, explanation:"Confirmer les faits et évaluer l'impact avant de choisir une action." },
    { q:"À quoi sert une passerelle par défaut ?", options:["À joindre des réseaux externes au sous-réseau local","À remplacer l'adresse IP","À créer un utilisateur","À compresser des fichiers"], answer:0, explanation:"Elle permet de transmettre le trafic destiné à d'autres réseaux." },
    { q:"Quel port est associé au HTTPS par défaut ?", options:["21","22","80","443"], answer:3, explanation:"HTTPS utilise généralement TCP 443." },
    { q:"Pourquoi documenter une intervention ?", options:["Pour éviter les tests","Pour garder une trace des faits et des actions","Pour masquer les erreurs","Pour supprimer les alertes"], answer:1, explanation:"La documentation facilite le suivi, le diagnostic et la transmission." }
  ],

  glossary: [
    ["AD DS", "Service d'annuaire Microsoft pour les identités et objets d'un domaine."],
    ["Adresse IP", "Identifiant logique d'une interface sur un réseau IP."],
    ["CIDR", "Notation d'un préfixe réseau, par exemple /24."],
    ["DHCP", "Protocole de configuration dynamique des clients réseau."],
    ["DNS", "Système de noms de domaine, notamment utilisé pour la résolution de noms."],
    ["Docker", "Plateforme de création et d'exécution de conteneurs."],
    ["GPO", "Stratégie de groupe permettant de configurer des utilisateurs et ordinateurs Windows."],
    ["Hyperviseur", "Logiciel ou couche système qui permet d'exécuter des machines virtuelles."],
    ["NTFS", "Système de fichiers Windows qui prend notamment en charge les permissions."],
    ["RPO", "Objectif de point de reprise : perte de données maximale visée."],
    ["RTO", "Objectif de délai de reprise d'un service."],
    ["Snapshot", "Capture de l'état d'une VM ou d'un volume à un instant donné."],
    ["VLAN", "Segmentation logique d'un réseau de niveau 2."],
    ["VPN", "Technologie permettant d'établir un tunnel réseau sécurisé selon sa configuration."],
    ["Pare-feu", "Mécanisme qui autorise ou bloque des flux selon des règles."],
    ["Moindre privilège", "Principe consistant à n'accorder que les droits nécessaires."],
    ["Supervision", "Collecte et analyse d'états, métriques et événements d'une infrastructure."],
    ["Journal", "Enregistrement chronologique d'événements d'un système ou d'une application."]
  ],

  servers: [
    { id:"ad01", name:"SRV-AD01", role:"Active Directory / DNS", status:"online", cpu:18, ram:42, uptime:"12 j 04 h" },
    { id:"web01", name:"SRV-WEB01", role:"Serveur web", status:"online", cpu:32, ram:61, uptime:"8 j 16 h" },
    { id:"files01", name:"SRV-FICHIERS", role:"Partages réseau", status:"warning", cpu:84, ram:78, uptime:"5 j 02 h" },
    { id:"backup01", name:"SRV-BACKUP", role:"Sauvegardes", status:"offline", cpu:0, ram:0, uptime:"Indisponible" },
    { id:"docker01", name:"SRV-DOCKER", role:"Conteneurs", status:"online", cpu:24, ram:55, uptime:"3 j 11 h" }
  ]
};
