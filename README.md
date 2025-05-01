# MindCare DApp – Workplace Mental Health Risk Screening
MindCare is a decentralized web application that assesses mental health risk in workplace environments using machine learning and blockchain. It enables users to take a private self-assessment and securely log the prediction result on a blockchain using MetaMask and a smart contract deployed on Ganache.
This DApp demonstrates how AI and blockchain can be combined to provide secure, private, and intelligent mental health support without relying on centralized data storage.

# Project Structure
Final Dapp/ Frontend/ # HTML/CSS/JS interface + MetaMask + ethers.js 
Backend/ # FastAPI + trained ML model for prediction

# Frontend (Frontend/)
# Features:
- Mental health test form based on workplace-related indicators (e.g. stress, support, burnout)
- Real-time prediction using a backend ML model
- Result logging to Ethereum blockchain (Ganache) via MetaMask
- View prediction history on-chain using `getAllPredictions`

# To Run:
bash
copy
cd Frontend
python -m http.server 5500
Then open in browser:
http://localhost:5500/test.html

# Backend (Backend/)
# Features:
FastAPI backend with a trained RandomForest model (80% accuracy)
Handles /predict POST requests with form data
Returns: "High Risk" or "Low Risk / Stable"

# To Run:
bash
Copy
Edit
cd Backend
pip install -r requirements.txt
uvicorn backend_api:app --reload
Access the API at:
 http://127.0.0.1:8000/predict
 
# Smart Contract (Ganache + MetaMask)
Written in Solidity and deployed on Ganache
# Functions:
logPrediction(uint8 _result) → saves prediction with timestamp
getAllPredictions(address user) → fetches previous results
Connected via MetaMask (localhost 7545)
Interaction via ethers.js in the frontend

# Technologies Used
Frontend: HTML, CSS, JavaScript, MetaMask, ethers.js
Backend: FastAPI, Scikit-learn, pandas, joblib
Blockchain: Solidity, Ganache, Web3, MetaMask
Model: RandomForestClassifier

# Known Limitations
Sign-in is handled via browser localStorage (not secure)
No database — predictions only stored on blockchain
Smart contract runs only on Ganache (local blockchain)
Prediction model is not clinically validated

# How to Use
Run the FastAPI backend (see backend section)
Serve the frontend using a local server
Open test.html in your browser
Connect MetaMask to Ganache (RPC: http://127.0.0.1:7545)
Import a Ganache account into MetaMask
Fill out the mental health form and submit
Confirm the transaction in MetaMask
View your prediction and prediction history

# GitHub Repository
https://github.com/ReshamAdhikari/MindCare-Dapp


# Acknowledgments
FastAPI, Scikit-learn, ethers.js, and the Ethereum developer community
MetaMask, Ganache, and Remix IDE
Workplace mental health dataset (Kaggle)



