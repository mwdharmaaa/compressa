# Compressa

> High-Performance Client-Side Video Compressor & Optimizer Studio.

Compressa is a modern, privacy-first web application designed to compress and optimize video files directly in the browser using native Canvas, AudioContext, and MediaStream codecs. Videos are processed entirely in memory on your device: zero file uploads, zero server bandwidth costs, and zero cloud privacy exposure.

---

## Key Features

- **100% In-Browser Privacy**: Video files never leave your computer. Processing occurs entirely in client-side memory.
- **Hardware-Accelerated Encoding**: Leverages GPU rendering pipelines via browser Canvas and MediaRecorder APIs.
- **Platform Target Size Presets**:
  - Discord Free (8 MB limit)
  - Discord Standard (25 MB limit)
  - WhatsApp Media (16 MB limit)
  - Email Attachments (10 MB and 20 MB caps)
  - Custom MB boundary with automatic adaptive bitrate solving
- **Quality & Rate Control**:
  - Preset Target Size Mode
  - Constant Rate Factor (CRF 18-38) quality mode
  - Manual video bitrate slider (150 kbps to 10 Mbps)
- **Resolution Downscaling**: Original, 1080p, 720p, 480p, 360p, or custom percentage downscaling with strict even-pixel dimension enforcement.
- **Framerate Limiting**: Auto/Original, 60 FPS, 30 FPS, 24 FPS, or 15 FPS.
- **Audio Optimization**: Keep standard (128 kbps), compress voice/music (64 kbps), or strip audio completely for maximum file size reduction.
- **Precision Trimmer**: Select custom start and end timestamps to compress only specific highlights.
- **Video Quality Inspector**: Side-by-side and toggled preview comparing original source and compressed output before downloading.
- **Batch Processing Queue**: Queue multiple videos, compress sequentially, and export as individual files or a single ZIP archive.

---

## Tech Stack & Architecture

- **Frontend**: React 19, TypeScript 6, Vite 8, Tailwind CSS v4
- **Iconography**: Lucide React (vector SVG)
- **Archive & Export**: JSZip, Canvas Confetti
- **Testing & Quality**: Vitest, Oxlint
- **Deployment**: Docker multi-stage build (Node 24 Alpine builder + Nginx Alpine runner)

---

## Quick Start

### Prerequisites
- Node.js 22+ (or Node.js 24)
- Docker & Docker Compose (optional for containerized deployment)

### Local Development

Run the single-enter launch script:

```bash
# Unix / WSL / Git Bash
./runapp.sh

# Windows Command Prompt
runapp.bat
```

Or manually:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## Automated Tests

Run test suites:

```bash
# Unix / WSL / Git Bash
./runtest.sh

# Windows Command Prompt
runtest.bat
```

Or directly:

```bash
npm run test
npm run lint
```

---

## Containerized Deployment (Docker Trifecta)

To build and run the production container in one enter:

```bash
# Initial Deployment
./deploy.sh

# Redeployment & Updates
./redeploy.sh
```

Or via Docker Compose:

```bash
docker compose up -d --build
```

Container access endpoint: `http://localhost:3000`

---

## License

MIT License. Authored by [Mahendra Wira Dharma](https://github.com/mwdharmaaa).
