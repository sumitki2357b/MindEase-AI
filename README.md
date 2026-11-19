# MindEase AI
> **A little more room to think.**  
> *Adaptive Task-Initiation & Student Productivity Companion*  
> **Team CodeXpress | One-Day Hackathon MVP**

---

## 👥 Team Information — CodeXpress
- Developer- Sumit Kumar Singh

---

## 🌿 Product Overview
MindEase AI is an adaptive, nature-inspired productivity companion designed for college and university students who experience task initiation friction, competing deadlines, or mental fatigue.

Rather than merely generating overwhelming checklists or rigid countdown clocks, MindEase AI provides:
1. **Full-Stack Adaptive Planning:** Energy-adapted task rebalancing, priority-based scheduling, and conflict detection.
2. **RAG-Grounded Interventions:** Deterministic keyword-based retrieval across curated academic productivity strategies, paired with Google Gemini 3.5 enhancement (and 100% offline local fallback).
3. **Stuck Radar Observer:** A transparent, privacy-first observer that monitors in-app interaction pauses (120s limit) to offer gentle check-ins without cameras, microphones, or psychological labels.
4. **Mind Stories Parables:** 5 original nature-inspired motivational stories with SVG scenes, reflection questions, takeaways, and user-initiated browser speech synthesis.
5. **Reset Room & Mini-Games:** 4 calming, low-cognitive activities (*Breathe & Bloom*, *Color Garden*, *Pattern Pause*, *Little Zen Garden*) alongside a personal growing forest clearing.

---

## 💻 Technology Stack

- **Frontend:**
  - React 18
  - Vite 5 + TypeScript
  - Tailwind CSS (custom nature-inspired palette: `#F3F4F0`, `#24332D`, `#52796F`, `#8EBD78`, `#F2D69B`, `#C47D57`)
  - Lucide React icons
  - Web SpeechSynthesis API (client-side narration with captions)
  - Browser `localStorage` with safe error boundaries
  - Vitest for frontend unit tests

- **Backend:**
  - Python 3.11+ / 3.13
  - FastAPI + Uvicorn
  - Pydantic v2
  - `python-dotenv`
  - Official `google-genai` SDK
  - Pytest for backend unit and API tests

- **Deterministic RAG Knowledge Base:**
  - Local curated `strategies.json` (12+ original student productivity strategies)
  - Keyword and tag overlap scoring

---

## 🚀 Beginner-Friendly Windows 10/11 PowerShell Startup

### 1. Prerequisites Check
Open PowerShell in the project directory (`c:\Users\sumit\OneDrive\Desktop\MindEase AI`) and check your installed tools:
```powershell
python --version
node --version
npm --version
```
*(Requires Python 3.11+ and Node.js v18+)*

---

### 2. Backend Setup
1. Create and activate a Python virtual environment:
```powershell
python -m venv backend\venv
```
2. Install Python dependencies:
```powershell
backend\venv\Scripts\pip install -r backend\requirements.txt
```
3. Prepare the environment file:
```powershell
Copy-Item backend\.env.example backend\.env
```
> **Note on No-Key Mode:** MindEase AI works **100% out of the box without any Gemini API key**. If `GEMINI_API_KEY` is blank, the application automatically uses high-quality built-in RAG guidance. To enable live Gemini generation, add your API key into `backend\.env`:
> ```env
> GEMINI_API_KEY=your_actual_key_here
> GEMINI_MODEL=gemini-3.5-flash-lite
> ```

4. Run backend tests to verify health:
```powershell
$env:PYTHONPATH='backend'; backend\venv\Scripts\pytest -c backend\pytest.ini backend\tests
```

5. Start the FastAPI backend server:
```powershell
$env:PYTHONPATH='backend'; backend\venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API is accessible at `http://127.0.0.1:8000` (API documentation at `http://127.0.0.1:8000/docs`).

---

### 3. Frontend Setup (In a Second PowerShell Terminal)
1. Navigate into the frontend folder:
```powershell
cd frontend
```
2. Install Node dependencies:
```powershell
npm install
```
3. Run frontend tests:
```powershell
npm test
```
4. Start the Vite development server:
```powershell
npm run dev
```
5. Open your browser at **`http://localhost:5173`**.

---

### ⚡ Quick One-Click Startup (PowerShell)
You can also launch both the backend and frontend simultaneously with:
```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

---

## 📖 3-Minute Judge Demonstration Script

| Time | Phase | Action & What to Show |
| :--- | :--- | :--- |
| **0:00 – 0:20** | **The Core Problem** | Introduce the problem: Task paralysis for students is not solved by generating a longer checklist. MindEase AI provides an adaptive companion with alternate pathways, nature-inspired parables, and low-pressure interventions. |
| **0:20 – 0:45** | **Dashboard & Tasks** | Show the **Overview** page. Point out the sample student tasks, the **Current Energy** selector (Low, Medium, High), and explain how energy immediately shapes schedule recommendations without making assumptions. |
| **0:45 – 1:05** | **Focus Session & Stuck Radar** | Click **Focus** on a task to enter the **Focus Room**. Start the timer. Highlight the **Stuck Radar** card and demonstrate how it observes in-app pauses transparently (120s limit) without webcam access. |
| **1:05 – 1:35** | **Intervention Engine** | Click **"I'm feeling stuck"**. Choose *"I don't know how to begin"* or *"The task feels overwhelming"*. Show the retrieved RAG strategies and the structured micro-steps (*The 2-Minute Physical Entry*). Point out the source badge (*Google Gemini* or *Built-in Knowledge Guidance*). |
| **1:35 – 2:00** | **Mind Stories** | Click **"Hear a story"** to open **The Seed and the Rock**. Walk through the 3 illustrated SVG scenes showing the seed curving around the stone toward the sunlight. Trigger the narration audio and show the synchronized captions and takeaway. |
| **2:00 – 2:20** | **Reset Room & Mini-Games** | Navigate to the **Reset Room**. Show the interactive personal forest clearing with stones and blossoms. Open a quick game like **Breathe & Bloom** or **Color Garden**. Show that there are zero penalties, countdown stress, or forced reward loops. |
| **2:20 – 2:40** | **Adaptive Planner Rebalancing** | Return to **My Tasks**. Click **"Rebalance my plan"**. Show the deterministic scheduling engine prioritizing tasks based on current energy and deadlines, with clear rationales and conflict warnings. |
| **2:40 – 3:00** | **Architecture & Privacy** | Navigate to **Settings & Privacy**. Highlight that all tasks and garden states live in browser `localStorage`, explain the limits of the observer, and conclude with the CodeXpress team credits. |

---

## 🔒 Privacy & Non-Clinical Disclaimer

> **Important Disclosure:** MindEase AI is an adaptive productivity aid for task-initiation support. It is **not** a diagnostic, medical, or psychological treatment system. It does not access webcam feeds, microphones, biometric sensors, or external applications.
