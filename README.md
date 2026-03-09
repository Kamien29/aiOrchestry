Przepis – Multi‑agent Frontend + Ollama (Docker)

### Requirements

- **Docker / Docker Desktop**
- **Docker Compose** (comes with newer Docker Desktop)

Optional, for local development without Docker:

- **Node.js**
- **npm**

Check installation:

```bash
docker --version
node -v
npm -v
```

---

### Project structure

- **backend (Ollama)**: runs in the `ollama` container from the `ollama/ollama` image
- **frontend (React)**: app in the `frontend` directory, runs in the `react-ai` container
- **docker-compose.yml**: definition of both services (Ollama + frontend)

The frontend talks to Ollama over HTTP at:

- `http://localhost:11434/api/chat`

---

### Run the project with Docker (recommended)

1. **Go to the project directory**

```bash
cd przepis
```

2. **Build images**

```bash
docker compose build
```

3. **Start containers**

```bash
docker compose up
```

After a moment, two services should be running:

- `ollama` – model API (`http://localhost:11434`)
- `react-ai` – frontend (`http://localhost:3000`)

4. **Open the app in your browser**

Go to:

- `http://localhost:3000`

---

### Ollama model configuration

The Ollama container starts from the `ollama/ollama` image. To download a model (e.g. Bielik), enter the container and pull it:

```bash
docker exec -it ollama bash
ollama pull SpeakLeash/bielik-7b-instruct
ollama list
```

Once the model is installed, the frontend can use it via the `/api/chat` endpoint.

---

### Local development without Docker (optional)

If you want to develop only the frontend locally:

1. Make sure Ollama is running locally on port `11434`
2. In another terminal, start the frontend:

```bash
cd frontend
npm install
npm start
```

The frontend is available at `http://localhost:3000` and connects to the Ollama API at `http://localhost:11434/api/chat`.

---

### Ports

- **3000** – frontend application (React)
- **11434** – Ollama API
