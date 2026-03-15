<<<<<<< HEAD
# Car-Price-Prediction
=======
# AutoValuate - Car Price Intelligence

AutoValuate is a comprehensive, AI-powered car price prediction and analysis tool tailored for the Indian used car market. It features a modern React (Vite) frontend for an immersive user experience, and a robust FastAPI backend powered by an advanced Gradient Boosting ML model.

Our application utilizes real-world Kaggle data (CarDekho dataset) covering over 8,000 Indian used cars across 32 brands to provide highly accurate, data-driven market valuations.

## Features

- **Pricing Intelligence:** Predict car prices via an intuitive and feature-rich query form with 95.4% Cross-Validation accuracy.
- **Data Explorer:** Interactively browse, search, and sort through the entire real-world Indian used cars dataset (8,128 records).
- **Dashboard Analytics:** High-level metrics, top brands distributions, body type pies, and average price per segment visualisations.
- **Visualisations:** Dynamic interactive scatter charts and correlation matrices to explore relationships between car features and market price.

## Tech Stack

- **Frontend:** React, Vite, Recharts (for data visualization), Vanilla CSS (glassmorphism UI)
- **Backend:** FastAPI, Pandas, Scikit-learn (Gradient Boosting Regressor), Uvicorn
- **Data:** Kaggle *Vehicle dataset from cardekho* (processed)

## Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v16+ recommended)
- Python (v3.8+ recommended)
- Git

## Project Setup Instructions

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
The backend API will start running at `http://localhost:8000` or `http://127.0.0.1:8000`.

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

## Usage

1. **Dashboard:** Start here for a high-level overview of the dataset with dynamic charts.
2. **Data Explorer:** Use the tabular view to search and filter real-world cars matching your queries.
3. **Visualize:** Understand the dataset better by viewing relationships between Year, Mileage, Engine Volume, and Price.
4. **Predict:** Enter specific details about a vehicle (Brand, Body Type, Manufacture Year, Fuel Type, Transmission, Condition, etc.) and hit "Predict Price" to get its current market valuation range.

## Authors

- Gopikrishnan
>>>>>>> 71e7f6e (Initial commit of Indian Car Price Prediction application)
