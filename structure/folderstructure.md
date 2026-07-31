backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── auth.ts
│   │   └── logger.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── client.controller.ts
│   │   ├── product.controller.ts
│   │   ├── subscription.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── tenant.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rate-limit.middleware.ts
│   ├── models/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── index.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── client.routes.ts
│   │   ├── product.routes.ts
│   │   ├── subscription.routes.ts
│   │   └── user.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── client.service.ts
│   │   ├── product.service.ts
│   │   ├── subscription.service.ts
│   │   └── user.service.ts
│   ├── validations/
│   │   ├── auth.validation.ts
│   │   ├── client.validation.ts
│   │   ├── product.validation.ts
│   │   └── subscription.validation.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── encryption.ts
│   │   ├── token.ts
│   │   ├── pagination.ts
│   │   └── helpers.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── express.d.ts
│   │   └── prisma.d.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── tests/
│   ├── unit/
│   └── integration/
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── prisma.config.ts
└── README.md