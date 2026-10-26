
"use strict";

window.CyberApp = (() => {
  const $ = selector => document.querySelector(selector);
  const root = $("#pageContent");
  const title = $("#pageTitle");
  const toast = $("#toast");

  const pages = {
    dashboard: "Tableau de bord",
    courses: "Formations",
    missions: "Missions pratiques",
    quiz: "Quiz & examens",
    lab: "Laboratoire réseau",
    supervision: "Supervision",
    glossary: "Glossaire",
    journal: "Journal de révision",
    settings: "Paramètres"
  };

  let currentPage = "dashboard";
  let toastTimer;
  let quizRun = null;

  function esc(value) {
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

  function heading(name, description) {
    return `<div class="section-heading"><div><h2>${name}</h2><p>${description}</p></div></div>`;
  }

  function stat(icon, label, value, note) {
    return `<article class="card stat-card">
      <div class="stat-icon">${icon}</div>
      <div><span class="stat-label">${label}</span>
      <strong class="stat-value">${value}</strong>
      <span class="stat-note">${note}</span></div>
    </article>`;
  }

  function refreshSidebar() {
    const state = CyberStorage.get();
    $("#sidebarLevel").textContent = `Niveau ${CyberStorage.level()}`;
    $("#sidebarXp").textContent = `${state.xp} XP`;
    $("#sidebarProgress").style.width = `${CyberStorage.levelProgress() / 250 * 100}%`;
  }

  function setTheme(theme) {
    const chosen = theme === "light" ? "light" : "dark";
    document.body.classList.toggle("light", chosen === "light");
    $("#themeButton").textContent = chosen === "light" ? "☾" : "☼";
    CyberStorage.setTheme(chosen);
  }

  function renderDashboard() {
    const state = CyberStorage.get();
    const allLessons = CyberData.courses.reduce((sum, course) => sum + course.lessons.length, 0);
    const lessonsDone = state.completedLessons.length;
    const missionsDone = state.completedMissions.length;
    const percent = allLessons ? Math.min(100, Math.round(lessonsDone / allLessons * 100)) : 0;
    const quizAverage = state.quizHistory.length
      ? Math.round(state.quizHistory.reduce((sum, item) => sum + item.score / item.total * 100, 0) / state.quizHistory.length)
      : 0;

    root.innerHTML = `
      <section class="grid grid-4">
        ${stat("⚡", "Expérience", `${state.xp} XP`, "Expérience cumulée")}
        ${stat("🏅", "Niveau", CyberStorage.level(), `${CyberStorage.levelProgress()}/250 XP vers le prochain niveau`)}
        ${stat("📚", "Leçons", `${lessonsDone}/${allLessons}`, "Leçons validées")}
        ${stat("✓", "Missions", `${missionsDone}/${CyberData.missions.length}`, "Missions terminées")}
      </section>

      <section class="section">
        ${heading("Ton espace de travail", "Reprends ton parcours ou choisis un nouveau défi.")}
        <div class="card">
          <div class="module-top"><strong>Progression des formations</strong><strong>${percent}%</strong></div>
          <div class="progress-track"><span style="width:${percent}%"></span></div>
          <p>${lessonsDone} leçon(s) terminée(s) sur ${allLessons}.</p>
          <div class="button-row">
            <button class="button primary" data-page="courses">Continuer les formations</button>
            <button class="button" data-page="missions">Voir les missions</button>
            <button class="button" data-page="lab">Ouvrir le laboratoire</button>
          </div>
        </div>
      </section>

      <section class="section">
        ${heading("Parcours SISR", "Cours structurés par domaine de compétence.")}
        <div class="grid grid-3">
          ${CyberData.courses.map(course => {
            const done = course.lessons.filter(lesson => state.completedLessons.includes(lesson.id)).length;
            return `<article class="card module-card">
              <div class="module-top"><span class="module-icon">${course.icon}</span><span class="tag">${esc(course.category)}</span></div>
              <h3>${esc(course.title)}</h3><p>${esc(course.description)}</p>
              <div class="progress-track"><span style="width:${done / course.lessons.length * 100}%"></span></div>
              <span class="small-text muted">${done}/${course.lessons.length} leçons · ${esc(course.level)}</span>
              <button class="button" data-action="open-course" data-id="${course.id}">Ouvrir le parcours</button>
            </article>`;
          }).join("")}
        </div>
      </section>

      <section class="section">
        ${heading("Dernières activités", "Les événements récents enregistrés sur cet appareil.")}
        <div class="card">
          ${state.journal.length ? `<ul class="list">${state.journal.slice(0, 5).map(item => `
            <li class="list-item"><strong>${esc(item.type)}</strong>
            <span>${esc(item.description)}</span>
            <span class="small-text muted">${new Date(item.date).toLocaleString("fr-FR")}</span></li>`).join("")}</ul>`
            : `<div class="empty">Aucune activité. Commence un cours ou ajoute une note dans le journal.</div>`}
        </div>
      </section>

      <section class="section grid grid-2">
        <div class="card"><h3>Résultats des quiz</h3><strong class="stat-value">${quizAverage}%</strong><p>Moyenne de tes quiz enregistrés.</p><button class="button" data-page="quiz">Continuer les quiz</button></div>
        <div class="card"><h3>Un bon réflexe IT</h3><p>Avant toute intervention, relève les faits, évalue l'impact, vérifie les journaux et documente les changements.</p><button class="button" data-page="journal">Ouvrir mon journal</button></div>
      </section>`;
  }

  function renderCourses() {
    const state = CyberStorage.get();
    root.innerHTML = `
      ${heading("Centre de formation", "Explore les modules et suis les leçons terminées.")}
      <div class="field"><label for="courseSearch">Rechercher une formation</label><input id="courseSearch" placeholder="Ex. : DNS, Linux, Docker..."></div>
      <div id="courseList" class="grid grid-3">
        ${CyberData.courses.map(course => {
          const done = course.lessons.filter(lesson => state.completedLessons.includes(lesson.id)).length;
          const searchable = `${course.title} ${course.category} ${course.description}`.toLowerCase();
          return `<article class="card module-card" data-search="${esc(searchable)}">
            <div class="module-top"><span class="module-icon">${course.icon}</span><span class="tag">${esc(course.category)}</span></div>
            <h3>${esc(course.title)}</h3><p>${esc(course.description)}</p>
            <div class="progress-track"><span style="width:${done / course.lessons.length * 100}%"></span></div>
            <span class="small-text muted">${done}/${course.lessons.length} leçons · ${esc(course.level)}</span>
            <button class="button primary" data-action="open-course" data-id="${course.id}">Voir les leçons</button>
          </article>`;
        }).join("")}
      </div>`;

    $("#courseSearch").addEventListener("input", event => {
      const query = event.target.value.toLowerCase().trim();
      document.querySelectorAll("#courseList [data-search]").forEach(card => {
        card.hidden = !card.dataset.search.includes(query);
      });
    });
  }

  function renderCourse(courseId) {
    const course = CyberData.courses.find(item => item.id === courseId);
    if (!course) return navigate("courses");

    const state = CyberStorage.get();
    root.innerHTML = `
      <div class="section-heading">
        <div><h2>${course.icon} ${esc(course.title)}</h2><p>${esc(course.description)}</p></div>
        <button class="button" data-page="courses">← Toutes les formations</button>
      </div>
      <div class="grid grid-2">
        <section class="card"><h3>Leçons du parcours</h3><ul class="list">
          ${course.lessons.map(lesson => `
            <li class="list-item">
              <strong>${state.completedLessons.includes(lesson.id) ? "✓ " : ""}${esc(lesson.title)}</strong>
              <span class="small-text muted">${esc(lesson.duration)}</span>
              <button class="button" data-action="open-lesson" data-course="${course.id}" data-id="${lesson.id}">Lire la leçon</button>
            </li>`).join("")}
        </ul></section>
        <section class="card"><h3>Objectifs</h3><p>Comprendre les notions, savoir les expliquer et les appliquer dans un laboratoire autorisé.</p>
          <div class="notice">Les exercices sont pédagogiques. Effectue les manipulations réelles uniquement dans un environnement que tu es autorisé à administrer.</div>
        </section>
      </div>
      <div id="lessonContent" class="section"></div>`;
  }

  function renderLesson(courseId, lessonId) {
    const course = CyberData.courses.find(item => item.id === courseId);
    const lesson = course && course.lessons.find(item => item.id === lessonId);
    if (!course || !lesson) return;

    const done = CyberStorage.get().completedLessons.includes(lesson.id);
    $("#lessonContent").innerHTML = `
      <article class="card">
        <span class="tag">${esc(course.title)} · ${esc(lesson.duration)}</span>
        <h2>${esc(lesson.title)}</h2>
        ${lesson.content.map(text => `<p>${esc(text)}</p>`).join("")}
        <hr>
        <h3>Exercice pratique</h3><p>${esc(lesson.task)}</p>
        <div class="field"><label for="lessonNotes">Mes notes personnelles</label><textarea id="lessonNotes" maxlength="3000" placeholder="Mes observations, commandes, résultats..."></textarea></div>
        <div class="button-row">
          <button class="button primary" data-action="complete-lesson" data-course="${course.id}" data-id="${lesson.id}" data-title="${esc(lesson.title)}" ${done ? "disabled" : ""}>${done ? "Leçon terminée ✓" : "Valider la leçon (+25 XP)"}</button>
          <button class="button" data-action="save-lesson-note" data-title="${esc(lesson.title)}">Enregistrer mes notes</button>
        </div>
      </article>`;
    $("#lessonContent").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderMissions() {
    const state = CyberStorage.get();
    root.innerHTML = `
      ${heading("Missions pratiques", "Étudie chaque situation, consulte les indices et valide tes apprentissages.")}
      <div class="notice warn"><strong>Important</strong><p>La validation signifie que tu as étudié la mission. Elle ne vérifie pas automatiquement une intervention réelle.</p></div>
      <div class="grid grid-2 section">
        ${CyberData.missions.map(mission => {
          const done = state.completedMissions.includes(mission.id);
          return `<article class="card module-card">
            <div class="module-top"><span class="module-icon">⚑</span><span class="tag">${esc(mission.difficulty)}</span></div>
            <h3>${esc(mission.title)}</h3><p>${esc(mission.description)}</p>
            <div class="module-top"><span class="tag">${esc(mission.category)}</span><strong>${mission.xp} XP</strong></div>
            <div class="button-row">
              <button class="button" data-action="mission-hint" data-id="${mission.id}">Indice</button>
              <button class="button" data-action="mission-solution" data-id="${mission.id}">Correction</button>
              <button class="button ${done ? "success" : "primary"}" data-action="complete-mission" data-id="${mission.id}" ${done ? "disabled" : ""}>${done ? "Terminée ✓" : "Valider"}</button>
            </div>
            <div id="missionDetail-${mission.id}"></div>
          </article>`;
        }).join("")}
      </div>`;
  }

  function renderQuiz() {
    const state = CyberStorage.get();
    root.innerHTML = `
      ${heading("Quiz & examens blancs", "Réponds aux questions, consulte les explications et suis tes résultats.")}
      <div class="card">
        <h3>Quiz SISR</h3><p>10 questions sont choisies au hasard parmi la banque de questions.</p>
        <button class="button primary" data-action="start-quiz">Démarrer un quiz</button>
        <div id="quizArea"></div>
      </div>
      <section class="section card"><h3>Historique des résultats</h3>
        ${state.quizHistory.length ? `<div class="table-wrap"><table><thead><tr><th>Quiz</th><th>Résultat</th><th>Pourcentage</th><th>Date</th></tr></thead><tbody>
          ${state.quizHistory.map(item => `<tr><td>${esc(item.title)}</td><td>${item.score}/${item.total}</td><td>${Math.round(item.score / item.total * 100)}%</td><td>${new Date(item.date).toLocaleString("fr-FR")}</td></tr>`).join("")}
        </tbody></table></div>` : `<p class="muted">Aucun résultat enregistré pour le moment.</p>`}
      </section>`;
  }

  function startQuiz() {
    const questions = [...CyberData.questions]
      .sort(() => Math.random() - .5)
      .slice(0, Math.min(10, CyberData.questions.length));
    quizRun = questions;

    $("#quizArea").innerHTML = `
      <form id="quizForm">
        ${questions.map((question, index) => `
          <div class="question">
            <strong>${index + 1}. ${esc(question.q)}</strong>
            ${question.options.map((option, i) => `
              <label class="option"><input type="radio" name="q${index}" value="${i}" required><span>${esc(option)}</span></label>
            `).join("")}
            <p id="explanation-${index}" class="small-text"></p>
          </div>`).join("")}
        <div class="button-row"><button class="button primary" type="submit">Corriger le quiz</button></div>
      </form><div id="quizResult"></div>`;

    $("#quizForm").addEventListener("submit", event => {
      event.preventDefault();
      if (!quizRun) return;

      const form = new FormData(event.currentTarget);
      let score = 0;
      quizRun.forEach((question, index) => {
        const chosen = Number(form.get(`q${index}`));
        const correct = chosen === question.answer;
        if (correct) score++;
        $(`#explanation-${index}`).textContent =
          `${correct ? "Correct. " : "À revoir. "}${question.explanation}`;
      });

      const total = quizRun.length;
      const points = score * 10;
      CyberStorage.addQuiz(score, total, "Quiz SISR V5");
      if (points > 0) CyberStorage.addXP(points, "Résultat du quiz");
      quizRun = null;

      $("#quizResult").innerHTML = `
        <div class="result"><h3>Résultat : ${score}/${total}</h3>
        <p>${Math.round(score / total * 100)} % de bonnes réponses.</p>
        <p>${points} XP gagnés.</p></div>
        <button class="button" data-action="refresh-quiz">Voir l'historique</button>`;
      refreshSidebar();
    }, { once: true });
  }

  function renderLab() {
    root.innerHTML = `
      ${heading("Laboratoire réseau", "Entraîne-toi au calcul IPv4 et au diagnostic avec des données fictives.")}
      <div class="grid grid-2">
        <section class="card">
          <h3>Calculateur IPv4 / CIDR</h3><p>Entre une adresse et un préfixe.</p>
          <form id="subnetForm">
            <div class="field"><label for="ipAddress">Adresse IPv4</label><input id="ipAddress" value="192.168.10.25" required></div>
            <div class="field"><label for="prefix">Préfixe CIDR</label><select id="prefix">${Array.from({length:33},(_,i)=>32-i).map(n=>`<option value="${n}" ${n===24?"selected":""}>/${n}</option>`).join("")}</select></div>
            <button class="button primary" type="submit">Calculer</button>
          </form><div id="subnetResult"></div>
        </section>
        <section class="card">
          <h3>Console simulée</h3><p>Commandes disponibles : help, ipconfig, ip addr, ip route, ping 192.168.10.1, clear.</p>
          <form id="consoleForm">
            <div class="field"><label for="consoleCommand">Commande</label><input id="consoleCommand" placeholder="help" required autocomplete="off"></div>
            <button class="button primary" type="submit">Simuler</button>
          </form>
          <pre id="consoleOutput" class="code-output">CyberLab V5
Saisis help pour commencer.
Aucune commande réelle n'est exécutée.</pre>
        </section>
      </div>
      <section class="section card">
        <h3>Checklist de diagnostic</h3>
        <p>Coche les vérifications réalisées dans ton exercice.</p>
        ${["Vérifier le lien réseau et le VLAN","Relever l'adresse IP et le masque","Contrôler la passerelle","Tester la résolution DNS","Noter les résultats et les journaux"].map(item => `<label class="option"><input type="checkbox" class="lab-check"><span>${item}</span></label>`).join("")}
        <p id="checkCount" class="small-text muted">0/5 étapes cochées</p>
      </section>`;

    $("#subnetForm").addEventListener("submit", event => {
      event.preventDefault();
      try {
        const net = CyberLab.calculate($("#ipAddress").value, $("#prefix").value);
        $("#subnetResult").innerHTML = `<div class="result"><h3>Résultat du calcul</h3><div class="table-wrap"><table><tbody>
          <tr><td>Adresse saisie</td><td>${net.ip}/${net.prefix}</td></tr>
          <tr><td>Masque</td><td>${net.mask}</td></tr>
          <tr><td>Adresse réseau</td><td>${net.network}</td></tr>
          <tr><td>Broadcast</td><td>${net.broadcast}</td></tr>
          <tr><td>Première adresse indicative</td><td>${net.first}</td></tr>
          <tr><td>Dernière adresse indicative</td><td>${net.last}</td></tr>
          <tr><td>Adresses totales</td><td>${net.total.toLocaleString("fr-FR")}</td></tr>
          <tr><td>Hôtes utilisables (convention usuelle)</td><td>${net.usable.toLocaleString("fr-FR")}</td></tr>
        </tbody></table></div><p class="small-text muted">Les préfixes /31 et /32 suivent des conventions particulières.</p></div>`;
      } catch (error) {
        $("#subnetResult").innerHTML = `<div class="notice bad">${esc(error.message)}</div>`;
      }
    });

    $("#consoleForm").addEventListener("submit", event => {
      event.preventDefault();
      const command = $("#consoleCommand").value;
      const output = CyberLab.simulatedCommand(command);
      $("#consoleOutput").textContent = output.length ? output.join("\n") : "Console effacée.";
    });

    document.querySelectorAll(".lab-check").forEach(check => {
      check.addEventListener("change", () => {
        const all = [...document.querySelectorAll(".lab-check")];
        $("#checkCount").textContent = `${all.filter(item => item.checked).length}/${all.length} étapes cochées`;
      });
    });
  }

  function renderSupervision() {
    const servers = CyberData.servers;
    const events = [
      { time:"09:12", level:"INFO", message:"Contrôle de disponibilité terminé." },
      { time:"09:14", level:"WARN", message:"Charge CPU élevée sur SRV-FICHIERS." },
      { time:"09:16", level:"ERROR", message:"Contrôle fictif de SRV-BACKUP en échec." },
      { time:"09:18", level:"INFO", message:"Collecte des métriques simulée terminée." }
    ];

    root.innerHTML = `
      ${heading("Supervision pédagogique", "Analyse des métriques et événements d'une infrastructure fictive.")}
      <div class="notice warn"><strong>Simulation uniquement</strong><p>Les états et journaux sont inventés pour l'exercice. Aucun serveur réel n'est interrogé.</p></div>
      <section class="section grid grid-3">
        ${stat("▣","Serveurs",servers.length,"Inventaire fictif")}
        ${stat("●","En ligne",servers.filter(s=>s.status==="online").length,"État simulé")}
        ${stat("⚠","Alertes",servers.filter(s=>s.status!=="online").length,"À examiner")}
      </section>
      <section class="section card"><h3>Inventaire des serveurs</h3><div class="table-wrap"><table>
        <thead><tr><th>Serveur / rôle</th><th>État</th><th>CPU</th><th>RAM</th><th>Disponibilité</th><th>Analyse</th></tr></thead>
        <tbody>${servers.map(server => `<tr>
          <td><strong>${esc(server.name)}</strong><br><span class="muted">${esc(server.role)}</span></td>
          <td><span class="status ${server.status}">${server.status==="online"?"En ligne":server.status==="warning"?"Attention":"Indisponible"}</span></td>
          <td>${server.cpu}%</td><td>${server.ram}%</td><td>${esc(server.uptime)}</td>
          <td><button class="button" data-action="inspect-server" data-id="${server.id}">Examiner</button></td>
        </tr>`).join("")}</tbody>
      </table></div><div id="serverDetail"></div></section>
      <section class="section card"><h3>Journal d'événements fictifs</h3><ul class="list">
        ${events.map(event=>`<li class="list-item"><strong>${event.time} · ${event.level}</strong><span>${event.message}</span></li>`).join("")}
      </ul>
      <div class="field"><label for="incidentNote">Ton diagnostic</label><textarea id="incidentNote" maxlength="3000" placeholder="Faits observés, impact, hypothèses et prochaines actions..."></textarea></div>
      <button class="button primary" data-action="save-incident">Ajouter au journal de révision</button></section>`;
  }

  function renderGlossary() {
    root.innerHTML = `
      ${heading("Glossaire informatique", "Retrouve rapidement les notions essentielles.")}
      <div class="field"><label for="glossarySearch">Rechercher un terme ou une définition</label><input id="glossarySearch" placeholder="Ex. VLAN, DNS, RTO..."></div>
      <div id="glossaryList" class="grid grid-2">
        ${CyberData.glossary.map(([term, definition]) => `<article class="card glossary-item" data-search="${esc((term+" "+definition).toLowerCase())}">
          <h3>${esc(term)}</h3><p>${esc(definition)}</p></article>`).join("")}
      </div>`;
    $("#glossarySearch").addEventListener("input", event => {
      const query = event.target.value.toLowerCase().trim();
      document.querySelectorAll(".glossary-item").forEach(item => {
        item.hidden = !item.dataset.search.includes(query);
      });
    });
  }

  function renderJournal() {
    const state = CyberStorage.get();
    root.innerHTML = `
      ${heading("Journal de révision", "Conserve tes notes, tes diagnostics et tes comptes rendus.")}
      <section class="card"><h3>Ajouter une entrée</h3>
        <form id="journalForm">
          <div class="field"><label for="journalType">Catégorie</label><select id="journalType">
            <option>Révision</option><option>Diagnostic</option><option>Incident</option><option>Commande</option><option>Objectif</option><option>Compte rendu</option>
          </select></div>
          <div class="field"><label for="journalText">Contenu</label><textarea id="journalText" maxlength="3000" required placeholder="Ce que tu as appris, les actions réalisées et les résultats..."></textarea></div>
          <button class="button primary" type="submit">Enregistrer</button>
        </form>
      </section>
      <section class="section card"><div class="section-heading"><h2>Historique</h2><span class="tag">${state.journal.length} entrée(s)</span></div>
        ${state.journal.length ? `<ul class="list">${state.journal.map(item=>`<li class="list-item">
          <strong>${esc(item.type)}</strong><p>${esc(item.description)}</p>
          <span class="small-text muted">${new Date(item.date).toLocaleString("fr-FR")}</span>
        </li>`).join("")}</ul>` : `<div class="empty">Aucune note pour le moment.</div>`}
      </section>
      <section class="section card"><h3>Historique des quiz</h3>
        ${state.quizHistory.length ? `<div class="table-wrap"><table><thead><tr><th>Quiz</th><th>Résultat</th><th>Date</th></tr></thead><tbody>
          ${state.quizHistory.map(item=>`<tr><td>${esc(item.title)}</td><td>${item.score}/${item.total}</td><td>${new Date(item.date).toLocaleString("fr-FR")}</td></tr>`).join("")}
        </tbody></table></div>` : `<p class="muted">Aucun quiz réalisé.</p>`}
      </section>`;

    $("#journalForm").addEventListener("submit", event => {
      event.preventDefault();
      const description = $("#journalText").value.trim();
      if (!description) return;
      CyberStorage.addJournal($("#journalType").value, description);
      notify("Entrée ajoutée au journal.");
      renderJournal();
    });
  }

  function renderSettings() {
    const state = CyberStorage.get();
    root.innerHTML = `
      ${heading("Paramètres", "Gère l'apparence et les données de cette installation.")}
      <div class="grid grid-2">
        <section class="card"><h3>Apparence</h3><p>Choisis ton thème.</p><div class="button-row">
          <button class="button" data-action="theme-dark">Thème sombre</button><button class="button" data-action="theme-light">Thème clair</button>
        </div></section>
        <section class="card"><h3>Sauvegarde</h3><p>Exporte ou importe ta progression au format JSON.</p><div class="button-row">
          <button class="button primary" data-action="export-data">Exporter mes données</button>
          <button class="button" data-action="import-data">Importer une sauvegarde</button>
        </div><input type="file" id="importFile" accept=".json,application/json" hidden>
        <p class="small-text muted">L'import remplace les données actuelles. Fais un export avant d'importer un autre fichier.</p></section>
        <section class="card"><h3>Statistiques</h3><ul class="list">
          <li class="list-item">XP : <strong>${state.xp}</strong></li>
          <li class="list-item">Niveau : <strong>${CyberStorage.level()}</strong></li>
          <li class="list-item">Leçons terminées : <strong>${state.completedLessons.length}</strong></li>
          <li class="list-item">Missions terminées : <strong>${state.completedMissions.length}</strong></li>
          <li class="list-item">Quiz réalisés : <strong>${state.quizHistory.length}</strong></li>
        </ul></section>
        <section class="card"><h3>Réinitialiser</h3><p>Efface la progression locale enregistrée par CyberLab V5.</p>
          <button class="button danger" data-action="reset-data">Réinitialiser mes données</button>
        </section>
      </div>`;
  }

  function navigate(page) {
    currentPage = pages[page] ? page : "dashboard";
    title.textContent = pages[currentPage];
    document.querySelectorAll(".nav-link[data-page]").forEach(button => {
      button.classList.toggle("active", button.dataset.page === currentPage);
    });

    if (currentPage === "dashboard") renderDashboard();
    else if (currentPage === "courses") renderCourses();
    else if (currentPage === "missions") renderMissions();
    else if (currentPage === "quiz") renderQuiz();
    else if (currentPage === "lab") renderLab();
    else if (currentPage === "supervision") renderSupervision();
    else if (currentPage === "glossary") renderGlossary();
    else if (currentPage === "journal") renderJournal();
    else if (currentPage === "settings") renderSettings();

    refreshSidebar();
    $("#sidebar").classList.remove("open");
    $("#content").focus({ preventScroll: true });
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
      renderLesson(button.dataset.course, id);
    } else if (action === "complete-lesson") {
      if (CyberStorage.completeLesson(id, button.dataset.title)) {
        notify("Leçon validée : +25 XP.");
        renderCourse(button.dataset.course);
        renderLesson(button.dataset.course, id);
        refreshSidebar();
      } else notify("Cette leçon est déjà terminée.");
    } else if (action === "save-lesson-note") {
      const note = $("#lessonNotes")?.value.trim();
      if (!note) return notify("Écris une note avant de l'enregistrer.");
      CyberStorage.addJournal("Cours", `${button.dataset.title} : ${note}`);
      notify("Notes enregistrées.");
    } else if (action === "mission-hint" || action === "mission-solution") {
      const mission = CyberData.missions.find(item => item.id === id);
      if (!mission) return;
      const target = $(`#missionDetail-${id}`);
      const isHint = action === "mission-hint";
      target.innerHTML = `<div class="notice ${isHint ? "" : "good"}"><strong>${isHint ? "Indice" : "Correction pédagogique"}</strong><p>${esc(isHint ? mission.hint : mission.correction)}</p></div>`;
    } else if (action === "complete-mission") {
      const mission = CyberData.missions.find(item => item.id === id);
      if (mission && CyberStorage.completeMission(id, mission.title, mission.xp)) {
        notify(`Mission validée : +${mission.xp} XP.`);
        renderMissions();
        refreshSidebar();
      } else notify("Cette mission est déjà terminée.");
    } else if (action === "start-quiz") {
      startQuiz();
    } else if (action === "refresh-quiz") {
      navigate("quiz");
    } else if (action === "inspect-server") {
      const server = CyberData.servers.find(item => item.id === id);
      if (!server) return;
      const message = server.status === "online"
        ? "État nominal dans cette simulation. Continuer les contrôles périodiques."
        : server.status === "warning"
          ? "Vérifier la tendance CPU, les journaux et les tâches en cours avant de conclure."
          : "Confirmer l'incident et examiner les dépendances et journaux selon les procédures autorisées.";
      $("#serverDetail").innerHTML = `<div class="result"><h3>Analyse de ${esc(server.name)}</h3><p>${message}</p><p class="small-text muted">Données fictives : ce résultat ne décrit pas un serveur réel.</p></div>`;
    } else if (action === "save-incident") {
      const note = $("#incidentNote")?.value.trim();
      if (!note) return notify("Rédige ton diagnostic avant de l'enregistrer.");
      CyberStorage.addJournal("Diagnostic de supervision", note);
      $("#incidentNote").value = "";
      notify("Diagnostic ajouté au journal.");
    } else if (action === "theme-dark" || action === "theme-light") {
      setTheme(action === "theme-light" ? "light" : "dark");
      notify("Thème mis à jour.");
    } else if (action === "export-data") {
      CyberStorage.exportJSON();
      notify("Export JSON demandé au navigateur.");
    } else if (action === "import-data") {
      $("#importFile").click();
    } else if (action === "reset-data") {
      if (confirm("Effacer toute la progression et les notes de ce navigateur ? Sans sauvegarde, cette action est irréversible.")) {
        CyberStorage.reset();
        setTheme("dark");
        notify("Données réinitialisées.");
        navigate("dashboard");
      }
    }
  });

  document.addEventListener("submit", event => {
    if (event.target.id !== "journalForm") return;
    event.preventDefault();
  });

  document.addEventListener("change", async event => {
    if (event.target.id !== "importFile" || !event.target.files.length) return;
    try {
      if (!confirm("Importer cette sauvegarde remplacera les données actuelles. Continuer ?")) return;
      await CyberStorage.importJSON(event.target.files[0]);
      setTheme(CyberStorage.get().settings.theme);
      notify("Sauvegarde importée.");
      navigate("dashboard");
    } catch (error) {
      notify(`Import refusé : ${error.message}`);
    } finally {
      event.target.value = "";
    }
  });

  $("#themeButton").addEventListener("click", () => {
    setTheme(document.body.classList.contains("light") ? "dark" : "light");
  });

  $("#menuButton").addEventListener("click", () => {
    $("#sidebar").classList.toggle("open");
  });

  function init() {
    setTheme(CyberStorage.get().settings.theme);
    const today = new Date().toISOString().slice(0, 10);
    const state = CyberStorage.get();
    if (state.lastVisit !== today) {
      state.lastVisit = today;
      CyberStorage.save(state);
      CyberStorage.addJournal("Activité", "Ouverture de CyberLab Academy V5.");
    }
    navigate("dashboard");
  }

  return { init, navigate, refreshSidebar };
})();

window.addEventListener("DOMContentLoaded", window.CyberApp.init);
