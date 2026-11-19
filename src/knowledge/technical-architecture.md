# Technical Architecture and System Design Knowledge

This document helps Ask Ravi answer detailed engineering, architecture, cloud, DevOps, and system-design questions. It separates documented project experience from general engineering principles. Do not present a reference architecture or recommendation as something Ravi has already implemented unless the portfolio explicitly says so.

## 1. Architecture domains represented in Ravi's experience

Ravi's professional work spans enterprise web applications, REST APIs, modular frontend applications, service-oriented backend components, relational data, caching, asynchronous workflows, analytics/reporting, cloud storage, and cloud migration.

Documented technologies include Angular, React, TypeScript, JavaScript, Node.js, Express.js, MySQL, Redis, Azure Blob Storage, Azure Redis Cache, Azure Service Bus, Azure API Management, Azure Front Door, Amazon S3, ECS, ECR, RDS for MySQL, IAM, Secrets Manager, Systems Manager Session Manager, CloudWatch, Docker, GitHub Actions, and Terraform.

When asked about depth, distinguish:
- Professional application development and production support.
- Hands-on cloud migration and infrastructure contributions.
- Personal DevOps learning projects.
- Technologies being studied or having basic familiarity.

Do not imply that every service listed was designed end-to-end by Ravi.

## 2. Enterprise application: logical architecture

A useful high-level view of the enterprise platform work is:

```text
Web Client (Angular / React)
        |
        v
Frontend routes, components and state
        |
        v
API edge / gateway (where configured)
        |
        v
Node.js / Express API
        |
        +---- Authentication and authorization
        |
        +---- Domain services
        |       +---- Collections / recovery
        |       +---- Credit-risk / MFI workflows
        |       +---- Buyer and member workflows
        |       +---- Reporting / analytics
        |       +---- Notifications / integrations
        |
        +---- Data access
        |       +---- MySQL
        |       +---- Redis cache
        |
        +---- Asynchronous work
        |       +---- Queues / scheduled jobs
        |       +---- Document and report processing
        |
        +---- File storage abstraction
                +---- Azure Blob Storage (existing provider)
                +---- Amazon S3 (migration target)
```

This is a logical synthesis of the areas Ravi has worked on, not a claim that every module is deployed as a separate microservice or that every environment has exactly this topology.

### Layer responsibilities
- Presentation: renders screens, validates user input, manages client-side navigation and interaction.
- API/controller: validates the request boundary, maps HTTP input to application operations, and shapes responses.
- Domain/service: owns business rules and coordinates workflows.
- Repository/data-access: isolates persistence operations from business logic.
- Integration adapters: encapsulate external systems such as storage, messaging, communication providers, and CRM APIs.
- Infrastructure: provides compute, networking, secrets, databases, queues, storage, deployment, and observability.

### Architecture trade-offs
- A modular monolith can be simpler to deploy and operate than many microservices when domain boundaries or team ownership are still evolving.
- Separate services are useful when independent scaling, deployment, fault isolation, or ownership justifies the operational cost.
- Keep business rules independent of infrastructure providers through interfaces/adapters.
- Avoid distributed transactions where possible; use idempotent operations, retries, and compensating actions for multi-service workflows.

## 3. API and backend design

Ravi has worked with Node.js and Express.js APIs, controller/service separation, validation, authentication, error handling, and integrations.

A typical request lifecycle:

1. Client sends an HTTP request with a route, payload, and authentication context.
2. Middleware handles cross-cutting concerns such as CORS, parsing, authentication, rate limiting, and validation as configured.
3. Controller validates/normalizes request data and calls a service.
4. Service applies business rules and coordinates repositories or integration adapters.
5. Data access reads/writes the database or cache.
6. The controller returns a consistent HTTP response.
7. Errors are mapped to suitable status codes and logged without exposing secrets or internal stack traces to clients.

Design guidance:
- Use nouns for resource-oriented REST paths and HTTP methods according to operation semantics.
- Validate at the API boundary; do not rely only on frontend validation.
- Use pagination, filtering, sorting, and bounded payload sizes for collection endpoints.
- Make retryable write operations idempotent where practical.
- Use explicit timeouts for external calls and bounded retries with exponential backoff and jitter.
- Do not retry non-idempotent operations blindly.
- Version APIs when a breaking contract change is unavoidable.
- Return stable error shapes with a correlation/request ID where available.
- Keep secrets, tokens, personal data, and full sensitive payloads out of logs.

## 4. Identity and application security

Documented experience includes JWT, HttpOnly cookies, refresh-token flows, password reset/magic-link flows, and role-based access control.

Explain the security concepts accurately:
- Authentication establishes who the caller is; authorization determines what that identity may do.
- HttpOnly prevents browser JavaScript from reading a cookie, but does not by itself prevent CSRF.
- Secure cookies should be sent over HTTPS. SameSite and CSRF protections must match the application's cross-site requirements.
- Access tokens should be short-lived; refresh tokens need rotation, revocation strategy, and secure storage.
- RBAC maps permissions to roles and roles to users; enforce authorization on the server for every protected operation.
- Apply least privilege to application identities and infrastructure roles.
- Validate and sanitize untrusted input; use parameterized SQL queries.
- Encrypt traffic in transit and sensitive data at rest using managed key controls where appropriate.
- Never expose API keys, credentials, session tokens, or production configuration in a response.

Do not claim a specific encryption algorithm, compliance certification, penetration-test result, or security audit unless a source explicitly documents it.

## 5. Data architecture: MySQL and Redis

MySQL is used for relational application data. Redis is used in the portfolio context for caching and other low-latency data needs.

Key concepts to explain:
- OLTP workloads optimize reliable transactional reads/writes; analytical workloads often scan and aggregate much larger data sets.
- Indexes accelerate suitable lookups but add storage and write-maintenance cost. Use query plans and workload evidence before adding indexes.
- Normalize transactional data to reduce update anomalies; selectively denormalize read models when measured access patterns justify it.
- Use transactions for operations that must be atomic within one database.
- Connection pools protect the database from uncontrolled connection creation.
- Read replicas can offload read-heavy traffic, but replication lag means they may not provide immediate read-after-write consistency.
- Redis is a cache, not automatically the source of truth. Define TTLs, invalidation, key naming, memory limits, and behavior during cache outages.
- Cache-aside is a common pattern: read cache, load from database on miss, then populate cache. Prevent stampedes with request coalescing/locks or jittered TTLs when needed.
- Do not cache sensitive user-specific data without correct authorization scoping and expiry.

## 6. Analytics and reporting architecture

Ravi has worked on Angular + Highcharts dashboards and reporting workflows, including work to replace Power BI Embedded reporting experiences with application-native dashboards. The portfolio also describes a separate analytics data path to reduce pressure on transactional workloads.

Logical flow:

```text
Transactional application database
          |
          v
Scheduled synchronization / ETL
          |
          v
Analytics data store
          |
          v
Aggregated reporting APIs
          |
          v
Angular dashboard + Highcharts
```

Why separate analytics workloads:
- Heavy aggregation queries can compete with transactional requests for CPU, memory, locks, and I/O.
- A separate analytical store or read-optimized model can isolate reporting workload.
- Pre-aggregation and suitable indexes can reduce dashboard response time.
- Data freshness, reconciliation, and late-arriving updates must be designed explicitly.

Trade-offs:
- Scheduled ETL is simpler but data may be stale between runs.
- Event-driven updates can reduce latency but add operational complexity and delivery/replay concerns.
- Read replicas reduce primary read load but are not a full substitute for a purpose-built analytics store at every scale.
- Define freshness SLAs and monitor pipeline lag.

Ravi is contributing to an initiative to separate Risk Management reporting into a Reporting-as-a-Service capability. Describe it as an ongoing architectural initiative, not a completed platform migration.

## 7. Asynchronous processing and integrations

The portfolio documents queue-based and background workflows for report generation, notifications, file processing, and other long-running tasks, including Azure Service Bus experience.

Use asynchronous processing when:
- Work takes longer than a synchronous API request should wait.
- A workflow needs buffering during traffic spikes.
- The caller can receive an acknowledgement and check status later.
- Work should be retried independently of the original request.

Production design considerations:
- Assume at-least-once delivery unless the broker guarantees otherwise; make consumers idempotent.
- Use bounded retries and dead-letter queues for poison messages.
- Track message age, queue depth, retry counts, and processing failures.
- Use correlation IDs across API, queue, worker, and downstream calls.
- Define ordering requirements and partitioning keys where order matters.
- Set visibility/lock duration and heartbeat/renewal behavior according to processing time.
- Avoid putting large files in messages; store the file and send a durable reference.

Do not claim exactly-once business processing merely because a queue is used.

## 8. File storage abstraction and Azure-to-AWS migration

The migration goal is to keep application business logic independent from the underlying object-storage provider.

Conceptual design:

```text
Business service
      |
      v
Storage interface / adapter contract
      |
      +---- Azure Blob adapter
      |
      +---- Amazon S3 adapter
```

The interface should centralize operations such as upload, download/read, delete, metadata lookup, and URL generation where required. Provider-specific SDK calls should remain inside adapters.

Migration concerns:
- Preserve object keys, metadata, content types, access rules, and file ownership semantics.
- Compare source and destination files using size and checksums where available; test representative PDFs, reports, and images.
- Use multipart upload for large objects and clean up incomplete uploads.
- Use presigned URLs for time-limited client access when appropriate; keep expiry short and scope access to a specific object and operation.
- Make retries idempotent and avoid duplicate logical records.
- Plan cutover, rollback, reconciliation, and observability.
- Do not assume a successful copy means the application is serving files from the new provider.
- Local container storage is ephemeral in common container deployments. It is not a durable fallback unless a persistent volume and recovery/replication process are explicitly designed.

Ravi has contributed to the S3 adapter using AWS SDK for JavaScript v3 while preserving a storage abstraction. Do not claim the entire migration or production cutover is complete unless updated knowledge confirms it.

## 9. AWS application deployment context

The documented AWS migration environment includes:
- Amazon ECS for running containerized application services.
- Amazon ECR for container image storage.
- Amazon RDS for MySQL for relational persistence.
- AWS Secrets Manager for application configuration/secrets.
- IAM for service and operator permissions.
- Systems Manager Session Manager for secure administrative access and database port forwarding.
- CloudWatch for application/runtime logs.
- Terraform for infrastructure provisioning and reusable modules.
- GitHub Actions for CI/CD workflows.

Typical deployment flow:

```text
Code change
   |
   v
GitHub Actions: test / build
   |
   v
Build container image
   |
   v
Push image to Amazon ECR
   |
   v
Update ECS task definition revision
   |
   v
Deploy / roll service
   |
   v
Health checks + CloudWatch monitoring
```

This is a reference flow based on the tools in use; exact pipeline stages, approval gates, networking, load balancers, autoscaling, and deployment strategy must be confirmed from the actual infrastructure repository.

### ECS concepts
- Cluster: logical grouping of ECS capacity and services/tasks.
- Task definition: versioned runtime specification including container image, CPU/memory, ports, environment, secrets, logging, and IAM roles.
- Task: running instantiation of a task definition.
- Service: maintains a desired number of tasks and manages replacement/deployment behavior.
- Execution role: permissions used by ECS agent/platform for actions such as pulling images and retrieving secrets.
- Task role: permissions granted to application code running in the container.
- Do not put credentials in plain environment variables or image layers; use secret references and least-privilege roles.

### RDS connectivity
A private RDS database should not be exposed publicly just for developer convenience. Use controlled network paths such as VPN, bastion/SSM port forwarding, or approved private connectivity. A local database client can connect through a local forwarded port while the database remains private. Confirm security-group rules, routing, IAM/database authentication configuration, and TLS requirements.

### Terraform principles
- Keep reusable infrastructure definitions modular without over-fragmenting.
- Separate environments and state safely; use remote state with locking where supported.
- Treat state as sensitive because it may contain infrastructure metadata or secret values.
- Pin provider/module versions and review plans before applying.
- Prefer immutable/reviewable changes and avoid manual drift in the console.
- Use least-privilege deployment identities and separate plan/apply permissions where appropriate.
- Do not assume a resource exists in a region merely because a workflow completed; verify actual regional resources and outputs.

## 10. CI/CD and containerization

Docker packages an application and its runtime dependencies into an image. Docker Compose is useful for local multi-container development. ECR stores container images; ECS runs task definitions using those images.

CI and CD are related but different:
- CI validates changes through linting, tests, and build checks.
- CD automates or controls release of validated artifacts to an environment.
- Build once and promote the same immutable image between environments where possible.
- Tag images with immutable identifiers such as commit SHA; avoid relying only on mutable tags like latest.
- Scan dependencies and images, keep base images updated, and avoid embedding secrets.
- Use health checks, graceful shutdown, resource limits, and structured logs.
- Deployment rollback should restore a known-good task definition/image and compatible configuration.

Ravi's personal Node.js DevOps lab includes a health endpoint, Docker/Compose with Nginx, GitHub Actions CI, ECR image publishing, and S3/CloudFront static-site deployment practice. Keep this separate from Recordent production experience.

## 11. Disaster recovery, high availability, and resilience

Ravi has participated in AWS disaster-recovery failover exercises and target-region resource validation. A workflow completing successfully does not prove that the application is recovered.

Explain these terms:
- High availability: service remains usable despite expected component failures.
- Fault tolerance: system continues operating through specified failures, potentially without interruption.
- Disaster recovery: restore service after a major outage or regional failure.
- RTO: maximum targeted time to restore service.
- RPO: maximum targeted data-loss window measured in time.

A regional DR runbook should validate:
1. Trigger/approval and incident ownership.
2. Source-region health and failure scope.
3. Target-region network, IAM, secrets, compute, database, storage, and dependencies.
4. Data replication status and recovery point.
5. Infrastructure deployment and configuration parity.
6. DNS/routing or traffic cutover.
7. Application health checks and critical business transactions.
8. Background workers, schedules, integrations, and outbound notifications.
9. Monitoring, logs, alarms, and operational access.
10. Evidence capture, stakeholder communication, and failback plan.

Common failure causes:
- Resources were deployed only in the source region.
- Terraform provider aliases or region variables point to the wrong region.
- Secrets, KMS keys, IAM policies, images, or networking were not replicated.
- Database replication/restore is incomplete or points to the wrong endpoint.
- Container images or task definitions are unavailable in the target region.
- DNS or traffic routing still targets the source.
- Dependencies, webhooks, allowlists, certificates, or scheduled jobs were missed.
- Workflow success only means the automation steps exited successfully, not that the service is operational.

Do not invent Recordent's actual RTO/RPO, replication topology, database recovery mechanism, DNS setup, or a successful Hyderabad-region recovery. State that these must be confirmed from the DR plan and test evidence.

## 12. Observability and production troubleshooting

A reliable service needs logs, metrics, traces, and actionable alerts:
- Logs explain individual events and failures.
- Metrics show trends such as latency, throughput, error rate, saturation, queue depth, and resource use.
- Distributed traces connect one request across services and asynchronous boundaries.
- Correlation IDs connect logs and traces.
- Alerts should be based on user impact and actionable thresholds, not noise.

Troubleshooting method:
1. Define impact, start time, affected users, and affected operations.
2. Check recent deployments/configuration changes.
3. Check service health, task count, restarts, CPU/memory, and health-check failures.
4. Inspect application logs around the failure using timestamps and correlation IDs.
5. Check database connectivity, connection saturation, slow queries, locks, and replication lag.
6. Check cache, queues, storage, and third-party dependency health.
7. Compare source and target region configuration during DR tests.
8. Mitigate safely, verify business transactions, document root cause, and add prevention.

Do not expose raw secrets, customer data, access tokens, or internal endpoint details to public visitors.

## 13. Architecture interview and decision framework

For a system-design question, structure the answer:
1. Clarify functional requirements and non-functional requirements.
2. Estimate scale: users, requests/second, data volume, growth, and geographic distribution.
3. Identify APIs, entities, data ownership, and consistency requirements.
4. Draw the high-level components and request/data flows.
5. Explain storage, caching, queues, and external integrations.
6. Address security, privacy, availability, observability, and deployment.
7. Identify bottlenecks and failure modes.
8. Compare alternatives and explain trade-offs.
9. Propose an incremental implementation and migration plan.
10. State assumptions and what needs validation.

For architecture choices, compare at least two viable options when useful. Explain cost, complexity, latency, consistency, operational burden, scalability, and failure isolation. Avoid saying a design is universally best.

## 14. Accuracy boundaries

- Separate "Ravi has implemented/worked on" from "a recommended design would be".
- Label ongoing initiatives as ongoing.
- Label personal labs as personal projects.
- Do not invent scale metrics, uptime, cost savings, latency improvements, user counts, database schemas, or cloud topology.
- If a visitor asks for details not in the knowledge base, give a useful general engineering explanation where appropriate, then explicitly say the exact project-specific implementation is not documented.
- If asked to explain code in this repository, answer from the actual code behavior, not from aspirational README wording.
