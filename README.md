# 🌍 World Explorer App

A responsive React application that allows users to explore countries around the world using the [REST Countries API](https://restcountries.com/).  
Users can view countries, filter by region, filter by language, search by name, and view detailed country information.  
Registered users can personalize their experience by adding countries to their favorites list, making it easy to access the countries they are most interested in.

# 🤖 Deployment

The frontend is deployed on Vercel and can be accessed at [World Explorer App](https://world-explorer-rosy.vercel.app/).

---

## 🚀 Technologies Used

- Frontend: React.js, Bootstrap
- API: [REST Countries API v3](https://restcountries.com/)
- Backend: Node.js + Express.js
- Database: MongoDB (for storing user accounts and favorites)
- Authentication**: JWT (JSON Web Tokens) for secure user authentication
- Testing: Cypress (End-to-End Testing)

---

## 📦 Project Setup

### Prerequisites

Ensure you have the following installed on your system:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (running locally or a cloud instance)

---

### 1. Clone the Repository

```bash
git clone [repo link]
```

---

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` directory and configure the following environment variables:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

Run the backend server:

```bash
npm start
```

The backend server will run on `http://localhost:5000`.

---

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend application locally:

```bash
npm start
```

The frontend application will run on `http://localhost:3000`.

Alternatively, you can access the deployed frontend at [World Explorer App](https://world-explorer-rosy.vercel.app/).

---

### 4. Connecting Frontend and Backend

Ensure the backend server is running on `http://localhost:5000`.  
The frontend is pre-configured to communicate with this backend URL. If you need to change it, update the API base URL in the frontend configuration file.

---

## 🔍 API Documentation

This project uses the public REST Countries API.  
All country data (name, flag, capital, region, etc.) is fetched dynamically.

### Key Endpoints

1. **Get All Countries**  
    `GET /all`  
    Fetches a list of all countries.

2. **Search by Country Name**  
    `GET /name/{name}`  
    Fetches country details by name.

3. **Filter by Region**  
    `GET /region/{region}`  
    Fetches countries filtered by region.

4. **Filter by Language**  
    `GET /lang/{language}`  
    Fetches countries filtered by language.

For more details, visit the [REST Countries API Documentation](https://restcountries.com/).

---

## 🧪 Testing with Cypress

Cypress is used for end-to-end testing of the application.

To run Cypress tests:

1. Ensure both the backend and frontend servers are running.
2. Open Cypress:

    ```bash
    npx cypress open
    ```

3. Run the desired test suite from the Cypress UI.

---

## 🧪 Unit and Integration testing

Jest and React Testing libraray used for unit and integration testing.

1. Navigate to the frontend.

    ```bash
    npm test
    ```

## 🌟 Features

- View detailed information about countries.
- Filter countries by region and language.
- Search for countries by name.
- Add countries to a personalized favorites list (requires user registration).
- Secure user authentication using JWT.

## 🛠️ Challenges Faced

- REST Countries API was temporarily unavailable while coding, blocking progress.
- Cards became cramped on small screens.
- Filter controls overlapped on small screens.

## 💡 Solution

- The author fixed the issue after a while.
- Implemented explicit column sizing for responsive grids.  
- Wrapped filters with `flex-wrap`.

