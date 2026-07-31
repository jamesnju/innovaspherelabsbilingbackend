# 1. Generate Prisma Client
npx prisma generate

# 2. Create the initial migration
npx prisma migrate dev --name init

# 3. Open Prisma Studio to verify
npx prisma studio


#production
# 1. Generate Prisma Client (production-optimized)
npx prisma generate

# 2. Apply migrations in production (NOT migrate dev)
npx prisma migrate deploy

# 3. If you need to create a new migration for production
npx prisma migrate dev --name initial --create-only
# Then apply it with: npx prisma migrate deploy