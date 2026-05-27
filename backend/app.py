import os
import uuid
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS

from parser_engine import extract_text_from_file, process_resume

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "uploads"
)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

candidate_store = []


@app.route("/")
def home():
    return jsonify({"message": "Resume Parser backend running"})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email", "")
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

    return jsonify({
        "success": True,
        "user": {
            "email": email,
            "name": email.split("@")[0]
        }
    })


def classify_candidate(score):
    if score >= 80:
        return "shortlist"
    elif score >= 60:
        return "hold"
    else:
        return "reject"


@app.route("/api/resume/parse", methods=["POST"])
def parse_resume():
    if "file" not in request.files:
        return jsonify({
            "success": False,
            "message": "No file uploaded"
        }), 400

    file = request.files["file"]
    job_description = request.form.get("job_description", "")

    if file.filename == "":
        return jsonify({
            "success": False,
            "message": "Empty filename"
        }), 400

    ext = os.path.splitext(file.filename)[1].lower()
    saved_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_FOLDER, saved_name)
    file.save(file_path)

    extracted_text = extract_text_from_file(file_path)
    if not extracted_text:
        return jsonify({
            "success": False,
            "message": "Could not extract text"
        }), 500

    processed = process_resume(extracted_text, job_description) or {}

    name = processed.get("name", "N/A")
    email = processed.get("email", "N/A")
    phone = processed.get("phone", "N/A")
    score = processed.get("score", 0)
    skills = processed.get("skills", [])

    try:
        score_value = float(score)
    except Exception:
        score_value = 0.0

    decision = classify_candidate(score_value)

    candidate = {
        "name": name,
        "email": email,
        "phone": phone,
        "score": score_value,
        "decision": decision,
        "skills": skills,
        "job_matching": processed.get("job_matching", {}),
        "date": datetime.now().strftime("%d %b %Y"),
    }

    candidate_store.append(candidate)

    return jsonify({
        "success": True,
        "filename": file.filename,
        "candidate": candidate
    })


@app.route("/api/candidates", methods=["GET"])
def get_candidates():
    return jsonify(candidate_store)


@app.route("/api/reports/summary", methods=["GET"])
def reports_summary():
    total = len(candidate_store)

    shortlisted = len([c for c in candidate_store if c["decision"] == "shortlist"])
    hold = len([c for c in candidate_store if c["decision"] == "hold"])
    rejected = len([c for c in candidate_store if c["decision"] == "reject"])

    return jsonify({
        "applications": total,
        "shortlisted": shortlisted,
        "hold": hold,
        "rejected": rejected
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)