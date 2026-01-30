# Stack Completa – Painel Perfect World 162

**Papel:**
- Você: *Product Owner / Arquiteto Funcional*
- Zayla (eu): *Engenharia de Software / Arquiteta de Sistemas PW*
- Antigravity: *Dev Sênior / Implementação*

---

## 🎯 Objetivo do Projeto
Criar um **Painel Web moderno (User + ADM)** totalmente integrado ao **Perfect World 162**, respeitando a separação correta entre:
- **Banco MySQL (contas / painel / donate)**
- **Servidor do jogo (pwserver – GS/Auth/Delivery)**

Sem corromper personagens, sem editar BLOBs perigosos e com **nível profissional**.

---

## 🧱 Visão Geral da Arquitetura

```
[ Frontend (React) ]
        ↓ JWT
[ Backend API (Node.js) ]
        ↓ MySQL (read/write controlado)
[ Banco PW 162 ]
        ↓ (indireto)
[ gdeliveryd / GS / Auth ]
```

⚠️ O painel **NUNCA** escreve direto em arquivos do `/pwserver`.

---

## 🧰 Stack Tecnológica (oficial)

### 🔹 Backend
- **Node.js 20 LTS**
- **Express.js**
- **TypeScript**
- **JWT (Access + Refresh)**
- **bcrypt** (hash de senha do painel)
- **mysql2** (prepared statements)
- **Zod** (validação de payload)
- **Winston** (logs)

### 🔹 Frontend
- **React 18**
- **Vite**
- **TypeScript**
- **TailwindCSS**
- **React Router**
- **Axios**
- **HeroIcons / Lucide**

### 🔹 Infra / DevOps
- **Docker**
- **Docker Compose**
- **WSL2**
- **Nginx (reverse proxy)**
- **PM2 (produção)**

---

## 📁 Estrutura de Pastas (monorepo)

```
pw-panel/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   └── database.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── characters/
│   │   │   ├── inventory/
│   │   │   ├── donate/
│   │   │   └── admin/
│   │   ├── middlewares/
│   │   │   ├── auth.ts
│   │   │   ├── rateLimit.ts
│   │   │   └── acl.ts
│   │   ├── routes.ts
│   │   └── server.ts
│   ├── prisma/ (opcional)
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Characters.tsx
│   │   │   ├── Inventory.tsx
│   │   │   ├── Donate.tsx
│   │   │   └── Admin.tsx
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── services/api.ts
│   │   └── router.tsx
│   └── Dockerfile
│
├── scripts/
│   ├── server-status.sh
│   ├── broadcast.sh
│   └── delivery-worker.js
│
├── docker-compose.yml
└── README.md
```

---

## 🔐 Autenticação (Painel)

- Login via tabela de contas PW (MySQL)
- Validação segura
- JWT com payload:
```json
{
  "uid": 123,
  "role": "user|admin",
  "exp": 123456
}
```

- Refresh token
- Rate limit por IP

---

## 👤 Módulos do Usuário

### 🔹 Dashboard
- Último login
- Quantidade de personagens
- Cash / Gold

### 🔹 Personagens
- Leitura da tabela `role`
- Nome, classe, level, status

### 🔹 Inventário
- Leitura controlada da `inventory`
- Decodificação segura
- **Read-only**

### 🔹 Doações
- Histórico
- Itens pendentes
- Entrega via gdeliveryd

---

## 🛡️ Módulos Admin

### 🔹 Gestão de Contas
- Ban / Unban
- Reset senha
- Ver IP

### 🔹 Gestão de Personagens
- Kick
- Rename
- Transferência

### 🔹 Servidor
- Status Auth / GS / Delivery
- Broadcast
- Scripts shell controlados

---

## ⚠️ Regras de Ouro PW 162

- ❌ Nunca editar BLOB manualmente
- ❌ Nunca escrever direto no `/pwserver`
- ✅ Usar delivery para itens
- ✅ Logs em tudo

---

## 🚀 Roadmap de Implementação

**Fase 1 – Base**
- Estrutura do projeto
- Login + JWT
- Dashboard

**Fase 2 – User**
- Personagens
- Inventário

**Fase 3 – Donate**
- Fila
- Delivery

**Fase 4 – Admin**
- Gestão
- Servidor

---

## 📌 Status Atual
- Stack definida
- Arquitetura validada para PW 162
- Pronta para iniciar no Antigravity

👉 Próximo passo: importar essa stack no Antigravity e iniciar **backend/auth**.

