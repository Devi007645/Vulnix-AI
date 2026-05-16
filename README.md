# 🛡️ Vulnix AI - AI-Powered Cybersecurity Platform

![Vulnix AI Hero](./assets/hero.png)

Vulnix AI is a next-generation cybersecurity platform that transforms vulnerability scanning into an autonomous, AI-driven security operation. By leveraging the **Model Context Protocol (MCP)** and a specialized **Multi-Agent Orchestration System**, Vulnix AI provides intelligent infrastructure analysis, real-time container monitoring, and automated remediation roadmaps.

---

## 🚀 Key Capabilities

### 1. Autonomous AI Agent Orchestration
Vulnix AI features a modular agent system where specialized AI entities collaborate to secure your infrastructure:
- **🔍 Recon Agent**: Handles initial discovery, port scanning, and service identification using Nmap.
- **🛡️ Vulnerability Agent**: Performs deep-dive analysis into detected services to identify specific CVEs and misconfigurations.
- **🛠️ DevOps Agent**: Manages infrastructure health, container status, and system-wide monitoring via Docker MCP.
- **🧠 Orchestrator**: Coordinates tasks between agents, ensuring a seamless flow from discovery to remediation.

### 2. MCP-Native Infrastructure (Model Context Protocol)
We've integrated MCP as the backbone for tool communication:
- **Docker MCP Integration**: Enables agents to interact directly with Docker engines for container management and health checks.
- **Supabase MCP Integration**: Streamlines database operations, migrations, and real-time data handling.
- **Extensible Tooling**: Easily plug in new security tools by implementing standard MCP server interfaces.

### 3. Scalable Distributed Architecture
- **Express.js Backend**: Robust API layer managing agent workflows and user interactions.
- **BullMQ & Redis**: High-performance asynchronous task queue for distributed scanning workloads.
- **Dockerized Workers**: Scalable scanner nodes that execute heavy lifting in isolated environments.

### 4. Modern AI Dashboard
- **Real-time Monitoring**: Live updates for agent logs, scan progress, and vulnerability detections via Supabase Real-time.
- **Interactive Agent Console**: Manage and monitor autonomous workflows through a dedicated agent dashboard.
- **AI Remediation**: Human-readable, actionable security advice powered by Google Gemini (1.5 Flash).

---

## 🎯 Future Roadmap (Targets)

- [ ] **Multi-Tool Integration**: Incorporate OWASP ZAP, Nikto, and Metasploit via dedicated MCP servers.
- [ ] **Automated Remediation**: AI-generated patch suggestions and shell scripts for instant fixes.
- [ ] **Comprehensive Reporting**: Export professional security audits in PDF, JSON, and CSV formats.
- [ ] **Continuous Monitoring**: Scheduled recurring scans with automated alerting (Email/Slack).
- [ ] **Cloud-Native Scanning**: Specialized scanning modules for AWS, Azure, and GCP environments.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Supabase Auth/Realtime
- **Backend**: Node.js, Express.js, TypeScript
- **Agent System**: Custom TypeScript Orchestrator, Model Context Protocol (MCP)
- **Task Management**: BullMQ, Redis
- **Infrastructure**: Docker, Docker Compose, MCP-Server-Docker
- **AI/ML**: Google Gemini (1.5 Flash)

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- Redis (Local or Cloud)
- Supabase Project
- Google Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Devi007645/Vulnix-AI.git
   cd vulnix-ai
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root and add your keys (see `.env.example`).

4. **Start the services**:
   ```bash
   docker-compose up -d  # Start Redis and Workers
   npm run server        # Start Backend & Agents
   npm run dev           # Start Frontend Dashboard
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

