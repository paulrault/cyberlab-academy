
"use strict";

window.CyberStorage = (() => {
  const KEY = "cyberlab-academy-v5";
  const THEME_KEY = "cyberlab-academy-v5-theme";

  function emptyState() {
    return {
      version: 5,
      xp: 0,
      completedLessons: [],
      completedMissions: [],
      journal: [],
      quizHistory: [],
      settings: { theme: "dark", weeklyGoal: 5 },
      lastVisit: ""
    };
  }

  function validStringArray(value) {
    return Array.isArray(value) &&
      value.every(item => typeof item === "string" && item.length < 300);
  }

  function normalize(value) {
    const base = emptyState();
    if (!value || typeof value !== "object" || Array.isArray(value)) return base;

    return {
      version: 5,
      xp: Number.isFinite(value.xp) && value.xp >= 0
        ? Math.floor(Math.min(value.xp, 100000000)) : 0,
      completedLessons: validStringArray(value.completedLessons)
        ? [...new Set(value.completedLessons)] : [],
      completedMissions: validStringArray(value.completedMissions)
        ? [...new Set(value.completedMissions)] : [],
      journal: Array.isArray(value.journal)
        ? value.journal.filter(item =>
            item && typeof item.type === "string" &&
            typeof item.description === "string" &&
            typeof item.date === "string"
          ).slice(0, 1000) : [],
      quizHistory: Array.isArray(value.quizHistory)
        ? value.quizHistory.filter(item =>
            item && typeof item.title === "string" &&
            Number.isFinite(item.score) && Number.isFinite(item.total) &&
            typeof item.date === "string"
          ).slice(0, 500) : [],
      settings: {
        theme: value.settings && value.settings.theme === "light" ? "light" : "dark",
        weeklyGoal: value.settings &&
          Number.isFinite(value.settings.weeklyGoal)
          ? Math.max(1, Math.min(30, Math.floor(value.settings.weeklyGoal)))
          : 5
      },
      lastVisit: typeof value.lastVisit === "string" ? value.lastVisit : ""
    };
  }

  function get() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? normalize(JSON.parse(raw)) : emptyState();
    } catch (error) {
      console.warn("CyberLab : lecture locale impossible.", error);
      return emptyState();
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(normalize(state)));
      return true;
    } catch (error) {
      console.error("CyberLab : sauvegarde locale impossible.", error);
      return false;
    }
  }

  function addJournal(type, description) {
    const state = get();
    state.journal.unshift({
      id: `j-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: String(type).slice(0, 100),
      description: String(description).slice(0, 3000),
      date: new Date().toISOString()
    });
    state.journal = state.journal.slice(0, 1000);
    save(state);
  }

  function addXP(amount, reason) {
    const state = get();
    const safeAmount = Math.max(0, Math.min(10000, Math.floor(Number(amount) || 0)));
    if (!safeAmount) return false;
    state.xp += safeAmount;
    state.xp = Math.min(state.xp, 100000000);
    state.journal.unshift({
      id: `xp-${Date.now()}`,
      type: "XP",
      description: `+${safeAmount} XP — ${String(reason).slice(0, 200)}`,
      date: new Date().toISOString()
    });
    state.journal = state.journal.slice(0, 1000);
    return save(state);
  }

  function completeLesson(id, title) {
    const state = get();
    if (state.completedLessons.includes(id)) return false;
    state.completedLessons.push(id);
    state.xp = Math.min(100000000, state.xp + 25);
    state.journal.unshift({
      id: `lesson-${Date.now()}`,
      type: "Leçon terminée",
      description: `${title} — +25 XP`,
      date: new Date().toISOString()
    });
    state.journal = state.journal.slice(0, 1000);
    save(state);
    return true;
  }

  function completeMission(id, title, xp) {
    const state = get();
    if (state.completedMissions.includes(id)) return false;

    const amount = Math.max(0, Math.min(10000, Math.floor(Number(xp) || 0)));
    state.completedMissions.push(id);
    state.xp = Math.min(100000000, state.xp + amount);
    state.journal.unshift({
      id: `mission-${Date.now()}`,
      type: "Mission terminée",
      description: `${title} — +${amount} XP`,
      date: new Date().toISOString()
    });
    state.journal = state.journal.slice(0, 1000);
    save(state);
    return true;
  }

  function addQuiz(score, total, title) {
    const state = get();
    const safeTotal = Math.max(1, Math.floor(Number(total) || 1));
    const safeScore = Math.max(0, Math.min(safeTotal, Math.floor(Number(score) || 0)));

    state.quizHistory.unshift({
      title: String(title).slice(0, 100),
      score: safeScore,
      total: safeTotal,
      date: new Date().toISOString()
    });
    state.quizHistory = state.quizHistory.slice(0, 500);
    state.journal.unshift({
      id: `quiz-${Date.now()}`,
      type: "Quiz terminé",
      description: `${title} : ${safeScore}/${safeTotal}`,
      date: new Date().toISOString()
    });
    state.journal = state.journal.slice(0, 1000);
    save(state);
  }

  function level() {
    return Math.floor(get().xp / 250) + 1;
  }

  function levelProgress() {
    return get().xp % 250;
  }

  function setTheme(theme) {
    const state = get();
    state.settings.theme = theme === "light" ? "light" : "dark";
    save(state);
    try { localStorage.setItem(THEME_KEY, state.settings.theme); } catch (_) {}
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(get(), null, 2)], {
      type: "application/json;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cyberlab-v5-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importJSON(file) {
    if (!file || file.size > 2 * 1024 * 1024) {
      throw new Error("Fichier absent ou trop volumineux (maximum 2 Mo).");
    }
    const text = await file.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (_) {
      throw new Error("Le fichier n'est pas un JSON valide.");
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Format de sauvegarde incorrect.");
    }
    const imported = normalize(parsed);
    if (!save(imported)) {
      throw new Error("Le navigateur n'a pas pu enregistrer les données.");
    }
    return true;
  }

  function reset() {
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(THEME_KEY);
    } catch (error) {
      console.error("CyberLab : réinitialisation locale impossible.", error);
    }
  }

  return {
    get, save, addJournal, addXP, completeLesson, completeMission,
    addQuiz, level, levelProgress, setTheme, exportJSON, importJSON, reset
  };
})();
