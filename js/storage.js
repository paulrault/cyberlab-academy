
"use strict";

window.CyberStorage = (() => {
  const KEY = "cyberlab-academy-v4";
  const DEFAULTS = {
    version: 4,
    xp: 0,
    completedLessons: [],
    completedMissions: [],
    quizHistory: [],
    journal: [],
    settings: { theme: "dark" },
    lastVisit: null
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return clone(DEFAULTS);

      const parsed = JSON.parse(raw);
      return {
        ...clone(DEFAULTS),
        ...parsed,
        settings: { ...DEFAULTS.settings, ...(parsed.settings || {}) },
        completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
        completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
        quizHistory: Array.isArray(parsed.quizHistory) ? parsed.quizHistory : [],
        journal: Array.isArray(parsed.journal) ? parsed.journal : []
      };
    } catch (error) {
      console.error("Chargement des données impossible :", error);
      return clone(DEFAULTS);
    }
  }

  let state = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error("Sauvegarde impossible :", error);
      return false;
    }
  }

  function get() {
    return clone(state);
  }

  function addXP(amount, reason) {
    const value = Math.max(0, Math.floor(Number(amount) || 0));
    if (!value) return false;

    state.xp += value;
    addJournal("XP", `+${value} XP — ${reason || "Progression"}`);
    return save();
  }

  function level() {
    return Math.floor(state.xp / 250) + 1;
  }

  function levelProgress() {
    return state.xp % 250;
  }

  function completeLesson(id, title) {
    if (state.completedLessons.includes(id)) return false;
    state.completedLessons.push(id);
    addXP(25, `Cours terminé : ${title}`);
    return true;
  }

  function completeMission(id, title, xp) {
    if (state.completedMissions.includes(id)) return false;
    state.completedMissions.push(id);
    addXP(xp || 50, `Mission réussie : ${title}`);
    return true;
  }

  function addQuiz(score, total, title) {
    state.quizHistory.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      score,
      total,
      title
    });
    state.quizHistory = state.quizHistory.slice(0, 100);
    save();
  }

  function addJournal(type, description) {
    state.journal.unshift({
      id: Date.now() + Math.random(),
      date: new Date().toISOString(),
      type,
      description
    });
    state.journal = state.journal.slice(0, 200);
    save();
  }

  function setTheme(theme) {
    state.settings.theme = theme === "light" ? "light" : "dark";
    save();
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cyberlab-academy-sauvegarde.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (!parsed || typeof parsed !== "object" ||
              !Number.isFinite(Number(parsed.xp)) ||
              !Array.isArray(parsed.completedLessons) ||
              !Array.isArray(parsed.completedMissions)) {
            throw new Error("Format de sauvegarde invalide.");
          }

          state = {
            ...clone(DEFAULTS),
            ...parsed,
            xp: Math.max(0, Math.floor(Number(parsed.xp))),
            settings: { ...DEFAULTS.settings, ...(parsed.settings || {}) },
            completedLessons: parsed.completedLessons,
            completedMissions: parsed.completedMissions,
            quizHistory: Array.isArray(parsed.quizHistory) ? parsed.quizHistory : [],
            journal: Array.isArray(parsed.journal) ? parsed.journal : []
          };

          if (!save()) throw new Error("Impossible d'enregistrer les données.");
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
      reader.readAsText(file);
    });
  }

  function reset() {
    state = clone(DEFAULTS);
    return save();
  }

  return {
    get, save, addXP, level, levelProgress, completeLesson,
    completeMission, addQuiz, addJournal, setTheme,
    exportJSON, importJSON, reset
  };
})();
