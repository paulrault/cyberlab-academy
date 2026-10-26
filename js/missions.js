
(() => {
  "use strict";

  const missions = [
    {
      id: "ip",
      icon: "⌘",
      title: "Diagnostic IP",
      level: "Débutant",
      description: "Un poste possède l'adresse 192.168.10.25/24 et une passerelle 192.168.20.1. Explique le problème.",
      keywords: ["sous-réseau", "masque", "passerelle"],
      correction: "Avec un masque /24, le poste appartient au réseau 192.168.10.0/24. La passerelle 192.168.20.1 est dans un autre sous-réseau. Il faut vérifier le plan d'adressage et corriger la passerelle ou la configuration réseau."
    },
    {
      id: "dns",
      icon: "⌕",
      title: "Résolution DNS",
      level: "Débutant",
      description: "Un utilisateur accède à un serveur par son adresse IP mais pas par son nom. Cite deux vérifications utiles.",
      keywords: ["dns", "résolution", "serveur"],
      correction: "Vérifier le serveur DNS configuré sur le client, tester la résolution du nom avec nslookup, contrôler l'enregistrement DNS et vérifier que le nom recherché est correct."
    },
    {
      id: "ad",
      icon: "▤",
      title: "Active Directory",
      level: "Intermédiaire",
      description: "Un nouveau technicien doit accéder aux ressources réservées à son équipe. Comment organiser ses droits ?",
      keywords: ["groupe", "moindre privilège", "permissions"],
      correction: "Créer ou utiliser un groupe de sécurité adapté, ajouter le compte à ce groupe et attribuer les permissions nécessaires au groupe. Appliquer le principe du moindre privilège et tester l'accès."
    },
    {
      id: "linux",
      icon: "⌨",
      title: "Serveur Debian",
      level: "Intermédiaire",
      description: "Un service Linux ne répond plus. Donne une démarche de diagnostic et une commande pertinente.",
      keywords: ["systemctl", "journalctl", "logs"],
      correction: "Identifier le service, vérifier son état avec systemctl status nom-du-service, consulter ses journaux avec journalctl -u nom-du-service, puis examiner les erreurs avant de modifier la configuration."
    },
    {
      id: "docker",
      icon: "▣",
      title: "Conteneur Docker",
      level: "Intermédiaire",
      description: "Une application dans un conteneur n'est pas accessible depuis le navigateur. Quelles vérifications effectuer ?",
      keywords: ["port", "logs", "conteneur"],
      correction: "Vérifier l'état du conteneur avec docker ps, lire les journaux avec docker logs nom-du-conteneur et contrôler le mappage des ports ainsi que le service qui écoute dans le conteneur."
    },
    {
      id: "backup",
      icon: "◈",
      title: "Sauvegarde",
      level: "Avancé",
      description: "Une sauvegarde vient de se terminer. Pourquoi faut-il vérifier sa restauration ?",
      keywords: ["restauration", "intégrité", "test"],
      correction: "Une sauvegarde réussie ne garantit pas que les données seront récupérables. Il faut tester régulièrement la restauration, contrôler l'intégrité et documenter la procédure."
    }
  ];

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function render() {
    const container = document.getElementById("missionsGrid");
    if (!container) return;

    const state = window.CyberStorage.getState();
    container.replaceChildren();

    missions.forEach(mission => {
      const done = state.completedMissions.includes(mission.id);
      const card = document.createElement("article");
      card.className = "mission-card";

      const title = document.createElement("h3");
      title.textContent = mission.icon + "  " + mission.title;

      const level = document.createElement("span");
      level.className = "status-pill";
      level.textContent = mission.level;

      const description = document.createElement("p");
      description.textContent = mission.description;

      const meta = document.createElement("div");
      meta.className = "card-meta";
      meta.textContent = done ? "✓ Mission terminée" : "Récompense : 50 XP";

      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "Voir l'énoncé et la correction";
      details.appendChild(summary);

      const answer = document.createElement("textarea");
      answer.setAttribute("aria-label", "Réponse à la mission " + mission.title);
      answer.placeholder = "Écris ta proposition avant de consulter la correction...";
      details.appendChild(answer);

      const correction = document.createElement("p");
      correction.hidden = true;
      correction.textContent = mission.correction;
      details.appendChild(correction);

      const controls = document.createElement("div");
      controls.className = "mission-controls";

      const check = document.createElement("button");
      check.className = "primary-button";
      check.textContent = done ? "Déjà validée" : "Valider ma réponse";
      check.disabled = done;

      const reveal = document.createElement("button");
      reveal.className = "secondary-button";
      reveal.textContent = "Afficher la correction";

      check.addEventListener("click", () => {
        const text = answer.value.trim().toLocaleLowerCase("fr");
        if (text.length < 15) {
          window.CyberApp.notify("Développe un peu ta réponse avant de la valider.");
          return;
        }

        const matches = mission.keywords.filter(word =>
          text.includes(word.toLocaleLowerCase("fr"))
        );

        if (matches.length < 2) {
          window.CyberApp.notify("Ajoute au moins deux notions clés à ta réponse, puis réessaie.");
          return;
        }

        const added = window.CyberStorage.completeMission(mission.id);
        if (added) {
          window.CyberApp.notify("Mission validée ! +50 XP.");
          render();
          window.CyberApp.refreshDashboard();
        }
      });

      reveal.addEventListener("click", () => {
        correction.hidden = !correction.hidden;
        reveal.textContent = correction.hidden ? "Afficher la correction" : "Masquer la correction";
      });

      controls.append(check, reveal);
      details.appendChild(controls);
      card.append(title, level, description, meta, details);
      container.appendChild(card);
    });
  }

  window.CyberMissions = { render, list: () => missions };

  document.addEventListener("DOMContentLoaded", render);
})();
