# Redis Setup Guide for Champion Choice

## Option 1: Upstash (Recommended - Free Tier)

1. Go to [Upstash](https://upstash.com/)
2. Sign up for free account
3. Create a new Redis database
4. Copy the connection string (looks like: `redis://default:password@host:port`)
5. Add to your `.env` file:
   ```
   REDIS_URL=your_upstash_redis_url_here
   ```

## Option 2: Local Redis (Windows)

### Using WSL (Windows Subsystem for Linux):
```bash
# Install WSL if not already installed
wsl --install

# In WSL terminal:
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

Then in `.env`:
```
REDIS_URL=redis://localhost:6379
```

### Using Docker:
```bash
docker run -d -p 6379:6379 redis:alpine
```

Then in `.env`:
```
REDIS_URL=redis://localhost:6379
```

## Testing Redis Connection

After setting up Redis, test the connection:

```bash
npm run worker
```

This will start the email worker. You should see:
```
[Worker] Email worker started and listening for jobs...
```

## Running the Worker

In production, you'll want to run the worker as a separate process:

```bash
# Development
npm run worker

# Production (with PM2)
pm2 start workers/emailWorker.ts --name email-worker
```
