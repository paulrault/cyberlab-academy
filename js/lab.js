
(() => {
  "use strict";

  function parseIPv4(value) {
    const parts = value.trim().split(".");
    if (parts.length !== 4) return null;

    const nums = parts.map(part => {
      if (!/^\d{1,3}$/.test(part)) return NaN;
      return Number(part);
    });

    if (nums.some(n => !Number.isInteger(n) || n < 0 || n > 255)) {
      return null;
    }

    return nums;
  }

  function toNumber(ip) {
    return ip.reduce((result, part) => result * 256 + part, 0);
  }

  function isContiguousMask(mask) {
    const n = toNumber(mask);
    const inverted = (~n) >>> 0;
    return (inverted & (inverted + 1)) === 0;
  }

  function sameSubnet(ip, gateway, mask) {
    return (toNumber(ip) & toNumber(mask)) ===
      (toNumber(gateway) & toNumber(mask));
  }

  function testConfiguration(values) {
    const ip = parseIPv4(values.ip);
    const mask = parseIPv4(values.mask);
    const gateway = parseIPv4(values.gateway);
    const dns = parseIPv4(values.dns);
    const errors = [];

    if (!ip) errors.push("L'adresse IP est invalide.");
    if (!mask || !isContiguousMask(mask)) {
      errors.push("Le masque réseau est invalide ou non contigu.");
    }
    if (!gateway) errors.push("La passerelle est invalide.");
    if (!dns) errors.push("Le serveur DNS est invalide.");

    if (errors.length) return { ok: false, errors };

    const maskNumber = toNumber(mask);
    const prefix = maskNumber.toString(2).replace(/0/g, "").length;
    const hostBits = 32 - prefix;

    if (prefix < 1 || prefix > 30) {
      errors.push("Utilise ici un masque IPv4 classique entre /1 et /30.");
    }

    if (sameSubnet(ip, gateway, mask) === false) {
      errors.push("La passerelle n'appartient pas au même sous-réseau.");
    }

    const ipNumber = toNumber(ip);
    const network = ipNumber & maskNumber;
    const broadcast = (network | (~maskNumber >>> 0)) >>> 0;

    if (hostBits > 1 && (ipNumber === network || ipNumber === broadcast)) {
      errors.push("L'adresse IP correspond à l'adresse réseau ou de diffusion.");
    }

    if (ipNumber === toNumber(gateway)) {
      errors.push("L'adresse IP du poste ne doit pas être celle de la passerelle.");
    }

    return {
      ok: errors.length === 0,
      errors,
      prefix,
      network: [
        (network >>> 24) & 255,
        (network >>> 16) & 255,
        (network >>> 8) & 255,
        network & 255
      ].join(".")
    };
  }

  function appendTerminal(text, prompt = "$") {
    const output = document.getElementById("terminalOutput");
    if (!output) return;

    const line = document.createElement("p");
    const prefix = document.createElement("span");
    prefix.className = "terminal-prompt";
    prefix.textContent = prompt + " ";
    line.append(prefix, document.createTextNode(text));
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function runCommand(command) {
    const ip = document.getElementById("ipAddress")?.value || "192.168.10.20";
    const mask = document.getElementById("subnetMask")?.value || "255.255.255.0";
    const gateway = document.getElementById("gateway")?.value || "192.168.10.1";
    const dns = document.getElementById("dnsAddress")?.value || "192.168.10.10";

    if (command === "clear") {
      document.getElementById("terminalOutput").replaceChildren();
      appendTerminal("Console effacée.");
      return;
    }

    if (command === "ipconfig") {
      appendTerminal("ipconfig (simulation)");
      appendTerminal("Adresse IPv4 . . . : " + ip);
      appendTerminal("Masque . . . . . . : " + mask);
      appendTerminal("Passerelle . . . . : " + gateway);
      appendTerminal("DNS . . . . . . . : " + dns);
      return;
    }

    if (command === "ping") {
      const result = testConfiguration({ ip, mask, gateway, dns });
      if (result.ok) {
        appendTerminal("ping " + gateway + " (simulation)");
        appendTerminal("Réponse simulée : délai < 1 ms, aucune perte.");
      } else {
        appendTerminal("Test simulé impossible : configuration à corriger.");
        result.errors.forEach(error => appendTerminal(error, "!"));
      }
    }
  }

  function init() {
    const form = document.getElementById("networkForm");
    if (!form) return;

    form.addEventListener("submit", event => {
      event.preventDefault();

      const result = testConfiguration({
        ip: document.getElementById("ipAddress").value,
        mask: document.getElementById("subnetMask").value,
        gateway: document.getElementById("gateway").value,
        dns: document.getElementById("dnsAddress").value
      });

      const box = document.getElementById("networkResult");
      box.replaceChildren();
      box.className = "result-box " + (result.ok ? "success" : "error");

      const title = document.createElement("strong");
      title.textContent = result.ok ? "Configuration cohérente" : "Points à corriger";
      box.appendChild(title);

      if (result.ok) {
        const p = document.createElement("p");
        p.textContent = "Réseau détecté : " + result.network + "/" + result.prefix +
          ". Ce test ne garantit pas une connectivité réelle.";
        box.appendChild(p);
        appendTerminal("Configuration cohérente. Réseau : " + result.network + "/" + result.prefix);
      } else {
        const ul = document.createElement("ul");
        result.errors.forEach(error => {
          const li = document.createElement("li");
          li.textContent = error;
          ul.appendChild(li);
        });
        box.appendChild(ul);
        appendTerminal("Configuration à corriger.");
      }
    });

    document.querySelectorAll("[data-command]").forEach(button => {
      button.addEventListener("click", () => runCommand(button.dataset.command));
    });
  }

  window.CyberLabNetwork = { testConfiguration, runCommand };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
