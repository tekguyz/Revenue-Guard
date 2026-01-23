# Technical Specification: Revenue Guard Intelligence Platform

## 1. Project Overview
**Revenue Guard** is a high-performance lead qualification and ROI visualization platform engineered by **TEKGUYZ**. The platform leverages generative AI to replace traditional lead capture forms with an **Intelligent Strategist** interface. It analyzes operational friction, validates business-grade leads, and generates secured, data-backed Strategic Briefs to convert high-value prospects into Phase 1 Intelligence Sprints.

---

## 2. Technical Stack
*   **Core:** React 19 (Strict Mode) + TypeScript + Vite.
*   **State Management:** Zustand 5.x with `persist` middleware (Auto-hydration from `localStorage`).
*   **Styling:** Tailwind CSS with a custom "Revenue Guard" theme engine (Deep Purple/Royal Blue).
*   **AI Engine:** Google Gemini API (`@google/genai`) using the `gemini-3-flash-preview` model.
*   **Animations:** Native Web Animations API (WAAPI) for GPU-accelerated motion (No Framer Motion/GSAP).
*   **Data Validation:** Zod (Shielding the API layer and validating final lead payloads).
*   **Reporting:** `html2canvas` + `jsPDF` for client-side secure document generation.
*   **Security:** Web Crypto API for SHA-256 transcript hashing.

---

## 3. System Architecture

### 3.1 features/ (Functional Modules)
*   **`strategist/`**: The AI core. Manages multi-turn conversations, analyzes intent, and triggers state transitions based on qualification scores.
*   **`assessment/`**: The "Deep-Dive" interface. A multi-step form that captures granular operational data to fuel the ROI engine.
*   **`dashboard/`**: The **ROI Command Center**. A high-fidelity visualization layer that remains locked until a lead reaches a qualification threshold of 7/10.

### 3.2 components/ (UI & UX Infrastructure)
*   **`animations/`**: Custom hooks (`useTechMotion`, `useTerminalReveal`) providing physics-based entry transitions and staggered reveals.
*   **`ui/`**: Atomic, accessible components (ROICounter, EfficiencyGauge, TerminalLoader) designed for data density.
*   **`layout/`**: Glassmorphism-based persistent navigation with a real-time **System Health Monitor**.

---

## 4. AI Strategist Intelligence (`useStrategist`)
The Strategist is the primary conversion engine, operating on a strict "TEKGUYZ" identity protocol:
1.  **Pattern Extraction:** Automatically identifies company names and specific bottlenecks from natural language conversations.
2.  **Hidden JSON Middleware:** Every AI response includes a `JSON_DATA` block. The system intercepts this block to update the `qualificationScore` (0-10) and detect when a user is `ready_for_phase_1`.
3.  **Tiered Qualification:** Reaching a score of 7 triggers the automatic expansion of the **Strategic Brief Form**, creating a fluid transition from chat to structured data entry.
4.  **Fail-Forward Logic:** If the AI link exceeds a 10-second latency, the system triggers a "High-Concurrency" override, unlocking the assessment form manually to prevent lead attrition.

---

## 5. ROI & Revenue Recovery Engine
The platform calculates potential recovery using a proprietary dual-mode model:
*   **Operational Rate (Ops):** Blended rate of **$65/hr** for administrative and support labor.
*   **Executive Rate (Exec):** Blended rate of **$125/hr** for high-value management labor.
*   **Formula:** `Annual Savings = (Wasted Hours * Staff Count * 52 Weeks) * 0.70 (Efficiency Multiplier) * [Hourly Rate]`.
*   **Dynamic UI:** The Command Center allows leads to toggle between these rates in real-time to visualize the scaling impact of automation.

---

## 6. Secure Asset Generation (The Brief)
Upon audit completion, the system generates a **Strategic Brief PDF**:
*   **Document Engine:** Captures a high-resolution snapshot of the Command Center data.
*   **Integrity Shield:** Uses SHA-256 hashing to generate a unique "Transcript Hash" from the conversation history. This hash is embedded in the PDF as a "Certificate of Authenticity."
*   **Branding:** PDFs are strictly named `TEKGUYZ_Strategic_Brief_[Date].pdf` and encoded with TEKGUYZ metadata.

---

## 7. Security & Domain Hardening
*   **Business Filter:** The `briefSchema` rejects generic email providers (Gmail, Yahoo, etc.), enforcing a B2B lead quality standard.
*   **Sanity Shield:** Intercepts impossible data inputs (e.g., >168 hours wasted per week) and flags anomalies through the AI Strategist interface.
*   **Domain Integrity:** All meta-tags and social proof assets are synchronized with `https://tekguyz.com`.

---

## 8. UX Motion Design
*   **Digital Shred:** A `clip-path` based transition used during system handovers to simulate data being shredded and secured into the vault.
*   **Matrix Stream:** A high-performance `<canvas>` background used during "Syncing" states to maintain user engagement during API latency.
*   **Glow Pulse:** Dynamic `text-shadow` animations on ROI figures that increase in intensity relative to the dollar amount recovered.