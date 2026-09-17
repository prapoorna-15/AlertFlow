# AlertFlow ⚡

> **Real-Time Enterprise IT Incident Triage & Automated RCA Platform**

AlertFlow is an operational intelligence dashboard designed for SRE and DevOps engineering teams. It ingests server log traces in real time, streams incident severity updates via WebSockets, and leverages AI for root cause analysis (RCA).

---

## 🚀 Key Features

* **Real-Time Telemetry Stream:** Incident broadcasting and active engineer presence tracking powered by Socket.IO.
* **AI Root Cause Analysis (RCA):** Automated log trace summarization utilizing OpenAI APIs.
* **Schema Validation Guardrails:** Runtime JSON structure verification using **Zod**.
* **Relational Persistence:** PostgreSQL schema tracking incident lifecycles (`OPEN` → `INVESTIGATING` → `RESOLVED`).

---

## 🏗️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, Recharts
* **Backend:** Node.js, Express.js, Socket.IO, Sequelize ORM
* **Database:** PostgreSQL (Supabase)
* **Auth:** JWT, bcryptjs