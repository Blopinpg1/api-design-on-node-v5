🚀 API Design on Node.js (v5)

A Node.js REST API demonstrating modular architecture, clean code, and best practices for building scalable APIs.

<p align="left"> <img src="https://img.shields.io/badge/Node.js-14+-green?style=for-the-badge" /> <img src="https://img.shields.io/badge/Express-Server-yellow?style=for-the-badge" /> <img src="https://img.shields.io/badge/REST-API-blue?style=for-the-badge" /> <img src="https://img.shields.io/badge/Frontend%20Masters-Course-red?style=for-the-badge" /> </p>
📖 Overview

This repository contains a Node.js backend API project built with:

Express.js for server and routing

Modular controllers and services

RESTful endpoints with proper HTTP status codes

Optional database integration (MongoDB, PostgreSQL, or mock JSON)

Input validation, error handling, and scalable architecture

This project was created as part of the Frontend Masters course:
🎓 “API Design and Node.js Best Practices”

It is ideal for:

Learning Node.js API design

Building a scalable backend

Bootstrapping new API projects quickly

📁 Project Structure
/
├── server.js (or app.js)         # Entry point: starts server and configures routes
├── routes/                       # API route definitions
│   ├── users.js                  # User routes
│   ├── products.js               # Product routes
│   └── ...
│
├── controllers/                  # Request handlers
│   ├── userController.js
│   ├── productController.js
│   └── ...
│
├── services/                     # Business logic / data operations
│   ├── userService.js
│   ├── productService.js
│   └── ...
│
├── models/ (optional)            # Data models / schema definitions
├── data/ (optional)              # Mock JSON data
├── middleware/ (optional)        # Logging, auth, validation
├── utils/ (optional)             # Helper functions
├── tests/ (optional)             # Unit/integration tests
├── .env                          # Environment variables (PORT, DB_URI, etc.)
├── package.json                  # Dependencies & scripts
└── README.md                     # Project documentation

⚡ Getting Started
1️⃣ Clone the repo
git clone https://github.com/Blopinpg1/api-design-on-node-v5.git
cd api-design-on-node-v5

2️⃣ Install dependencies
npm install

3️⃣ Configure environment

Create a .env file if required:

PORT=3000
DB_URI=mongodb://localhost:27017/mydb

4️⃣ Start the server
npm start


The API should now be running locally at:
http://localhost:3000

🌐 Live API Demo

The API is deployed on Render and publicly accessible:

https://habit-api-otrr.onrender.com

Example Endpoints on Live Server
Method	Endpoint	Description
GET	/users	List all users
GET	/users/:id	Get a user by ID
POST	/users	Create a new user
PUT	/users/:id	Update an existing user
DELETE	/users/:id	Delete a user
GET	/products	List all products
GET	/products/:id	Get a product by ID
POST	/products	Add a new product
PUT	/products/:id	Update a product
DELETE	/products/:id	Delete a product
Example cURL Requests on Live Server
# Get all users
curl https://habit-api-otrr.onrender.com/users

# Create a new user
curl -X POST https://habit-api-otrr.onrender.com/users \
-H "Content-Type: application/json" \
-d '{"name": "Bibek", "email": "bibek@example.com"}'

🔧 Features & Best Practices

✅ Modular code structure: routes, controllers, services

✅ RESTful API design

✅ Error handling & proper HTTP status codes

✅ Scalable & testable architecture

✅ Optional DB integration (MongoDB, PostgreSQL, or mock JSON)

✅ Ready for unit/integration tests
