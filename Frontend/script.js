//  Handle Sign Up 
function handleSignUp(event) {
    event.preventDefault();
  
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    fetch('http://localhost:8000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        alert("Signup successful! Please log in.");
        window.location.href = "signin.html";
      })
      .catch(err => {
        console.error('Signup Error:', err);
        alert("Signup failed. Try again.");
      });
  }
  
  // Handle Sign In 
  function handleSignIn(event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    fetch('http://localhost:8000/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("loggedInUser", email);
        alert("Login successful!");
        window.location.href = "test.html";
      })
      .catch(err => {
        console.error('Login Error:', err);
        alert("Login failed. Try again.");
      });
  }
  
  // Handle Logout 
  function logout() {
    localStorage.removeItem("loggedInUser");
    alert("You have been logged out.");
    window.location.href = "signin.html";
  }
  
  //Contract Configuration 
  
  const contractAddress = "0x623D823a9c6ee7Acd39dcfDd887C69ea107298a9";
  
  // REPLACE this with your actual ABI if changed
  const contractABI = 
    [
      {
        "inputs": [
          {
            "internalType": "uint8",
            "name": "_result",
            "type": "uint8"
          }
        ],
        "name": "logPrediction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "name": "getAllPredictions",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              },
              {
                "internalType": "uint8",
                "name": "result",
                "type": "uint8"
              }
            ],
            "internalType": "struct MentalHealthDApp.Prediction[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "userPredictions",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "result",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  // Log Prediction to Blockchain
  async function logPredictionOnChain(prediction) {
    console.log("🔍 Logging prediction to blockchain:", prediction);
  
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
        const tx = await contract.logPrediction(prediction); // Must be 0 or 1
        await tx.wait();
  
        console.log("✅ Prediction logged on blockchain!");
        alert("✅ Prediction logged on blockchain!");
      } catch (err) {
        console.error("❌ Blockchain Error:", err);
        alert("⚠️ Failed to log prediction on blockchain.");
      }
    } else {
      alert("⚠️ MetaMask not installed.");
    }
  }
  
  // Fetch Prediction History 
  async function fetchPredictionHistory() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const user = accounts[0];
  
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
        const predictions = await contract.getAllPredictions(user);
        const historyDiv = document.getElementById("history");
  
        if (predictions.length === 0) {
          historyDiv.innerHTML = "<p>No predictions logged yet.</p>";
          return;
        }
  
        let html = "<h3>Prediction History</h3><ul>";
        predictions.forEach(p => {
          const date = new Date(Number(p.timestamp) * 1000).toLocaleString();
          const status = p.result === 1 ? "High Risk" : "Low Risk";
          html += `<li><strong>${status}</strong> - ${date}</li>`;
        });
        html += "</ul>";
        historyDiv.innerHTML = html;
  
      } catch (err) {
        console.error("History Fetch Error:", err);
        alert("⚠️ Failed to fetch prediction history.");
      }
    } else {
      alert("⚠️ MetaMask not available.");
    }
  }
  
  //Handle Mental Health Form Submission
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("mentalHealthForm");
  
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
  
        const optionMap = {
          "Never": 0, "Rarely": 1, "Sometimes": 2, "Often": 3, "Always": 4,
          "Very Poor": 0, "Poor": 1, "Average": 2, "Good": 3, "Very Good": 4
        };
  
        const get = (id) => optionMap[document.getElementById(id).value] ?? 0;
  
        const data = {
          Age: parseInt(document.getElementById("Age").value),
          Gender: parseInt(document.getElementById("Gender").value),
          family_history: get("supportAtWork"),
          work_interfere: get("stressAtWork"),
          no_employees: get("workLifeInterference"),
          leave: 1,
          mental_health_consequence: get("emotionalDrain"),
          phys_health_consequence: get("feelingValued"),
          supervisor: get("concentration"),
          mental_vs_physical: get("socialIsolation"),
          obs_consequence: get("burnout")
        };
  
        fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
          .then(res => res.json())
          .then(result => {
            console.log("📦 ML API Response:", result);
            const fullName = document.getElementById("fullName").value;
            const message = `Thank you, ${fullName}. Prediction: ${result.message}`;
            document.getElementById("result").innerText = message;
            alert(message);
  
            // Pass prediction to blockchain logger (must be 0 or 1)
            logPredictionOnChain(result.prediction);
          })
          .catch(err => {
            console.error("Prediction Error:", err);
            document.getElementById("result").innerText = "Error predicting result.";
          });
      });
    }
  });
  