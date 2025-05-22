import requests

url = "https://apply-to-avantos.dev-sandbox.workload.avantos-ai.net"
headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome"
}
payload = {
    "email": "rahulsp4601@gmail.com"
}

response = requests.post(url, headers=headers, json=payload)

print("Status Code:", response.status_code)
print("Response Text:", response.text)
