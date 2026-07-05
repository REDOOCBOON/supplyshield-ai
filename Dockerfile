# Use an official Node runtime as parent image
FROM node:20-slim

# Install system dependencies (Python 3, pip, and venv)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy package lock and configurations
COPY package*.json tsconfig.json vite.config.ts server.ts ./

# Install npm dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set up Python virtual environment and install ML libraries
RUN python3 -m venv venv && \
    ./venv/bin/pip install --upgrade pip && \
    ./venv/bin/pip install pandas scikit-learn

# Rebuild native Node modules (e.g., sqlite3) for the container Linux environment
RUN npm rebuild

# Run the data simulation generation, ML training, and SQLite database seeding
# so that the container is fully pre-seeded and pre-trained
RUN PYTHONPATH=. ./venv/bin/python ml/main.py && \
    PYTHONPATH=. ./venv/bin/python ml/train.py && \
    PYTHONPATH=. ./venv/bin/python db/seed.py

# Build the React/Vite assets and bundle the server
RUN npm run build

# Expose port (Google Cloud Run dynamically injects the PORT env variable)
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Start the Node.js Express production server
CMD ["npm", "run", "start"]
