# Trackventory - Final Report

## Team Information

| Name | Student Number | Email Address |
|---|---|---|
| Esam Uddin | 1012865384 | esam.uddin@mail.utoronto.ca |
| Abdul Mohammed | 1012858481 | abdulrahmanzahid.mohammed@mail.utoronto.ca |
| Joeria Mahmood | 1011819034 | joeria.mahmood@mail.utoronto.ca |

## Motivation

Small retail stores like local electronics shops or a neighborhood grocery with a handful of employees still rely on spreadsheets or paper logs to track what's in stock. This works until it doesn't: someone forgets to update a count, a popular item runs out without warning, or a staff member does not get updated on an item's quantity being edited. The result is lost sales, wasted time, and no visibility into what's actually on the shelves.

Existing solutions like Shopify Inventory, Lightspeed, or Zoho Inventory are powerful but come with significant subscription costs, vendor lock-in, and complexity that exceeds the needs of smaller operations.

To address this gap, we built *Trackventory*, a cloud-native inventory management system that gives small retail teams a better way to stay on top of their stock. The app features a dashboard landing page with inventory metrics and stock summaries, an inventory page to view and manage products, and an admin-only user management page. It has real-time stock visibility, low-stock alerts, and role-based access for staff and administrators.

This project also doubles as a hands-on application of cloud computing concepts: containerization with Docker, persistent storage with PostgreSQL, Kubernetes orchestration, real-time updates with Server Sent Events, and secure authentication, all deployed to a production environment on DigitalOcean.

## Objectives

The objective of Trackventory was to build and deploy a stateful, containerized inventory management system for small retail teams while satisfying the technical requirements of the course project. Through the final implementation, our team aimed to create a practical platform that improves stock visibility, reduces manual tracking errors, and gives both regular users and administrators a shared, up-to-date view of inventory.

Specifically, we wanted the system to allow users to:

- securely register and sign in using email/password authentication, with support for Google and GitHub login
- view a dashboard that summarizes key inventory metrics such as total products, low-stock items, category count, and total inventory value
- browse inventory records with important product information, including SKU, category, location, quantity, price, and reorder threshold
- allow regular users to update product quantities as stock changes occur
- allow administrators to create, edit, and delete products, as well as manage user roles and accounts
- keep all connected clients synchronized through real-time inventory updates using Server-Sent Events (SSE), so changes are reflected without requiring a manual refresh

To achieve these goals, we focused on implementing the project as a full-stack Next.js application using React and TypeScript, rather than a separate frontend and backend architecture. We used PostgreSQL as the primary relational database and Prisma for schema management, migrations, and database access. The system was containerized with Docker, supported local development through Docker Compose, and was prepared for cloud deployment using Kubernetes manifests for the application, PostgreSQL database, services, persistent storage, secrets, and migration/seed jobs.

In addition to the core requirements, we aimed to implement advanced functionality in two main areas. First, we added secure authentication and role-based authorization using Better Auth, separating standard user and admin permissions. Second, we implemented real-time inventory synchronization through SSE so that stock updates and low-stock conditions are reflected across active sessions as soon as changes occur.

Overall, the objective of Trackventory was not only to deliver a useful inventory tool for small businesses, but also to demonstrate a complete cloud-native application that combines modern web development, persistent data management, authentication, containerization, and Kubernetes-based deployment.

## Technical Stack

### Approach: Next.js Full Stack

This application is built using a [Next.js](https://nextjs.org) full-stack approach, where the App Router is used to seamlessly integrate both the frontend and the backend logic into a single codebase. Server-rendered pages are used for core views such as the dashboard, inventory page, and admin settings, while server actions handle operations like product creation, editing, deletion, and quantity updates. Server actions are used for CRUD operations, while API routes manage authentication and the real-time event stream.

### Database: PostgreSQL with Prisma

This application uses PostgreSQL as the primary relational database. It can be accessed through Prisma to ensure type-safe queries, schema management, and seed support. The schema stores users, sessions, accounts, products, categories, and locations, allowing Trackventory to manage both authentication data and inventory records in a structured and persistent way.

### Real-Time Updates: Server-Sent Events (SSE)

For real-time functionality, the system uses Server-Sent Events. A Next.js API route exposes an event stream, and connected clients subscribe using EventSource. When inventory data changes, the server emits an update event so active clients automatically refresh their views and stay synchronized without requiring manual page reloads.

### Authentication and Authorization: Better Auth

Authentication is implemented with Better Auth using the Prisma adapter. The system supports traditional email/password login as well as Google and GitHub sign-in. Role-based access control is handled through Better Auth's admin plugin, which allows the application to tell between regular users and admins.

### Containers, Orchestration, and Deployment

The project is containerized with Docker using a multi-stage build, and Docker Compose is used for local development to run the application, PostgreSQL database, and Prisma migration workflow together. For orchestration, the project uses Kubernetes manifests for the application, database, services, persistent volume claim, and migration/seed jobs. This supports local Kubernetes testing and cloud deployment on DigitalOcean Kubernetes. For monitoring, the deployed environment relies on DigitalOcean's built-in metrics and alerting tools to track system health and resource usage.

## Features

- **Login / Sign-up Page:** Form to create an account using Google email, Github, or generic email, and an associated login page where users can access the application using their created accounts. Protected routing ensures only authenticated users can access the main application workspace. → **User Authentication and Authorization**
- **Dashboard Page:** Displays total products, low-stock items, total categories, total inventory value, and a low-stock table for products at or below their reorder threshold → **Data Storage Requirement: Reading from PostgreSQL table**
- **Inventory Page:** All signed-in users can browse the complete inventory table, including product name, SKU, category, location, quantity, price, and stock status. Standard users can update item quantities directly from this page. → **CRUD Operations: Read, Update**
- **Add Product Page (Admin Only):** Form to add new inventory items by entering product details such as name, description, SKU, category, location, quantity, price, and reorder threshold → **CRUD Operations: Create**
- **Edit / Delete Product Actions (Admin Only):** Admins can edit existing products or remove them entirely from the system through the inventory management interface → **CRUD Operations: Update, Delete**
- **User Management Page (Admin Only):** Admins can view registered users, change roles between regular staff user and admin, and delete accounts. → **Authorization and role-based access control**
- **Real-Time Inventory Synchronization:** The application uses Server-Sent Events (SSE) to notify connected clients when inventory data changes. When a product is updated, active sessions automatically refresh their inventory and dashboard pages so stock levels and low-stock alerts stay up to date → **Real-time functionality**

## User Guide

### 1. Landing Page

- **Access**: Navigate to the deployed app URL running on DigitalOcean.
- **Redirect**: If you are not logged in, you will be automatically redirected to the sign-up page.

![Landing Page](docs/image1.png)

### 2. Authentication

- **Sign Up**: Create an account using your name, email, and password. All new accounts are assigned the **Staff** role by default.
- **Sign In**: Log in with your registered email and password, or use **Google** or **GitHub** SSO options.

![Sign Up Page](docs/image2.png)

![Sign In Page](docs/image3.png)

### 3. Dashboard

The Dashboard serves as the landing page after signing in and displays key metrics:

- **Total Products**: The number of items currently tracked.
- **Low Stock Items**: Items at or below their reorder threshold.
- **Categories**: The number of distinct product categories.
- **Total Inventory Value**: The combined value of all stock.
- **Low Stock Alerts**: A table listing all items that need immediate attention.

![Dashboard](docs/image4.png)

### 4. Inventory Page

The Inventory page shows the full product table including name, SKU, category, location, quantity, price, and stock status.

- **Stock Status**: Items at or below threshold are marked **Low Stock** in red; others are marked **In Stock**.
- **Edit a Product (Admin only)**: Click the edit icon on any row to update product details.

![Inventory Page](docs/image5.png)

![Edit Product](docs/image6.png)

- **Delete a Product (Admin only)**: Click the delete icon to permanently remove a product.
- **Update Stock Quantity (Staff and Admin)**: Staff members can adjust quantities directly from the inventory table.

![Update Stock Quantity](docs/image7.png)

### 5. Add Product (Admin only)

Admins can add new items by navigating to **Add Product** in the sidebar and filling in:

- **Product Info**: Name, Description, and SKU.
- **Categorization**: Category and Location dropdowns.
- **Inventory Levels**: Quantity, Price, and Reorder Threshold.

![Add Product](docs/image8.png)

### 6. Real-Time Updates

When any user adds, edits, or deletes a product, all other logged-in users see the Inventory and Dashboard update automatically without a manual refresh. This is powered by Server-Sent Events with Redis pub/sub.

![Real-Time Updates](docs/image9.png)

### 7. User Management (Admin only)

Admins can view all registered users and promote or demote their roles between Staff and Admin from the Settings page.

![User Management](docs/image10.png)

## Development Guide

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- kubectl (for Kubernetes deployments)
- For Minikube: Minikube
- For DigitalOcean: doctl

Credentials have been sent to the TA as a zip file via email. The submitted zip file includes three configuration files for different environments: `.env` for Docker Compose, `secret_minikube.yaml` for Minikube, and `secret.yaml` for the cloud Kubernetes deployment. The two Kubernetes secret files use Base64-encoded values, which is the format expected by Kubernetes Secret resources.

A `secret_example.yaml` template is included in the repository showing the expected keys with empty values. Required environment variables:

- `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: PostgreSQL connection details
- `DATABASE_URL`: Full PostgreSQL connection string (e.g. `postgresql://user:pass@host:5432/dbname`)
- `BETTER_AUTH_SECRET`: Secret used for signing sessions
- `BETTER_AUTH_URL`: Base URL of the application (differs between environments)
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`: GitHub OAuth credentials
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth credentials

> **Note:** `BETTER_AUTH_URL` must match the actual URL the app is served from. It differs between Docker Compose (`http://localhost:3000`), Minikube (retrieved via `minikube service app-service --url`), and DigitalOcean (the external LoadBalancer IP).

### Local Development (Docker Compose)

Docker Compose is used to run the full stack locally — the Next.js application, PostgreSQL database, Redis, and a migration service — in an isolated, reproducible environment.

The application uses a multi-stage Dockerfile:
- **`deps`**: installs Node dependencies
- **`builder`**: generates the Prisma client and builds the Next.js app; also used as the migration/seed image
- **`runner`**: minimal production image running the standalone Next.js server as a non-root user

**Setup steps:**

1. Ensure Docker is running.
2. Place the provided `.env` file in the project root.
3. Build and start all services: `docker compose up --build -d`
4. The `migrate` service runs automatically on startup and applies all pending Prisma migrations before the app starts.

**Key commands:**

```bash
# Build and start all services
docker compose up --build -d

# Stop all services
docker compose down

# Run migrations manually
docker compose run --rm migrate npx prisma migrate deploy

# Seed the database
docker compose run --rm migrate npm run seed

# Check running containers
docker compose ps

# View logs
docker compose logs
```

The app will be available at `http://localhost:3000`.

### Kubernetes Manifest Files Overview

The system is deployed using Kubernetes YAML manifest files, each handling a specific part of the application.

- `secret_minikube.yaml` and `secret.yaml` store sensitive configuration values such as database credentials and authentication settings. Two versions are maintained because `BETTER_AUTH_URL` differs between Minikube and DigitalOcean Kubernetes.
- `postgres-pvc.yaml` provisions persistent storage for PostgreSQL.
- `postgres-deployment.yaml` and `postgres-service.yaml` deploy PostgreSQL and make it accessible within the cluster.
- `redis-deployment.yaml` and `redis-service.yaml` deploy Redis and make it accessible within the cluster.
- `migration-job.yaml` and `seed-job.yaml` handle database schema migration and initial data seeding.
- `app-deployment.yaml` and `app-service.yaml` deploy the main application and expose it to users.

Minikube and DigitalOcean Kubernetes use separate clusters and separate persistent volumes, so their data is not shared.

### Kubernetes (Minikube)

Minikube was used to simulate a local Kubernetes environment for testing deployments, services, and persistent storage before cloud deployment. This helped verify that the application behaved correctly in a containerized and orchestrated environment.

**Setup steps:**

1. Start Minikube:
   ```bash
   minikube start
   minikube status
   kubectl get nodes
   ```

2. Build and push multi-platform images:
   ```bash
   # Application image
   docker buildx build --platform linux/amd64,linux/arm64 --target runner \
     -t joeria/trackventory-app:v2 --push .

   # Migration/seed image
   docker buildx build --platform linux/amd64,linux/arm64 --target builder \
     -t joeria/trackventory-migrate:v2 --push .
   ```
   > If `docker buildx build` returns *"Multi-platform build is not supported for the docker driver"*, switch builders first:
   > ```bash
   > docker buildx use trackventory-builder
   > docker buildx inspect --bootstrap
   > ```

3. Deploy all resources:
   ```bash
   kubectl apply -f secret_minikube.yaml
   kubectl apply -f postgres-pvc.yaml
   kubectl apply -f postgres-service.yaml
   kubectl apply -f postgres-deployment.yaml
   kubectl apply -f redis-service.yaml
   kubectl apply -f redis-deployment.yaml
   kubectl delete job prisma-migrate --ignore-not-found
   kubectl apply -f migration-job.yaml
   kubectl delete job prisma-seed --ignore-not-found
   kubectl apply -f seed-job.yaml
   kubectl apply -f app-deployment.yaml
   kubectl apply -f app-service.yaml
   ```

4. Retrieve the service URL:
   ```bash
   minikube service app-service --url
   ```

   > **Important:** The Minikube service URL may change between runs or across machines. After retrieving the URL, update `BETTER_AUTH_URL` in `secret_minikube.yaml` to match it, then reapply and restart:
   > ```bash
   > kubectl apply -f secret_minikube.yaml
   > kubectl rollout restart deployment app
   > kubectl rollout status deployment/app
   > ```

**Status commands:**
```bash
kubectl get pods
kubectl get jobs
kubectl get svc
```

### Kubernetes (DigitalOcean)

After validating the system locally using Minikube, the application was deployed to a managed Kubernetes cluster on DigitalOcean. This involved configuring access, connecting via kubectl, and applying the Kubernetes manifests to deploy the application, PostgreSQL, and Redis.

**Setup steps:**

1. Authenticate and connect to the cluster:
   ```bash
   doctl auth init --context default --access-token <your-access-token>
   doctl auth switch --context default
   doctl kubernetes cluster kubeconfig save <cluster-id>
   kubectl config get-contexts
   kubectl config use-context <your-cluster-context>
   kubectl get nodes
   ```

2. Build and push images (skip if already built for Minikube — same images are used).

3. Deploy resources in the same order as Minikube, using `secret.yaml` instead of `secret_minikube.yaml`:
   ```bash
   kubectl apply -f secret.yaml
   kubectl apply -f postgres-pvc.yaml
   kubectl apply -f postgres-service.yaml
   kubectl apply -f postgres-deployment.yaml
   kubectl apply -f redis-service.yaml
   kubectl apply -f redis-deployment.yaml
   kubectl delete job prisma-migrate --ignore-not-found
   kubectl apply -f migration-job.yaml
   kubectl delete job prisma-seed --ignore-not-found
   kubectl apply -f seed-job.yaml
   kubectl apply -f app-deployment.yaml
   kubectl apply -f app-service.yaml
   ```

4. Get the external IP once deployed:
   ```bash
   kubectl get svc app-service
   ```

**Updating after code changes:**
```bash
# Rebuild and push images (same buildx commands as above)
# Reapply changed manifests, then restart:
kubectl rollout restart deployment app
kubectl rollout status deployment/app
```

**Status and diagnostics:**
```bash
kubectl get pods
kubectl get jobs
kubectl get svc

# Demonstrate self-healing
kubectl delete pod -l app=app
kubectl get pods -w
```

### Local Testing (without Docker)

To run the application directly without containers:

1. Install dependencies: `npm install`
   - This also generates the Prisma client automatically via the postinstall hook.
2. Set `DATABASE_URL` in `.env` to a locally accessible PostgreSQL instance.
3. Run migrations: `npx prisma migrate deploy`
   - (Optional) Seed the database: `npm run seed`
4. Start the development server: `npm run dev`
5. Visit `http://localhost:3000`.

**Validation steps:**
- Sign up or log in via email, GitHub, or Google
- Verify the dashboard loads and displays inventory data
- As an admin, add and edit products
- As a regular user, verify read-only access is enforced
- Test low-stock alerts and quantity updates
- Run a static build check: `npm run build`

## Deployment Information

**Live URL:** http://209.38.1.131/  
**Deployment platform:** DigitalOcean Kubernetes (DOKS)

The application is deployed on a DigitalOcean Kubernetes cluster and exposed publicly through a Kubernetes LoadBalancer service. It is deployed with two app replicas for improved availability.

PostgreSQL is deployed as a separate Kubernetes deployment and exposed internally using a ClusterIP service, so the database is not publicly accessible. Persistent storage is provided through a Kubernetes PersistentVolumeClaim to ensure database data survives restarts and redeployments.

## Video Demo

The demo video showcases key features, user flow through the application, technical highlights, and deployment.

Video URL (Google Drive): [Demo Video](https://drive.google.com/file/d/1m7cYvU-QVrZc4OKpuzGG2vSQsIoC0HW6/view?usp=sharing)

## AI Assistance & Verification (Summary)

AI was used selectively across three areas, after our team had already established the core architecture and design direction.

The primary use was debugging. When features broke in ways that were difficult to trace, we used AI to help reason through root causes. This included diagnosing why SSE real-time updates were failing intermittently after deploying to Kubernetes — which led us to identify that our in-memory EventEmitter singleton could not broadcast across multiple pods, and to adopt a Redis pub/sub solution using ioredis. We also used AI to work through Minikube image pull failures and authentication configuration mismatches, and to think through how to structure RBAC using Better Auth's admin plugin.

The second use was code generation. We used AI to generate and iterate on ShadCN UI components, and to help scaffold parts of the SSE and Redis integration after we had decided on the approach. The third use was architecture exploration early in the project. We initially considered a separate React frontend with an Express backend, but used AI to think through the tradeoffs and concluded that a full-stack Next.js approach using the App Router would eliminate unnecessary WebSocket and CORS configuration overhead while keeping the codebase unified.

AI output was not always directly applicable. For RBAC, the AI suggested using Next.js middleware for authorization, which did not fit our App Router structure where we enforced access through server-side session checks in pages and server actions. It also suggested flattening all non-admin users to identical permissions, which conflicted with our requirement that regular users can still update product quantities. For the Minikube issue, it recommended creating a separate Dockerfile for migration images, which was unnecessary since our existing multi-stage Dockerfile's `builder` target already served that purpose. In both cases, we identified the mismatch by comparing the suggestions against our actual codebase and requirements. Concrete examples are in `ai-session.md`.

Correctness was verified through direct testing: we confirmed the Redis fix using `redis-cli monitor` to observe publish events firing across pods, validated RBAC behavior by testing admin-only pages and unauthorized action attempts in the browser, and confirmed the Minikube fix by inspecting pod logs with `kubectl describe pod` after rebuilding as multi-architecture images.

## Individual Contributions

### Esam Uddin (@esam191)

Esam's work was mainly around authentication, the core app structure, role-based access control, and the main inventory management flows.

- **Authentication and app structure:** set up the initial app foundation, built the public landing page, created the sign-in and sign-up flows using better-auth, and organized the authenticated app shell with sidebar navigation and logout support.
- **Routing and shared layout:** added the main route structure for the dashboard, inventory, add product, and settings pages, and set up the shared layout used across authenticated pages.
- **Auth flow improvements:** refined redirect behavior for signed-in and signed-out users and improved sign-out state synchronization across pages so session changes were reflected more reliably throughout the app.
- **Role-based access control and admin features:** implemented admin/user RBAC, added the settings page for user and role management, and connected inventory actions that support the different workflows available to staff users and admins.

### Abdul Mohammed (@abdueee)

Abdul's work focused on real-time data features, frontend data integration, and inventory management workflows.

- **Inventory and dashboard pages:** Built the inventory and dashboard pages connected directly to the database via Prisma, displaying live data, stock levels, category breakdowns, and key metrics like total inventory value and low-stock alerts.
- **Product management UI:** Implemented the add-product page and form using shadcn/ui components, wired to server actions for creating, editing, deleting, and adjusting product stock quantities.
- **Real-time updates via SSE:** Designed and implemented a Server-Sent Events system so that changes made by one user (adding a product, editing stock) are reflected on all other connected users' screens automatically without a manual refresh.
- **Redis pub/sub for multi-pod reliability:** Diagnosed a production bug where real-time updates were failing approximately 50% of the time on the Kubernetes cluster due to the in-memory event emitter not being shared across pods. Replaced it with a Redis pub/sub architecture using ioredis, where each SSE connection subscribes to a shared Redis channel, ensuring events reach all clients regardless of which pod handles the request.

### Joeria Mahmood (@JoeHabibullah)

Joeria's work was mainly focused on the core technical requirements, including containerization, database setup, deployment, and infrastructure.

- **Containerization and local development:** set up Docker for the application using a multi-stage Dockerfile to ensure efficient and lightweight images, and configured Docker Compose to run the app, database, and migrations together in a consistent local environment.
- **Database and state management:** configured PostgreSQL for relational data storage and implemented persistent storage both locally using Docker volumes and in production using Kubernetes PersistentVolumes to ensure data is retained across restarts.
- **Deployment and orchestration:** deployed the application on DigitalOcean Kubernetes, set up Kubernetes manifests for deployments and services, and ensured smooth transition from local development with Minikube to a cloud-managed environment.
- **Monitoring and reliability:** integrated DigitalOcean monitoring and alerts for CPU, memory, and disk usage to track system health and ensure stability in production.

## Lessons Learned and Concluding Remarks

One of the biggest things we took away from this project is that what works locally does not always work in production. The clearest example was the real-time update feature, which worked fine in development but broke intermittently once the app was running across two Kubernetes pods. It took some digging to find the root cause and replace the in-memory emitter with a Redis pub/sub solution, but we would not have thought about that problem upfront if we had not seen it fail in a real deployment.

Working as a team also taught us a lot about coordination we did not expect going in. When different people are working on different parts of the stack, small assumptions about how sessions are passed around or how the schema is structured can quietly break each other's work. We got better at communicating changes before making them rather than after.

A lot of the tools we used were also new to us. Prisma, BetterAuth, and Next.js all had their own learning curves, but picking them up in the context of a real project made the learning stick in a way that following a tutorial probably would not have.

Overall this project gave us a much more realistic picture of what building and shipping a web application actually involves, and that is probably what we will take away from it most.
