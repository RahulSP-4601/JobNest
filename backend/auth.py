from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
import re

app = Flask(__name__)

# Allow CORS from your frontend origin(s)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)


client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
db = client['jobportal']
users_collection = db['auth']

def clean_html(raw_html: str) -> str:
    """Basic clean HTML tags from description for printing snippet."""
    clean_text = re.sub(r'<[^>]+>', '', raw_html)  # remove tags
    clean_text = unescape(clean_text)  # decode HTML entities
    return clean_text.strip()

def fetch_themuse_jobs(page=1):
    url = f"https://www.themuse.com/api/public/jobs?page={page}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Fetch error on page {page}: {e}")
        return []

    jobs = []
    for job in data.get("results", []):
        jobs.append({
            "title": job.get("name", "N/A"),
            "company": job.get("company", {}).get("name", "N/A"),
            "location": ", ".join(loc.get("name", "Remote") for loc in job.get("locations", [{"name": "Remote"}])),
            "experience_level": [level.get("name") for level in job.get("levels", [])],
            "category": [cat.get("name") for cat in job.get("categories", [])],
            "url": job.get("refs", {}).get("landing_page", ""),
            "publication_date": job.get("publication_date", ""),
            "remote": job.get("remote", False),
            "sponsorship": job.get("sponsorship", False),
            "description": clean_html(job.get("contents", ""))[:8150]
        })
    return jobs

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    # Fetch first 20 pages concurrently
    all_jobs = []
    with ThreadPoolExecutor(max_workers=10) as executor:  # Optional: increase workers for performance
        futures = [executor.submit(fetch_themuse_jobs, page) for page in range(1, 21)]
        for future in as_completed(futures):
            jobs = future.result()
            if jobs:
                all_jobs.extend(jobs)
    return jsonify(all_jobs)


if __name__ == '__main__':
    app.run(debug=True)
