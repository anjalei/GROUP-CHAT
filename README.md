# Real-Time Chat Application (Backend)

A scalable real-time chat backend built using WebSockets for low-latency group messaging with secure access control and automated message archiving.

## Tech Stack
- Node.js
- Express.js
- Socket.IO
- MongoDB
- REST APIs
- Cron Jobs

## Features
- Real-time group messaging using WebSockets (Socket.IO)
- User registration and authentication
- Role-based access control for chat participation
- Low-latency message delivery across multiple users
- Automated message archiving using Cron jobs
- Secure and scalable backend design

## High-Level Architecture (OOD Overview)
- **Client Layer**
  - Connects via REST APIs for auth
  - Uses WebSocket connection for real-time messaging

- **API Layer (Express)**
  - Handles user registration, login, and role validation
  - Issues authentication tokens
  - Manages chat room metadata

- **WebSocket Layer (Socket.IO)**
  - Maintains persistent client connections
  - Broadcasts messages to group members
  - Handles join/leave room events
  - Ensures low-latency communication

- **Service Layer**
  - Business logic for message validation
  - Role-based access enforcement
  - Message persistence handling

- **Database Layer (MongoDB)**
  - Stores users, roles, chat rooms, and messages
  - Archived messages moved/flagged for performance optimization

- **Background Jobs (Cron)**
  - Periodically archives old messages
  - Keeps active collections lightweight and performant

## Project Structure
controller/
routes/
model/
services/
middleware/
jobs/
sockets/
util/
server.js


## Setup & Run Locally
```bash
git clone https://github.com/anjalei/GROUP-CHAT.git
cd GROUP-CHAT
npm install
npm start
```

## What I Learned

Designing real-time systems using WebSockets

Managing persistent socket connections at scale

Role-based access control in real-time applications

Low-latency message broadcasting patterns

Background job scheduling using Cron

Database performance optimization via message archiving

## Author

Anjali R Nair

Backend / MERN Developer

GitHub: https://github.com/anjalei

LinkedIn: https://linkedin.com/in/anjalirnair/




