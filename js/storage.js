
(() => {
  "use strict";

  const KEY = "cyberlab-academy-v3";

  const defaults = {
    xp: 0,
    completedMissions: [],
    quizHistory: [],
    quizBest: 0,
    theme: "dark"
  };

  let state = { ...defaults };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      state = {
        ...defaults,
        xp: Number.isFinite(data.xp) && data.xp >= 0 ? data.xp : 0,
        completedMissions: Array.isArray(data.completedMissions)
          ? [...new Set(data.completedMissions.filter(x => typeof x === "string"))]
          : [],
        quizHistory: Array.isArray(data.quizHistory)
          ? data.quizHistory.filter(x =>
              x && Number.isFinite(x.score) &&
              Number.isFinite(x.total) &&
              typeof x.date === "string"
            ).slice(0, 20)
          : [],
        quizBest: Number.isFinite(data.quizBest) ? data.quizBest : 0,
        theme: data.theme === "light" ? "light" : "dark"
      };
    } catch (error) {
      console.warn("La sauvegarde locale n'a pas pu être lue.", error);
      state = { ...defaults };
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.warn("La sauvegarde locale a échoué.", error);
      return false;
    }
  }

  function addXP(amount) {
    if (!Number.isFinite(amount) || amount <= 0) return;
    state.xp += amount;
    save();
  }

  function completeMission(id) {
    if (state.completedMissions.includes(id)) return false;
    state.completedMissions.push(id);
    addXP(50);
    save();
    return true;
  }

  function addQuizResult(score, total) {
    const result = {
      score,
      total,
      date: new Date().toLocaleString("fr-FR")
    };

    state.quizHistory.unshift(result);
    state.quizHistory = state.quizHistory.slice(0, 20);

    const percent = total > 0 ? Math.round(score / total * 100) : 0;
    state.quizBest = Math.max(state.quizBest, percent);

    addXP(score * 10);
    save();
  }

  function setTheme(theme) {
    state.theme = theme === "light" ? "light" : "dark";
    save();
  }

  function exportData() {
    return JSON.stringify({
      version: 3,
      exportedAt: new Date().toISOString(),
      data: state
    }, null, 2);
  }

  function importData(text) {
    const backup = JSON.parse(text);

    if (!backup || backup.version !== 3 || !backup.data) {
      throw new Error("Ce fichier n'est pas une sauvegarde CyberLab V3.");
    }

    const d = backup.data;

    if (!Number.isFinite(d.xp) || d.xp < 0 ||
        !Array.isArray(d.completedMissions) ||
        !Array.isArray(d.quizHistory) ||
        !["light", "dark"].includes(d.theme)) {
      throw new Error("Le contenu de la sauvegarde est invalide.");
    }

    state = {
      ...defaults,
      xp: d.xp,
      completedMissions: [...new Set(d.completedMissions.filter(x => typeof x === "string"))],
      quizHistory: d.quizHistory.slice(0, 20),
      quizBest: Number.isFinite(d.quizBest) ? d.quizBest : 0,
      theme: d.theme
    };

    if (!save()) throw new Error("Impossible d'enregistrer la sauvegarde dans ce navigateur.");
  }

  window.CyberStorage = {
    load,
    save,
    getState: () => state,
    addXP,
    completeMission,
    addQuizResult,
    setTheme,
    exportData,
    importData
  };

  load();
})();
