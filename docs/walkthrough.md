# TEKGUYZ Revenue Guard: Comprehensive Walkthrough

This document provides a detailed operational and technical guide to the **Revenue Guard** intelligence platform. It outlines the user journey, the underlying AI mechanics, and the ROI calculation models used to convert leads into Phase 1 Intelligence Sprints.

---

## 1. Executive Summary
**Revenue Guard** is a "high-friction" lead qualification engine. Unlike traditional landing pages that seek to minimize form fields, Revenue Guard uses a multi-layered approach to verify lead quality:
1.  **Unstructured Discovery**: AI-driven chat to identify intent and "Manual Work Fatigue."
2.  **Structured Assessment**: A 4-step strategic brief capturing granular operational metrics.
3.  **Visualization & Proof**: A GPU-accelerated dashboard (Command Center) projecting 12-month ROI.

---

## 2. The User Journey

### Phase A: Discovery (The Strategist)
The journey begins in the **Strategist View**. 
*   **The Hook**: Users are greeted by the TEKGUYZ AI Strategist.
*   **The Interaction**: The AI uses pattern recognition to identify bottlenecks. If a user mentions "meetings," the AI cites the *Crispy Bacon* case study (5h to 5m recovery). If they mention "manual tasks," it cites *VeriClear* (90% faster processing).
*   **The Qualification**: Behind the scenes, the AI generates a hidden `JSON_DATA` block. When the `qualificationScore` reaches **7/10**, the app triggers a "Phase 1 Transition."

### Phase B: Quantification (The Strategic Brief)
Once qualified, the **Strategic Brief Form** slides into view.
*   **Step 1 (Bottlenecks)**: Users select specific friction points (e.g., "Legacy Tech Debt").
*   **Step 2 (Outcomes)**: Qualitative data capture of specific business goals.
*   **Step 3 (The Multiplier)**: Users input their staff count and average wasted hours. The app performs real-time ROI calculations using the `ROICounter` component.
*   **Step 4 (Identity)**: Business email validation. The system uses a Zod-backed "Shield" to reject generic providers (Gmail/Yahoo), ensuring only enterprise leads proceed.

### Phase C: Visualization (The Command Center)
Upon submission, the user is granted access to the **ROI Command Center**.
*   **Efficiency Gauge**: A visual representation of their current operational health.
*   **Time Recovery Chart**: A 12-month projection of cumulative savings.
*   **Secure Dispatch**: The user can "Secure My Sprint," which triggers a SHA-256 integrity hash of their conversation before dispatching it to the TEKGUYZ vault.

---

## 3. AI & Scoring Logic

The platform utilizes the **Gemini 3 Flash** model with a strictly defined system instruction set.

### Hidden JSON Protocol
To bridge the gap between unstructured chat and structured UI state, the AI is instructed to append a JSON block to its messages:
```json
JSON_DATA: { 
  "score": 8, 
  "bottleneck": "Meeting Overload", 
  "ready_for_phase_1": true, 
  "company": "Acme Corp" 
}
```
The `useStrategist` hook intercepts this, updates the `InteractionStore`, and triggers UI state changes without the user seeing the raw data.

---

## 4. ROI Calculation Engine

The platform uses a blended corporate labor model to calculate potential revenue recovery.

### The Blended Rate
*   **Standard Rate**: $65/hr (Operational Blended Rate).
*   **Efficiency Multiplier**: 0.70 (Conservative estimate of automation impact).

### The Formula
`Annual Savings = (Wasted Hours * Staff Count * 52 Weeks) * 0.70 * $65`

*Example*: A team of 10 wasting 5 hours/week each:
`(5 * 10 * 52) * 0.70 * $65 = $118,300 recovered per year.`

---

## 5. Technical Infrastructure

### Motion & Performance (WAAPI)
Revenue Guard uses the **Native Web Animations API** instead of heavy libraries. This ensures:
*   **Zero-Jank**: Animations run on the compositor thread.
*   **Digital Shred**: The exit transition uses `clip-path` to simulate a document being shredded and secured.
*   **Matrix Stream**: A `<canvas>` based matrix rain visualizes data synchronization during API calls.

### Data Integrity (The Shield)
*   **Zod Hardening**: All inputs are validated against strict schemas (`LeadSanitySchema`).
*   **Anomaly Detection**: If a user reports >168 wasted hours in a week (impossible), the system flags an "Anomaly Detected" state.
*   **Persistence**: Uses `zustand/middleware` to persist session data. If a user refreshes, a `SESSION_DATA RESTORED` notification appears.

---

## 6. Security Protocol

1.  **Transcript Hashing**: Before final dispatch, the entire conversation is hashed using SHA-256. This ensures the data received by TEKGUYZ Principals matches exactly what was visualized in the Command Center.
2.  **B2B Filtering**: The application enforces a business-only policy by blacklisting generic email domains at the schema level.
3.  **Error Boundaries**: A system-level error boundary catches unhandled exceptions and offers a "Protocol Reset," clearing local storage and restoring the app to a stable state.

---

## 7. Navigation & System Health
The **Navbar** includes a real-time health monitor:
*   **Optimal**: Active link to Gemini intelligence.
*   **Latent**: Response times > 10 seconds.
*   **Disconnected**: API link lost.

This transparency builds trust with high-value technical leads who expect visibility into system status.
