# AutoValuate - Built Architecture & System Design

This document provides a detailed explanation of the AutoValuate full-stack project architecture. It describes how the different components (Frontend, Backend, and Machine Learning Machine) interact.

## 1. System Overview

AutoValuate is a Car Resale Value Prediction application. The primary goal of the system is to allow users to input specifications of a vehicle (like engine size, manufacturer, horsepower, body style) and receive an intelligent estimate of its market value.

The project follows a standard **Client-Server architecture**, strictly separating the user interface from the data processing and machine learning logic.

*   **Client (Frontend):** A React (Vite) application that runs in the user's browser. It is responsible for gathering input, displaying data visually using charts, and showing prediction results.
*   **Server (Backend):** A Python (FastAPI) application that operates as a REST API. It receives data from the frontend, queries the trained machine learning models, and serves raw dataset metrics.

---

## 2. Frontend Architecture (React + Vite)

The frontend is a Single Page Application (SPA). This means it loads a single HTML page and dynamically updates the content as the user interacts with it, resulting in a fast, seamless experience without page reloads.

**Key Technologies:**
*   **Framework:** React 19.
*   **Build Tool:** Vite (chosen for its extremely fast Hot Module Replacement during development).
*   **Routing:** `react-router-dom` is used to map URLs (`/`, `/predict`, `/dataset`, `/visualizations`) to specific React components without triggering a browser refresh.
*   **Charting:** `recharts` is used to render the SVG-based data visualizations.
*   **Styling:** Custom Vanilla CSS utilizing CSS variables (custom properties) for theming and a "Glassmorphism" aesthetic (semi-transparent backgrounds with blur).
*   **HTTP Client:** `axios` is configured with a base URL to communicate flawlessly with the FastAPI backend.

**Directory Structure (`/frontend/src`):**
*   `api/axios.js`: Centralized Axios configuration for backend requests.
*   `components/`: Reusable UI pieces (e.g., `Navbar`, `Spinner`, `ErrorBanner`).
*   `pages/`: The main views tied to routes (e.g., `Home.jsx`, `Predict.jsx`, `Dataset.jsx`, `Visualizations.jsx`).
*   `App.jsx`: The root component that sets up the Router and layout.

---

## 3. Backend Architecture (FastAPI)

The backend is built with FastAPI, a modern, fast web framework for building APIs with Python based on standard Python type hints.

**Key Technologies:**
*   **Framework:** FastAPI.
*   **Server:** Uvicorn (an ASGI web server implementation for Python).
*   **Data Validation:** `pydantic` heavily enforces that incoming data from the React frontend matches the exact types and constraints required by the machine learning models.
*   **Machine Learning:** `scikit-learn` and `joblib` are used for loading and executing the models.
*   **Data Processing:** `pandas` and `numpy` handle the dataset and format arrays for prediction runs.

**Directory Structure (`/backend`):**
*   `main.py`: The entry point. It initializes the FastAPI app, configures CORS (Cross-Origin Resource Sharing) to allow requests from the React frontend port (5173), and connects all the routers.
*   `routes/`: Modules keeping the API organized by domain:
    *   `predict.py`: The core endpoint (`POST /predict/`). It receives the car specs, formats them into a NumPy array, loads the requested `.pkl` model, and returns the predicted price.
    *   `dataset.py`: Endpoint (`GET /dataset/`) that uses Pandas to read the raw `car_dataset.csv` file, cleans it, handles missing values, and sends it to the frontend's datatable.
    *   `visualize.py`: Endpoint (`GET /visualize/metrics`) calculating aggregate statistics, correlation matrices, and averages used by the Recharts graphs on the frontend.
*   `saved_models/`: The compiled, serialized machine learning models (`.pkl` format).
*   `data/`: The raw CSV datasets.

---

## 4. The Machine Learning Pipeline

The prediction engine relies on pre-trained models.

**The Workflow:**
1.  **Data Preparation (`prepare_csv.py` / `preprocess.py`):** The raw UCI Automobile dataset contains missing values and categorical text (e.g., "Toyota", "Gas"). These scripts clean the data, impute missing numbers, and use techniques like Label Encoding to transform text into numbers that a machine learning algorithm can understand.
2.  **Training (`train.py`):** The cleaned data is split into "training" and "testing" sets. Three different Scikit-Learn algorithms (Linear Regression, Decision Tree Regressor, Random Forest Regressor) are trained on the data to learn the relationship between the features and the target variable (`price`).
3.  **Serialization:** Using the `joblib` library, these trained models are saved to disk as `.pkl` files.
4.  **Inference (Live Prediction):** When a user hits "Predict" on the frontend, the backend route (`predict.py`) loads these `.pkl` files into memory. It ensures the user's input features are in the *exact same order* as during training (`FEATURE_ORDER`), feeds the array to the model's `.predict()` method, and returns the output.

**The Ensemble Concept:**
The API supports an "Ensemble" prediction mode. If selected, the backend routes the user's data through *all three* loaded models simultaneously and calculates the arithmetic mean (average) of their predictions. This leverages the "wisdom of the crowd", often resulting in a more robust and generalized prediction than any single model alone.
