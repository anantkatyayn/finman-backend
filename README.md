# 💼 FinMan Backend – Personal Finance Manager (API)

This is the **backend API** for [FinMan](https://github.com/anantkatyayn/finman-frontend) — a modern personal finance management app. It powers features like user authentication, income/expense tracking, and file uploads.

Built with **Node.js**, **Express**, and **MongoDB**.


## 🔧 Tech Stack

- **Node.js + Express** – REST API framework
- **MongoDB + Mongoose** – Data modeling and persistence
- **JWT Auth** – Secure authentication
- **Multer / Cloudinary** – Profile image upload
- **CORS + dotenv** – Environment and security configs


## 📁 Folder Structure

```
backend/
├── controllers/       # Business logic
├── models/            # Mongoose schemas
├── routes/            # API route definitions
├── middleware/        # Auth + upload handling
├── utils/             # Image uploader
├── uploads/           # (Optional) for local file storage
├── .env               # Environment variables
├── server.js          # Entry point
└── package.json
```

## 📦 API Features

### 👤 Authentication

- `POST /api/v1/auth/register` – Register user
- `POST /api/v1/auth/login` – Login user
- `GET /api/v1/auth/getUser` – Get user info (protected)
- `POST /api/v1/auth/upload-image` – Upload profile picture

### 💰 Income

- `POST /api/v1/income/add` – Add income
- `GET /api/v1/income/get` – Fetch all income
- `DELETE /api/v1/income/delete/:id` – Delete an income
- `GET /api/v1/income/downloadexcel` – Export income as Excel

### 💸 Expenses

- `POST /api/v1/expense/add` – Add expense
- `GET /api/v1/expense/get` – Fetch all expenses
- `DELETE /api/v1/expense/delete/:id` – Delete expense
- `GET /api/v1/expense/downloadexcel` – Export expense as Excel

### 📊 Dashboard

- `GET /api/v1/dashboard` – Get totals, monthly stats, recent transactions


## 🔗 Important Links
###  Frontend Repo

👉 [FinMan Frontend](https://github.com/anantkatyayn/finman-frontend)
###  Deployed Website

👉 [FinMan](https://finman-anant.netlify.app)


## 🧪 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/anantkatyayn/finman-backend.git
cd finman-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<your-cluster-url>
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Start the Server

```bash
npm run dev
```

Server runs at: `http://localhost:8000`

## 🟢 Render Deployment Tips

- Add these build/start commands:
  - Build command: `npm install`
  - Start command: `node server.js`
- Add environment variables via Render dashboard
- Enable **Web Service** (not static site)


## 👨‍💻 Author

Made with 💚 by [Anant Katyayn](https://github.com/anantkatyayn)
