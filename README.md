# 🗂️ Task Management System

A full-stack Task Management System built for small teams to efficiently create, assign, manage, and track tasks. This project was developed as part of a software developer take-home assignment to showcase practical skills in modern web development, problem-solving, and user-focused design.

## 🚀 Features

### ✅ User Authentication
- Secure user registration and login.
- JWT-based session handling.
- Encrypted password storage using industry standards.

### ✅ Task Management
- Full CRUD (Create, Read, Update, Delete) operations.
- Tasks include: `title`, `description`, `due date`, `priority`, and `status`.

### ✅ Team Collaboration
- Assign tasks to other registered users.
- Automatic notifications upon assignment.

### ✅ Dashboard
- Personalized view showing:
  - Tasks assigned to the user.
  - Tasks created by the user.
  - Overdue tasks (highlighted in red).

### ✅ Search and Filters
- Search tasks by title or description.
- Filter tasks by:
  - Status (`To Do`, `In Progress`, `Completed`)
  - Priority (`Low`, `Medium`, `High`)
  - Due Date (`Today`, `This Week`, `Overdue`, `No Due Date`)

## ⚙️ Tech Stack

| Layer      | Tech                     |
|------------|--------------------------|
| Frontend   | [Next.js](https://nextjs.org/) + Tailwind CSS |
| Backend    | [Express.js](https://expressjs.com/) |
| Database   | [MongoDB](https://www.mongodb.com/) |
| State Mgmt | Zustand                  |
| Auth       | JWT + Bcrypt             |
| Hosting    | Vercel |

## 📁 Project Structure
/components # Reusable UI components (Kanban, Tasklist, Sidebar, etc.)
/pages/api # API routes for tasks, users, authentication
/store # Zustand stores for state management
/types # TypeScript types for Tasks, Users, etc.
/utils # Utility functions (e.g., for date formatting)


### Prerequisites
- Node.js >= 18
- MongoDB instance (local or cloud via Atlas)

### Installation

```bash
git clone [https://github.com/dhayaaaa/Task-Management-App-NEXTJS.git]
cd Task-Management-App-NEXTJS
npm install

```Create a .env.local file in the root directory:

NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri

```Run Locally

npm run dev

PROCEDURE/WORKING
*U can use default mail/password to login
* add task
* CRUD Operations also there u can edit task later
*Toggle the task among TODO PROGRESS COMPLETED
*Assign task to the users that already have an account





THANK YOU
