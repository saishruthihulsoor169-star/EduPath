import json
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_resume(resume_text: str, role: str):
    prompt = f"""
You are EduPath, an adaptive AI career-learning coach.

Target role:
{role}

Resume:
{resume_text}

Analyze this learner against the target role.

Return ONLY valid JSON using exactly this structure:

{{
  "summary": "2-3 sentence summary of the learner",
  "skills": [
    {{
      "name": "skill name",
      "current_level": "Beginner",
      "target_level": "Advanced",
      "gap": "Short explanation of the gap"
    }}
  ],
  "critical_gaps": [
    "gap 1",
    "gap 2",
    "gap 3"
  ],
  "recommended_focus": "The most important thing to learn first",
  "seven_day_plan": [
    {{
      "day": 1,
      "focus": "topic",
      "task": "specific practical task"
    }},
    {{
      "day": 2,
      "focus": "topic",
      "task": "specific practical task"
    }},
    {{
      "day": 3,
      "focus": "topic",
      "task": "specific practical task"
    }},
    {{
      "day": 4,
      "focus": "topic",
      "task": "specific practical task"
    }},
    {{
      "day": 5,
      "focus": "topic",
      "task": "specific practical task"
    }},
    {{
      "day": 6,
      "focus": "topic",
      "task": "specific practical task"
    }},
    {{
      "day": 7,
      "focus": "topic",
      "task": "specific practical task"
    }}
  ]
}}

Rules:
- Base the analysis only on evidence from the resume.
- Do not invent experience.
- Be realistic about skill levels.
- Prioritize the highest-impact gaps.
- Make the 7-day plan practical and specific.
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
    )

    content = response.text.strip()

    if content.startswith("```"):
        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

    return json.loads(content)
