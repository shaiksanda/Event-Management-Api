# Event Management API

A RESTful Event Management API built using **Node.js**, **Express**, and **PostgreSQL** as part of the internship assignment.

This API allows you to create events, register/cancel users, view event details, list upcoming events, and get event statistics.

## 🚀 Features
✅ Create Event  
✅ Get Event Details with registered users  
✅ Register User for Event  
✅ Cancel User Registration  
✅ List Upcoming Events (sorted by date & location)  
✅ Get Event Stats (registrations, remaining capacity, % used)


## 🛠️ Tech Stack
- Node.js
- Express
- PostgreSQL
- pg (PostgreSQL client for Node)


## 📂 Folder Structure
/event-management-api
├── db.js
├── index.js
├── .env
├── .gitignore
├── package.json
└── README.md


## ⚙️ Setup Instructions

git clone https://github.com/shaiksanda/Event-Management-Api.git
cd Event-Management-Api

Install dependencies:
npm install

Create .env file:
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name


Set up the database:

Create a PostgreSQL database.
Run the following SQL to create tables:


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date_time TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INT CHECK (capacity > 0 AND capacity <= 1000) NOT NULL
);

CREATE TABLE registrations (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, event_id)
);



Start the server:
node index.js

API runs at: http://localhost:4000


📖 API Endpoints

POST /create-event
Create a new event.

GET /event-details/:eventId
Get event details + registered users.

POST /register-event
Register a user for an event.

DELETE /cancel-registration
Cancel a user's registration.

GET /upcoming-events
List all upcoming events.

GET /event-stats/:eventId
Get stats about a specific event.



Author
Shaik Sandani Basha
Submitted for: Surefy Technologies Internship Assignment