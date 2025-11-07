# Prisma Database Workflow

When using Prisma with Supabase's connection pooling, follow these workflows:

## Development Workflow (with pooled connections)

For local development when you change the schema:

```bash
# Push schema changes directly (preferred with pooled connections)
npm run prisma:push

# Generate Prisma Client after schema changes
npm run prisma:generate
```

## Production Workflow (if you need migrations)

For production or when you need migration history:

1. Temporarily switch DATABASE_URL to use DIRECT_URL in .env
2. Run migration command
   ```bash
   npm run prisma:migrate
   ```
3. Switch back to pooled connection

## Common Commands

- `npm run prisma:push` - Push schema changes (development)
- `npm run prisma:generate` - Update Prisma Client
- `npm run prisma:studio` - Open Prisma Studio UI
- `npm run prisma:reset` - Reset database (development only)

## Troubleshooting

### Permission Denied to Terminate Process

If you see this error when using `migrate dev`:
```
Error: ERROR: permission denied to terminate process
```

This happens because:
1. You're using a pooled connection (pgbouncer)
2. Prisma tries to terminate other connections during migration
3. The pooled connection user doesn't have terminate permissions

Solutions:
1. Use `npm run prisma:push` instead for development
2. Or temporarily use DIRECT_URL for migrations if you need migration history

### Connection Issues

If you can't connect to the database:
1. Check if you're using the correct connection URL (pooled vs direct)
2. Verify network connectivity (especially for direct connections)
3. Consider using Supabase's SQL Editor for direct schema changes

## Environment Setup

Your .env should have:
```env
# Pooled connection for normal operations
DATABASE_URL="postgresql://...pooler.supabase.com:6543/..."

# Direct connection for migrations (if needed)
DIRECT_URL="postgresql://...supabase.co:5432/..."
```

## Best Practices

1. Use `prisma db push` for development (works with pooled connections)
2. Generate migration SQL files if you need to track schema changes
3. Consider running migrations through Supabase's SQL Editor
4. Always backup your database before major schema changes