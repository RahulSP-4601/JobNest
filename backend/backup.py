import requests
from typing import List, Dict
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
import re

def clean_html(raw_html: str) -> str:
    """Basic clean HTML tags from description for printing snippet."""
    clean_text = re.sub(r'<[^>]+>', '', raw_html)  # remove tags
    clean_text = unescape(clean_text)  # decode HTML entities
    return clean_text.strip()

def fetch_themuse_jobs(page=1) -> List[Dict]:
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
            "description": clean_html(job.get("contents", ""))[:8150]  # snippet 150 chars
        })
    return jobs

def main():
    all_jobs = []
    print("Fetching The Muse jobs from pages 1 to 30 concurrently...")

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(fetch_themuse_jobs, page) for page in range(1, 31)]

        for future in as_completed(futures):
            jobs = future.result()
            if jobs:
                all_jobs.extend(jobs)

    print(f"\nTotal jobs fetched: {len(all_jobs)}\n")

    for idx, job in enumerate(all_jobs, 1):
        print(f"{idx}. {job['title']} at {job['company']}")
        print(f"   Location: {job['location']}")
        print(f"   Experience Level: {', '.join(job['experience_level']) if job['experience_level'] else 'N/A'}")
        print(f"   Category: {', '.join(job['category']) if job['category'] else 'N/A'}")
        print(f"   Published: {job['publication_date']}")
        print(f"   Remote: {'Yes' if job['remote'] else 'No'}")
        print(f"   Sponsored: {'Yes' if job['sponsorship'] else 'No'}")
        print(f"   Description snippet: {job['description']}...")
        print(f"   URL: {job['url']}\n")

if __name__ == "__main__":
    main()











from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
from datetime import datetime, timedelta, timezone
from functools import wraps

app = Flask(__name__)

# Allow CORS from your frontend origin(s)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key')

client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
db = client['jobportal']
users_collection = db['auth']

def generate_jwt(email):
    payload = {
        'email': email,
        'exp': datetime.now(timezone.utc) + timedelta(days=1)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        token = None
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = users_collection.find_one({'email': data['email']})
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return '', 200  # Respond to preflight OPTIONS request

    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    contact = data.get('contact')
    password = data.get('password')

    if not all([username, email, contact, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 409

    hashed_password = generate_password_hash(password)
    token = generate_jwt(email)

    users_collection.insert_one({
        'username': username,
        'email': email,
        'contact': contact,
        'password': hashed_password
    })

    return jsonify({
        'message': 'User registered successfully',
        'user': {
            'username': username,
            'email': email,
            'contact': contact
        },
        'token': token
    }), 201

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200  # Respond to preflight OPTIONS request

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    user = users_collection.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_jwt(email)

    return jsonify({
        'message': 'Login successful',
        'user': {
            'username': user['username'],
            'email': user['email'],
            'contact': user['contact']
        },
        'token': token
    }), 200

@app.route('/verify-token', methods=['GET', 'OPTIONS'])
def verify_token():
    if request.method == 'OPTIONS':
        return '', 200  # Respond to preflight OPTIONS request

    auth_header = request.headers.get('Authorization', '')
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({'error': 'Token missing or malformed'}), 401

    token = auth_header.split(" ")[1]

    try:
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user = users_collection.find_one({'email': decoded['email']})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'message': 'Token valid', 'user': user['username']}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

@app.route('/jobs', methods=['GET', 'OPTIONS'])
@token_required
def jobs(current_user):
    if request.method == 'OPTIONS':
        return '', 200  # Respond to preflight OPTIONS request

    return jsonify({'message': f'Welcome {current_user["username"]}, here are your jobs'}), 200

if __name__ == '__main__':
    app.run(debug=True)
