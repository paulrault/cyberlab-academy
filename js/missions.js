
"use strict";

window.CyberMissions = (() => {
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function renderMissions(state) {
    return window.CyberData.missions.map(mission => {
      const done = state.completedMissions.includes(mission.id);

      return `
        <article class="card module-card">
          <div class="module-top">
            <span class="module-icon">⚑</span>
            <span class="tag">${escapeHTML(mission.difficulty)}</span>
          </div>
          <h3>${escapeHTML(mission.title)}</h3>
          <p>${escapeHTML(mission.description)}</p>
          <div class="module-top">
            <span class="tag">${escapeHTML(mission.category)}</span>
            <span class="muted small-text">${mission.xp} XP</span>
          </div>
          <div class="button-row">
            <button class="button" data-action="hint" data-id="${mission.id}">Indice</button>
            <button class="button" data-action="correction" data-id="${mission.id}">Correction</button>
            <button class="button ${done ? "success" : "primary"}"
              data-action="complete-mission" data-id="${mission.id}"
              ${done ? "disabled" : ""}>${done ? "Terminée ✓" : "Valider"}</button>
          </div>
          <div id="mission-detail-${mission.id}"></div>
        </article>
      `;
    }).join("");
  }

  function getMission(id) {
    return window.CyberData.missions.find(item => item.id === id);
  }

  function showDetail(id, kind) {
    const mission = getMission(id);
    const target = document.getElementById(`mission-detail-${id}`);
    if (!mission || !target) return;

    const text = kind === "hint" ? mission.hint : mission.correction;
    target.innerHTML = `<div class="notice ${kind === "hint" ? "" : "good"}">
      <strong>${kind === "hint" ? "Indice" : "Correction pédagogique"}</strong>
      <p>${escapeHTML(text)}</p>
    </div>`;
  }

  function renderQuiz() {
    return `
      <div class="card">
        <h3>Quiz de connaissances SISR</h3>
        <p>10 questions sélectionnées aléatoirement. Une seule réponse est attendue par question.</p>
        <div class="button-row">
          <button class="button primary" data-action="start-quiz">Commencer un quiz</button>
        </div>
        <div id="quizArea"></div>
      </div>`;
  }

  function startQuiz() {
    const all = [...window.CyberData.questions];
    all.sort(() => Math.random() - 0.5);
    const questions = all.slice(0, Math.min(10, all.length));
    const area = document.getElementById("quizArea");
    if (!area) return;

    area.innerHTML = `
      <form id="quizForm">
        ${questions.map((question, index) => `
          <div class="question">
            <strong>${index + 1}. ${escapeHTML(question.q)}</strong>
            ${question.options.map((option, i) => `
              <label class="option">
                <input type="radio" name="q${index}" value="${i}" required>
                <span>${escapeHTML(option)}</span>
              </label>
            `).join("")}
            <div class="muted small-text" id="explanation-${index}"></div>
          </div>
        `).join("")}
        <div class="button-row">
          <button class="button primary" type="submit">Corriger le quiz</button>
        </div>
      </form>
      <div id="quizResult"></div>`;

    document.getElementById("quizForm").addEventListener("submit", event => {
      event.preventDefault();

      const form = new FormData(event.currentTarget);
      let score = 0;

      questions.forEach((question, index) => {
        const chosen = Number(form.get(`q${index}`));
        if (chosen === question.answer) score++;
        const explanation = document.getElementById(`explanation-${index}`);
        explanation.textContent =
          `${chosen === question.answer ? "Correct." : "À revoir."} ${question.explanation}`;
      });

      const total = questions.length;
      const points = score * 10;
      window.CyberStorage.addQuiz(score, total, "Quiz SISR");
      if (points > 0) window.CyberStorage.addXP(points, "Quiz SISR");

      document.getElementById("quizResult").innerHTML = `
        <div class="result">
          <h3>Résultat : ${score}/${total}</h3>
          <p>${Math.round(score / total * 100)} % de bonnes réponses</p>
          <p>XP gagnés : ${points}</p>
        </div>`;
      window.CyberApp.refreshSidebar();
    }, { once: true });
  }

  return { renderMissions, showDetail, renderQuiz, startQuiz };
})();
