from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
import os, time, hmac, hashlib

app = Flask(__name__)
CORS(app)

# -------------------------------
# Configuration / keys
# -------------------------------

KEYFILE = "secret.key"

# Create a persistent key if it doesn’t exist
if not os.path.exists(KEYFILE):
    with open(KEYFILE, "wb") as f:
        f.write(Fernet.generate_key())

# Load the encryption key
with open(KEYFILE, "rb") as f:
    key = f.read()

fernet = Fernet(key)

# -------------------------------
# Simple Access Control (Satellite Protection)
# -------------------------------
SECRET_ACCESS_TOKEN = "nasa_secure_access_963"  # you can rename this

def verify_access(token):
    """Check if the request has a valid secret token"""
    return token == SECRET_ACCESS_TOKEN

# -------------------------------
# Routes
# -------------------------------

@app.route("/encrypt", methods=["POST"])
def encrypt_message():
    data = request.get_json()
    token = data.get("token")  # security check
    text = data.get("text")

    if not verify_access(token):
        return jsonify({"error": "Unauthorized"}), 401

    encrypted = fernet.encrypt(text.encode()).decode()
    return jsonify({"encrypted": encrypted})

@app.route("/decrypt", methods=["POST"])
def decrypt_message():
    data = request.get_json()
    token = data.get("token")
    text = data.get("text")

    if not verify_access(token):
        return jsonify({"error": "Unauthorized"}), 401

    try:
        decrypted = fernet.decrypt(text.encode()).decode()
        return jsonify({"decrypted": decrypted})
    except:
        return jsonify({"error": "Invalid or corrupted data"}), 400

# -------------------------------
# Main
# -------------------------------

if __name__ == "__main__":
    app.run(debug=True)
