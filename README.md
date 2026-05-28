# Orbit Workspaces API (Backend)

This is the cloud-native backend routing service for the Orbit Workspaces manager. It utilizes an event-driven Node.js runtime environment paired with Express and AWS DynamoDB to execute resource-efficient workflow calculations.

## 🚀 Features
*   **Dynamic Expression Construction:** Implements single-attribute update expressions using the JavaScript AWS SDK (v3) to modify field values atomically without risk of null-payload data overwrites.
*   **Optimized NoSQL Single-Table Layout:** Leverages a composite partition-and-sort primary key strategy to isolate metadata schemas and multi-task documents within a single physical table unit.
*   **Resource-Sparing Scoping:** Intentionally optimized parameters built without data bloat dependencies to adhere strictly to lean serverless computing architecture constraints.
*   **Environment Segregation:** Complete decoupling of cloud access keys from repository code lines using encrypted runtime environment variables.

## 🛠️ Tech Stack
*   **Runtime Environment:** Node.js v22.x
*   **Backend Routing Engine:** Express.js
*   **Cloud Cloud Database:** AWS DynamoDB (NoSQL Storage System)
*   **Interface Gateway:** AWS SDK for JavaScript v3 (`@aws-sdk/client-dynamodb`)

## 📋 Prerequisites
Before launching this container runtime service, ensure you have:
*   An **AWS Active Account** containing an provisioned DynamoDB index table.
*   Local Identity access keys (`AWS_ACCESS_KEY_ID`) configured with read/write resource permissions.

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chamroeunSen/task_tracker_backend.git
   cd task_tracker_backend
   ```

2. **Install server dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Secret Arrays:**
   Create a hidden `.env` file in the service root workspace node:
   ```env
   PORT=3000
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_iam_access_key_id
   AWS_SECRET_ACCESS_KEY=your_iam_secret_access_key
   DYNAMODB_TABLE_NAME=OrbitWorkspacesTable
   ```
   *(Note: Ensure your `.env` is explicitly documented inside your `.gitignore` file to guarantee cloud credentials are never leaked to public version trees.)*

## 🏃 Running the Application

*   **Development Watch Engine (Nodemon Hot Reloading):**
    ```bash
    npm run dev
    ```
*   **Production Standalone Process Launch:**
    ```bash
    npm start
    ```

## 🛣️ API Endpoints

All transaction payloads communication pipelines adhere to strict JSON configurations.

### Task Control Routes

| Method | Endpoint | Description | Expected Request Body Parameters (JSON Schema) |
| :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | Query all active task records | None |
| **POST** | `/tasks` | Create a fresh task document entry | `{ "id": "String", "projectId": "String", "title": "String", "description": "String", "priority": "String", "status": "String", "createdAt": "ISOString" }` |
| **PUT** | `/tasks/:id` | Execute dynamic patch mutations | `{ "title": "String", "description": "String", "priority": "String", "status": "String", "projectId": "String" }` *(All properties optional)* |
| **DELETE** | `/tasks/:id` | Remove task record completely from table | None |

### Project Control Routes

| Method | Endpoint | Description | Expected Request Body Parameters (JSON Schema) |
| :--- | :--- | :--- | :--- |
| **GET** | `/projects` | Query all registered project plans | None |
| **POST** | `/projects` | Initialize a new project container | `{ "projectId": "String", "projectName": "String", "projectDescription": "String", "createdAt": "ISOString" }` |
| **PUT** | `/projects/:projectId` | Modify project title or context descriptors | `{ "projectName": "String", "projectDescription": "String" }` |
| **DELETE** | `/projects/:projectId` | Drop project container from database | None |

## ☁️ Deployment Notes (On-Demand Scale Optimization)
This engine is built for hosting on **Render.com Web Services**. Because instances run on on-demand container nodes that spin down to save resource costs during periods of inactivity, the initial endpoint handshake transaction may trigger a standard provisioning startup delay of up to 30 seconds.
