import io

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader

from services.ai import analyze_resume


app = FastAPI(title="EduPath API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "EduPath API is running"}


@app.post("/analyze")
async def analyze(
    role: str = Form(...),
    resume: UploadFile = File(...),
):
    file_bytes = await resume.read()

    reader = PdfReader(io.BytesIO(file_bytes))

    resume_text = "\n".join(
        page.extract_text() or ""
        for page in reader.pages
    )

    if not resume_text.strip():
        return {
            "error": "Could not extract text from this PDF."
        }

    result = analyze_resume(resume_text, role)

    return result
