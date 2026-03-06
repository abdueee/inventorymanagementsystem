# Project Proposal: Retail Inventory Management System - Trackventory

**Team Members:**
- Abdul Mohammed — 1012858481
- Esam Uddin — 1012865384
- Joeria Mahmood — 1011819034

---

## 1. Motivation

Small retail stores like local electronics shops or a neighborhood grocery with a handful of employees still rely on spreadsheets or paper logs to track what's in stock. This works until it doesn't: someone forgets to update a count, a popular item runs out without warning, or a staff member does not get updated on an item's quantity being edited. The result is lost sales, wasted time, and no visibility into what's actually on the shelves.

Existing solutions like Shopify Inventory, Lightspeed, or Zoho Inventory are powerful but come with significant subscription costs, vendor lock-in, and complexity that exceeds the needs of smaller operations.

We're building a cloud-native inventory management system that gives small retail teams a better way to stay on top of their stock. The app features a dashboard landing page with inventory metrics and stock summaries, an inventory page with search and filtering for all users, and an admin-only product management page. Real-time low-stock alerts are pushed to all logged-in users via WebSockets, and role-based access control separates what staff and admins can see and do.

This project also doubles as a hands-on application of cloud computing concepts: containerization with Docker, persistent storage with PostgreSQL, Kubernetes orchestration, real-time communication, and secure authentication, all deployed to a production environment on DigitalOcean.

---

## 2. Objective and Key Features

### Objective

Build and deploy a stateful, containerized retail inventory management application on DigitalOcean, orchestrated with Kubernetes, featuring role-based access control and real-time low-stock notifications via WebSockets.

### Core Technical Requirements

**1. Containerization and Local Development**

All services (React.js frontend, Node.js/Express backend, PostgreSQL database) are containerized with Docker. Docker Compose orchestrates the multi-container setup for local development, allowing the full stack to start with a single `docker-compose up` command.

**2. State Management**

PostgreSQL serves as the primary data store, managed through Prisma for type-safe queries and migrations. Persistent storage is provided via DigitalOcean Volumes so data survives container restarts and redeployments.

The database has mainly two core tables:

- **users** table stores account credentials, names, and roles (admin/staff).
- **products** table stores product details (name, SKU, category, location, quantity, price) along with a per-item `reorder_threshold` for low-stock detection.

**3. Deployment Provider**

The application is deployed to DigitalOcean (IaaS focus), with the production environment running on DigitalOcean's managed Kubernetes service.

**4. Orchestration (Kubernetes)**

Local development and testing use minikube. Production uses DigitalOcean Managed Kubernetes (DOKS). Kubernetes resources include:

- Deployments for the backend, frontend, and PostgreSQL
- PersistentVolumeClaim backed by DigitalOcean Volumes for database persistence
- Secrets for environment configuration

**5. Monitoring and Observability**

DigitalOcean's built-in monitoring dashboard tracks CPU, memory, and disk usage across cluster nodes. Alert policies notify the team when key metrics cross thresholds (e.g., CPU > 80%, disk > 90%).

### Advanced Features

**1. Security Enhancements (Authentication and Authorization)**

User registration and login handled through Better Auth, with password hashing and session management built in. Role-based access control with two roles:

- **Staff** (default on signup): can view the dashboard, browse and search inventory, and update stock quantities on existing items.
- **Admin** (promoted by another admin): full access including creating, editing, and deleting products, plus user management (view users, promote/demote roles).

**2. Real-Time Functionality (WebSockets)**

Socket.io provides bidirectional real-time communication between the server and all connected clients. When any user updates an item's quantity and it drops below the item's `reorder_threshold`, the server broadcasts a `low-stock-alert` to all connected clients instantly. On connection, each client receives the current low-stock count to populate a notification badge. This keeps all logged-in staff aware of stock issues without manual refreshes.

### Application Features

- **Dashboard (Landing Page):** Displays summary stats including total items, items by category, total inventory value, and a low-stock warnings table showing items below their reorder threshold.
- **Inventory Page:** Browse all items with search by product name and filtering by category or location. Accessible to both admins and staff.
- **Add Product Page (Admin Only):** Form to create new inventory items with fields for name, description, SKU, category, location, quantity, price, and reorder threshold.
- **User Management (Admin Only):** View all registered users and toggle roles between staff and admin.
- **Notification Badge:** Displays the count of low-stock items in the header, updated in real time via WebSockets.

### Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js (Express) |
| Database | PostgreSQL via Prisma |
| Auth | BetterAuth |
| Real-time | Socket.io |
| Containers | Docker + Docker Compose |
| Orchestration | Kubernetes (minikube → DOKS) |
| Deployment | DigitalOcean |
| Monitoring | DigitalOcean built-in metrics + alerts |

### Scope and Feasibility

This project is well-scoped for a team of 3 over the 5-week development window. The application has a focused domain in retail inventory and a straightforward data model of roughly 2 tables. The core backend covering auth, CRUD, and the dashboard is achievable in the first two weeks, leaving time for WebSocket integration, Kubernetes configuration, deployment, and documentation. Each team member can own distinct parts of the backend, frontend, and infrastructure while collaborating on integration points as laid out in the next section.

---

## 3. Tentative Plan

### Team Plan

Our team has three members, and we plan to split the work evenly across the main components while still collaborating as needed where tasks overlap. From the proposal deadline, we have about a month until the final project deliverable, and other additional intermediate deliverables like the project introduction, presentation slides, and the presentation. Since the timeline is short, we will ensure to make steady progress each week and be intentional with how we spend time, rather than leaving major work to the end.

### Team Responsibilities

*Subject to change*

**Abdul Mohammed — Backend (State Management) and Containerization**
- Containerize the Node.js (Express) backend and PostgreSQL database using Docker.
- Configure Docker Compose for multi-container setup (app + database).
- Design the database schema and implement persistence using PostgreSQL with Prisma ORM (migrations, CRUD workflows).
- Ensure database state persists through restarts/deployments (volume-backed storage).

**Esam Uddin — Deployment and Orchestration (Kubernetes + DigitalOcean)**
- Set up Kubernetes deployment locally using minikube for early testing.
- Deploy to DigitalOcean (IaaS focus) using DigitalOcean Kubernetes.
- Create Kubernetes manifests: Deployments, Services, and PersistentVolume configuration for PostgreSQL.

**Joeria Mahmood — Frontend (UI), Monitoring, and Observability**
- Build a simple React.js web UI to demonstrate key workflows (view inventory, update stock, basic admin actions).
- Integrate monitoring using DigitalOcean metrics/alerts for CPU, memory, disk.
- Set up basic alerts or dashboards for key metrics in the UI to make the demo clearer.

### Plan Outline

To stay on track, we will meet at least once every week, starting the week of Monday, March 2, to review progress, resolve blockers, and confirm what each member plans to complete by the end of the following week. Our goal is to have the core technical requirements completed by the end of Week 2, implement the advanced features during Week 3, and then shift our focus to polishing, testing, and preparing the remaining deliverables (Project Introduction, Presentation Slides, and the Presentation).

**Week 1 — Foundations and Local Development**
- Finalize scope, core workflows, and responsibilities.
- Set up GitHub repo structure and branching strategy.
- Prisma schema, migrations, and initial REST endpoints.
- Docker and Docker Compose working locally (backend + Postgres running).
- Frontend setup in React.js with initial pages and API integration.

**Week 2 — Core Technical Requirements**
- Implement Kubernetes manifests and validate on minikube.
- Deploy the system to DigitalOcean Kubernetes and verify persistence.
- Ensure key inventory workflows work in the deployed environment (create product, update stock, view inventory).
- Set up DigitalOcean monitoring dashboards and basic alerts.

**Week 3 — Advanced Features**
- Implement two advanced features:
  - Security Enhancements (Authentication and Authorization)
  - Real-Time Functionality (WebSockets)
- Integration testing of major workflows; fix deployment and performance issues discovered during testing.

**Week 4 — Documentation and Presentation Deliverables**
- Ensure demo scenarios are clear and repeatable.
- Prepare project introduction and final documentation.
- Create presentation slides and rehearse the demo.

---

## 4. Initial Independent Reasoning (Before Using AI)

### Architecture Choices

To start, we chose DigitalOcean as our deployment provider because we wanted a platform with IaaS focus so that we have more control over our infrastructure. We also had prior experience with DigitalOcean services like Droplets, Volumes, and the DigitalOcean API from earlier assignments which made it a practical choice for this project. We also planned to use DigitalOcean Volumes for persistent storage since we had implemented this before and it fit our use case well of block storage that preserves data across restarts and redeployments. For orchestration we decided to use Kubernetes instead of Docker Swarm. We were aware that Kubernetes would be slightly more complex to implement given our setup, but since it is the industry standard, we wanted to gain hands-on experience using this tool.

### Anticipated Challenges

We initially considered Python and FastAPI for the backend since handling WebSockets can be more straightforward there, but decided on Node.js to keep the entire stack in JavaScript and reduce context-switching across the team.

We expect Kubernetes to be one of the hardest parts of this project. None of us have used it before, and the setup and configuration involved is significantly more than Docker Swarm. Writing manifests, debugging pod networking, persistent volumes, and configuring auto-scaling if required based on load will all be new to us.

Authentication and role-based access control will also be a challenge. We're looking at Better Auth to simplify the auth flow, but integrating a third-party auth library is new for us. Enforcing the staff/admin role separation consistently across both protected API routes and frontend components will also take careful coordination.

### Early Development Approach

Our initial strategy was to prioritize and complete the core technical requirements first, since they were the foundation of the entire system. We split these core components across team members so work could happen in parallel and progress could be measured clearly, then moved on to implementing and integrating the advanced features as well. We also wanted to divide responsibilities evenly by area (backend/data, deployment/orchestration, frontend/observability), while staying flexible to collaborate on overlaps, integration, and debugging as needed.

---

## 5. AI Assistance Disclosure

AI tools were used primarily to evaluate tech stack trade-offs after we had already scoped the project and drafted the proposal. The core project decisions, motivation, and plan were developed independently by the team.

### Parts Developed Without AI Assistance

The project topic, motivation, weekly plan, and team responsibilities were developed entirely by our team. The core technical requirements (Docker, PostgreSQL, Kubernetes, DigitalOcean, monitoring) were already defined in the course guidelines, so those decisions were straightforward.

### AI-Assisted Parts

We used AI to help weigh the pros and cons of different tech stack options for the frontend and backend. Specifically, we wanted to understand which combinations would work best for WebSockets, Kubernetes deployment, and cloud-native development overall, such as Python (FastAPI) + Node.js for the backend, and React + Next.js for the frontend. We also used it to get feedback on our objective and key features section after we had already drafted it, primarily around our deployment provider and orchestration choices.

### AI Influence Example

We asked AI to compare tech stack options: full Next.js, Next.js + FastAPI, and React + Express. It recommended Next.js + FastAPI, arguing that separate frontend and backend services better demonstrate distributed systems knowledge for a cloud computing course.

We went with React.js + Express (Node.js) instead. FastAPI would have split our stack across Python and JavaScript, meaning two dependency ecosystems, two Docker base images, and more context-switching for a 3-person team over 4 weeks. We still get the two-service K8s architecture by keeping React.js and Express as separate containers, but with a single language across the whole stack.
