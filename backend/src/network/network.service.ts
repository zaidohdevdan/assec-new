import { Injectable } from '@nestjs/common';
import * as dns from 'dns';
import * as net from 'net';
import * as tls from 'tls';

@Injectable()
export class NetworkService {
  /**
   * Real ping via TCP connection measurement.
   */
  async ping(host: string): Promise<{
    ip: string;
    latencyMs: number;
    status: 'ONLINE' | 'OFFLINE' | 'UNREACHABLE';
  }> {
    const start = performance.now();
    try {
      // 1. Resolve DNS first
      const lookupResult = await dns.promises.lookup(host);
      const ip = lookupResult.address;

      // 2. Try to connect to port 80 or 443 to measure TCP latency
      const targetPort = 443;
      const status = await this.tcpConnect(ip, targetPort, 1500);

      const end = performance.now();
      const latencyMs = Math.round(end - start);

      return {
        ip,
        latencyMs,
        status: status ? 'ONLINE' : 'UNREACHABLE',
      };
    } catch (err) {
      return {
        ip: '0.0.0.0',
        latencyMs: 0,
        status: 'OFFLINE',
      };
    }
  }

  /**
   * Real port scanner (similar to Nmap) for a set of standard ports.
   */
  async portScan(
    host: string,
  ): Promise<
    { port: number; service: string; status: 'OPEN' | 'CLOSED' | 'FILTERED' }[]
  > {
    const targetPorts = [
      { port: 21, service: 'FTP' },
      { port: 22, service: 'SSH' },
      { port: 23, service: 'Telnet' },
      { port: 25, service: 'SMTP' },
      { port: 53, service: 'DNS' },
      { port: 80, service: 'HTTP' },
      { port: 110, service: 'POP3' },
      { port: 443, service: 'HTTPS' },
      { port: 1433, service: 'MSSQL' },
      { port: 3306, service: 'MySQL' },
      { port: 5432, service: 'PostgreSQL' },
      { port: 8080, service: 'HTTP-Alt' },
    ];

    let ip: string;
    try {
      const lookup = await dns.promises.lookup(host);
      ip = lookup.address;
    } catch {
      throw new Error(`Não foi possível resolver o host: ${host}`);
    }

    const results = await Promise.all(
      targetPorts.map(async ({ port, service }) => {
        const result = await this.checkPort(ip, port, 800);
        return { port, service, status: result };
      }),
    );

    return results;
  }

  /**
   * Real DNS Records Lookup (similar to nslookup/dig).
   */
  async dnsLookup(
    host: string,
  ): Promise<Record<string, string[] | dns.MxRecord[] | string[][]>> {
    const records: Record<string, string[] | dns.MxRecord[] | string[][]> = {};

    try {
      records.A = await dns.promises.resolve4(host).catch(() => []);
    } catch {}

    try {
      records.AAAA = await dns.promises.resolve6(host).catch(() => []);
    } catch {}

    try {
      records.MX = await dns.promises.resolveMx(host).catch(() => []);
    } catch {}

    try {
      records.TXT = await dns.promises.resolveTxt(host).catch(() => []);
    } catch {}

    try {
      records.NS = await dns.promises.resolveNs(host).catch(() => []);
    } catch {}

    return records;
  }

  /**
   * Real SSL/TLS Certificate check.
   */
  async sslCheck(host: string): Promise<{
    valid: boolean;
    validFrom?: string;
    validTo?: string;
    daysRemaining?: number;
    issuer?: string;
    subject?: string;
    error?: string;
  }> {
    return new Promise((resolve) => {
      const socket = tls.connect(
        {
          host,
          port: 443,
          servername: host, // SNI support
          rejectUnauthorized: false, // Don't throw on self-signed (let us inspect it)
          timeout: 2500,
        },
        () => {
          const cert = socket.getPeerCertificate(true);
          socket.end();

          if (!cert || Object.keys(cert).length === 0) {
            resolve({ valid: false, error: 'Certificado não encontrado' });
            return;
          }

          const validFrom = cert.valid_from;
          const validTo = cert.valid_to;
          const validToMs = Date.parse(validTo);
          const daysRemaining = Math.max(
            0,
            Math.round((validToMs - Date.now()) / (1000 * 60 * 60 * 24)),
          );

          const getCN = (
            field: { CN?: string | string[] } | string | undefined,
          ) => {
            if (!field) return undefined;
            if (typeof field === 'string') return field;
            const cn = field.CN;
            if (Array.isArray(cn)) return cn.join(', ');
            return cn;
          };

          const issuer = getCN(cert.issuer);
          const subject = getCN(cert.subject);

          // Check if socket was authorized
          const valid = socket.authorized && daysRemaining > 0;

          resolve({
            valid,
            validFrom,
            validTo,
            daysRemaining,
            issuer,
            subject,
          });
        },
      );

      socket.on('error', (err) => {
        resolve({ valid: false, error: err.message });
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve({ valid: false, error: 'Timeout ao tentar conectar TLS' });
      });
    });
  }

  /**
   * Real WHOIS client that queries IANA port 43.
   */
  async whois(domain: string): Promise<string> {
    const cleanDomain = domain.trim().toLowerCase();

    // First query IANA to find the responsible registrar whois server
    const ianaResponse = await this.queryWhoisServer(
      'whois.iana.org',
      cleanDomain,
    );

    const referMatch = ianaResponse.match(/refer:\s+([a-zA-Z0-9.-]+)/i);
    if (referMatch && referMatch[1]) {
      const referServer = referMatch[1].trim();
      // Query the specific registrar whois server
      return this.queryWhoisServer(referServer, cleanDomain);
    }

    return ianaResponse;
  }

  // Helper TCP connect
  private tcpConnect(
    ip: string,
    port: number,
    timeout: number,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(timeout);

      socket.connect(port, ip, () => {
        socket.end();
        resolve(true);
      });

      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
    });
  }

  // Helper port checker that distinguishes closed vs filtered
  private checkPort(
    ip: string,
    port: number,
    timeout: number,
  ): Promise<'OPEN' | 'CLOSED' | 'FILTERED'> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(timeout);

      socket.connect(port, ip, () => {
        socket.end();
        resolve('OPEN');
      });

      socket.on('error', (err: NodeJS.ErrnoException) => {
        socket.destroy();
        if (err.code === 'ECONNREFUSED') {
          resolve('CLOSED');
        } else {
          resolve('FILTERED');
        }
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve('FILTERED');
      });
    });
  }

  // Helper WHOIS TCP socket query
  private queryWhoisServer(server: string, query: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      let buffer = '';

      socket.setTimeout(5000);

      socket.connect(43, server, () => {
        socket.write(`${query}\r\n`);
      });

      socket.on('data', (data) => {
        buffer += data.toString();
      });

      socket.on('end', () => {
        resolve(buffer);
      });

      socket.on('error', (err) => {
        socket.destroy();
        resolve(`Erro ao consultar servidor WHOIS ${server}: ${err.message}`);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(`Timeout ao consultar servidor WHOIS ${server}`);
      });
    });
  }
}
