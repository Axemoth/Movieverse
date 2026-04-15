# 🎥 ChaiCode Cinema - Premium Seat Booking

A modern, full-stack movie seat booking platform built with **Node.js**, **Express**, and **PostgreSQL**. featuring a sleek dark-themed UI and secure token-based authentication.

![Screenshot](/public/screenshot_placeholder.png) <!-- Ensure you have a screenshot in public/ or update this link -->

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based registration and login system.
- 🎟️ **Real-time Booking**: Interactive seating chart with live updates.
- 🛡️ **Data Integrity**: Uses PostgreSQL transactions and optimistic locking to prevent double-bookings.
- 🎨 **Premium UI**: Sleek, glassmorphic design powered by Tailwind CSS and Google Fonts (Outfit).
- 📱 **Responsive**: works across desktops and mobile browsers.
- ⚙️ **Modular Architecture**: Clean, production-ready code structure.

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (via CDN).
- **Backend**: Node.js, Express.
- **Database**: PostgreSQL (Docker-ready).
- **Security**: Bcrypt (password hashing), JSON Web Tokens (session management).
- **Configuration**: Dotenv for environment variables.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/) (optional, if using the provided Postgres setup)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Axemoth/Movieverse.git
   cd Movieverse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your credentials:
   ```env
   PORT=8080
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=admin
   DB_PASSWORD=admin123
   DB_NAME=mydb
   JWT_SECRET=your_secure_random_key
   ```

4. **Initialize Database**:
   Run the provided SQL script in your Postgres session to create the necessary tables and seed data:
   - File: `My Local Postgres.session.sql`

### Running the App

- **Start the production server**:
  ```bash
  npm start
  ```
- **Run in development mode** (auto-restart):
  ```bash
  npm run dev
  ```

Once started, open your browser and navigate to `http://localhost:8080`.

## 📂 Project Structure

```text
Movieverse/
├── src/
│   ├── config/      # Database pool configuration
│   ├── middleware/  # JWT Auth middleware
│   └── routes/      # Auth and Seat API routes
├── public/          # Frontend assets (HTML, CSS, JS)
├── .env             # Sensitive configuration (Ignored by Git)
├── index.mjs        # Main entry point
└── package.json     # Project dependencies and scripts
```

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve the project!

## 📜 License

This project is licensed under the ISC License.
