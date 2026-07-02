# System Design Experience

## REST API Design

Designed scalable REST APIs following layered architecture.

Used:

- Controllers
- Services
- Repository pattern
- Validation middleware
- Error handling
- Authentication middleware

Focused on

- Maintainability
- Reusability
- Scalability

---

## Authentication

Implemented

- JWT

- HttpOnly Cookies

- Refresh Token Flow

- Role Based Access Control

- Password Reset

- Magic Link Authentication

---

## Caching

Used Redis for

- Frequently accessed reports

- Authentication sessions

- Expensive database queries

- AI chatbot response caching

Implemented

- TTL

- Cache invalidation

- Cache versioning

---

## Queue Based Processing

Built asynchronous workflows for

- Report generation

- Email notifications

- WhatsApp notifications

- Long running background tasks

This reduced API response time significantly.

---

## Reporting Architecture

Migrated Power BI Embedded reports to Angular + Highcharts.

Designed

Operational Database

↓

Cron Jobs

↓

Analytics Database

↓

Aggregated APIs

↓

Dashboard

This improved

- Performance

- Maintainability

- Flexibility


# Analytics Platform Architecture

## Separate Analytics Database

To improve reporting performance and reduce load on the primary transactional database, the analytics platform was designed with a dedicated analytics database.

Architecture:

```
Application Database
        │
        │
Scheduled Sync / ETL
        │
        ▼
Analytics Database
        │
        ▼
Reporting APIs
        │
        ▼
Angular + Highcharts Dashboards
```

### Why this approach?

- Prevented heavy reporting queries from impacting transactional operations.
- Improved dashboard performance.
- Allowed analytical indexes without affecting OLTP workloads.
- Simplified report optimization and maintenance.
- Enabled independent scaling of reporting workloads.

## Read Replicas

Read replicas were used to offload read-heavy operations from the primary database.

Typical use cases included:

- Dashboard queries
- Analytics
- Report generation
- Read-intensive APIs

This helped improve application responsiveness while reducing pressure on the primary database.

## Environment Separation

Different environments were maintained throughout development and deployment, including:

- Development
- QA / Testing
- UAT
- Production

Each environment had its own:

- Database
- API configuration
- Azure resources
- Environment variables
- Deployment pipeline

This ensured safe testing and controlled releases before production deployments.