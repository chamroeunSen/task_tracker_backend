# Task Tracker API (Backend)

This is the backend service for the Task Tracker application. It is built using Node.js, Express, and AWS DynamoDB to provide a fast, secure RESTful API for managing tasks.

##  Features
* **Full CRUD Operations:** Create, read, update, and delete tasks seamlessly.
* **Cloud Database:** Fully integrated with AWS DynamoDB for scalable, persistent storage.
* **Secure Configurations:** Environment variables used to protect sensitive AWS cloud credentials.

##  Tech Stack
* **Runtime Environment:** Node.js
* **Backend Framework:** Express.js
* **Database:** AWS DynamoDB (NoSQL)

##  Prerequisites
Before running this project, ensure you have:
* **Node.js** (v22 or higher recommended)
* An **AWS Account** with an active DynamoDB table.
* Local AWS credentials or permission to access your cloud tables.

##  Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chamroeunSen/task_tracker_backend.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the backend directory:
   ```env
   PORT=3000
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   DYNAMODB_TABLE_NAME=your_tasks_table_name
   ```
   *(Note: Ensure your `.env` file is added to your `.gitignore` so your AWS keys are never leaked to GitHub.)*

## 🏃 Running the Application

* **Development Mode (with Nodemon):**
  ```bash
  npm run dev
  ```
* **Production Mode:**
  ```bash
  npm start
  ```

## 🛣️ API Endpoints


| Method | Endpoint | Description | Request Body (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | Retrieve all tasks from DynamoDB | None |
| **GET** | `/tasks/:id` | Retrieve a specific task by ID | None |
| **POST** | `/tasks` | Create a new task | `{ "title": "String", "description": "String" }` |
| **PATCH** | `/tasks/:id` | Update an existing task status/details | `{ "completed": Boolean }` |
| **DELETE** | `/tasks/:id` | Delete a task from DynamoDB | None |
