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
