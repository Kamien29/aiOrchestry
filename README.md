Przepis – Multi‑agentowy frontend + Ollama (Docker)

### Wymagania

- **Docker / Docker Desktop**
- **Docker Compose** (w zestawie z nowszym Docker Desktop)

Opcjonalnie, do lokalnego developmentu bez Dockera:

- **Node.js**
- **npm**

Sprawdzenie instalacji:

```bash
docker --version
node -v
npm -v
```

---

### Struktura projektu

- **backend (Ollama)**: uruchamiany w kontenerze `ollama` z obrazu `ollama/ollama`
- **frontend (React)**: aplikacja w katalogu `frontend`, uruchamiana w kontenerze `react-ai`
- **docker-compose.yml**: definicja obu usług (Ollama + frontend)

Frontend komunikuje się z Ollamą przez HTTP pod adresem:

- `http://localhost:11434/api/chat`

---

### Uruchomienie projektu w Dockerze (rekomendowane)

1. **Przejdź do katalogu projektu**

```bash
cd przepis
```

2. **Zbuduj obrazy**

```bash
docker compose build
```

3. **Uruchom kontenery**

```bash
docker compose up
```

Po chwili powinny działać dwa serwisy:

- `ollama` – API modeli (`http://localhost:11434`)
- `react-ai` – frontend (`http://localhost:3000`)

4. **Otwórz aplikację w przeglądarce**

Przejdź do:

- `http://localhost:3000`

---

### Konfiguracja modelu Ollama

Kontener Ollama startuje z obrazu `ollama/ollama`. Aby pobrać model (np. Bielik), wejdź do kontenera i pobierz go:

```bash
docker exec -it ollama bash
ollama pull SpeakLeash/bielik-7b-instruct
ollama list
```

Po zainstalowaniu modelu frontend będzie mógł z niego korzystać przez endpoint `/api/chat`.

---

### Lokalny development bez Dockera (opcjonalnie)

Jeśli chcesz rozwijać tylko frontend lokalnie:

1. Upewnij się, że Ollama działa lokalnie na porcie `11434`
2. W drugim terminalu uruchom frontend:

```bash
cd frontend
npm install
npm start
```

Frontend jest dostępny pod `http://localhost:3000` i łączy się z API Ollamy na `http://localhost:11434/api/chat`.

---

### Porty

- **3000** – aplikacja frontendowa (React)
- **11434** – API Ollama
