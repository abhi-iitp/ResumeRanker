import os
import fitz
import docx
import re
from sentence_transformers import SentenceTransformer, util

import spacy

# =========================
# Load spaCy
# =========================
try:
    nlp = spacy.load("en_core_web_sm")
    semantic_model = SentenceTransformer("all-MiniLM-L6-v2")

except:
    os.system("python -m spacy download en_core_web_sm")

    nlp = spacy.load("en_core_web_sm")
    semantic_model = SentenceTransformer("all-MiniLM-L6-v2")

# =========================
# Extract text
# =========================
def extract_text_from_file(file_path):
    if not os.path.exists(file_path):
        return None

    ext = file_path.lower().split(".")[-1]
    text = ""

    try:
        if ext == "pdf":
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text() + "\n"
            doc.close()

        elif ext in ["doc", "docx"]:
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"

        return text

    except Exception as e:
        print("Error:", e)
        return None


# =========================
# Clean text
# =========================
def clean_text(text):
    text = text.lower()
    text = re.sub(r"\n+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9\s@.+]", "", text)

    doc = nlp(text)
    tokens = []

    for token in doc:
        if not token.is_stop and not token.is_punct:
            tokens.append(token.lemma_)

    return " ".join(tokens)


# =========================
# Extract email / phone
# =========================
def extract_contact_info(text):
    email_regex = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
    phone_regex = r"\+?\d[\d\s\-\(\)]{8,15}"

    email_match = re.search(email_regex, text)
    phone_match = re.search(phone_regex, text)

    return {
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
    }


# =========================
# Extract Name
# =========================
def extract_name_robust(text):
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    top_lines = lines[:10]

    for line in top_lines:
        if (
            "@" not in line
            and not re.search(r"\d", line)
            and 1 <= len(line.split()) <= 4
        ):
            clean = re.sub(r"[^A-Za-z\s]", "", line).strip()
            if len(clean) > 2:
                return clean.title()

    doc = nlp(text[:1000])

    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text.strip()
            if len(name.split()) >= 2:
                return name.title()

    return "Name Not Found"


# =========================
# Skills Database
# =========================
skill_hierarchy = {
    "python": ["python", "backend", "scripting"],
    "java": ["java", "backend"],
    "react": ["react", "frontend", "javascript"],
    "javascript": ["javascript", "frontend"],
    "sql": ["sql", "database", "querying"],
    "mysql": ["mysql", "database", "sql"],
    "postgresql": ["postgresql", "database", "sql"],
    "machine learning": ["machine learning", "ai", "ml"],
    "django": ["django", "python", "backend"],
    "flask": ["flask", "python", "backend"],
    "html": ["html", "frontend"],
    "css": ["css", "frontend"],
    "aws": ["aws", "cloud"],
}


# =========================
# Extract Skills
# =========================
def extract_and_expand_skills(cleaned_text):
    found = set()
    words = cleaned_text.split()

    for word in words:
        if word in skill_hierarchy:
            found.update(skill_hierarchy[word])

    return list(found)


# =========================
# Semantic Match
# =========================
def advanced_semantic_match(resume_text, job_desc_text):
    try:
        res_embedding = semantic_model.encode(
            resume_text,
            convert_to_tensor=True
        )

        job_embedding = semantic_model.encode(
            job_desc_text,
            convert_to_tensor=True
        )

        semantic_score = util.cos_sim(
            res_embedding,
            job_embedding
        ).item()

        return round(semantic_score * 100, 2)

    except Exception as e:
        print("Semantic Match Error:", e)
        return 0

# =========================
# Main Resume Processing
# =========================
def process_resume(resume_text, job_description):
    cleaned_resume = clean_text(resume_text)
    cleaned_job = clean_text(job_description)

    name = extract_name_robust(resume_text)
    contact = extract_contact_info(resume_text)

    resume_skills = extract_and_expand_skills(cleaned_resume)
    job_skills = extract_and_expand_skills(cleaned_job)

    matched_skills = list(set(resume_skills).intersection(set(job_skills)))

    semantic_score = advanced_semantic_match(cleaned_resume, cleaned_job)

    overlap_score = 0
    if len(job_skills) > 0:
        overlap_score = (len(matched_skills) / len(job_skills)) * 100

    final_score = round((semantic_score * 0.4) + (overlap_score * 0.6), 2)

    return {
        "name": name,
        "email": contact["email"],
        "phone": contact["phone"],
        "score": final_score,
        "skills": resume_skills[:20],
        "job_matching": {
            "matched_skills": matched_skills,
            "semantic_score": semantic_score,
            "overlap_score": overlap_score,
            "final_score": final_score,
        },
    }