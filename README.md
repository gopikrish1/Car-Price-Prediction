# AutoValuate - Car Price Intelligence

AutoValuate is a comprehensive, full-stack car resale value prediction application. It features a modern React (Vite) frontend for an immersive user experience, and a robust FastAPI backend powered by Machine Learning models.

Our application utilizes the classic **UCI Automobile dataset** to provide precise data-driven market valuations based on vehicle specifications.

## ✨ Features

- **Pricing Intelligence:** Predict car prices via an intuitive and feature-rich query form with robust real-time constraint validation. The system dynamically runs your specifications through a sophisticated Machine Learning pipeline.
- **Ensemble Learning:** Choose between Linear Regression, Decision Tree, and Random Forest models, or use our **Ultimate Ensemble** algorithm to get a balanced prediction aggregating the strengths of all models.
- **Data Explorer:** Interactively browse, search, and sort through the dataset with properly aligned, responsive data tables.
- **Visualisations:** Dynamic interactive scatter charts and bar graphs (powered by Recharts) to explore relationships between car features such as Horsepower, Engine Size, MPG, and Market Price.
- **Premium UI / UX:** A stunning, modern "Glassmorphism" interface built with pure CSS and React. Features a custom geometric interlocking A/V lettermark logo, custom dropdown selectors, and seamless micro-animations.

## 💻 Tech Stack

- **Frontend:** React 19, Vite, React Router v7, Recharts (for data visualization), Axios, Vanilla CSS (glassmorphism UI)
- **Backend:** FastAPI, Python, Pandas, NumPy, Scikit-learn (Linear Regression, Decision Tree Regressor, Random Forest Regressor), Uvicorn
- **Data:** UCI Automobile dataset (processed)

## ⚙️ Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v18+ recommended)
- Python (v3.8+ recommended)
- Git

## 🛠️ Project Setup Instructions

Follow these steps to set up the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/gopikrish1/Car-Price-Prediction.git
cd Car-Price-Prediction
```

### 2. Backend Setup

Open a terminal or command prompt and navigate to the `backend` directory:

```bash
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt

# Run the backend FastAPI server
python -m uvicorn main:app --reload --port 8000
```
The backend API will start running at `http://localhost:8000` or `http://127.0.0.1:8000`. You can access the interactive Swagger API documentation at `http://localhost:8000/docs`.

### 3. Frontend Setup

Open a new terminal or command prompt and navigate to the `frontend` directory:

```bash
cd frontend

# Install Node modules
npm install

# Start the Vite development server
npm run dev
```

The frontend will be accessible at `http://localhost:5173`. Open this URL in your browser to access the application.

## 🚀 Usage

1. **Dashboard:** Start at the Home page to get an overview of the application and its capabilities.
2. **Predict:** Enter specific details about a vehicle (Manufacturer, Body Style, Drive Wheel Type, Engine Size, Horsepower, Cylinders, MPG, etc.). Select an ML model (or the Ensemble) and hit "Predict Price" to get its current market valuation.
3. **Data Explorer:** Navigate to the Dataset tab to view the tabular representation of the UCI Automobile data used for training.
4. **Visualizations:** Go to the Visualizations tab to understand the dataset better by viewing relationships between features and pricing using interactive charts.

## 👤 Authors

- Gopi Krishnaa
