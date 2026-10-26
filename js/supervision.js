
"use strict";

window.CyberSupervision = (() => {
  const servers = [
    { id: "srv-ad", name: "SRV-AD01", role: "Active Directory / DNS", status: "online", cpu: 18, ram: 42, uptime: "12 j 04 h" },
    { id: "srv-web", name: "SRV-WEB01", role: "Serveur web", status: "online", cpu: 32, ram: 61, uptime: "8 j 16 h" },
    { id: "srv-file", name: "SRV-FICHIERS", role: "Partages réseau", status: "warning", cpu: 84, ram: 78, uptime: "5 j 02 h" },
    { id: "srv-backup", name: "SRV-BACKUP", role: "Sauvegardes", status: "offline", cpu: 0, ram: 0, uptime: "Indisponible" },
    { id: "srv-docker", name: "SRV-DOCKER", role: "Conteneurs", status: "online", cpu: 24, ram: 55, uptime: "3 j 11 h" }
  ];

  const events = [
    { time: "09:12", level: "INFO", message: "Contrôle de disponibilité terminé." },
    { time: "09:14", level: "WARN", message: "Utilisation CPU élevée sur SRV-FICHIERS." },
    { time: "09:16", level: "ERROR", message: "Contrôle fictif de SRV-BACKUP en échec." },
    { time: "09:18", level: "INFO", message: "Vérification des métriques terminée." }
  ];

  function render() {
    const rows = servers.map(server => {
      const statusLabel = {
        online: "En ligne",
        warning: "Attention",
        offline: "Indisponible"
      }[server.status];

      return `
        <tr>
          <td><strong>${server.name}</strong><br><span class="muted">${server.role}</span></td>
          <td><span class="status ${server.status}">${statusLabel}</span></td>
          <td>${server.cpu} %</td>
          <td>${server.ram} %</td>
          <td>${server.uptime}</td>
          <td><button class="button small" data-action="inspect-server" data-id="${server.id}">Examiner</button></td>
        </tr>`;
    }).join("");

    const logs = events.map(event => `
      <li class="list-item">
        <strong>${event.time} · ${event.level}</strong>
        <span>${event.message}</span>
      </li>`).join("");

    return `
      <div class="notice warn">
        <strong>Simulation pédagogique</strong>
        <p>Les états, les métriques et les journaux ci-dessous sont fictifs. Ils ne proviennent pas de tes machines.</p>
      </div>
      <section class="section">
        <div class="grid grid-3">
          <div class="card"><span class="stat-label">Serveurs suivis</span><span class="stat-value">${servers.length}</span></div>
          <div class="card"><span class="stat-label">En ligne</span><span class="stat-value">${servers.filter(s => s.status === "online").length}</span></div>
          <div class="card"><span class="stat-label">Alertes à examiner</span><span class="stat-value">${servers.filter(s => s.status !== "online").length}</span></div>
        </div>
      </section>
      <section class="section card">
        <div class="section-heading"><h2>Inventaire des serveurs</h2><span class="tag">Données simulées</span></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Serveur / rôle</th><th>État</th><th>CPU</th><th>RAM</th><th>Disponibilité</th><th>Action</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
        <div id="serverDetail"></div>
      </section>
      <section class="section card">
        <div class="section-heading"><h2>Journal d'événements</h2><span class="tag">Exemple fictif</span></div>
        <ul class="list">${logs}</ul>
        <div class="field">
          <label for="incidentNote">Ton diagnostic ou les actions à prévoir</label>
          <textarea id="incidentNote" placeholder="Ex. : vérifier les journaux, confirmer l'incident, prévenir le responsable..."></textarea>
        </div>
        <button class="button primary" data-action="save-incident">Enregistrer dans le journal de révision</button>
      </section>`;
  }

  function inspect(id) {
    const server = servers.find(item => item.id === id);
    const target = document.getElementById("serverDetail");
    if (!server || !target) return;

    const advice = server.status === "online"
      ? "État nominal dans cette simulation. Continuer les contrôles périodiques."
      : server.status === "warning"
        ? "Examiner la tendance des métriques, les journaux et les tâches en cours avant de conclure."
        : "Vérifier la portée de l'alerte, l'alimentation et la connectivité dans un environnement réel, selon les procédures autorisées.";

    target.innerHTML = `
      <div class="result">
        <h3>Analyse de ${server.name}</h3>
        <p>${advice}</p>
        <p class="muted small-text">Ces données sont simulées et ne permettent pas de conclure sur un serveur réel.</p>
      </div>`;
  }

  return { render, inspect };
})();
