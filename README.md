# 🎫 Support Copilot

> An AI-powered customer support and ticket management platform built with **React, Node.js, Express, Prisma, PostgreSQL, and Google Gemini AI**.

Support Copilot helps support teams manage customer tickets, collaborate efficiently, and generate AI-assisted responses using a Knowledge Base. All AI-generated replies are reviewed by a human before being sent.

---

## 🚀 Live Demo

🌐 **Frontend**

https://support-copilot-seven.vercel.app

⚙️ **Backend API**

https://support-copilot-m0k5.onrender.com

📂 **GitHub Repository**

https://github.com/Aravind628187/support-copilot

---

# 📸 Screenshots

> Add screenshots inside `docs/screenshots/`

| Dashboard | Tickets |
|------------|----------|
| Dashboard Screenshot | Ticket Screenshot |

| AI Draft | Knowledge Base |
|-----------|----------------|
| AI Draft Screenshot | KB Screenshot |

| Team | Audit Log |
|------|-----------|
| Team Screenshot | Audit Screenshot |

---

# ✨ Features

## 🔐 Authentication

- Secure Login
- User Registration
- JWT Authentication
- Rotating Refresh Tokens
- HTTP Only Cookies
- Email Verification
- Forgot Password
- Password Reset

---

## 👥 Role-Based Access Control

### 👑 Admin

- View all tickets
- Create tickets
- Update tickets
- Delete tickets
- Assign tickets
- Manage agents
- Create Knowledge Base articles
- Edit articles
- Delete articles
- View Audit Logs
- Dashboard Analytics

### 👨‍💻 Agent

- View assigned tickets
- Update assigned tickets
- Reply to customers
- Generate AI Drafts
- Read Knowledge Base

---

# 🎫 Ticket Management

- Create Ticket
- Update Ticket
- Delete Ticket
- Assign Ticket
- Search Tickets
- Filter Tickets
- Sort Tickets
- Pagination
- Bulk Close
- Export CSV
- Soft Delete

---

# 🤖 AI Features

Support Copilot integrates **Google Gemini AI** to help support agents respond faster.

Features include

- AI Reply Draft
- Context-aware Suggestions
- Knowledge Base Grounding
- Human Review Required
- Faster Customer Support

---

# 📚 Knowledge Base

- Create Articles
- Edit Articles
- Delete Articles
- Search Articles
- Tag Support
- AI Knowledge Grounding

---

# 📊 Dashboard

Visual analytics include

- Open Tickets
- Pending Tickets
- Closed Tickets
- Priority Distribution
- Status Distribution
- Average Resolution Time
- Agent Workload

---

# 📝 Audit Logs

Every important system activity is recorded.

Examples

- User Login
- Ticket Created
- Ticket Updated
- Ticket Deleted
- Knowledge Base Changes
- Team Management

---

# 🔍 Search

Search across

- Tickets
- Customers
- Knowledge Base

---

# 🛠 Tech Stack

## Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod
- Lucide React

---

## Backend

- Node.js
- Express.js
- TypeScript

---

## Database

- PostgreSQL
- Prisma ORM

---

## Authentication

- JWT
- Refresh Tokens
- HTTP Only Cookies
- bcrypt

---

## AI

- Google Gemini API

---

## Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |

---

# 📂 Project Structure

```text
support-copilot

├── frontend
│
│   ├── src
│   ├── api
│   ├── assets
│   ├── components
│   ├── context
│   ├── hooks
│   ├── lib
│   ├── pages
│   ├── styles
│   └── types
│
├── backend
│
│   ├── prisma
│   ├── src
│   │
│   ├── config
│   ├── lib
│   ├── middleware
│   ├── modules
│   ├── utils
│   ├── routes
│   ├── app.ts
│   └── server.ts
│
└── README.md
```

---

# ⚙️ Installation

Clone repository

```bash
git clone https://github.com/Aravind628187/support-copilot.git

cd support-copilot
```

Backend

```bash
cd backend

npm install

cp .env.example .env

npx prisma migrate deploy

npm run seed

npm run dev
```

Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

```env
DATABASE_URL=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

CORS_ORIGIN=

GEMINI_API_KEY=
```

---

# 📡 API Modules

Authentication

```
POST /auth/signup

POST /auth/login

POST /auth/logout

GET /auth/me
```

Tickets

```
GET /tickets

POST /tickets

PATCH /tickets/:id

DELETE /tickets/:id
```

Knowledge Base

```
GET /kb

POST /kb

PATCH /kb/:id

DELETE /kb/:id
```

Dashboard

```
GET /dashboard
```

Users

```
GET /users

PATCH /users/:id
```

Audit Logs

```
GET /audit
```

---

# 🔒 Security

- JWT Authentication
- Refresh Tokens
- HTTP Only Cookies
- bcrypt Password Hashing
- Role-Based Authorization
- Protected Routes
- Zod Validation
- Prisma ORM

---

# 📈 Future Improvements

- Customer Portal
- File Uploads
- Email Notifications
- Real-Time Updates
- WebSockets
- AI Semantic Search (RAG)
- Docker Support
- Kubernetes Deployment
- Automated Testing
- Multi-language Support

---

# 👨‍💻 Author

## Aravind Kumar

B.Tech CSE (AI & ML)

📧 Email

chithamanaravind@gmail.com

🐙 GitHub

https://github.com/Aravind628187

💼 LinkedIn

(Add your LinkedIn URL)

🌐 Portfolio

(Add your portfolio URL)

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

If you like this project, don't forget to ⭐ the repository.

---

# 📜 License

Licensed under the MIT License.

---

## ⭐ If you found this project useful, please give it a Star.
