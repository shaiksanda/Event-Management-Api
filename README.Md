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
🔗 [GitHub Repository](https://github.com/shaiksanda/Event-Management-Api)

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

Example:
POST http://localhost:4000/create-event
Content-Type: application/json

{
    "title":"Music Fest",
    "date_time":"2025-07-15T08:20:30.123Z",
    "location":"Hyderabad",
    "capacity":600
}

response:
{
  "id": 13,
  "message": "Event Created Successfully"
}


Get event details + registered users.
GET /event-details/:eventId
request:
GET http://localhost:4000/event-details/10
response:
{
    
  "event": {
    "id": 10,
    "title": "Music Fest",
    "date_time": "2025-08-01T10:00:00.000Z",
    "location": "Hyderabad",
    "capacity": 600
  },
  "registered_users": [
    {
      "id": 1,
      "email": "sanni@gmail.com",
      "name": "sanni"
    }
  ]
}



POST /register-event
Register a user for an event.
request:
POST http://localhost:4000/register-event 
Content-Type: application/json

{
    "user_id":1,
    "event_id":8
}

response:
{
  "message": "User successfully registered for event"
}


DELETE /cancel-registration
Cancel a user's registration.
request:
DELETE  http://localhost:4000/cancel-registration
Content-Type: application/json

{
    "user_id":1,
    "event_id":11
}
response:
{
  "message": "Registration cancelled successfully"
}

GET /upcoming-events
List all upcoming events.
request:
GET http://localhost:4000/upcoming-events
response:
[
  {
    "id": 4,
    "title": "Music Fest",
    "date_time": "2025-08-01T10:00:00.000Z",
    "location": "Hyderabad",
    "capacity": 500
  },
  {
    "id": 5,
    "title": "Music Fest",
    "date_time": "2025-08-01T10:00:00.000Z",
    "location": "Hyderabad",
    "capacity": 10
  },
  {
    "id": 7,
    "title": "Music Fest",
    "date_time": "2025-08-01T10:00:00.000Z",
    "location": "Hyderabad",
    "capacity": 200
  },
  {
    "id": 8,
    "title": "Music Fest",
    "date_time": "2025-08-01T10:00:00.000Z",
    "location": "Hyderabad",
    "capacity": 200
  },
  {
    "id": 9,
    "title": "Music Fest",
    "date_time": "2025-08-01T10:00:00.000Z",
    "location": "Hyderabad",
    "capacity": 600
  },
  {
    "id": 10,
    "title": "Music Fest",
    "date_time": "2025-08-01T10:00:00.000Z",
    "location": "Hyderabad",
    "capacity": 600
  },
  {
    "id": 11,
    "title": "Music Fest",
    "date_time": "2025-08-01T10:00:00.000Z",
    "location": "Hyderabad",
    "capacity": 600
  },
  {
    "id": 13,
    "title": "Music Fest",
    "date_time": "2025-08-15T08:20:30.123Z",
    "location": "Hyderabad",
    "capacity": 600
  }
]



GET /event-stats/:eventId
Get stats about a specific event.
request:
GET http://localhost:4000/event-stats/8

response:
{
  "event_id": "8",
  "total_registrations": 1,
  "remaining_capacity": 199,
  "capacity_used_percent": 1
}



Author
Shaik Sandani Basha
Submitted for: Surefy Technologies Internship Assignment