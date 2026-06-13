⛪ Church Management & Live Streaming Backend

A modern, scalable backend system powering a full digital church platform.
It supports live streaming, events, blogs, user management, and real-time analytics with visitor tracking.

Built to serve both public-facing church pages and an internal admin dashboard.

🚀 Features

📡 Live Streaming System
Supports YouTube & Facebook Live embeds
Live/offline status tracking
Current and past livestream management
Public live page API

📊 Analytics & Visitor Tracking
Unique visitor tracking using cookies (no login required)
Prevents duplicate daily visit counts
Tracks page-based visits (home, about, events, etc.)
Weekly analytics aggregation for dashboard charts
Real-time engagement insights

📝 Blog System
Create, update, delete blogs
Blog analytics integration
Weekly blog activity tracking

📅 Events Management
Create and manage church events
Event listing API for frontend
Tracks upcoming and active events

👥 User Management
Admin user management system
Fetch all users
Tracks new user registrations for insights


📈 Admin Dashboard Support
Powerful data endpoints for:

Total users, blogs, events
New users today
Weekly blog activity
Upcoming events
Recent user activity feed
Live broadcast status
Weekly engagement chart (Chart.js frontend integration)

🧠 Architecture Overview
Node.js + Express backend
RESTful API design
Cookie-based visitor tracking
MongoDB (Mongoose-based models)
Modular controller structure
Middleware-based authentication system (expandable)

📡 API Endpoints
Analytics
POST   /analytics/:id        → Track page visit (cookie-based)
GET    /analytics/weekly     → Weekly visit statistics

Live Streaming
GET    /live                 → Get current live stream
GET    /live/past           → Get past livestreams

Blogs
GET    /blogs               → Fetch all blogs
POST   /blogs               → Create blog

Events
GET    /events              → Fetch events
POST   /events              → Create event

Users
GET    /manage/all          → Fetch all users

📊 Analytics Logic
Each visitor is assigned a cookie-based visitorId
Visits are counted once per user per page per day
Stored structure:
{
  "visitorId": "uuid",
  "pageId": "home",
  "date": "2026-06-13",
  "createdAt": "timestamp"
}
Weekly aggregation used for dashboard charts:
[
  { date: "2026-06-10", count: 12 },
  { date: "2026-06-11", count: 20 }
]

🎯 Frontend Integration
Vanilla JS dashboard
Chart.js for analytics visualization
Real-time dashboard updates
Live stream embedding (YouTube/Facebook)
Activity feed & insights panels

🔐 Security Notes
Cookie-based visitor tracking (httpOnly, sameSite enabled)
Middleware-ready architecture for authentication expansion
Input validation recommended for production

🛠 Tech Stack
Node.js
Express.js
MongoDB (Mongoose)
JavaScript (Frontend)
Chart.js
REST API architecture

📌 Future Improvements
Real-time WebSocket analytics
Push notifications for live services
Email alerts for events
Advanced dashboard filtering

