# BWKI 2025: Sprachidentifikation seltener Sprachen - Frontend

Eine moderne Angular-basierte Webanwendung zur automatischen Identifikation von 2000+ Sprachen. Dieses Projekt ist die Frontend-Komponente der BWKI 2025 Submission zum Thema "Sprachidentifikation seltener Sprachen".

## Table of Contents

- [🚀 Live Demo](#-live-demo)
- [🛠️ Lokale Installation](#️-lokale-installation)
- [🐳 Docker Setup](#-docker-setup)
- [⚙️ Umgebungskonfiguration](#️-umgebungskonfiguration)
- [🚀 Deployment](#-deployment)
- [🔧 Entwicklung](#-entwicklung)
- [🏗️ Architektur](#️-architektur)
- [👥 Team](#-team)

## 🚀 Live Demo

Die Anwendung läuft live auf: **https://toberocat.github.io/bwki2025-lowres-langid-ui/**

### Backend API

Das zugehörige Backend ist verfügbar unter: **https://bwki2025-lowres-langid-backend.fly.dev/**

> **Hinweis**: Die öffentliche Backend-Instanz wird aus Kostengründen nach 5 Minuten Inaktivität automatisch heruntergefahren und bei Bedarf neu gestartet. Dies kann zu längeren Ladezeiten beim ersten Zugriff führen.

## 🛠️ Lokale Installation

### Voraussetzungen

- **Node.js 20+** (empfohlen: LTS Version)
- **npm** (wird mit Node.js mitgeliefert)

### Installation

> Das Frontend benötigt das Backend für volle Funktionalität. Stelle sicher, dass das Backend lokal läuft oder passe die API-URL richtig ein. Die Installationen verwenden beide dev environments (Das Backend muss unter http://localhost:8000/ verfügbar sein).

```bash
# Im Projektverzeichnis
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm start

# Anwendung ist verfügbar unter: http://localhost:4200
```

## 🐳 Docker Setup

```bash
# Im Projektverzeichnis

docker compose up

# Anwendung ist verfügbar unter: http://localhost:4200
```

## 🚀 Deployment

### GitHub Pages (Automatisch)

Das Projekt ist für automatisches Deployment auf GitHub Pages konfiguriert:

1. **Push auf `main` Branch** löst automatisches Deployment aus
2. **GitHub Actions** führt Build und Deployment durch
3. **Live unter**: https://toberocat.github.io/bwki2025-lowres-langid-ui/

## 🔧 Entwicklung

### Verfügbare Scripts

```bash
# Entwicklungsserver starten
npm start

# Entwicklungsserver über docker starten
docker compose up
```

### Backend-Integration

Die Anwendung kommuniziert mit dem Backend über REST API:

- **Health Check**: `GET /health`
- **Sprachklassifikation**: `POST /api/v1/classify`

Beispiel API-Request:

```json
{
  "text": "Hello, how are you?",
  "locale": "en"
}
```

Beispiel API-Response:

```json
{
  "predictions": [
    {
      "language_id": "en",
      "language_name": "English",
      "probability": 0.95
    }
  ],
  "writing_system": "Latin"
}
```

## 👥 Team

Tobias Madlberger, Florian Schwanzer, Fabian Popov; HTL St. Pölten
Entwickelt für den Bundesweiten Informatikwettbewerb (BWKI) 2025.
In kooperation mit [DIGILINGDIV](https://digiling.univie.ac.at/digilingdiv/)
