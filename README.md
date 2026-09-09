# SSO Admin

An admin portal for managing Single Sign-On (SSO), users, roles, permissions, authentication, and access across multiple applications.

## Features

- **Single Sign-On Management** — Centralized SSO configuration across apps
- **User Management** — Create, update, and manage user accounts
- **Role & Permission Control** — Define roles and fine-grained access permissions
- **Authentication** — Secure login flows across connected applications
- **Multi-App Access Control** — Manage access for multiple applications from one portal

## Tech Stack

- Backend: Node.js /NestJS
- Auth: SSO protocol integration (OAuth2 / SAML / OIDC as configured)
- Database: PostgreSQL or similar (as configured)

## Getting Started

```bash
# Clone the repo
git clone https://github.com/tariqsherazi/sso-admin.git

# Install dependencies
npm install

# Set up environment variables (SSO provider credentials, etc.)
cp .env.example .env

# Run the app
npm run start:dev
```

## Project Goal

Built to centralize identity and access management — giving admins a single portal to control who has access to what, across every connected application.

---
*Contributions and feedback welcome.*
