# 🌤️ Weather App Dashboard #

A modern, responsive Weather Dashboard that displays real-time weather forecasts, temperature trends, and local city time using the OpenWeather API.
The application uses a Node.js plus Express backend proxy to securely manage API keys and prevent public exposure.


## 🚀 Live Demo ##

https://weather-app-dashboard-6sc0.onrender.com/


## ✨ Features ##

🔍 Search weather by city name

🌡️ Toggle between Celsius (°C) and Fahrenheit (°F)

📊 Interactive temperature chart (Chart.js)

🕒 Displays local city time using timezone offsets

📅 5-interval weather forecast cards

🔁 Toggle Chart View ON / OFF

💾 Saves last searched city & units (localStorage)

🔐 Secure API access via backend proxy

⚡ API response caching & rate limiting


## 🛠️ Tech Stack ##
### Frontend ###

* HTML5

* CSS3

* JavaScript (ES6)

* Chart.js

### Backend ###

* Node.js

* Express.js

* Needle (HTTP client)

* dotenv (environment variables)

* apicache (API response caching)

* Express-rate-limit (rate limiting)

* CORS

## 📂 Project Structure ##
```
weather-app/
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
├── routes/
│   └── index.js
├── index.js
├── package.json
├── .env        # (NOT committed)
├── .gitignore
└── README.md
```

## 🔐 Why a Backend Proxy? ##

To secure the OpenWeather API key, the app uses a Node.js backend that:

* Prevents exposing API keys in frontend JavaScript

* Adds caching to reduce API calls

* Applies rate limiting to prevent abuse

* Centralizes API logic for production readiness

## ⚙️ Environment Variables ##

Create a .env file in the project root:
```
API_BASE_URL="https://api.openweathermap.org/data/2.5/forecast"
API_KEY_NAME="appid"
API_KEY_VALUE="your_openweather_api_key"
```

⚠️  .env  NOT commited to GitHub

## ▶️ Running the Project Locally ##

### 1️⃣ Install dependencies ###
``` 
npm install
```

### 2️⃣ Start the backend server ###
```
npm run dev
```

Server runs on:
```
http://localhost:5000
```

### 3️⃣ Open the frontend ###

Open:
```
public/index.html
```

(or serve it using Live Server)

### 🔄 API Flow ###
```
Browser
   ↓
Frontend (script.js)
   ↓
Node.js API Proxy (/api)
   ↓
OpenWeather API
```
### Add public API info ###
Rename .env.example to .env and edit the values

If the public API URL is https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={APIkey}

* API_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast"
* API_KEY_NAME = "appid"
* API_KEY_VALUE = "YOUR_API_KEY"

You can add on any other query params as needed when hitting the /api endpoint such as https://yourdomain/api?q=dubai without having to add your key in the client

* Add new routes as you see fit
* Change rate limiting and caching to desired values

## ⭐ Acknowledgements ##

* OpenWeather

* Chart.js

* Node.js & Express community
  
* Traversy Media
  
* Excelerate & St. Louis University

## 👤 Author ##

Kelvin Nyagudi

Software Developer | Data & Web Enthusiast
