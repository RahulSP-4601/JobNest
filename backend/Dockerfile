# backend/Dockerfile

# 1. Use official Python image
FROM python:3.11-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy app files
COPY . .

# 5. Expose backend port (commonly 5000 for Flask)
EXPOSE 5000

# 6. Run the backend (adjust this based on your entry point)
CMD ["sh", "-c", "gunicorn -b 0.0.0.0:$PORT auth:app"]



