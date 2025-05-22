from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os, re, requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"]) 

client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
db = client["jobportal"]
users_collection = db["auth"]

def clean_html(raw_html: str) -> str:
    text = re.sub(r"<[^>]+>", "", raw_html)
    return unescape(text).strip()

def fetch_themuse_jobs(page=1):
    url = f"https://www.themuse.com/api/public/jobs?page={page}"
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
    except Exception as e:
        print(f"[Fetch error] page {page}: {e}")
        return []

    jobs = []
    for j in resp.json().get("results", []):
        jobs.append({
            "title":  j.get("name", "N/A"),
            "company": j.get("company", {}).get("name", "N/A"),
            "location": ", ".join(loc.get("name", "Remote")
                                  for loc in j.get("locations", [{"name": "Remote"}])),
            "experience_level": [l.get("name") for l in j.get("levels", [])],
            "category":        [c.get("name") for c in j.get("categories", [])],
            "url":             j.get("refs", {}).get("landing_page", ""),
            "publication_date": j.get("publication_date", ""),
            "remote":          j.get("remote", False),
            "sponsorship":     j.get("sponsorship", False),
            "description":     clean_html(j.get("contents", ""))[:8150]
        })
    return jobs

@app.route("/api/jobs", methods=["GET"])
def get_jobs():
    all_jobs = []
    with ThreadPoolExecutor(max_workers=10) as pool:
        futures = [pool.submit(fetch_themuse_jobs, p) for p in range(1, 21)]
        for f in as_completed(futures):
            all_jobs.extend(f.result())
    return jsonify(all_jobs)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
