# 🧠 Job Nest

Job Nest is an end-to-end job portal web application designed to streamline job discovery and applications for users. Built with a modern tech stack, it supports real-time features and a seamless UI experience — deployed via Docker and hosted on Google Cloud Run.

---

## 🚀 1. How We Created Job Nest

- Designed a modern job portal frontend using **React.js**.
- Developed a robust backend using **Python** and **Flask** to handle job data, applications, user sessions, and more.
- Implemented API proxying with **NGINX** to connect the frontend and backend seamlessly.
- Containerized the entire application using **Docker**.
- Hosted the application on **Google Cloud Run** for scalable deployment.

---

## 🛠 2. Tech Stack

- **Frontend**: React, HTML, CSS, JavaScript
- **Backend**: Python, Flask
- **Server/Proxy**: NGINX
- **Containerization**: Docker, Docker Compose
- **Cloud Platform**: Google Cloud Run

---

## 📦 3. Deployed on Docker

- Built custom Docker image using `Dockerfile`
- Used `docker-compose.yml` to expose the service on port `8080`
- Local deployment:

```bash
docker compose up --build
```

- Stopped containers with:

```bash
docker compose down
```

## ☁️ 4. Hosted on Google Cloud

- Docker image built and submitted using:

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/jobportal-frontend
```

- Deployed to Google Cloud Run using:

```bash
gcloud run deploy jobportal-frontend \
  --image gcr.io/YOUR_PROJECT_ID/jobportal-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

## 🔗 5. Live Website

[Click here to visit Job Nest 🌐](https://frontend-service-920994214041.us-central1.run.app/home)

## 📹 6. Video Output

## 🖼️ 7. Output Screenshot
