[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)

# 🌍 World Explorer App

A responsive React application that allows users to explore countries around the world using the [REST Countries API](https://restcountries.com/).  
Users can view countries, filter by region,filter by language, search by name, and view detailed country information.
Registered users can personalize their experience by adding countries to their favorites list, making it easy to access the countries they are most interested in.

---

## 🚀 Technologies Used

- Frontend: React.js, Bootstrap
- API: [REST Countries API v3](https://restcountries.com/)
- Backend: Node.js + Express.js
- Database: MongoDB (for storing user accounts and favorites)
- Authentication: JWT (JSON Web Tokens) for secure user authentication
- Testing: Cypress (End-to-End Testing)

---

## 📦 Project Setup

### 1. Clone the Repository

```bash
git clone [repo link]
```

### 2. Navgate to the Project Directory backend

```bash
cd backend
```

### 3.Install Dependencies

```bash
npm install
```
### 4.Run the Application

```bash
npm start
```

### 5. Navgate to the Project Directory frontend

```bash
cd ..
cd frontend
```

### 6.Install Dependencies

```bash
npm install
```

### 7.Run the Application

```bash
npm start
```
Open your browser and navigate to http://localhost:3000.

---

### 🔍 API Documentation

This project uses the public REST Countries API.

All country data (name, flag, capital, region, etc.) is fetched dynamically.

You can view the API documentation here: https://restcountries.com/.

### 🧪 Testing with Cypress

```bash
npx cypress open
```