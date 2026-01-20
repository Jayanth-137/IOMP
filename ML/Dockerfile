# ML/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies AND dos2unix (to fix Windows line endings)
RUN apt-get update && apt-get install -y \
    libgl1 libglib2.0-0 dos2unix \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python requirements
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --default-timeout=1000 -r requirements.txt

# Copy the rest of the application
COPY . .

# Copy the script, FIX WINDOWS LINE ENDINGS, and make executable
COPY start_ml.sh .
RUN dos2unix start_ml.sh && chmod +x start_ml.sh

# Expose ports
EXPOSE 9550 5001

# Start services
CMD ["./start_ml.sh"]