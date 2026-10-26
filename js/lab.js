
"use strict";

window.CyberLab = (() => {
  function parseIPv4(value) {
    const parts = String(value).trim().split(".");
    if (parts.length !== 4) return null;
    const octets = parts.map(part =>
      /^\d{1,3}$/.test(part) ? Number(part) : NaN
    );
    if (octets.some(n => !Number.isInteger(n) || n < 0 || n > 255)) return null;
    return octets;
  }

  function toInt(octets) {
    return (((octets[0] << 24) >>> 0) +
      (octets[1] << 16) + (octets[2] << 8) + octets[3]) >>> 0;
  }

  function toIPv4(value) {
    return [
      (value >>> 24) & 255,
      (value >>> 16) & 255,
      (value >>> 8) & 255,
      value & 255
    ].join(".");
  }

  function calculate(ipText, prefixText) {
    const ip = parseIPv4(ipText);
    const prefix = Number(prefixText);

    if (!ip) throw new Error("Adresse IPv4 invalide.");
    if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
      throw new Error("Le préfixe doit être compris entre /0 et /32.");
    }

    const ipInt = toInt(ip);
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const total = Math.pow(2, 32 - prefix);
    const first = prefix <= 30 ? network + 1 : network;
    const last = prefix <= 30 ? broadcast - 1 : broadcast;
    const usable = prefix <= 30 ? Math.max(0, total - 2) : total;

    return {
      ip: ip.join("."),
      prefix,
      mask: toIPv4(mask),
      network: toIPv4(network),
      broadcast: toIPv4(broadcast),
      first: toIPv4(first >>> 0),
      last: toIPv4(last >>> 0),
      total,
      usable
    };
  }

  function simulatedCommand(command) {
    const cmd = String(command).trim().toLowerCase();

    const responses = {
      help: [
        "CyberLab Academy — console pédagogique",
        "Commandes : help, ipconfig, ip addr, ip route, ping 192.168.10.1, clear",
        "Aucune commande système réelle n'est exécutée."
      ],
      ipconfig: [
        "Configuration réseau simulée",
        "Interface Ethernet pédagogique",
        "IPv4 : 192.168.10.25",
        "Masque : 255.255.255.0",
        "Passerelle : 192.168.10.1",
        "DNS : 192.168.10.10"
      ],
      "ip addr": [
        "Simulation : interface eth0",
        "inet 192.168.10.25/24",
        "state UP"
      ],
      "ip route": [
        "Table de routage simulée",
        "default via 192.168.10.1 dev eth0",
        "192.168.10.0/24 dev eth0"
      ]
    };

    if (cmd === "clear") return [];
    if (responses[cmd]) return responses[cmd];

    if (/^ping\s+/.test(cmd)) {
      const target = cmd.replace(/^ping\s+/, "").trim();
      if (!parseIPv4(target)) return ["Erreur : indique une adresse IPv4 valide."];
      return [
        `Simulation de ping vers ${target}`,
        "Réponse fictive : délai=1 ms TTL=64",
        "Bilan fictif : 4 envoyés, 4 reçus, 0 perdus",
        "Aucun paquet réseau réel n'a été envoyé."
      ];
    }

    return [`Commande inconnue : ${command}`, "Saisis help pour voir les commandes disponibles."];
  }

  return { parseIPv4, calculate, simulatedCommand };
})();
