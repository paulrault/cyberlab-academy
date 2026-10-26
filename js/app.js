
(() => {
  "use strict";

  const titles = {
    dashboard: "Tableau de bord",
    courses: "Parcours SISR",
    lab: "Laboratoire réseau",
    missions: "Missions pratiques",
    supervision: "Supervision",
    quiz: "Quiz & examens"
  };

  const courses = [
    { id: "windows", icon: "▤", title: "Windows Server", desc: "Active Directory, DNS, DHCP, GPO et partages réseau.", lessons: 8 },
    { id: "network", icon: "⌘", title: "Réseaux", desc: "IPv4, sous-réseaux, VLAN, routage et dépannage.", lessons: 10 },
    { id: "linux", icon: "⌨", title: "Linux & Debian", desc: "Commandes, utilisateurs, services et permissions.", lessons: 8 },
    { id: "security", icon: "◈", title: "Cybersécurité défensive", desc: "Journaux, mises à jour, droits et bonnes pratiques.", lessons: 8 },
    { id: "docker", icon: "▣", title: "Docker", desc: "Images, conteneurs, volumes, ports et journaux.", lessons: 7 },
    { id: "virtual", icon: "▦", title: "Virtualisation", desc: "Machines virtuelles, réseaux virtuels et snapshots.", lessons: 7 }
  ];

  const questions = [
    {
      q: "Quel service traduit un nom de domaine en adresse IP ?",
      answers: ["DHCP", "DNS", "SSH", "NTP"],
      correct: 1,
      explanation: "DNS assure la résolution des noms en adresses IP."
    },
    {
      q: "Quel service distribue automatiquement des paramètres IP ?",
      answers: ["DHCP", "HTTP", "SMTP", "FTP"],
      correct: 0,
      explanation: "DHCP distribue notamment les adresses IP et la passerelle."
    },
    {
      q: "Quelle commande affiche l'état d'un service systemd ?",
      answers: ["systemctl status", "mkdir status", "ip route add", "chmod status"],
      correct: 0,
      explanation: "systemctl status nom-du-service affiche son état et des informations utiles."
    },
    {
      q: "Quel principe consiste à accorder uniquement les droits nécessaires ?",
      answers: ["Accès public", "Moindre privilège", "Compte partagé", "Désactivation des journaux"],
      correct: 1,
      explanation: "Le moindre privilège limite les droits à ce qui est nécessaire."
    },
    {
      q: "Quelle commande permet de consulter les journaux d'un conteneur Docker ?",
      answers: ["docker logs", "docker erase", "docker format", "docker password"],
      correct: 0,
      explanation: "docker logs nom-du-conteneur affiche ses journaux."
    },
    {
      q: "Quel équipement permet d'interconnecter des réseaux IP différents ?",
      answers: ["Un clavier", "Un routeur", "Un écran", "Un câble seul"],
      correct: 1,
      explanation: "Un routeur transfère des paquets entre différents réseaux IP."
    },
    {
      q: "Pourquoi tester la restauration d'une sauvegarde ?",
      answers: [
        "Pour supprimer les journaux",
        "Pour vérifier que les données sont récupérables",
        "Pour désactiver les comptes",
        "Pour changer l'adresse IP"
      ],
      correct: 1,
      explanation: "Le test confirme que la sauvegarde est réellement exploitable."
    }
  ];

  let quiz = [];
  let questionIndex = 0;
  let score = 0;
  let answered = false;

  function notify(message) {
    const notice = document.getElementById("notice");
    if (!notice) return;
    notice.textContent = message;
    notice.hidden = false;
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => { notice.hidden = true; }, 3500);
  }

  function goTo(page) {
    if (!titles[page]) return;

    document.querySelectorAll(".page").forEach(section => {
      section.classList.toggle("active", section.id === "page-" + page);
    });

    document.querySelectorAll(".nav-item").forEach(button => {
      button.classList.toggle("active", button.dataset.page === page);
    });

    document.getElementById("pageTitle").textContent = titles[page];

    if (page === "dashboard") refreshDashboard();
    if (page === "courses") renderCourses();
    if (page === "missions") window.CyberMissions.render();
    if (page === "supervision") {
      window.CyberSupervision.renderDevices();
      window.CyberSupervision.renderLogs();
    }
    if (page === "quiz") renderHistory();

    if (location.hash !== "#" + page) {
      history.replaceState(null, "", "#" + page);
    }
  }

  function renderCourses() {
    const container = document.getElementById("coursesGrid");
    if (!container) return;
    container.replaceChildren();

    courses.forEach(course => {
      const card = document.createElement("article");
      card.className = "course-card";

      const icon = document.createElement("div");
      icon.className = "card-symbol";
      icon.textContent = course.icon;

      const title = document.createElement("h3");
      title.textContent = course.title;

      const desc = document.createElement("p");
      desc.textContent = course.desc;

      const meta = document.createElement("div");
      meta.className = "card-meta";
      meta.textContent = course.lessons + " notions à étudier • Parcours pédagogique";

      const actions = document.createElement("div");
      actions.className = "card-actions";

      const button = document.createElement("button");
      button.className = "primary-button";
      button.textContent = "Voir les notions →";
      button.addEventListener("click", () => showCourse(course));

      actions.appendChild(button);
      card.append(icon, title, desc, meta, actions);
      container.appendChild(card);
    });
  }

  function showCourse(course) {
    const container = document.getElementById("coursesGrid");
    container.replaceChildren();

    const back = document.createElement("button");
    back.className = "secondary-button";
    back.textContent = "← Retour aux parcours";
    back.addEventListener("click", renderCourses);

    const panel = document.createElement("article");
    panel.className = "panel";
    const title = document.createElement("h2");
    title.textContent = course.title;

    const desc = document.createElement("p");
    desc.textContent = course.desc;

    const intro = document.createElement("p");
    intro.textContent = "Lis chaque notion, puis marque-la comme étudiée. Ces fiches sont des points de départ pour tes travaux pratiques.";

    const topics = {
      windows: [
        ["Active Directory", "Un annuaire centralise les identités, ordinateurs et groupes d'un domaine."],
        ["DNS", "Le DNS permet notamment de localiser les services du domaine."],
        ["DHCP", "DHCP attribue automatiquement des paramètres IP aux clients."],
        ["GPO", "Les stratégies de groupe permettent de gérer certains paramètres des utilisateurs et ordinateurs."],
        ["Partages réseau", "Les autorisations de partage et les permissions NTFS doivent être examinées ensemble."]
      ],
      network: [
        ["IPv4", "Une adresse IPv4 identifie une interface dans un réseau."],
        ["Masque et préfixe", "Le masque indique quelle partie de l'adresse correspond au réseau."],
        ["Passerelle", "La passerelle permet d'acheminer le trafic vers d'autres réseaux."],
        ["VLAN", "Un VLAN sépare logiquement des domaines de niveau 2."],
        ["Diagnostic", "Procède par étapes : lien, IP, passerelle, DNS et service distant."]
      ],
      linux: [
        ["Fichiers", "pwd, ls et cd permettent de se repérer dans l'arborescence."],
        ["Permissions", "Les droits propriétaire, groupe et autres contrôlent l'accès."],
        ["Services", "systemctl permet de contrôler les services systemd."],
        ["Journaux", "journalctl aide à examiner les événements et erreurs."],
        ["Réseau", "ip address et ip route affichent les interfaces et routes."]
      ],
      security: [
        ["Moindre privilège", "Accorde seulement les droits indispensables."],
        ["Mises à jour", "Maintiens les systèmes et applications à jour."],
        ["Authentification", "Utilise des mots de passe uniques et l'authentification multifacteur quand possible."],
        ["Journaux", "Les journaux permettent de repérer des événements inhabituels."],
        ["Sauvegardes", "Protège les sauvegardes et vérifie leur restauration."]
      ],
      docker: [
        ["Image", "Une image est le modèle utilisé pour créer un conteneur."],
        ["Conteneur", "Un conteneur exécute une application dans un environnement isolé."],
        ["Ports", "Le mappage de ports expose un service vers l'hôte."],
        ["Volumes", "Les volumes conservent des données indépendamment du cycle de vie du conteneur."],
        ["Journaux", "docker logs aide à diagnostiquer le démarrage et l'exécution."]
      ],
      virtual: [
        ["Hyperviseur", "Il permet d'exécuter plusieurs machines virtuelles sur un hôte."],
        ["Ressources", "CPU, mémoire et stockage doivent être dimensionnés."],
        ["Réseaux virtuels", "Ils relient les VM entre elles ou au réseau physique."],
        ["Instantanés", "Un instantané facilite certains retours en arrière, mais ne remplace pas une sauvegarde."],
        ["Tests", "Teste l'accès, la connectivité et les services après un changement."]
      ]
    };

    const list = document.createElement("div");
    list.className = "course-progress";
    const saved = JSON.parse(localStorage.getItem("cyberlab-lessons-v3") || "{}");

    (topics[course.id] || []).forEach((topic, index) => {
      const row = document.createElement("div");
      const label = document.createElement("label");
      label.className = "task-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.width = "auto";
      checkbox.checked = Boolean(saved[course.id + "-" + index]);

      const text = document.createElement("span");
      text.style.flex = "1";
      const strong = document.createElement("strong");
      strong.textContent = topic[0];
      const small = document.createElement("small");
      small.textContent = topic[1];
      text.append(strong, small);
      label.append(checkbox, text);
      row.appendChild(label);
      list.appendChild(row);

      checkbox.addEventListener("change", () => {
        saved[course.id + "-" + index] = checkbox.checked;
        localStorage.setItem("cyberlab-lessons-v3", JSON.stringify(saved));
        updateCourseProgress();
      });
    });

    panel.append(title, desc, intro, list);
    container.append(back, panel);
  }

  function updateCourseProgress() {
    const saved = JSON.parse(localStorage.getItem("cyberlab-lessons-v3") || "{}");
    const values = Object.values(saved);
    const total = values.length ? Math.round(values.filter(Boolean).length / 30 * 100) : 0;
    const el = document.getElementById("progressStat");
    if (el) el.textContent = Math.min(100, total) + "%";
  }

  function refreshDashboard() {
    const state = window.CyberStorage.getState();
    document.getElementById("xpStat").textContent = state.xp;
    document.getElementById("missionStat").textContent = state.completedMissions.length;
    document.getElementById("quizStat").textContent = state.quizHistory.length;

    const lessonData = JSON.parse(localStorage.getItem("cyberlab-lessons-v3") || "{}");
    const completed = Object.values(lessonData).filter(Boolean).length;
    const missionsDone = state.completedMissions.length;
    const quizDone = Math.min(state.quizHistory.length, 5);
    const percent = Math.round((completed / 30 * 70) + (missionsDone / 6 * 20) + (quizDone / 5 * 10));
    document.getElementById("progressStat").textContent = Math.min(100, percent) + "%";

    const container = document.getElementById("courseProgress");
    container.replaceChildren();

    const progress = [
      ["Notions étudiées", completed, 30],
      ["Missions terminées", missionsDone, 6],
      ["Quiz réalisés", quizDone, 5]
    ];

    progress.forEach(([name, done, total]) => {
      const item = document.createElement("div");
      const heading = document.createElement("div");
      heading.className = "progress-heading";
      const left = document.createElement("span");
      left.textContent = name;
      const right = document.createElement("span");
      right.textContent = done + " / " + total;
      heading.append(left, right);

      const track = document.createElement("div");
      track.className = "progress-track";
      const fill = document.createElement("div");
      fill.className = "progress-fill";
      fill.style.width = Math.min(100, done / total * 100) + "%";
      track.appendChild(fill);
      item.append(heading, track);
      container.appendChild(item);
    });
  }

  function startQuiz() {
    quiz = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    questionIndex = 0;
    score = 0;
    answered = false;
    document.getElementById("quizFeedback").hidden = true;
    showQuestion();
  }

  function showQuestion() {
    const area = document.getElementById("quizArea");
    const question = quiz[questionIndex];
    answered = false;
    document.getElementById("quizCounter").textContent =
      "Question " + (questionIndex + 1) + " / " + quiz.length;

    area.replaceChildren();

    const progress = document.createElement("p");
    progress.className = "quiz-progress";
    progress.textContent = "Question " + (questionIndex + 1) + " sur " + quiz.length;

    const title = document.createElement("p");
    title.className = "quiz-question";
    title.textContent = question.q;

    const options = document.createElement("div");
    question.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.textContent = answer;
      button.addEventListener("click", () => answerQuestion(index, options));
      options.appendChild(button);
    });

    area.append(progress, title, options);
  }

  function answerQuestion(index, options) {
    if (answered) return;
    answered = true;

    const question = quiz[questionIndex];
    if (index === question.correct) score++;

    [...options.children].forEach((button, i) => {
      button.disabled = true;
      if (i === question.correct) button.classList.add("correct");
      if (i === index && i !== question.correct) button.classList.add("incorrect");
    });

    const feedback = document.getElementById("quizFeedback");
    feedback.hidden = false;
    feedback.className = "result-box " + (index === question.correct ? "success" : "error");
    feedback.textContent = (index === question.correct ? "Bonne réponse. " : "Pas tout à fait. ") + question.explanation;

    const next = document.createElement("button");
    next.className = "primary-button";
    next.style.marginTop = "12px";
    next.textContent = questionIndex === quiz.length - 1 ? "Voir le résultat" : "Question suivante";
    next.addEventListener("click", () => {
      if (questionIndex < quiz.length - 1) {
        questionIndex++;
        feedback.hidden = true;
        showQuestion();
      } else {
        finishQuiz();
      }
    });
    feedback.appendChild(document.createElement("br"));
    feedback.appendChild(next);
  }

  function finishQuiz() {
    window.CyberStorage.addQuizResult(score, quiz.length);
    const area = document.getElementById("quizArea");
    area.replaceChildren();

    const title = document.createElement("h3");
    title.textContent = "Résultat : " + score + " / " + quiz.length;

    const desc = document.createElement("p");
    desc.textContent = "Score : " + Math.round(score / quiz.length * 100) + "%. Continue à réviser les notions où tu hésites.";

    const restart = document.createElement("button");
    restart.className = "primary-button";
    restart.textContent = "Recommencer un quiz";
    restart.addEventListener("click", startQuiz);

    area.append(title, desc, restart);
    document.getElementById("quizCounter").textContent = "Terminé";
    document.getElementById("quizFeedback").hidden = true;
    refreshDashboard();
    renderHistory();
  }

  function renderHistory() {
    const container = document.getElementById("quizHistory");
    if (!container) return;
    container.replaceChildren();

    const historyItems = window.CyberStorage.getState().quizHistory;
    if (!historyItems.length) {
      const empty = document.createElement("p");
      empty.className = "card-meta";
      empty.textContent = "Aucun quiz effectué pour le moment.";
      container.appendChild(empty);
      return;
    }

    historyItems.forEach(item => {
      const row = document.createElement("div");
      row.className = "history-row";
      const date = document.createElement("span");
      date.textContent = item.date;
      const result = document.createElement("strong");
      result.textContent = item.score + " / " + item.total;
      row.append(date, result);
      container.appendChild(row);
    });
  }

  function exportBackup() {
    const blob = new Blob([window.CyberStorage.exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cyberlab-academy-v3-backup.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Export lancé. Conserve le fichier de sauvegarde en lieu sûr.");
  }

  function importBackup(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        window.CyberStorage.importData(String(reader.result));
        applyTheme();
        refreshDashboard();
        renderHistory();
        window.CyberMissions.render();
        notify("Sauvegarde importée.");
      } catch (error) {
        notify(error.message || "Import impossible.");
      }
    };
    reader.onerror = () => notify("Impossible de lire ce fichier.");
    reader.readAsText(file);
  }

  function applyTheme() {
    const light = window.CyberStorage.getState().theme === "light";
    document.body.classList.toggle("light-theme", light);
    document.getElementById("themeToggle").textContent =
      light ? "☾ Activer le thème sombre" : "☼ Activer le thème clair";
  }

  function init() {
    document.querySelectorAll("[data-page]").forEach(button => {
      button.addEventListener("click", () => goTo(button.dataset.page));
    });

    document.querySelectorAll("[data-go]").forEach(button => {
      button.addEventListener("click", () => goTo(button.dataset.go));
    });

    document.getElementById("themeToggle").addEventListener("click", () => {
      const next = document.body.classList.contains("light-theme") ? "dark" : "light";
      window.CyberStorage.setTheme(next);
      applyTheme();
    });

    document.getElementById("exportButton").addEventListener("click", exportBackup);
    document.getElementById("startQuiz").addEventListener("click", startQuiz);

    const importInput = document.createElement("input");
    importInput.type = "file";
    importInput.accept = ".json,application/json";
    importInput.hidden = true;
    importInput.addEventListener("change", () => {
      if (importInput.files && importInput.files[0]) importBackup(importInput.files[0]);
      importInput.value = "";
    });
    document.getElementById("exportButton").insertAdjacentElement("afterend", importInput);

    const importButton = document.createElement("button");
    importButton.className = "secondary-button";
    importButton.textContent = "Importer";
    importButton.addEventListener("click", () => importInput.click());
    document.getElementById("exportButton").insertAdjacentElement("afterend", importButton);

    applyTheme();
    renderCourses();
    refreshDashboard();
    renderHistory();

    const requested = location.hash.replace("#", "");
    goTo(titles[requested] ? requested : "dashboard");
  }

  window.CyberApp = { notify, goTo, refreshDashboard };

  document.addEventListener("DOMContentLoaded", init);
})();
