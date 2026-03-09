Requirements

Make sure the following tools are installed:

Docker

Node.js

npm

Git

You can verify the installation with:

docker --version
node -v
npm -v
Running the Project
1. Start Ollama with Docker

Pull the Ollama image:

docker pull ollama/ollama

Run the container:

docker run -d -p 11434:11434 --name ollama ollama/ollama
2. Download the Bielik Model

Download the model inside the container:

docker exec -it ollama ollama pull SpeakLeash/bielik-7b-instruct

Check if the model is installed:

docker exec -it ollama ollama list
3. Start the Frontend

Go to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the application:

npm start
4. Open the Application

Open the browser and go to:

http://localhost:3000
5. Check Ollama API

You can verify that Ollama is running at:

http://localhost:11434
Ports Used

3000 – Frontend application

11434 – Ollama API
