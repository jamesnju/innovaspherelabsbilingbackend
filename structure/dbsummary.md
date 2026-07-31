Multi-SaaS Platform Database Summary
Core Concept: Multi-Tenant Architecture
This database is designed as a centralized, multi-tenant system where multiple businesses (clients) use the same database but their data is completely isolated from each other. Every table has a clientId field that links back to the Client table, ensuring data separation.

Key Tables & Their Purpose
🏢 Core Tenancy Tables
Table	Purpose
Client	The "tenant" or business account. Stores company details, status, and subscription reference. This is the root of all data isolation.
User	Employees/owners of a client. Each user belongs to one client and has a role (SUPER_ADMIN, BUSINESS_OWNER, MANAGER, EMPLOYEE).
Session	User session management for authentication (tokens, expiry, device info).
💳 Subscription & Billing
Table	Purpose
Subscription	The client's active plan (FREE, BASIC, PREMIUM, ENTERPRISE). Tracks start/end dates, auto-renew, billing cycle, and features.
SubscriptionProduct	Links a subscription to specific SaaS products (POS, E-commerce, Inventory, etc.). A client can have multiple products under one subscription.
Invoice	Billing records generated for each subscription cycle. Tracks amount, due date, status, and items.
Payment	Payment transactions linked to invoices. Supports multiple payment methods (CARD, MPESA, PAYPAL, BANK_TRANSFER).
📦 Product Management
Table	Purpose
Product	The SaaS products offered (POS, E-commerce, Inventory, Restaurant, School, CRM, Accounting). Each has a unique slug, type, features, and status.
ClientProduct	Tracks which products a specific client has access to. Allows per-client feature toggles and settings.
ProductFeature	Individual features within a product (e.g., "Offline Mode" for POS). Can be marked as premium.
ProductPricing	Pricing tiers per product per plan. Defines cost, billing cycle, and included features.
🔐 Permissions & Security
Table	Purpose
RolePermission	Defines what permissions each role (SUPER_ADMIN, BUSINESS_OWNER, MANAGER, EMPLOYEE) has globally.
UserPermission	Overrides or grants specific permissions to individual users beyond their role.
ApiKey	API keys for external applications (POS, E-commerce, etc.) to authenticate with the central platform. Each key belongs to a client.
ApiLog	Logs all API requests for monitoring, debugging, and security auditing.
⚙️ Customization & Preferences
Table	Purpose
ClientCustomization	Per-client branding, theme colors, feature toggles, and third-party integration settings.
UserPreference	Individual user settings like theme, language, timezone, and dashboard layout.
📊 Audit & Notifications
Table	Purpose
AuditLog	Tracks all changes in the system (CREATE, UPDATE, DELETE, LOGIN, LOGOUT) for compliance and troubleshooting.
Notification	System notifications sent to users (alerts, reminders, updates).
🔗 Integrations
Table	Purpose
Webhook	Webhook configurations per client for real-time event notifications to external systems.
WebhookLog	Logs all webhook delivery attempts with status codes and response data.
SystemConfig	Global system-wide configuration settings (e.g., feature flags, default values).
How Data Flows
1. Client Onboarding
text
Client signs up → Client record created → Subscription created → User (Business Owner) created
2. Product Activation
text
Client subscribes → SubscriptionProduct links client to products → ClientProduct enables access → User can use the product
3. Billing Cycle
text
Subscription generates Invoice → User pays → Payment recorded → Subscription renewed/updated
4. API Access
text
Client creates ApiKey → External app (POS/Ecom) uses key → ApiLog tracks every request → Access validated via permissions
Key Relationships Summary
text
Client (1) ──has many── User
Client (1) ──has one── Subscription
Client (1) ──has many── ClientProduct (links to Product)
Client (1) ──has many── Invoice
Client (1) ──has many── ApiKey
Client (1) ──has many── AuditLog
Client (1) ──has one── ClientCustomization

Product (1) ──has many── SubscriptionProduct (links to Subscription)
Product (1) ──has many── ClientProduct (links to Client)
Product (1) ──has many── ProductFeature
Product (1) ──has many── ProductPricing

Subscription (1) ──has many── SubscriptionProduct
Subscription (1) ──has many── Invoice

Invoice (1) ──has many── Payment

User (1) ──has many── Session
User (1) ──has many── Notification
User (1) ──has one── UserPreference
User (1) ──has many── UserPermission
Data Isolation Pattern (Multi-Tenancy)
Every table that stores client-specific data has a clientId field. All queries from the application should include WHERE clientId = currentClientId to ensure data isolation.

sql
-- Example: Get all users for the current client
SELECT * FROM users WHERE clientId = 'client_123';

-- Example: Get all products available to a client
SELECT p.* FROM products p
JOIN client_products cp ON cp.productId = p.id
WHERE cp.clientId = 'client_123' AND cp.isActive = true;
Scalability Features
Feature	Implementation
Indexing	All foreign keys and frequently queried fields have indexes (@@index)
Soft Delete	deletedAt field on major tables (preserves data history)
JSON Fields	Flexible data storage for settings, metadata, and features without schema changes
UUID Keys	All primary keys use cuid() for distributed ID generation
Enum Constraints	Enforced data integrity with PostgreSQL enums
This design supports hundreds of thousands of clients and can scale vertically (bigger DB) or horizontally (read replicas, sharding by clientId).