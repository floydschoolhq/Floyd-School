# Technical Guide: Coding Cloud Lab Infrastructure

This guide outlines the architecture of the **Coding Cloud Lab** and provides a roadmap for resolving current issues in execution, user input, and error handling.

## 1. Project Structure

### Frontend (Client-side)
- **Primary Page**: [CodingLabPage.jsx](file:///c:/Users/User/OneDrive/Desktop/FULL%20STACK/thinkskool-main/Client/src/pages/Student/CodingLabPage.jsx)
    - Manages the overall state (code, language, input, output).
    - Coordinates between the editor and the execution API.
- **IDE Components**: [Client/src/components/ide/](file:///c:/Users/User/OneDrive/Desktop/FULL%20STACK/thinkskool-main/Client/src/components/ide/)
    - `MonacoEditor.jsx`: The core code editor (powered by Monaco).
    - `Terminal.jsx`: Displays output and handles standard I/O visualization.
    - `LanguageSelector.jsx`: Handles language switching logic.
    - `CodeTemplates.js`: Pre-defined boilerplate code for different languages.

### Backend (Server-side)
- **Controller**: [codeExecutionController.js](file:///c:/Users/User/OneDrive/Desktop/FULL%20STACK/thinkskool-main/Server/controllers/codeExecutionController.js)
    - Orchestrates logic for receiving code, submitting to the service, and polling for results.
- **Service Layer**: [judge0Service.js](file:///c:/Users/User/OneDrive/Desktop/FULL%20STACK/thinkskool-main/Server/services/judge0Service.js)
    - **Crucial**: This is where we integrate with the Judge0 API via RapidAPI. Handles Base64 encoding/decoding of transmissions.
- **Routes**: [codeExecutionRoutes.js](file:///c:/Users/User/OneDrive/Desktop/FULL%20STACK/thinkskool-main/Server/routes/codeExecutionRoutes.js)

---

## 2. Identified Issue Domains

### A. Execution Failures
- **Symptom**: "Failed to execute code" or timeout errors.
- **Root Causes to Investigate**:
    - **polling Logic**: Ensure the polling interval in `codeExecutionController.js` is robust and handles "Processing" states correctly.
    - **API Limits**: Check RapidAPI/Judge0 rate limits and credit exhaustion.
    - **Base64 Issues**: Verify that non-ASCII characters in code don't break the encoding pipeline.

### B. User Input (STDIN) Handling
- **Symptom**: Code requires external input (e.g., `scanf`, `input()`) but hangs or fails.
- **Action Items**:
    - Ensure `stdin` is being correctly passed from the frontend `Terminal.jsx` component to the backend request.
    - In `judge0Service.js`, confirm the `stdin` field is Base64 encoded before being sent to Judge0.

### C. Error Handling & Feedback
- **Symptom**: Meaningless error messages like "Internal Server Error" instead of specific compiler/runtime errors.
- **Action Items**:
    - Improve decoding of `compile_output` and `stderr` in `judge0Service.js`.
    - Map Judge0 status IDs (e.g., Status 3 = Accepted, Status 6 = Compilation Error) to user-friendly messages in the frontend.

---

## 3. Getting Started

1.  **Environment Sync**: Ensure your `.env` includes a valid `JUDGE0_API_KEY`.
2.  **Trace a Request**: Use Netowrk tab to inspect the payload sent to `/api/code/execute` and verify the `source_code` and `stdin` fields.
3.  **Audit the Service**: Start with [judge0Service.js](file:///c:/Users/User/OneDrive/Desktop/FULL%20STACK/thinkskool-main/Server/services/judge0Service.js) to ensure raw transmission logs are captured for debugging.

> [!IMPORTANT]  
> Always ensure that any code modification in the execution pipeline is tested with multiple languages (Python, C++, Node.js) to verify cross-compatibility of the Base64 encoding.
