# 1. Generate Prisma Client
npx prisma generate

# 2. Create the initial migration
npx prisma migrate dev --name init

# 3. Open Prisma Studio to verify
npx prisma studio