# ML/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (needed for some ML libraries)
RUN apt-get update && apt-get install -y \
    libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the ML code
COPY . .

# Copy the startup script (we will create this next)
COPY start_ml.sh .
RUN chmod +x start_ml.sh

# Expose both ports used by your scripts
EXPOSE 9550 5001

# Run the startup script
CMD ["./start_ml.sh"]