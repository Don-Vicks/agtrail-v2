---
description: Build and run the app with Docker
---

# Docker Build & Run

1. Build the Docker image:

```bash
docker build -t frontend-v2 .
```

2. Run the container:

```bash
docker run -p 3000:3000 frontend-v2
```

The app will be available at `http://localhost:3000`.

## Notes

- The Dockerfile uses multi-stage builds with `node:20-alpine`
- Production dependencies are installed separately for a smaller image
- The container serves the production build via `react-router-serve`
