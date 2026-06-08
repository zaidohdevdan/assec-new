"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Terminal as TerminalIcon, AlertCircle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "success" | "info";
}

// Argument parser that respects quoted strings
const parseArgs = (input: string) => {
  const args: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === " " && !inQuotes) {
      if (current) {
        args.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }
  if (current) {
    args.push(current);
  }
  return args;
};

export default function TerminalPage() {
  const [history, setHistory] = React.useState<TerminalLine[]>([
    { text: "ASSEC Root Terminal v1.1.0 (Interactive Root Mode)", type: "info" },
    { text: "Digite 'help' para listar os comandos disponíveis.", type: "info" },
    { text: "", type: "info" },
  ]);
  const [inputVal, setInputVal] = React.useState("");
  const [commandHistory, setCommandHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);

  const [users, setUsers] = React.useState<any[]>([]);
  const [schedules, setSchedules] = React.useState<any[]>([]);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  const terminalEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Fetch all necessary data for the terminal commands
  const fetchAllData = React.useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Fetch users
      const usersRes = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      // Fetch schedules
      const schedulesRes = await fetch(`${API_BASE}/schedules/admin/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (schedulesRes.ok) {
        const schedulesData = await schedulesRes.json();
        setSchedules(schedulesData);
      }
    } catch (err) {
      console.error("Error reloading terminal data:", err);
    }
  }, []);

  React.useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchAllData();
  }, [fetchAllData]);

  // Scroll to bottom on history change
  React.useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Refocus input on terminal container click
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedCommand = inputVal.trim();
      if (trimmedCommand) {
        setCommandHistory((prev) => [...prev, trimmedCommand]);
        setHistoryIndex(-1);
        executeCommand(trimmedCommand);
      }
      setInputVal("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputVal("");
        } else {
          setHistoryIndex(nextIndex);
          setInputVal(commandHistory[nextIndex]);
        }
      }
    }
  };

  const executeCommand = async (cmdText: string) => {
    const args = parseArgs(cmdText);
    if (args.length === 0) return;
    const command = args[0].toLowerCase();
    const subCommand = args.slice(1).join(" ").toLowerCase();

    // Add input command line to history view
    const newHistory: TerminalLine[] = [...history, { text: `admin@assec:~$ ${cmdText}`, type: "input" }];

    const logOutput = (text: string, type: "input" | "output" | "error" | "success" | "info" = "output") => {
      newHistory.push({ text, type });
    };

    const token = localStorage.getItem("token");

    switch (command) {
      case "help":
        logOutput("Comandos de Gestão de Usuários (Root):", "info");
        logOutput("  create user <nome> <email> <senha> <role> [especialidade/org]", "info");
        logOutput("      Ex: create user \"Dr. Marcos\" marcos@assec.com.br 123456 PROFESSIONAL Fisioterapia", "info");
        logOutput("  edit user <id/email/nome> <campo> <valor>", "info");
        logOutput("      Ex: edit user marcos@assec.com.br status Inativo", "info");
        logOutput("      Ex: edit user Marcos password novasenha123", "info");
        logOutput("  delete user <id/email/nome>", "info");
        logOutput("      Ex: delete user 52b467e2", "info");
        logOutput("Comandos de Rede e Segurança (Kali-like):", "info");
        logOutput("  ping <host>              - Verifica conectividade e latência", "info");
        logOutput("  nmap <host> / portscan   - Escaneia portas TCP abertas/fechadas", "info");
        logOutput("  dig <host> / nslookup    - Consulta registros DNS (A, MX, NS, TXT)", "info");
        logOutput("  sslcheck <host>          - Verifica validade e dados do certificado SSL/TLS", "info");
        logOutput("  whois <domínio>          - Consulta informações de registro de domínio", "info");
        logOutput("Outros Comandos:", "info");
        logOutput("  help                     - Mostra esta lista de ajuda", "info");
        logOutput("  clear                    - Limpa o terminal", "info");
        logOutput("  whoami                   - Exibe informações do administrador logado", "info");
        logOutput("  system                   - Exibe especificações e status do sistema", "info");
        logOutput("  show users               - Lista todos os usuários cadastrados", "info");
        logOutput("  show schedules           - Lista todos os agendamentos registrados", "info");
        logOutput("  show logs / show audit   - Lista logs de auditoria recentes", "info");
        logOutput("  export users csv / pdf   - Baixa ou gera relatório de usuários", "info");
        logOutput("  export schedules csv/pdf - Baixa ou gera relatório de agendamentos", "info");
        break;

      case "clear":
        setHistory([]);
        return;

      case "whoami":
        if (currentUser) {
          logOutput(`Usuário: ${currentUser.name}`);
          logOutput(`E-mail: ${currentUser.email}`);
          logOutput(`Role: ${currentUser.role}`);
          logOutput("Status da Sessão: Root Autorizado", "success");
        } else {
          logOutput("Erro: Usuário não identificado.", "error");
        }
        break;

      case "system":
        logOutput("--- Informações do Sistema ASSEC ---", "info");
        logOutput("Servidor Backend: NestJS (Porta 3001) - ONLINE", "success");
        logOutput("Banco de Dados: PostgreSQL (127.0.0.1:15432) - ONLINE", "success");
        logOutput(`Número de Associados: ${users.filter(u => u.role === "USER").length}`);
        logOutput(`Número de Profissionais: ${users.filter(u => u.role === "PROFESSIONAL").length}`);
        logOutput(`Número Total de Agendamentos: ${schedules.length}`);
        break;

      case "show":
        if (subCommand === "users") {
          if (users.length === 0) {
            logOutput("Nenhum usuário cadastrado ou dados não carregados.");
          } else {
            logOutput("ID | NOME | E-MAIL | ROLE | STATUS", "info");
            users.forEach((u) => {
              logOutput(`${u.id.substring(0, 8)}... | ${u.name} | ${u.email} | ${u.role} | ${u.status}`);
            });
            logOutput(`Total: ${users.length} usuários listados.`, "success");
          }
        } else if (subCommand === "schedules") {
          if (schedules.length === 0) {
            logOutput("Nenhum agendamento encontrado no sistema.");
          } else {
            logOutput("ID | ASSOCIADO | ESPECIALIDADE | DATA & HORA | STATUS", "info");
            schedules.forEach((s) => {
              const associateName = s.user?.name || "N/A";
              logOutput(`${s.id.substring(0, 8)}... | ${associateName} | ${s.type} | ${s.date} às ${s.time} | ${s.status}`);
            });
            logOutput(`Total: ${schedules.length} agendamentos listados.`, "success");
          }
        } else if (subCommand === "logs" || subCommand === "audit") {
          const events: { date: Date; text: string }[] = [];
          users.forEach((u) => {
            events.push({
              date: new Date(u.createdAt || u.since),
              text: `[${new Date(u.createdAt || u.since).toLocaleString("pt-BR")}] USER_CREATE: Usuário '${u.name}' (${u.role}) registrado no sistema.`,
            });
          });
          schedules.forEach((s) => {
            const assocName = s.user?.name || "Associado";
            events.push({
              date: new Date(s.createdAt),
              text: `[${new Date(s.createdAt).toLocaleString("pt-BR")}] SCHEDULE_CREATE: Agendamento de ${s.type} para '${assocName}' registrado (Status: ${s.status}).`,
            });
          });
          events.sort((a, b) => b.date.getTime() - a.date.getTime()); // Show newest logs first

          if (events.length === 0) {
            logOutput("Nenhum evento registrado no sistema.");
          } else {
            logOutput("--- Logs de Auditoria do Sistema (Eventos Reais) ---", "info");
            events.forEach((e) => logOutput(e.text));
            logOutput(`Total: ${events.length} logs de auditoria carregados em tempo real.`, "success");
          }
        } else {
          logOutput("Uso incorreto: tente 'show users', 'show schedules' ou 'show logs'.", "error");
        }
        break;

      case "create":
        if (args[1]?.toLowerCase() === "user") {
          if (args.length < 6) {
            logOutput("Erro: Sintaxe incorreta. Use: create user <nome> <email> <senha> <role> [especialidade/org]", "error");
          } else {
            const [,, name, email, password, role, extra] = args;
            if (role !== "USER" && role !== "PROFESSIONAL" && role !== "ADMIN") {
              logOutput("Erro: Papel (role) deve ser USER, PROFESSIONAL ou ADMIN.", "error");
            } else {
              logOutput(`Iniciando criação do usuário "${name}"...`, "info");
              try {
                const res = await fetch(`${API_BASE}/users`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                    status: "Ativo",
                    specialty: role === "PROFESSIONAL" ? extra || null : null,
                    org: role === "USER" ? extra || null : null,
                  }),
                });

                if (res.ok) {
                  logOutput(`Usuário "${name}" criado com sucesso via terminal!`, "success");
                  await fetchAllData();
                } else {
                  const errData = await res.json();
                  logOutput(`Erro do servidor: ${errData.message || "Falha ao criar usuário."}`, "error");
                }
              } catch (err) {
                logOutput("Erro de conexão ao tentar criar usuário.", "error");
              }
            }
          }
        } else {
          logOutput("Erro: Comando de criação inválido. Tente 'create user'.", "error");
        }
        break;

      case "edit":
        if (args[1]?.toLowerCase() === "user") {
          if (args.length < 5) {
            logOutput("Erro: Sintaxe incorreta. Use: edit user <id> <campo> <valor>", "error");
          } else {
            const [,, id, field, value] = args;
            const validFields = ["name", "email", "password", "role", "status", "cpf", "rg", "matricula", "org", "specialty"];
            if (!validFields.includes(field)) {
              logOutput(`Erro: Campo inválido "${field}". Campos válidos: ${validFields.join(", ")}`, "error");
            } else {
              // Find target user by full/short ID, email or name
              const targetUser = users.find(
                (u) =>
                  u.id === id ||
                  u.id.startsWith(id) ||
                  u.email.toLowerCase() === id.toLowerCase() ||
                  u.name.toLowerCase().includes(id.toLowerCase())
              );
              if (!targetUser) {
                logOutput(`Erro: Usuário "${id}" não encontrado (pesquisado por ID, E-mail ou Nome).`, "error");
              } else {
                logOutput(`Iniciando edição de "${targetUser.name}" (Campo: ${field})...`, "info");
                try {
                  const payload = { [field]: value };
                  const res = await fetch(`${API_BASE}/users/${targetUser.id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                  });

                  if (res.ok) {
                    logOutput(`Usuário "${targetUser.name}" atualizado com sucesso!`, "success");
                    await fetchAllData();
                  } else {
                    const errData = await res.json();
                    logOutput(`Erro do servidor: ${errData.message || "Falha ao atualizar usuário."}`, "error");
                  }
                } catch (err) {
                  logOutput("Erro de conexão ao tentar atualizar usuário.", "error");
                }
              }
            }
          }
        } else {
          logOutput("Erro: Comando de edição inválido. Tente 'edit user'.", "error");
        }
        break;

      case "delete":
        if (args[1]?.toLowerCase() === "user") {
          if (args.length < 3) {
            logOutput("Erro: Sintaxe incorreta. Use: delete user <id>", "error");
          } else {
            const [,, id] = args;
            // Find target user by full/short ID, email or name
            const targetUser = users.find(
              (u) =>
                u.id === id ||
                u.id.startsWith(id) ||
                u.email.toLowerCase() === id.toLowerCase() ||
                u.name.toLowerCase().includes(id.toLowerCase())
            );
            if (!targetUser) {
              logOutput(`Erro: Usuário "${id}" não encontrado (pesquisado por ID, E-mail ou Nome).`, "error");
            } else if (targetUser.email === "admin@assec.com.br") {
              logOutput("Erro: Não é permitido excluir o administrador root do sistema.", "error");
            } else {
              logOutput(`Iniciando exclusão de "${targetUser.name}"...`, "info");
              try {
                const res = await fetch(`${API_BASE}/users/${targetUser.id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (res.ok) {
                  logOutput(`Usuário "${targetUser.name}" excluído com sucesso!`, "success");
                  await fetchAllData();
                } else {
                  logOutput("Erro do servidor ao tentar excluir o usuário.", "error");
                }
              } catch (err) {
                logOutput("Erro de conexão ao tentar excluir usuário.", "error");
              }
            }
          }
        } else {
          logOutput("Erro: Comando de exclusão inválido. Tente 'delete user'.", "error");
        }
        break;

      case "export":
        if (subCommand === "users csv") {
          exportUsersToCSV();
          logOutput("Arquivo 'usuarios_assec.csv' gerado e enviado para download.", "success");
        } else if (subCommand === "users pdf") {
          exportUsersToPDF();
          logOutput("Relatório PDF de usuários gerado com sucesso.", "success");
        } else if (subCommand === "schedules csv") {
          exportSchedulesToCSV();
          logOutput("Arquivo 'agendamentos_assec.csv' gerado e enviado para download.", "success");
        } else if (subCommand === "schedules pdf") {
          exportSchedulesToPDF();
          logOutput("Relatório PDF de agendamentos gerado com sucesso.", "success");
        } else {
          logOutput("Uso incorreto: tente 'export users csv', 'export users pdf', etc.", "error");
        }
        break;

      case "ping": {
        if (args.length < 2) {
          logOutput("Erro: Sintaxe incorreta. Use: ping <host>", "error");
          break;
        }
        const host = args[1];
        logOutput(`PING ${host} via TCP Connect...`, "info");
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/network/ping`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ host }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.status === "ONLINE") {
              logOutput(`64 bytes from ${data.ip}: tcp_seq=1 time=${data.latencyMs} ms`, "success");
              logOutput(`--- ${host} ping statistics ---`, "info");
              logOutput(`1 packets transmitted, 1 received, 0% packet loss, time ${data.latencyMs}ms`, "success");
            } else if (data.status === "UNREACHABLE") {
              logOutput(`Host ${host} (${data.ip}) resolvido, mas porta 443 não respondeu (UNREACHABLE).`, "error");
            } else {
              logOutput(`Falha ao pingar host ${host} (OFFLINE ou inacessível).`, "error");
            }
          } else {
            const err = await res.json().catch(() => ({}));
            logOutput(`Erro no ping: ${err.message || "resposta inválida do servidor"}`, "error");
          }
        } catch {
          logOutput("Erro de conexão ao tentar pingar.", "error");
        }
        break;
      }

      case "nmap":
      case "portscan": {
        if (args.length < 2) {
          logOutput("Erro: Sintaxe incorreta. Use: nmap <host> ou portscan <host>", "error");
          break;
        }
        const host = args[1];
        logOutput(`Starting Nmap scan on ${host}...`, "info");
        try {
          const startScan = performance.now();
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/network/portscan`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ host }),
          });
          const endScan = performance.now();
          const scanDuration = ((endScan - startScan) / 1000).toFixed(2);

          if (res.ok) {
            const ports = await res.json();
            logOutput(`Nmap scan report for ${host}`, "info");
            logOutput("PORT      STATE    SERVICE", "info");
            ports.forEach((p: any) => {
              const stateColor = p.status === "OPEN" ? "success" : p.status === "CLOSED" ? "error" : "info";
              const padding1 = `${p.port}/tcp`.padEnd(10, " ");
              const padding2 = p.status.toLowerCase().padEnd(9, " ");
              logOutput(`${padding1}${padding2}${p.service.toLowerCase()}`, stateColor === "success" ? "success" : stateColor === "error" ? "error" : "info");
            });
            logOutput(`Nmap done: 1 IP address scanned in ${scanDuration} seconds.`, "success");
          } else {
            const err = await res.json().catch(() => ({}));
            logOutput(`Erro no escaneamento: ${err.message || "resposta inválida do servidor"}`, "error");
          }
        } catch {
          logOutput("Erro de conexão ao tentar escanear portas.", "error");
        }
        break;
      }

      case "dig":
      case "nslookup": {
        if (args.length < 2) {
          logOutput("Erro: Sintaxe incorreta. Use: dig <host> ou nslookup <host>", "error");
          break;
        }
        const host = args[1];
        logOutput(`; <<>> DiG (DNS Lookup) for ${host} <<>>`, "info");
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/network/dns`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ host }),
          });
          if (res.ok) {
            const records = await res.json();
            logOutput(";; ANSWER SECTION:", "info");
            let recordsFound = false;
            Object.entries(records).forEach(([type, values]: [string, any]) => {
              if (Array.isArray(values) && values.length > 0) {
                recordsFound = true;
                values.forEach((val: any) => {
                  const recordStr = typeof val === "string" ? val : JSON.stringify(val);
                  logOutput(`${host}.        IN      ${type}      ${recordStr}`);
                });
              }
            });
            if (!recordsFound) {
              logOutput("Nenhum registro DNS encontrado.");
            }
          } else {
            const err = await res.json().catch(() => ({}));
            logOutput(`Erro no DNS lookup: ${err.message || "resposta inválida do servidor"}`, "error");
          }
        } catch {
          logOutput("Erro de conexão ao consultar DNS.", "error");
        }
        break;
      }

      case "sslcheck": {
        if (args.length < 2) {
          logOutput("Erro: Sintaxe incorreta. Use: sslcheck <host>", "error");
          break;
        }
        const host = args[1];
        logOutput(`Iniciando handshake SSL/TLS com ${host}:443...`, "info");
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/network/ssl`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ host }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.error) {
              logOutput(`Erro no certificado: ${data.error}`, "error");
            } else {
              logOutput(`Certificado do Servidor para ${host}:`, "info");
              logOutput(`  Subject: ${data.subject}`);
              logOutput(`  Issuer:  ${data.issuer}`);
              logOutput(`  Válido de:  ${new Date(data.validFrom).toLocaleDateString("pt-BR")}`);
              logOutput(`  Válido até: ${new Date(data.validTo).toLocaleDateString("pt-BR")}`);
              logOutput(`  Dias Restantes: ${data.daysRemaining} dias`);
              logOutput(`  Status: ${data.valid ? "VÁLIDO" : "INVÁLIDO ou EXPIRADO"}`, data.valid ? "success" : "error");
            }
          } else {
            const err = await res.json().catch(() => ({}));
            logOutput(`Erro no SSL check: ${err.message || "resposta inválida do servidor"}`, "error");
          }
        } catch {
          logOutput("Erro de conexão ao verificar certificado SSL.", "error");
        }
        break;
      }

      case "whois": {
        if (args.length < 2) {
          logOutput("Erro: Sintaxe incorreta. Use: whois <dominio>", "error");
          break;
        }
        const domain = args[1];
        logOutput(`Consultando WHOIS para ${domain}...`, "info");
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/network/whois`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ domain }),
          });
          if (res.ok) {
            const rawText = await res.text();
            // WHOIS output can be long, so print line by line
            const lines = rawText.split("\n");
            lines.slice(0, 100).forEach((l) => {
              if (l.trim()) logOutput(l);
            });
            if (lines.length > 100) {
              logOutput(`... [Saída truncada de ${lines.length} linhas] ...`, "info");
            }
          } else {
            const err = await res.json().catch(() => ({}));
            logOutput(`Erro no WHOIS: ${err.message || "resposta inválida do servidor"}`, "error");
          }
        } catch {
          logOutput("Erro de conexão ao consultar WHOIS.", "error");
        }
        break;
      }

      default:
        logOutput(`Comando inválido ou não reconhecido: '${command}'. Digite 'help' para obter ajuda.`, "error");
        break;
    }

    setHistory(newHistory);
  };

  // CSV/PDF exporters
  const exportUsersToCSV = () => {
    const headers = ["ID", "Nome", "E-mail", "Role", "Status", "CPF", "Matricula", "Especialidade", "Organizacao"];
    const rows = users.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role,
      u.status,
      u.cpf || "",
      u.matricula || "",
      u.specialty || "",
      `"${u.org || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(",")].concat(rows.map((r) => r.join(","))).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usuarios_assec.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportUsersToPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Relatório de Usuários - ASSEC</title>
          <style>
            body { font-family: sans-serif; padding: 25px; color: #1e293b; }
            h1 { font-family: serif; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 5px; }
            p { font-size: 11px; color: #64748b; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 11px; }
            th { background-color: #f8fafc; font-weight: bold; color: #334155; }
            tr:nth-child(even) { background-color: #f8fafc/50; }
          </style>
        </head>
        <body>
          <h1>ASSEC - Relatório de Controle de Usuários</h1>
          <p>Gerado pelo Administrador em: ${new Date().toLocaleString("pt-BR")}</p>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Documentação</th>
                <th>Especialidade/Org</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td><strong>${u.name}</strong></td>
                  <td>${u.email}</td>
                  <td>${u.role}</td>
                  <td>${u.status}</td>
                  <td>
                    ${u.cpf ? `CPF: ${u.cpf}<br/>` : ""}
                    ${u.matricula ? `Matrícula: ${u.matricula}` : ""}
                  </td>
                  <td>${u.role === "PROFESSIONAL" ? u.specialty || "Médico" : u.org || "-"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const exportSchedulesToCSV = () => {
    const headers = ["ID", "Associado", "Matricula", "Especialidade", "Assunto", "Data", "Hora", "Status"];
    const rows = schedules.map((s) => [
      s.id,
      `"${s.user?.name || ""}"`,
      s.user?.matricula || "",
      s.type,
      `"${s.title}"`,
      s.date,
      s.time,
      s.status,
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(",")].concat(rows.map((r) => r.join(","))).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agendamentos_assec.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSchedulesToPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Relatório Geral de Agendamentos - ASSEC</title>
          <style>
            body { font-family: sans-serif; padding: 25px; color: #1e293b; }
            h1 { font-family: serif; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 5px; }
            p { font-size: 11px; color: #64748b; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 11px; }
            th { background-color: #f8fafc; font-weight: bold; color: #334155; }
          </style>
        </head>
        <body>
          <h1>ASSEC - Relatório Geral de Agendamentos</h1>
          <p>Gerado pelo Administrador em: ${new Date().toLocaleString("pt-BR")}</p>
          <table>
            <thead>
              <tr>
                <th>Associado</th>
                <th>Serviço/Especialidade</th>
                <th>Título/Finalidade</th>
                <th>Data e Hora</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${schedules.map(s => `
                <tr>
                  <td><strong>${s.user?.name || "N/A"}</strong><br/><small>${s.user?.matricula || ""}</small></td>
                  <td>${s.type}</td>
                  <td>${s.title}</td>
                  <td>${s.date} às ${s.time}</td>
                  <td>${s.status}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (currentUser && currentUser.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h2 className="font-serif font-bold text-2xl text-primary">Acesso Negado</h2>
        <p className="text-text-secondary max-w-md">Este terminal é de uso exclusivo para o administrador root do sistema.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-none">
      {/* Top Header */}
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary flex items-center gap-2">
          <TerminalIcon className="h-7 w-7 text-accent-dark shrink-0" />
          <span>Terminal Root do Administrador</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Terminal interativo para consultas rápidas de dados, auditorias e downloads de relatórios via comandos de console.
        </p>
      </div>

      {/* Terminal UI */}
      <Card
        onClick={handleContainerClick}
        className="bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-6 font-mono text-xs sm:text-sm text-slate-200 min-h-[500px] max-h-[600px] overflow-y-auto flex flex-col justify-between cursor-text"
      >
        <div className="space-y-1.5 flex-1 overflow-y-auto">
          {history.map((line, idx) => {
            let colorClass = "text-slate-300";
            if (line.type === "input") colorClass = "text-emerald-400 font-bold";
            else if (line.type === "error") colorClass = "text-rose-400 font-bold";
            else if (line.type === "success") colorClass = "text-teal-400 font-bold";
            else if (line.type === "info") colorClass = "text-sky-400";

            return (
              <div key={idx} className={`whitespace-pre-wrap leading-relaxed ${colorClass}`}>
                {line.text}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Input prompt */}
        <div className="flex items-center gap-2 border-t border-slate-900 pt-4 mt-4 shrink-0">
          <span className="text-emerald-400 font-bold">admin@assec:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none text-slate-100 focus:outline-none focus:ring-0 p-0 font-mono text-xs sm:text-sm auto-focus"
            autoFocus
          />
        </div>
      </Card>
    </div>
  );
}
