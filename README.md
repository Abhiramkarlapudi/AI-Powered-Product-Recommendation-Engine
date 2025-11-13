# AI-Powered Product Recommendation Engine

This is a full-stack AI-powered web application built for the i95dev AI Engineering Intern take-home assignment. It provides personalized product recommendations based on user preferences and browsing history, through a clean, interactive React interface.

---

## Live Demo

* **Frontend (Netlify):** [https://ai-product-recommender.netlify.app](https://ai-product-recommender.netlify.app)
* **Backend (Render):** [https://ai-powered-product-recommendation-engine.onrender.com](https://ai-powered-product-recommendation-engine.onrender.com)

---

## Tech Stack

| Area | Technology |
| :--- | :--- |
| **Backend** | Python, Flask, Gunicorn |
| **Frontend** | React.js, JavaScript (ES6+), CSS |
| **AI Service** | OpenRouter (using `kwaipilot/kat-coder-pro:free`) |
| **Deployment** | Render (Backend), Netlify (Frontend) |

---

## Core Features

* **Full-Stack Application:** A complete, deployed application featuring a React frontend and a Python (Flask) backend.
* **Product Catalog:** Fetches the product list from the backend API on load.
* **Interactive Filtering:** Users can filter the catalog by price range and product category.
* **Browsing History:** The app tracks and displays all products the user clicks on.
* **AI-Powered Recommendations:** The core feature. User preferences and browsing history are sent to a backend LLM, which returns a personalized list of recommendations and *explanations* for each.
* **Robust Fallback:** The backend is designed to fall back to a "Mock AI" service if the live AI model fails (e.g., due to rate-limiting), ensuring the application never crashes.
---

## Approach

### AI & Prompt Engineering

The central goal was to use an LLM as a recommendation engine. This was achieved by designing a specific prompt that turns the general-purpose AI into an expert eCommerce assistant.

**1. AI Service Choice (OpenRouter):**
Initially, I attempted to use the Google Gemini API. However, this led to persistent environment and library versioning issues (`v1beta` errors). To solve this, I pivoted to **OpenRouter**, which acts as a "broker" for many different AI models.

This had two advantages:
* It allowed me to use their **OpenAI-compatible API**, which meant I could use the standard, stable `openai` Python library.
* It gave me access to a **free model** (`kwaipilot/kat-coder-pro:free`), which was crucial for avoiding the `402 Payment Required` errors I hit when testing more expensive models.

**2. Prompt Engineering Strategy:**
The "brain" of the AI is in `backend/services/llm_service.py`. The prompt is carefully structured to provide the AI with **Context**, **Rules**, and a **Format**.

* **Context:** The prompt is dynamically built to include:
    * `User Preferences`: "The user likes these categories and this price range."
    * `User Browsing History`: "The user has already looked at these items."
    * `Available Product Catalog`: "Here is a list of products you can choose from."

* **Rules (The Instructions):** This is the most critical part. I gave the AI 5 explicit instructions:
    1.  Analyze *both* preferences and history.
    2.  Recommend **3** products.
    3.  **"Crucially, DO NOT recommend any product that is already in the browsing history."** (This is the key business logic).
    4.  Provide a 1-sentence **explanation** for each choice (This fulfills the project requirement for "explanations").
    5.  Provide a `confidence_score`.

* **Format:** The prompt demands that the AI respond *only* in a specific JSON format. This makes the response reliable and easy for my Python code to parse.

**3. Fallback System:**
The `llm_service.py` is wrapped in a `try...except` block. If the call to the OpenRouter AI fails for *any* reason (e.g., the free model is rate-limited, as seen during testing), the code **automatically falls back** to a `_get_mock_recommendations` function. This "Mock AI" returns 3 random products, ensuring the user always gets a response and the application never breaks.

---

##  Setup Instructions

The project is deployed and live at the links above. To run it locally, you will need two terminals.

### API Key Configuration

This project requires an API key from OpenRouter to function. The key used in the project is given below.
To run this project locally, create a `.env` file in the `backend/` directory with the following content:

### Backend Setup (Terminal 1)

1.  Navigate to the `backend` directory
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the virtual environment:
    * Windows: `venv\Scripts\activate`
    * macOS/Linux: `source venv/bin/activate`
4.  Install dependencies: `pip install -r requirements.txt`
5.  Create a `.env` file and add LLM API key: `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`
6.  **Important (for Local Testing):** Open `backend/app.py` and change the `CORS` settings to allow `localhost:3000`.
7.  Run the application: `python app.py`
    * The server will run at `http://localhost:5000`
  
### Frontend Setup

1.  Navigate to the `frontend` directory
2.  Install dependencies: `npm install`
3.  **Important:** Edit `frontend/src/services/api.js` to point to your local server:
    * Change the `API_BASE_URL` to: `http://localhost:5000/api`
4.  Start the development server: `npm start`
    * The application should open at `http://localhost:3000`


  

