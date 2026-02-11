# Event Platform: Full-Stack Event Orchestration System

A sophisticated, role-based event management platform designed to handle the full lifecycle of events—from organization approval and event creation to team formations and QR-based attendance tracking. Built with a focus on **security**, **scalability**, and **user experience**.

## 🚀 Key Features

###  Advanced Security & Auth

* **JWT Authentication:** Stateless security using JSON Web Tokens.
* **RBAC (Role-Based Access Control):** Granular permissions for **ADMIN**, **ORGANIZER**, and **PARTICIPANT**.
* **Secure Password Hashing:** BCrypt encryption for user data protection.

###  Organization & Event Management

* **Approval Workflow:** Organizers submit organizations for Admin review before they can host events.
* **Event Lifecycle:** Manage events through stages: `DRAFT` ➔ `PUBLISHED` ➔ `ONGOING` ➔ `COMPLETED`.
* **Announcement System:** Real-time-style updates for event participants.

###  Collaboration & Participation

* **Team Dynamics:** Support for both Individual and Team-based registrations.
* **Invite Codes:** Secure team joining via unique auto-generated codes.
* **Attendance Tracking:** Backend-ready for QR-code check-ins with precise timestamps.

###  Admin Command Center

* **User Moderation:** Enable/Disable users and manage global roles.
* **System Analytics:** High-level summaries of total users and active events.

---

## 💻 Tech Stack

### Backend (Java Spring Boot)

* **Framework:** Spring Boot 3.x
* **Security:** Spring Security 6 (Stateless JWT Filter)
* **Persistence:** Spring Data JPA (Hibernate)
* **Database:** MySQL
* **Validation:** Jakarta Persistence (Lombok for boilerplate reduction)

### Frontend (React + Vite)

* **Build Tool:** Vite (for lightning-fast HMR)
* **Styling:** Tailwind CSS (Modern, utility-first design)
* **Routing:** React Router DOM v6
* **API Client:** Axios (Interceptors for JWT attachment)

---

##  Database Schema

The system utilizes a relational schema to manage complex event-user-team interactions:

* `Users`: Central identity table with role-based flags.
* `Organizations`: Linked to organizers with a status-based approval gate.
* `Events`: Detailed event metadata linked to parent organizations.
* `Registrations`: Junction table managing `INDIVIDUAL` or `TEAM` participation.
* `Teams`: Unique `joinCode` logic for group management.

---

##  Getting Started

### Prerequisites

* JDK 17 or higher
* Node.js (v18+)
* MySQL Server

### Backend Setup

1. Navigate to the `backend` folder.
2. Update `application.properties` with your MySQL credentials.
3. Run the application:
```bash
./mvnw spring-boot:run

```



### Frontend Setup

1. Navigate to the `frontend` folder.
2. Install dependencies:
```bash
npm install

```


3. Launch the development server:
```bash
npm run dev

```



---

##  API Documentation (Sample Endpoints)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Public | Create a new account |
| `POST` | `/api/v1/events` | Organizer | Initialize a new event draft |
| `GET` | `/api/v1/admin/users` | Admin | Fetch all registered users |
| `POST` | `/api/v1/teams/join` | Participant | Join a team via code |

---

## 🧠 Challenges Overcome

* **Complex Permissions:** Implemented a custom `JwtAuthenticationFilter` and `SecurityConfig` to ensure that Participants cannot access Organizer tools, even if they know the API endpoints.
* **State Synchronization:** Managed complex UI states in React to ensure the "Publish" or "Close" buttons only appear based on the current backend `EventStatus`.

