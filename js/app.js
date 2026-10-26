
"use strict";

window.CyberApp = (() => {
  const root = document.getElementById("pageContent");
  const title = document.getElementById("pageTitle");
  const toast = document.getElementById("toast");

  const pageNames = {
    dashboard: "Tableau de bord",
    courses: "Centre de formation",
    lab: "Laboratoire réseau",
    missions: "Missions pratiques",
    quiz: "Quiz & examens",
    supervision: "Supervision",
    glossary: "Glossaire",
    journal: "Journal de révision",
    settings: "Paramètres"
  };

  let activePage = "dashboard";
  let activeCourse = null;
  let activeLesson = null;
  let toastTimer = null;

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function notify(message) {
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
  }

  function refreshSidebar() {
    const state = CyberStorage.get();
    const level = CyberStorage.level();
    const progress = CyberStorage.levelProgress();

    document.getElementById("sidebarLevel").textContent = `Niveau ${level}`;
    document.getElementById("sidebarProgress").style.width = `${progress / 250 * 100}%`;
    document.getElementById("sidebarXp").textContent = `${state.xp} XP accumulés`;
  }

  function setTheme(theme) {
    document.body.classList.toggle("light", theme === "light");
    CyberStorage.setTheme(theme);
    document.getElementById("themeButton").textContent = theme === "light" ? "☾" : "☼";
  }

  function stat(icon, label, value, note) {
    return `<article class="card stat-card">
      <div class="stat-icon">${icon}</div>
      <div><span class="stat-label">${label}</span>
      <strong class="stat-value">${value}</strong>
      <span class="stat-note">${note}</span></div>
    </article>`;
  }

  function sectionHeading(heading, description) {
    return `<div class="section-heading"><div><h2>${heading}</h2><p>${description}</p></div></div>`;
  }

  function renderDashboard() {
    const state = CyberStorage.get();
    const totalLessons = CyberData.courses.reduce((sum, course) => sum + course.lessons.length, 0);
    const doneLessons = state.completedLessons.length;
    const doneMissions = state.completedMissions.length;
    const totalMissions = CyberData.missions.length;
    const percent = totalLessons ? Math.round(doneLessons / totalLessons * 100) : 0;
    const recent = state.journal.slice(0, 5);

    root.innerHTML = `
      <section class="grid grid-4">
        ${stat("⚡", "Expérience", `${state.xp} XP`, "Points gagnés")}
        ${stat("🏅", "Niveau", CyberStorage.level(), `${CyberStorage.levelProgress()}/250 XP vers le niveau suivant`)}
        ${stat("📚", "Cours terminés", `${doneLessons}/${totalLessons}`, "Leçons validées")}
        ${stat("⚑", "Missions terminées", `${doneMissions}/${totalMissions}`, "Défis pratiques")}
      </section>

      <section class="section">
        ${sectionHeading("Progression générale", "Suis tes apprentissages et choisis ta prochaine activité.")}
        <div class="card">
          <div class="module-top"><strong>Parcours de formation</strong><strong>${percent} %</strong></div>
          <div class="progress-track"><span style="width:${percent}%"></span></div>
          <p>Tu as terminé ${doneLessons} leçon(s) sur ${totalLessons}.</p>
          <div class="button-row"><button class="button primary" data-page="courses">Continuer les cours</button><button class="button" data-page="missions">Explorer les missions</button></div>
        </div>
      </section>

      <section class="section">
        ${sectionHeading("Tes domaines SISR", "Choisis un parcours pour consulter les leçons.")}
        <div class="grid grid-3">
          ${CyberData.courses.slice(0, 6).map(course => `
            <article class="card module-card">
              <div class="module-top"><span class="module-icon">${course.icon}</span><span class="tag">${course.category}</span></div>
              <h3>${course.title}</h3><p>${course.description}</p>
              <span class="muted small-text">${course.lessons.length} leçon(s) · ${course.level}</span>
              <div class="button-row"><button class="button" data-action="open-course" data-id="${course.id}">Découvrir</button></div>
            </article>`).join("")}
        </div>
      </section>

      <section class="section">
        ${sectionHeading("Activité récente", "Les dernières actions enregistrées sur cet appareil.")}
        <div class="card">
          ${recent.length ? `<ul class="list">${recent.map(item => `
            <li class="list-item"><strong>${escapeHTML(item.type)}</strong>
            <span>${escapeHTML(item.description)}</span><div class="muted small-text">${new Date(item.date).toLocaleString("fr-FR")}</div></li>`).join("")}</ul>` : `<div class="empty">Aucune activité pour le moment. Termine une leçon ou une mission pour commencer ton suivi.</div>`}
        </div>
      </section>`;
  }

  function renderCourses() {
    const state = CyberStorage.get();
    root.innerHTML = `
      ${sectionHeading("Centre de formation", "Des cours courts avec objectifs et exercices pratiques.")}
      <div class="field"><label for="courseSearch">Rechercher un cours ou un domaine</label><input id="courseSearch" class="search-input" placeholder="Ex. DNS, Docker, sauvegarde..."></div>
      <div class="grid grid-3" id="courseCards">
        ${CyberData.courses.map(course => {
          const done = course.lessons.filter(lesson => state.completedLessons.includes(lesson.id)).length;
          return `<article class="card module-card" data-search="${escapeHTML((course.title + " " + course.description + " " + course.category).toLowerCase())}">
            <div class="module-top"><span class="module-icon">${course.icon}</span><span class="tag">${course.category}</span></div>
            <h3>${course.title}</h3><p>${course.description}</p>
            <div class="progress-track"><span style="width:${done / course.lessons.length * 100}%"></span></div>
            <span class="muted small-text">${done}/${course.lessons.length} leçon(s) terminée(s)</span>
            <button class="button primary" data-action="open-course" data-id="${course.id}">Ouvrir le parcours</button>
          </article>`;
        }).join("")}
      </div>`;

    document.getElementById("courseSearch").addEventListener("input", event => {
      const query = event.target.value.toLowerCase().trim();
      document.querySelectorAll("#courseCards [data-search]").forEach(card => {
        card.hidden = !card.dataset.search.includes(query);
      });
    });
  }

  function renderCourse(courseId) {
    const course = CyberData.courses.find(item => item.id === courseId);
    if (!course) return renderCourses();

    activeCourse = course.id;
    const state = CyberStorage.get();

    root.innerHTML = `
      <div class="section-heading"><div><h2>${course.icon} ${course.title}</h2><p>${course.description}</p></div><button class="button" data-page="courses">← Tous les cours</button></div>
      <div class="grid grid-2">
        <div class="card">
          <h3>Leçons du parcours</h3>
          <ul class="list">${course.lessons.map(lesson => `
            <li class="list-item">
              <strong>${state.completedLessons.includes(lesson.id) ? "✓ " : ""}${lesson.title}</strong>
              <span class="muted small-text">${lesson.duration}</span>
              <div class="button-row"><button class="button" data-action="open-lesson" data-course="${course.id}" data-id="${lesson.id}">Lire la leçon</button></div>
            </li>`).join("")}</ul>
        </div>
        <div class="card"><h3>Objectif du parcours</h3>
          <p>Comprendre les notions essentielles puis les appliquer dans un environnement de laboratoire contrôlé.</p>
          <div class="notice">Note tes commandes, paramètres et résultats dans le journal de révision.</div>
        </div>
      </div>
      <div id="lessonContent" class="section"></div>`;
  }

  function renderLesson(courseId, lessonId) {
    const course = CyberData.courses.find(item => item.id === courseId);
    const lesson = course && course.lessons.find(item => item.id === lessonId);
    if (!course || !lesson) return;

    activeCourse = courseId;
    activeLesson = lessonId;

    const state = CyberStorage.get();
    const done = state.completedLessons.includes(lesson.id);
    document.getElementById("lessonContent").innerHTML = `
      <article class="card">
        <span class="tag">${course.title} · ${lesson.duration}</span>
        <h2>${lesson.title}</h2>
        ${lesson.content.map(paragraph => `<p>${paragraph}</p>`).join("")}
        <hr>
        <h3>Exercice pratique</h3><p>${lesson.task}</p>
        <div class="field"><label for="lessonNotes">Mes notes personnelles (facultatif)</label><textarea id="lessonNotes" placeholder="Note tes observations ici..."></textarea></div>
        <div class="button-row">
          <button class="button primary" data-action="complete-lesson" data-id="${lesson.id}" data-title="${escapeHTML(lesson.title)}" ${done ? "disabled" : ""}>${done ? "Leçon terminée ✓" : "Marquer comme terminée (+25 XP)"}</button>
          <button class="button" data-action="save-lesson-note" data-title="${escapeHTML(lesson.title)}">Ajouter les notes au journal</button>
        </div>
      </article>`;
  }

  function renderLab() {
    root.innerHTML = `
      ${sectionHeading("Laboratoire réseau", "Entraîne-toi à calculer un sous-réseau et à interpréter des commandes simulées.")}
      <div class="grid grid-2">
        <section class="card">
          <h3>Calculateur IPv4 / CIDR</h3>
          <p>Entre une adresse IPv4 et un préfixe entre /0 et /32.</p>
          <form id="subnetForm">
            <div class="field"><label for="ipAddress">Adresse IPv4</label><input id="ipAddress" value="192.168.10.25" required></div>
            <div class="field"><label for="prefix">Préfixe CIDR</label><select id="prefix">${Array.from({length:33},(_,i)=>32-i).map(n=>`<option value="${n}" ${n===24?"selected":""}>/${n}</option>`).join("")}</select></div>
            <button class="button primary" type="submit">Calculer le sous-réseau</button>
          </form>
          <div id="subnetResult"></div>
        </section>
        <section class="card">
          <h3>Console réseau simulée</h3>
          <p>Commandes autorisées : help, ipconfig, ip addr, ip route, ping 192.168.10.1, clear.</p>
          <form id="consoleForm">
            <div class="field"><label for="consoleCommand">Commande</label><input id="consoleCommand" placeholder="help" autocomplete="off" required></div>
            <button class="button primary" type="submit">Exécuter la simulation</button>
          </form>
          <pre class="code-output" id="consoleOutput">CyberLab Console V4
Saisis help pour commencer.
Aucune commande système réelle n'est exécutée.</pre>
        </section>
      </div>
      <section class="section card">
        <h3>Checklist de diagnostic</h3>
        <p class="muted">Coche les étapes effectuées pendant un exercice.</p>
        ${["Vérifier le lien réseau et le VLAN","Vérifier l'adresse IP et le masque","Contrôler la passerelle par défaut","Tester la résolution DNS","Consulter les journaux et noter les résultats"].map((item,index)=>`
          <label class="option"><input type="checkbox" class="lab-check"><span>${item}</span></label>`).join("")}
        <p id="checkCount" class="muted small-text">0/5 étapes cochées</p>
      </section>`;

    document.getElementById("subnetForm").addEventListener("submit", event => {
      event.preventDefault();
      const result = document.getElementById("subnetResult");
      try {
        const net = CyberLab.calculate(document.getElementById("ipAddress").value, document.getElementById("prefix").value);
        result.innerHTML = `<div class="result">
          <h3>Résultat</h3><div class="table-wrap"><table>
          <tbody>
            <tr><td>Adresse saisie</td><td>${net.ip}/${net.prefix}</td></tr>
            <tr><td>Masque</td><td>${net.mask}</td></tr>
            <tr><td>Adresse réseau</td><td>${net.network}</td></tr>
            <tr><td>Broadcast</td><td>${net.broadcast}</td></tr>
            <tr><td>Première adresse indicative</td><td>${net.first}</td></tr>
            <tr><td>Dernière adresse indicative</td><td>${net.last}</td></tr>
            <tr><td>Adresses totales</td><td>${net.total.toLocaleString("fr-FR")}</td></tr>
            <tr><td>Hôtes utilisables (convention usuelle)</td><td>${net.usable.toLocaleString("fr-FR")}</td></tr>
          </tbody></table></div>
          <p class="muted small-text">Pour /31 et /32, les conventions d'utilisation diffèrent des sous-réseaux IPv4 classiques.</p>
        </div>`;
      } catch (error) {
        result.innerHTML = `<div class="notice bad">${escapeHTML(error.message)}</div>`;
      }
    });

    document.getElementById("consoleForm").addEventListener("submit", event => {
      event.preventDefault();
      const command = document.getElementById("consoleCommand").value;
      const output = document.getElementById("consoleOutput");
      const lines = CyberLab.simulatedCommand(command);
      output.textContent = lines.length ? lines.join("\n") : "Console effacée. Saisis help pour afficher les commandes.";
      if (command.trim().toLowerCase() === "clear") output.textContent = "Console effacée.";
    });

    document.querySelectorAll(".lab-check").forEach(check => {
      check.addEventListener("change", () => {
        const checks = [...document.querySelectorAll(".lab-check")];
        document.getElementById("checkCount").textContent =
          `${checks.filter(item => item.checked).length}/${checks.length} étapes cochées`;
      });
    });
  }

  function renderGlossary() {
    root.innerHTML = `
      ${sectionHeading("Glossaire informatique", "Recherche rapide parmi les notions clés du BTS SIO SISR.")}
      <div class="field"><label for="glossarySearch">Rechercher un terme</label><input id="glossarySearch" class="search-input" placeholder="Ex. VLAN, RTO, DNS..."></div>
      <div class="grid grid-2" id="glossaryList">
        ${CyberData.glossary.map(([term, definition]) => `
          <article class="card glossary-item" data-search="${escapeHTML((term+" "+definition).toLowerCase())}">
            <h3>${escapeHTML(term)}</h3><p>${escapeHTML(definition)}</p>
          </article>`).join("")}
      </div>`;

    document.getElementById("glossarySearch").addEventListener("input", event => {
      const query = event.target.value.toLowerCase().trim();
      document.querySelectorAll(".glossary-item").forEach(item => {
        item.hidden = !item.dataset.search.includes(query);
      });
    });
  }

  function renderJournal() {
    const state = CyberStorage.get();
    root.innerHTML = `
      ${sectionHeading("Journal de révision", "Consulte tes activités et conserve tes notes de travail.")}
      <section class="card">
        <h3>Ajouter une note</h3>
        <form id="journalForm">
          <div class="field"><label for="journalType">Type de note</label>
            <select id="journalType"><option>Révision</option><option>Incident</option><option>Commande</option><option>Objectif</option><option>Compte rendu</option></select>
          </div>
          <div class="field"><label for="journalText">Contenu</label><textarea id="journalText" required maxlength="3000" placeholder="Ce que tu as appris, une commande, un problème rencontré..."></textarea></div>
          <button class="button primary" type="submit">Enregistrer la note</button>
        </form>
      </section>
      <section class="section card">
        <div class="section-heading"><h2>Historique</h2><span class="tag">${state.journal.length} entrée(s)</span></div>
        ${state.journal.length ? `<ul class="list">${state.journal.map(item=>`
          <li class="list-item"><strong>${escapeHTML(item.type)}</strong>
          <p>${escapeHTML(item.description)}</p>
          <span class="muted small-text">${new Date(item.date).toLocaleString("fr-FR")}</span></li>`).join("")}</ul>` : `<div class="empty">Ton journal est vide. Ajoute une première note ci-dessus.</div>`}
      </section>
      <section class="section card">
        <h3>Historique des quiz</h3>
        ${state.quizHistory.length ? `<div class="table-wrap"><table><thead><tr><th>Quiz</th><th>Résultat</th><th>Date</th></tr></thead><tbody>
          ${state.quizHistory.map(item=>`<tr><td>${escapeHTML(item.title)}</td><td>${item.score}/${item.total}</td><td>${new Date(item.date).toLocaleString("fr-FR")}</td></tr>`).join("")}
        </tbody></table></div>` : `<p class="muted">Aucun quiz enregistré pour le moment.</p>`}
      </section>`;
    document.getElementById("journalForm").addEventListener("submit", event => {
      event.preventDefault();
      const type = document.getElementById("journalType").value;
      const description = document.getElementById("journalText").value.trim();
      if (!description) return;
      CyberStorage.addJournal(type, description);
      notify("Note enregistrée.");
      renderJournal();
    });
  }

  function renderSettings() {
    const state = CyberStorage.get();
    root.innerHTML = `
      ${sectionHeading("Paramètres", "Gère l'apparence et tes données locales.")}
      <div class="grid grid-2">
        <section class="card">
          <h3>Apparence</h3><p>Choisis le thème adapté à tes préférences.</p>
          <div class="button-row"><button class="button" data-action="theme-dark">Thème sombre</button><button class="button" data-action="theme-light">Thème clair</button></div>
        </section>
        <section class="card">
          <h3>Sauvegarde locale</h3>
          <p>Export JSON pour conserver une copie de ta progression ou la transférer manuellement.</p>
          <div class="button-row"><button class="button primary" data-action="export-data">Exporter les données</button>
          <button class="button" data-action="import-data">Importer une sauvegarde</button></div>
          <input type="file" id="importFile" accept=".json,application/json" hidden>
          <p class="muted small-text">N'importe que des sauvegardes que tu connais et dont tu as confiance. L'import remplace la progression actuelle.</p>
        </section>
        <section class="card">
          <h3>Statistiques détaillées</h3>
          <ul class="list">
            <li class="list-item">XP total : <strong>${state.xp}</strong></li>
            <li class="list-item">Niveau : <strong>${CyberStorage.level()}</strong></li>
            <li class="list-item">Cours terminés : <strong>${state.completedLessons.length}</strong></li>
            <li class="list-item">Missions terminées : <strong>${state.completedMissions.length}</strong></li>
            <li class="list-item">Quiz réalisés : <strong>${state.quizHistory.length}</strong></li>
          </ul>
        </section>
        <section class="card">
          <h3>Réinitialiser la progression</h3>
          <p>Cette action efface la progression enregistrée dans ce navigateur.</p>
          <button class="button danger" data-action="reset-data">Réinitialiser mes données</button>
        </section>
      </div>`;
  }

  function renderPage(page) {
    activePage = pageNames[page] ? page : "dashboard";
    title.textContent = pageNames[activePage];
    document.querySelectorAll("[data-page].nav-link").forEach(button => {
      button.classList.toggle("active", button.dataset.page === activePage);
    });

    if (activePage === "dashboard") renderDashboard();
    else if (activePage === "courses") renderCourses();
    else if (activePage === "lab") renderLab();
    else if (activePage === "missions") {
      root.innerHTML = `${sectionHeading("Missions pratiques", "Résous des incidents fictifs et valide tes compétences.")}<div class="grid grid-2">${CyberMissions.renderMissions(CyberStorage.get())}</div>`;
    } else if (activePage === "quiz") {
      root.innerHTML = `${sectionHeading("Quiz et examens blancs", "Teste tes connaissances et consulte tes résultats.")}${CyberMissions.renderQuiz()}`;
    } else if (activePage === "supervision") {
      root.innerHTML = `${sectionHeading("Supervision pédagogique", "Analyse des métriques et incidents simulés.")}${CyberSupervision.render()}`;
    } else if (activePage === "glossary") renderGlossary();
    else if (activePage === "journal") renderJournal();
    else if (activePage === "settings") renderSettings();

    refreshSidebar();
  }

  function navigate(page) {
    renderPage(page);
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("content").focus({ preventScroll: true });
  }

  document.addEventListener("click", event => {
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) {
      event.preventDefault();
      navigate(pageButton.dataset.page);
      return;
    }

    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === "open-course") {
      renderCourse(id);
    } else if (action === "open-lesson") {
      const courseId = button.dataset.course;
      const lessonId = button.dataset.id;
      renderLesson(courseId, lessonId);
    } else if (action === "complete-lesson") {
      const done = CyberStorage.completeLesson(id, button.dataset.title);
      if (done) {
        notify("Leçon validée : +25 XP.");
        renderCourse(activeCourse);
        renderLesson(activeCourse, id);
        refreshSidebar();
      } else notify("Cette leçon est déjà terminée.");
    } else if (action === "save-lesson-note") {
      const field = document.getElementById("lessonNotes");
      const note = field && field.value.trim();
      if (!note) return notify("Ajoute une note avant de l'enregistrer.");
      CyberStorage.addJournal("Cours", `${button.dataset.title} : ${note}`);
      notify("Notes ajoutées au journal.");
    } else if (action === "hint" || action === "correction") {
      CyberMissions.showDetail(id, action);
    } else if (action === "complete-mission") {
      const mission = CyberData.missions.find(item => item.id === id);
      if (!mission) return;
      if (CyberStorage.completeMission(id, mission.title, mission.xp)) {
        notify(`Mission validée : +${mission.xp} XP.`);
        renderPage("missions");
      } else notify("Cette mission est déjà terminée.");
    } else if (action === "start-quiz") {
      CyberMissions.startQuiz();
    } else if (action === "inspect-server") {
      CyberSupervision.inspect(id);
    } else if (action === "save-incident") {
      const field = document.getElementById("incidentNote");
      if (!field || !field.value.trim()) return notify("Écris ton diagnostic avant de l'enregistrer.");
      CyberStorage.addJournal("Diagnostic de supervision", field.value.trim());
      field.value = "";
      notify("Diagnostic enregistré dans le journal.");
    } else if (action === "theme-dark") {
      setTheme("dark"); notify("Thème sombre activé.");
    } else if (action === "theme-light") {
      setTheme("light"); notify("Thème clair activé.");
    } else if (action === "export-data") {
      CyberStorage.exportJSON(); notify("Export demandé par le navigateur.");
    } else if (action === "import-data") {
      document.getElementById("importFile").click();
    } else if (action === "reset-data") {
      if (confirm("Effacer la progression et les notes enregistrées dans ce navigateur ? Cette action est irréversible sans sauvegarde.")) {
        CyberStorage.reset();
        setTheme("dark");
        notify("Progression réinitialisée.");
        renderPage("dashboard");
      }
    }
  });

  document.getElementById("themeButton").addEventListener("click", () => {
    const next = document.body.classList.contains("light") ? "dark" : "light";
    setTheme(next);
  });

  document.getElementById("menuButton").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });

  document.addEventListener("change", async event => {
    if (event.target.id !== "importFile" || !event.target.files.length) return;

    try {
      if (!confirm("Importer cette sauvegarde remplacera les données actuelles. Continuer ?")) {
        event.target.value = "";
        return;
      }
      await CyberStorage.importJSON(event.target.files[0]);
      setTheme(CyberStorage.get().settings.theme);
      notify("Sauvegarde importée.");
      renderPage("dashboard");
    } catch (error) {
      notify(`Import refusé : ${error.message}`);
    } finally {
      event.target.value = "";
    }
  });

  function init() {
    setTheme(CyberStorage.get().settings.theme);
    const state = CyberStorage.get();
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastVisit !== today) {
      state.lastVisit = today;
      CyberStorage.addJournal("Activité", "Ouverture de CyberLab Academy.");
      CyberStorage.save();
    }
    renderPage("dashboard");
  }

  return { init, refreshSidebar, navigate };
})();

window.addEventListener("DOMContentLoaded", () => window.CyberApp.init());
