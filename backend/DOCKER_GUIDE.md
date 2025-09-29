# Docker Setup Guide for StudySync AI

This guide explains how to run the StudySync AI backend using Docker and Docker Compose.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available for containers
- Supabase project credentials
- Cerebras AI API key

## Quick Start

### 1. Environment Setup

Copy the Docker environment template:

```bash
cp .env.docker .env
```

Edit `.env` and add your credentials:

```bash
# Required: Add your actual credentials
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
CEREBRAS_API_KEY=your_cerebras_api_key_here
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production-min-32-chars
```

### 2. Build and Run (Development)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f studysync-backend
```

### 3. Access the Application

- **FastAPI Backend**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432 (user: studysync, password: studysync123)
- **Redis**: localhost:6379
- **Nginx** (if enabled): http://localhost:80

## Advanced Usage

### Production Deployment

```bash
# Use production configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# With Nginx reverse proxy
docker-compose --profile production up -d --build
```

### Monitoring Stack

```bash
# Start with monitoring (Prometheus + Grafana)
docker-compose --profile monitoring up -d --build

# Access monitoring
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000 (admin/admin123)
```

### Individual Services

```bash
# Start only database services
docker-compose up postgres redis -d

# Start only the backend
docker-compose up studysync-backend -d

# Rebuild specific service
docker-compose build studysync-backend
docker-compose up studysync-backend -d
```

## Service Details

### FastAPI Backend (studysync-backend)

- **Image**: Custom built from Dockerfile
- **Port**: 8000
- **Health Check**: `/health` endpoint
- **Logs**: `/app/logs/` (mounted volume)
- **Environment**: Development with auto-reload

### PostgreSQL Database (postgres)

- **Image**: postgres:15-alpine
- **Port**: 5432 (exposed for development)
- **Database**: studysync_db
- **User**: studysync / studysync123
- **Initialization**: Runs `database_schema.sql` and `quick_setup.sql`
- **Data**: Persistent volume `postgres-data`

### Redis Cache (redis)

- **Image**: redis:7-alpine
- **Port**: 6379 (exposed for development)
- **Configuration**: Custom `redis.conf`
- **Data**: Persistent volume `redis-data`

### Nginx Reverse Proxy (nginx)

- **Image**: nginx:alpine
- **Ports**: 80, 443
- **Configuration**: Custom `nginx.conf`
- **SSL**: Mount certificates to `/etc/nginx/ssl/`
- **Profile**: Only runs with `--profile production`

## Volume Management

### Data Persistence

```bash
# List volumes
docker volume ls | grep studysync

# Backup database
docker-compose exec postgres pg_dump -U studysync studysync_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U studysync studysync_db < backup.sql

# Clean volumes (WARNING: Data loss!)
docker-compose down -v
```

### Log Access

```bash
# View application logs
docker-compose logs -f studysync-backend

# View all service logs
docker-compose logs -f

# Access log files
docker-compose exec studysync-backend ls -la /app/logs/
```

## Development Workflow

### Hot Reload Development

```bash
# Start with source code mounting (auto-reload enabled)
docker-compose up --build

# Make changes to Python files - they'll auto-reload
# Database and Redis changes persist in volumes
```

### Testing in Docker

```bash
# Run tests inside container
docker-compose exec studysync-backend python -m pytest

# Run specific test files
docker-compose exec studysync-backend python -m pytest test_chains.py

# Run with coverage
docker-compose exec studysync-backend python -m pytest --cov=.
```

### Database Operations

```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U studysync -d studysync_db

# Run database migrations
docker-compose exec studysync-backend python -c "from database_service import run_migrations; run_migrations()"

# Reset database
docker-compose exec postgres psql -U studysync -d studysync_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check what's using port 8000
lsof -i :8000

# Kill process
kill -9 $(lsof -ti:8000)

# Or use different ports in docker-compose.yml
```

#### Container Won't Start

```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs studysync-backend

# Inspect container
docker-compose exec studysync-backend /bin/bash
```

#### Database Connection Issues

```bash
# Check if PostgreSQL is ready
docker-compose exec postgres pg_isready -U studysync

# Test connection from backend
docker-compose exec studysync-backend python -c "
from supabase_client import get_supabase_client
client = get_supabase_client()
print('Supabase connected:', client is not None)
"
```

#### Permission Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Or run containers as root (not recommended for production)
docker-compose exec --user root studysync-backend /bin/bash
```

### Performance Optimization

#### Memory Usage

```bash
# Monitor container memory
docker stats

# Limit container memory in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 512M
```

#### Build Optimization

```bash
# Use build cache
docker-compose build --no-cache studysync-backend

# Multi-stage build cleanup
docker system prune -f

# Remove unused images
docker image prune -f
```

## Security Considerations

### Production Security

1. **Change default passwords** in production environment
2. **Use environment-specific `.env` files**
3. **Don't expose database ports** in production
4. **Enable SSL/TLS** with proper certificates
5. **Configure firewall rules** for container access
6. **Use secrets management** for sensitive data

### Environment Variables

```bash
# Sensitive data should be in .env (not committed)
POSTGRES_PASSWORD=secure_production_password
JWT_SECRET_KEY=very-long-secure-random-string-minimum-32-chars
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Monitoring and Maintenance

### Health Checks

```bash
# Check all services health
docker-compose ps

# Manual health check
curl http://localhost:8000/health
```

### Log Rotation

```bash
# Configure log rotation in production
# Add to docker-compose.prod.yml:
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Backup Strategy

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T postgres pg_dump -U studysync studysync_db > "backup_${DATE}.sql"
gzip "backup_${DATE}.sql"
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Docker Build and Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and test
        run: |
          docker-compose -f docker-compose.yml up -d --build
          docker-compose exec -T studysync-backend python -m pytest
          docker-compose down
```

For more detailed information, see the main README.md and individual service documentation.
