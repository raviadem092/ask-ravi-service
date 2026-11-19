# Ask Ravi Service

An AI-powered portfolio and engineering assistant built with **Node.js**, **Express**, and **Google Gemini 2.5 Flash**. It answers questions using a Markdown knowledge base about Ravi's experience and projects, and can also explain general software engineering and architecture concepts.

## Features

- Conversational portfolio assistant
- Google Gemini 2.5 Flash integration
- Modular Express application structure
- Markdown knowledge base loaded at startup
- Conversation history supplied with chat requests
- REST API and health-check endpoint
- Request validation and centralized error handling
- Configurable environment variables
- Docker / deployment-ready project structure

> **Implementation note:** The current implementation reads the Markdown files in `src/knowledge`, caches their combined contents in memory, and includes that content in the Gemini prompt. It is currently a prompt-context knowledge approach. Do not interpret the project as having vector embeddings, semantic retrieval, a vector database, or source citations unless those capabilities are implemented separately.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/raviadem092/ask-ravi-service.git
cd ask-ravi-service
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
PORT=5000
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
CLIENT_URL=http://localhost:3000
```

Use a real Gemini API key locally. Never commit `.env` or expose the key in client-side code.

### 3. Run

```bash
npm run dev
```

The default server port in `server.js` is 3001 unless `PORT` is configured.

## API

### Health

```http
GET /api/health
```

### Chat

```http
POST /api/chat
Content-Type: application/json
```

Example request:

```json
{
  "message": "Explain the architecture of Ravi's AWS migration work",
  "history": []
}
```

The response contains a success flag and generated answer. Check the route/controller implementation for the current response contract and validation rules.

### Suggested questions

```http
GET /api/questions
```

## Current application architecture

```text
Client
  |
  v
Express application (src/app.js)
  |
  +--> Routes
  |      +--> Chat route --> Chat controller
  |      |                    |
  |      |                    v
  |      |                Chat service
  |      |                    |
  |      |          +---------+----------+
  |      |          |                    |
  |      |       System prompt      Markdown knowledge
  |      |                               loader
  |      |          +---------+----------+
  |      |                    |
  |      +----------------> Gemini API
  |
  +--> Questions route
  |
  +--> Health route
  |
  +--> Central error handler
```

### Main responsibilities

- `server.js`: loads environment configuration and starts the HTTP server.
- `src/app.js`: configures Express middleware, routes, and error handling.
- `src/routes`: maps HTTP paths to controllers.
- `src/controllers`: handles HTTP request/response behavior.
- `src/services/chat.service.js`: assembles system prompt, knowledge, conversation history, and the current question; calls Gemini.
- `src/prompts/systemPrompt.js`: defines assistant behavior and grounding rules.
- `src/knowledge/*.md`: portfolio knowledge documents.
- `src/utils/loadKnowledge.js`: reads and caches Markdown knowledge at process startup/first load.
- `src/config/gemini.js`: configures the Gemini client.
- `src/middleware`: validation and error-handling middleware.

## Knowledge base

Markdown files are stored under `src/knowledge`. The loader discovers all `.md` files, sorts them, concatenates their content, and caches the result in process memory. Add or update a Markdown file to extend the assistant's context. Restart the service to ensure changed files are loaded by a fresh process.

Knowledge is organized around:
- Resume, experience, skills, education, and contact
- Projects and professional contributions
- FAQs and behavioral interview guidance

Keep facts evidence-based. Separate implemented work, ongoing initiatives, personal projects, and general engineering recommendations.

## Testing

```bash
npm test
npm run test:ci
npm run test:coverage
```

Run the test suite before merging changes.

## Environment variables

| Variable | Purpose |
|---|---|
| `PORT` | HTTP server port (defaults to 3001 in `server.js`) |
| `GEMINI_API_KEY` | Server-side Gemini API credential |
| `CLIENT_URL` | Allowed frontend origin; confirm CORS policy for each deployment |

## License

See the repository license file for the applicable license.
