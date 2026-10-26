
(() => {
  "use strict";

  const devices = [
    { name: "SRV-AD01", ip: "192.168.10.10", type: "Windows Server", status: "online" },
    { name: "PC-CLIENT01", ip: "192.168.10.20", type: "Windows 11", status: "online" },
    { name: "SRV-LINUX01", ip: "192.168.10.30", type: "Debian Linux", status: "warning" },
    { name: "SRV-WEB01", ip: "192.168.10.40", type: "Serveur web", status: "online" }
  ];

  const logs = [
    { time: "09:14:02", level: "info", source: "SRV-AD01", message: "Service d'annuaire disponible." },
    { time: "09:17:43", level: "warning", source: "SRV-LINUX01", message: "Espace disque simulé : seuil d'alerte atteint." },
    { time: "09:20:11", level: "critical", source: "SRV-LINUX01", message: "Exemple pédagogique : échec de connexion à un service." },
    { time: "09:22:30", level: "info", source: "PC-CLIENT01", message: "Poste client présent dans la simulation." }
  ];

  let visibleLogs = [...logs];

  function renderDevices() {
    const container = document.getElementById("devicesList");
    if (!container) return;
    container.replaceChildren();

    devices.forEach(device => {
      const row = document.createElement("div");
      row.className = "device-row";

      const info = document.createElement("div");
      info.className = "device-info";

      const name = document.createElement("strong");
      name.textContent = device.name;

      const description = document.createElement("small");
      description.textContent = device.type + " • " + device.ip;
      info.append(name, description);

      const status = document.createElement("span");
      status.className = "device-status " + device.status;
      status.textContent = {
        online: "● En ligne",
        warning: "▲ À surveiller",
        offline: "● Hors ligne"
      }[device.status];

      row.append(info, status);
      container.appendChild(row);
    });

    const online = devices.filter(d => d.status === "online").length;
    document.getElementById("onlineCount").textContent = online;
    document.getElementById("alertCount").textContent =
      devices.filter(d => d.status !== "online").length;
  }

  function renderLogs() {
    const container = document.getElementById("logsList");
    if (!container) return;
    container.replaceChildren();

    if (!visibleLogs.length) {
      const empty = document.createElement("p");
      empty.className = "card-meta";
      empty.textContent = "Aucun événement affiché.";
      container.appendChild(empty);
      return;
    }

    visibleLogs.forEach(log => {
      const row = document.createElement("div");
      row.className = "log-row";

      const level = document.createElement("span");
      level.className = "log-severity " + log.level;
      level.textContent = {
        info: "INFO",
        warning: "ALERTE",
        critical: "CRITIQUE"
      }[log.level] || "INFO";

      const content = document.createElement("div");
      const message = document.createElement("p");
      message.textContent = log.message;

      const detail = document.createElement("small");
      detail.textContent = log.time + " • " + log.source;
      content.append(message, detail);

      row.append(level, content);
      container.appendChild(row);
    });
  }

  function refresh() {
    renderDevices();
    renderLogs();
    window.CyberApp?.notify("Données de démonstration actualisées.");
  }

  function init() {
    renderDevices();
    renderLogs();

    document.getElementById("refreshMonitoring")
      ?.addEventListener("click", refresh);

    document.getElementById("clearLogs")
      ?.addEventListener("click", () => {
        visibleLogs = [];
        renderLogs();
      });
  }

  window.CyberSupervision = { renderDevices, renderLogs, refresh };

  document.addEventListener("DOMContentLoaded", init);
})();
