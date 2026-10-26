
"use strict";

window.CyberData = {
  courses: [
    {
      id: "windows",
      title: "Windows Server",
      icon: "🖥️",
      category: "Systèmes",
      level: "Intermédiaire",
      description: "Découvrir les rôles serveur et administrer un domaine.",
      lessons: [
        {
          id: "win-ad",
          title: "Active Directory",
          duration: "15 min",
          content: [
            "Active Directory Domain Services (AD DS) centralise l'identité des utilisateurs, des ordinateurs et des groupes dans un domaine Windows.",
            "Une unité d'organisation (OU) permet de classer les objets et de déléguer certaines tâches d'administration.",
            "Les stratégies de groupe (GPO) permettent d'appliquer des paramètres aux utilisateurs et aux ordinateurs.",
            "Le DNS est essentiel pour localiser les services Active Directory."
          ],
          task: "Propose une organisation simple avec les OU Clients et Techniciens, puis explique pourquoi les droits d'administration doivent être limités."
        },
        {
          id: "win-dns",
          title: "DNS et résolution de noms",
          duration: "12 min",
          content: [
            "Le DNS traduit les noms de domaine en informations utilisables par les systèmes, notamment des adresses IP.",
            "Un enregistrement A associe un nom à une adresse IPv4 ; un enregistrement AAAA utilise IPv6.",
            "Un enregistrement PTR sert à la résolution inverse. Les enregistrements SRV permettent de localiser des services.",
            "En cas de panne, vérifier la configuration DNS du client et tester la résolution du nom."
          ],
          task: "Explique pourquoi un poste joint à un domaine doit utiliser le DNS de l'infrastructure Active Directory."
        },
        {
          id: "win-dhcp",
          title: "DHCP et attribution d'adresses",
          duration: "12 min",
          content: [
            "Le DHCP attribue automatiquement des paramètres réseau aux clients.",
            "Le processus DORA correspond à Discover, Offer, Request et Acknowledge.",
            "Une étendue définit la plage d'adresses distribuées. Les exclusions et réservations répondent à des besoins différents.",
            "La passerelle par défaut permet de joindre les réseaux extérieurs au sous-réseau local."
          ],
          task: "Décris les vérifications à effectuer si un poste ne reçoit pas d'adresse IPv4."
        }
      ]
    },
    {
      id: "network",
      title: "Réseaux et IPv4",
      icon: "🌐",
      category: "Réseaux",
      level: "Fondamental",
      description: "Adresses, masques, passerelles, VLAN et diagnostic.",
      lessons: [
        {
          id: "net-ipv4",
          title: "Comprendre IPv4",
          duration: "12 min",
          content: [
            "Une adresse IPv4 contient 32 bits, généralement représentés par quatre nombres décimaux de 0 à 255.",
            "Le masque sépare la partie réseau et la partie hôte. Le préfixe /24 correspond au masque 255.255.255.0.",
            "La passerelle est le routeur utilisé pour atteindre d'autres réseaux.",
            "Deux appareils d'un même sous-réseau peuvent communiquer directement si les règles réseau le permettent."
          ],
          task: "Pour 192.168.10.25/24, indique l'adresse réseau et la plage habituelle des hôtes."
        },
        {
          id: "net-vlan",
          title: "VLAN et segmentation",
          duration: "15 min",
          content: [
            "Un VLAN segmente logiquement un réseau de niveau 2.",
            "Les ports access appartiennent généralement à un VLAN ; les trunks transportent plusieurs VLAN identifiés.",
            "La communication entre VLAN nécessite du routage de niveau 3 et les règles de filtrage appropriées.",
            "La segmentation facilite l'organisation et peut limiter l'étendue de certains incidents."
          ],
          task: "Propose deux VLAN séparés pour les postes clients et les serveurs, puis indique ce qu'il faut pour permettre leur communication."
        },
        {
          id: "net-troubleshoot",
          title: "Diagnostic réseau",
          duration: "10 min",
          content: [
            "Commence par vérifier le lien, l'adresse IP, le masque, la passerelle et le DNS.",
            "Ping teste la joignabilité ICMP lorsqu'elle est autorisée ; son échec ne prouve pas toujours qu'un hôte est indisponible.",
            "Traceroute ou tracert aide à observer le chemin vers une destination.",
            "Il faut isoler le problème étape par étape et noter les résultats."
          ],
          task: "Décris l'ordre de tes tests lorsqu'un poste accède aux adresses IP mais pas aux noms de domaine."
        }
      ]
    },
    {
      id: "debian",
      title: "Linux et Debian",
      icon: "🐧",
      category: "Systèmes",
      level: "Fondamental",
      description: "Commandes, permissions, services et journaux.",
      lessons: [
        {
          id: "deb-cli",
          title: "Commandes essentielles",
          duration: "10 min",
          content: [
            "pwd affiche le répertoire courant, ls liste son contenu et cd change de répertoire.",
            "ip address affiche les interfaces et leurs adresses. ip route affiche les routes connues.",
            "systemctl status nom.service permet d'examiner l'état d'un service systemd.",
            "journalctl -u nom.service permet de consulter les journaux associés à un service."
          ],
          task: "Prépare une séquence de commandes pour vérifier l'adresse IP et l'état d'un service."
        },
        {
          id: "deb-perms",
          title: "Utilisateurs et permissions",
          duration: "14 min",
          content: [
            "Linux distingue notamment le propriétaire, le groupe et les autres utilisateurs.",
            "Les permissions usuelles sont la lecture (r), l'écriture (w) et l'exécution (x).",
            "sudo permet d'exécuter certaines commandes avec des privilèges élevés selon la politique configurée.",
            "Applique le principe du moindre privilège et évite les droits trop larges."
          ],
          task: "Explique la différence entre les permissions 644 et 755."
        }
      ]
    },
    {
      id: "security",
      title: "Cybersécurité défensive",
      icon: "🛡️",
      category: "Sécurité",
      level: "Intermédiaire",
      description: "Durcissement, comptes, journaux et incidents.",
      lessons: [
        {
          id: "sec-hardening",
          title: "Durcissement des systèmes",
          duration: "15 min",
          content: [
            "Le durcissement consiste à réduire la surface d'attaque d'un système.",
            "Applique les mises à jour, désactive les services inutiles et limite les droits.",
            "Les sauvegardes doivent être protégées et faire l'objet de tests de restauration.",
            "La journalisation et la synchronisation de l'heure facilitent l'analyse des incidents."
          ],
          task: "Établis cinq mesures de protection pour un nouveau serveur Debian."
        },
        {
          id: "sec-incident",
          title: "Gestion d'incident",
          duration: "15 min",
          content: [
            "Détecter, qualifier, documenter et signaler un incident selon les procédures prévues.",
            "Préserver les journaux et les éléments utiles à l'analyse.",
            "Éviter les changements précipités qui pourraient détruire des preuves ou aggraver la situation.",
            "Après résolution, documenter la cause, les actions et les améliorations nécessaires."
          ],
          task: "Un serveur présente des connexions inhabituelles. Quelles sont les premières actions prudentes ?"
        }
      ]
    },
    {
      id: "docker",
      title: "Docker et conteneurs",
      icon: "🐳",
      category: "Infrastructure",
      level: "Intermédiaire",
      description: "Images, conteneurs, volumes et réseaux.",
      lessons: [
        {
          id: "dock-basics",
          title: "Images et conteneurs",
          duration: "12 min",
          content: [
            "Une image est un modèle servant à créer un conteneur.",
            "Un conteneur est une instance isolée d'une image avec son processus et sa configuration.",
            "Les volumes permettent de conserver des données au-delà du cycle de vie du conteneur.",
            "Les ports publiés rendent certains services accessibles depuis l'hôte ou le réseau selon la configuration."
          ],
          task: "Explique pourquoi une base de données en conteneur a souvent besoin d'un volume persistant."
        },
        {
          id: "dock-compose",
          title: "Docker Compose",
          duration: "15 min",
          content: [
            "Compose décrit une application multi-conteneurs dans un fichier YAML.",
            "Chaque service peut déclarer son image, ses variables, ses ports, ses volumes et ses réseaux.",
            "Les secrets ne doivent pas être écrits en clair dans un dépôt public.",
            "Les journaux et les contrôles de santé aident à diagnostiquer les problèmes."
          ],
          task: "Liste les éléments nécessaires pour déployer un serveur web avec des données persistantes."
        }
      ]
    },
    {
      id: "virtual",
      title: "Virtualisation",
      icon: "🧩",
      category: "Infrastructure",
      level: "Intermédiaire",
      description: "Machines virtuelles, ressources, snapshots et réseau virtuel.",
      lessons: [
        {
          id: "virt-vm",
          title: "Machines virtuelles",
          duration: "12 min",
          content: [
            "Un hyperviseur permet d'exécuter plusieurs machines virtuelles sur un hôte physique.",
            "Chaque VM dispose de ressources virtuelles comme le processeur, la mémoire, le disque et les interfaces réseau.",
            "Les réseaux NAT, pontés et internes répondent à des besoins différents.",
            "Les snapshots facilitent certains retours arrière mais ne remplacent pas une sauvegarde indépendante."
          ],
          task: "Compare un réseau NAT et un réseau interne pour un laboratoire de formation."
        }
      ]
    },
    {
      id: "backup",
      title: "Sauvegardes et restauration",
      icon: "💾",
      category: "Infrastructure",
      level: "Intermédiaire",
      description: "Stratégies de sauvegarde, rétention et tests.",
      lessons: [
        {
          id: "backup-plan",
          title: "Plan de sauvegarde",
          duration: "14 min",
          content: [
            "Identifie les données critiques et les objectifs de reprise.",
            "La règle 3-2-1 recommande trois copies, sur deux types de supports, dont une copie hors site.",
            "Une sauvegarde n'est utile que si elle peut être restaurée dans les délais attendus.",
            "Protège les sauvegardes contre l'accès non autorisé et les suppressions malveillantes."
          ],
          task: "Élabore un plan simple pour les fichiers d'une petite entreprise."
        }
      ]
    },
    {
      id: "monitoring",
      title: "Supervision et observabilité",
      icon: "📈",
      category: "Infrastructure",
      level: "Intermédiaire",
      description: "Disponibilité, métriques, journaux et alertes.",
      lessons: [
        {
          id: "mon-basics",
          title: "Indicateurs et alertes",
          duration: "12 min",
          content: [
            "La supervision suit l'état des services et les indicateurs utiles à leur fonctionnement.",
            "Une métrique représente une mesure dans le temps ; un journal contient des événements détaillés.",
            "Une alerte doit être actionnable, contextualisée et réglée pour limiter les faux positifs.",
            "Les seuils doivent être adaptés au service et à son comportement normal."
          ],
          task: "Choisis trois indicateurs pertinents pour surveiller un serveur web."
        }
      ]
    }
  ],

  missions: [
    { id: "m1", title: "Diagnostiquer une panne DNS", category: "Réseau", difficulty: "Débutant", xp: 50,
      description: "Un poste joint un serveur par adresse IP, mais la résolution de son nom échoue.",
      hint: "Vérifie d'abord le serveur DNS configuré et teste une résolution de nom.",
      correction: "Contrôler la configuration IP et DNS du client, vérifier l'accès au serveur DNS, tester la résolution et examiner la zone et les enregistrements nécessaires." },
    { id: "m2", title: "Organiser Active Directory", category: "Windows Server", difficulty: "Intermédiaire", xp: 75,
      description: "Sépare les comptes clients des comptes techniciens et limite les droits.",
      hint: "Pense aux OU, groupes de sécurité et délégations de droits.",
      correction: "Créer des OU cohérentes, placer les comptes au bon endroit, utiliser des groupes de sécurité et attribuer uniquement les droits nécessaires." },
    { id: "m3", title: "Résoudre un bail DHCP absent", category: "Réseau", difficulty: "Débutant", xp: 50,
      description: "Un poste ne reçoit pas d'adresse IPv4 automatiquement.",
      hint: "Examine le lien réseau, le VLAN, l'étendue et les relais éventuels.",
      correction: "Vérifier la connexion et le VLAN, l'état du service DHCP, la disponibilité de l'étendue, les exclusions, les relais et les règles de filtrage." },
    { id: "m4", title: "Examiner un service Debian", category: "Linux", difficulty: "Débutant", xp: 50,
      description: "Un service Linux ne démarre plus après une modification.",
      hint: "Consulte l'état du service puis ses journaux.",
      correction: "Utiliser systemctl status et journalctl -u, examiner la configuration modifiée, corriger l'erreur puis valider le démarrage." },
    { id: "m5", title: "Préparer un conteneur persistant", category: "Docker", difficulty: "Intermédiaire", xp: 75,
      description: "Une application doit conserver ses fichiers après recréation du conteneur.",
      hint: "Distingue le système de fichiers du conteneur et le stockage persistant.",
      correction: "Définir un volume ou un montage approprié, contrôler les permissions et vérifier la persistance après recréation." },
    { id: "m6", title: "Segmenter le réseau", category: "Réseau", difficulty: "Avancé", xp: 100,
      description: "Les postes utilisateurs et les serveurs doivent être séparés logiquement.",
      hint: "Pense aux VLAN, au routage et aux règles de filtrage.",
      correction: "Créer les VLAN, configurer les ports access et trunks, prévoir le routage inter-VLAN nécessaire et appliquer des règles de filtrage restrictives." },
    { id: "m7", title: "Établir une stratégie de sauvegarde", category: "Sauvegarde", difficulty: "Intermédiaire", xp: 75,
      description: "Les fichiers partagés doivent pouvoir être restaurés après incident.",
      hint: "Définis fréquence, rétention, protection et tests de restauration.",
      correction: "Définir les données à protéger, la fréquence, la rétention, une copie isolée, le contrôle des accès et des tests de restauration documentés." },
    { id: "m8", title: "Réagir à une alerte système", category: "Sécurité", difficulty: "Avancé", xp: 100,
      description: "Un serveur affiche une activité inhabituelle signalée par la supervision.",
      hint: "Documente les faits et préserve les journaux avant toute action importante.",
      correction: "Qualifier et signaler l'incident, préserver les journaux, appliquer la procédure de réponse et documenter chaque action sans tirer de conclusion hâtive." },
    { id: "m9", title: "Planifier une migration virtuelle", category: "Virtualisation", difficulty: "Intermédiaire", xp: 75,
      description: "Une VM doit être migrée vers un autre hôte.",
      hint: "Vérifie les ressources, le réseau, le stockage et le plan de retour arrière.",
      correction: "Inventorier les dépendances, vérifier la compatibilité et les ressources, sauvegarder, planifier une fenêtre de migration, tester puis documenter." },
    { id: "m10", title: "Créer une supervision utile", category: "Supervision", difficulty: "Intermédiaire", xp: 75,
      description: "Une équipe souhaite être alertée lorsque son service web devient indisponible.",
      hint: "Choisis un contrôle de disponibilité et un seuil d'alerte pertinent.",
      correction: "Définir un contrôle de disponibilité, la fréquence, le seuil, les destinataires, une procédure d'escalade et un test d'alerte." },
    { id: "m11", title: "Corriger des permissions Linux", category: "Linux", difficulty: "Intermédiaire", xp: 75,
      description: "Un fichier de configuration est accessible à trop d'utilisateurs.",
      hint: "Examine propriétaire, groupe et permissions nécessaires.",
      correction: "Identifier les utilisateurs légitimes, ajuster propriétaire et groupe, réduire les permissions et tester le fonctionnement du service." },
    { id: "m12", title: "Préparer un plan de reprise", category: "Continuité", difficulty: "Avancé", xp: 125,
      description: "Une petite entreprise veut réduire l'impact d'une panne majeure.",
      hint: "Pense aux priorités, dépendances, RPO, RTO et exercices de restauration.",
      correction: "Inventorier les services critiques, fixer les objectifs de reprise, documenter les dépendances, protéger les sauvegardes et tester régulièrement le plan." }
  ],

  questions: [
    { q: "Quel service attribue automatiquement des paramètres IP ?", options: ["DNS", "DHCP", "SSH", "HTTP"], answer: 1, explanation: "DHCP distribue notamment l'adresse IP, le masque, la passerelle et les DNS." },
    { q: "Quel enregistrement DNS associe généralement un nom à une IPv4 ?", options: ["AAAA", "PTR", "A", "MX"], answer: 2, explanation: "L'enregistrement A correspond à une adresse IPv4." },
    { q: "Que signifie le préfixe /24 en IPv4 ?", options: ["24 hôtes", "24 bits réseau", "24 routeurs", "24 VLAN"], answer: 1, explanation: "/24 signifie que 24 bits du masque identifient la partie réseau." },
    { q: "Quelle commande affiche les routes sous Linux ?", options: ["ip route", "pwd", "whoami", "mkdir"], answer: 0, explanation: "ip route affiche la table de routage." },
    { q: "À quoi sert un volume Docker ?", options: ["À remplacer le DNS", "À conserver des données", "À compiler le noyau", "À créer un VLAN physique"], answer: 1, explanation: "Un volume permet de conserver les données au-delà du cycle de vie d'un conteneur." },
    { q: "Quel mécanisme permet de centraliser les comptes Windows d'un domaine ?", options: ["Active Directory", "NAT", "FTP", "Cron"], answer: 0, explanation: "AD DS centralise les identités et les objets du domaine." },
    { q: "Un ping échoue. Que peut-on conclure ?", options: ["Le serveur est forcément éteint", "Le DNS est forcément cassé", "Il faut poursuivre le diagnostic", "Le disque est plein"], answer: 2, explanation: "ICMP peut être filtré ; un ping échoué ne prouve pas à lui seul que le service est indisponible." },
    { q: "Quel est l'objectif principal du principe du moindre privilège ?", options: ["Donner tous les droits", "Limiter les droits au nécessaire", "Désactiver les sauvegardes", "Partager tous les comptes"], answer: 1, explanation: "Chaque compte ou service ne doit disposer que des permissions nécessaires." },
    { q: "Que doit-on faire régulièrement avec les sauvegardes ?", options: ["Les ignorer", "Tester la restauration", "Les rendre publiques", "Supprimer toutes les copies"], answer: 1, explanation: "Les tests confirment que les données peuvent réellement être restaurées." },
    { q: "À quoi sert un VLAN ?", options: ["À segmenter logiquement un réseau", "À remplacer les disques", "À chiffrer les fichiers", "À attribuer les comptes AD"], answer: 0, explanation: "Un VLAN crée un segment logique de niveau 2." },
    { q: "Quelle commande examine les journaux d'un service systemd ?", options: ["journalctl -u", "cd -u", "ip -u", "ls -u"], answer: 0, explanation: "journalctl -u nom.service filtre les journaux d'un service." },
    { q: "Un snapshot remplace-t-il une sauvegarde indépendante ?", options: ["Oui toujours", "Non", "Seulement sous Linux", "Seulement avec DHCP"], answer: 1, explanation: "Un snapshot peut être utile pour revenir en arrière mais ne remplace pas une sauvegarde indépendante." }
  ],

  glossary: [
    ["AD DS", "Service Windows qui centralise les identités et objets d'un domaine."],
    ["DHCP", "Protocole d'attribution automatique de paramètres réseau."],
    ["DNS", "Système de résolution de noms et de localisation de services."],
    ["GPO", "Stratégie de groupe permettant de configurer utilisateurs et ordinateurs Windows."],
    ["Hyperviseur", "Logiciel ou couche permettant d'exécuter des machines virtuelles."],
    ["IPv4", "Protocole d'adressage IP sur 32 bits."],
    ["Pare-feu", "Mécanisme qui autorise ou bloque des flux selon des règles."],
    ["RPO", "Perte de données maximale acceptable, exprimée en temps."],
    ["RTO", "Durée cible pour rétablir un service après interruption."],
    ["VLAN", "Segmentation logique d'un réseau de niveau 2."],
    ["VPN", "Tunnel logique permettant de transporter du trafic de manière protégée selon sa configuration."],
    ["Conteneur", "Environnement isolé exécutant un processus à partir d'une image."],
    ["Supervision", "Suivi de l'état et des performances des systèmes et services."],
    ["Moindre privilège", "Attribution du minimum de droits nécessaire à une tâche."]
  ]
};
