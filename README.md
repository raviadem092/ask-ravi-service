# Ask Ravi Service 

An AI-powered portfolio chatbot built with **Node.js**, **Express**, and **Google Gemini 2.5 Flash**. The chatbot answers questions about Ravi's skills, projects, experience, education, and resume using a structured knowledge base.

---

## ✨ Features

* AI-powered conversational chatbot
* Google Gemini 2.5 Flash integration
* Modular Express architecture
* Markdown-based knowledge base
* Environment-based configuration
* Clean REST API
* Easy to extend and maintain
* Streaming responses
* Conversation memory
* Retrieval-Augmented Generation (RAG)
* Source citations
* Suggested questions
* Rate limiting
* Docker support
* Deployment configuration

---

# Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/raviadem092/ask-ravi-service.git

cd ask-ravi-service
```

---

## 2. Install Dependencies

```bash
npm install
```

or

```bash
npm install express @google/genai dotenv cors

npm install -D nodemon
```

---

## 3. Create Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

## 4. Start Development Server

```bash
npm run dev
```

Server will start at

```
http://localhost:5000
```

---

# Available API Endpoints

## Health Check

```
GET /api/health
```

Response

```json
{
  "success": true,
  "message": "Server is running."
}
```

---

## Chat

```
POST /api/chat
```

Request

```json
{
  "message": "Tell me about Ravi"
}
```

Response

```json
{
  "success": true,
  "answer": "Ravi is a Full Stack Developer..."
}
```

---

# Knowledge Base

The chatbot uses Markdown files as its knowledge source.

```text
knowledge/
│
├── resume.md
├── skills.md
├── projects.md
└── experience.md
```

These files are loaded into the system prompt so the chatbot can answer questions about the portfolio.

Example questions:

* Tell me about Ravi.
* What technologies does Ravi know?
* Explain Ravi's latest project.
* What backend frameworks has Ravi used?
* What databases has Ravi worked with?
* Show Ravi's work experience.
* What is Ravi currently learning?

---

# Architecture

```text
Client
   │
   ▼
Routes
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Gemini Client
   │
   ▼
Google Gemini API
```

Each layer has a single responsibility, making the project scalable and easy to maintain.

---

# Scripts

```bash
npm run dev
```

Runs the application in development mode using Nodemon.

```bash
npm start
```

Runs the production server.

---

# Environment Variables

| Variable       | Description           |
| -------------- | --------------------- |
| PORT           | Express server port   |
| GEMINI_API_KEY | Google Gemini API key |

---

# Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# License

This project is licensed under the MIT License.

---

# Author

**Ravi Kumar Yadav **

Full Stack Developer

Building modern web applications using Node.js, Express, React, MySQL, and AI-powered solutions.

---

⭐ If you found this project useful, consider giving it a star on GitHub.
