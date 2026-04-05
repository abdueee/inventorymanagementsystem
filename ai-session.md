## Planning Role-Based Access Control Workflows

### Prompt

What is a clean way to implement role-based access control in a Next.js app using Better Auth, if we have `admin` and `user` roles?

### AI Response (summary)

The AI suggested a layered RBAC approach:

1. Store a `role` value for each user and assign a default non-admin role.
2. Protect restricted pages with server-side session and role checks.
3. Hide admin-only UI elements, but also enforce permissions again in backend actions.

It also suggested using middleware for authorization and applying the same restrictions to all non-admin users.

### What Our Team Did With It

- The AI helped us outline a RBAC structure with checks at the route, UI, and server-action levels, which gave us a starting point for implementation.
- The middleware approach did not match how we organized authorization in our App Router, and the suggestion to make all non-admin users the same did not fit our requirement that regular users could still update product quantities.
- We used the AI output as guidance and compared it against our Better Auth setup and project requirements, and implemented RBAC using Better Auth's admin plugin together with server-side session checks in protected pages and actions. We validated the final behavior by testing admin-only pages, sidebar visibility, role updates, and unauthorized action attempts on the browser.

---

## Debugging Minikube Image Pull and Auth Configuration

### Prompt

"In this project, Docker Compose works, but Minikube is failing and the app is not accessible in the browser. Can you help me check whether the database hostnames are correct, why the app pods are failing in Minikube, and what steps I should use to make the same Kubernetes manifests work for both Minikube and DigitalOcean Kubernetes?"

### AI Response (trimmed)

Your Docker Compose database hostname is correct as `db` because the Compose Postgres service is named `db`, while in Kubernetes the hostname should be `postgres` because the Kubernetes Service is named `postgres`. The Minikube issue is not caused by the service configuration, but by an image architecture mismatch. The pod error `no matching manifest for linux/arm64/v8` means your published image only supports amd64, while Minikube on your machine is running arm64.

To keep the same Kubernetes manifests working for both Minikube and DigitalOcean Kubernetes, rebuild and push both the app image and migration image as multi-architecture images. For authentication, `BETTER_AUTH_URL` should be environment-specific: localhost for Docker Compose, the Minikube-accessible URL for Minikube, and the public IP or domain for DigitalOcean Kubernetes.

### What Our Team Did With It

- It correctly identified that the Minikube failure was caused by an image architecture mismatch (amd64 image on an arm64 Minikube environment), clarified the difference between Docker Compose service naming and Kubernetes service naming, and suggested multi-architecture images as the cleanest way to keep the same Kubernetes manifests working in both Minikube and DigitalOcean Kubernetes.
- It suggested creating a separate Dockerfile for the migration image, which was unnecessary because the migration image was already being built correctly from the existing Dockerfile's `builder` target. It also suggested creating Minikube-specific deployment manifests, which we ultimately did not need.
- We verified the root cause using `kubectl describe pod`, which showed the `no matching manifest for linux/arm64/v8` error. We reviewed our image build process and confirmed that the migration image was already produced from the builder stage and used by the Kubernetes Job with `npx prisma migrate deploy`. Based on that, we kept the existing manifest structure and resolved the issue by rebuilding and publishing both images as multi-architecture images.

---

## Debugging SSE Real-Time Updates Failing on Multi-Pod Kubernetes Deployment

### Prompt

"going back to the realtime updates feature, going ahead with the SSE implementation was not the best idea since after the app was deployed on kubernetes it had two pods/instances up for high availability and the SSE realtime update was not working half the time, but on local dockerized container it was working properly (since I'm assuming there's only one server instance)"

### AI Response (summary)

The AI correctly identified the root cause: the in-memory SSE emitter used a Node.js EventEmitter singleton, which only exists within a single process. With two pods running in Kubernetes, a user connected to Pod A would not receive events published by Pod B since each pod maintained its own isolated in-memory state.

The AI proposed replacing the in-memory emitter with Redis pub/sub using ioredis. The fix involved:

- A shared Redis channel (`inventory-updated`) that all pods publish to and subscribe from
- A singleton Redis publisher used by server actions
- A per-connection Redis subscriber created for each SSE client connection
- Adding a Redis deployment and service to Kubernetes manifests
- Adding a Redis service to Docker Compose for local development

### What Our Team Did With It

- Implemented the Redis pub/sub solution as described.
- Added the ioredis package, rewrote `lib/sse/emitter.ts` and `app/api/events/route.ts`, updated `lib/actions/product-actions.ts` to publish to Redis after each mutation, and added `redis-deployment.yaml` and `redis-service.yaml` to the Kubernetes manifests.
- Deployed to the DigitalOcean cluster and verified the fix using `redis-cli monitor` to confirm publish events were firing.
