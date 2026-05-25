from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client
from dotenv import load_dotenv
import os
from google import genai

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key = GEMINI_API_KEY)

SYSTEM_PROMPT = """
You are the LOCKEDIN buddy. You are a brutally honest, no-nonsense accountability partner for a student with ADHD who is trying to get his life together.

Your personality:
- Direct and honest, never sugarcoat
- Slightly tough love but genuinely care
- Keep responses concise, no essays
- Call out excuses when you see them
- Celebrate real wins, not participation trophies
- Talk like a friend, not a corporate assistant

Your user is:
- 2nd year CSE student
- Has ADHD, recently diagnosed
- Trying to learn DSA, build a full stack AI project, and get placed at 20+ LPA
- Tends to plan a lot but struggles to execute consistently
- Peak productivity is late night
- Genuinely smart but historically coasted on raw intelligence

Always push them to execute. If they're venting, acknowledge briefly then redirect to action.
"""

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CheckIn(BaseModel):
    energy: int
    mood: int
    plan: str

class HistoryMessage(BaseModel):
    role: str
    content: str

class ChatMessage(BaseModel):
    message : str
    history: list[HistoryMessage] = []

class Task(BaseModel):
    title : str
    description : str = ""
    status : str = "todo"
    due_date : str = None

@app.get("/") 
def read_root(): 
    return {"message": "LOCKEDIN backend is alive"}

@app.post("/checkin")
def create_checkin(checkin: CheckIn):
    supabase.table("checkins").insert({
        "energy" : checkin.energy,
        "mood" : checkin.mood,
        "plan" : checkin.plan
    }).execute()
    return {"message": "Check-in received", "data": checkin}

@app.post("/chat")
def chat(body: ChatMessage):
    history_text = ""
    for msg in body.history:
        history_text += f'\n{msg.role}: {msg.content}'

    full_prompt =  SYSTEM_PROMPT + history_text + "\n\nUser: " + body.message

    response = client.models.generate_content(
        model = "gemini-3-flash-preview",
        contents = full_prompt
    )
    return {"reply": response.text}

@app.post("/tasks")
def create_task(task: Task):
    data = supabase.table("tasks").insert({
        "title" : task.title,
        "description" : task.description,
        "status" : task.status,
        "due_date" : task.due_date
    }).execute()
    return {"message" : "Task Created Succesfully", "data" : data}

@app.get("/tasks")
def get_task():
    data = supabase.table("tasks").select("*").execute()
    return {"tasks" : data.data}

@app.patch("/tasks/{task_id}")
def update_task(task_id : int, task : Task):
    data = supabase.table("tasks").update({
       "status" : task.status
    }).eq("id", task_id).execute()
    return {"message" : "Task updated", "data" : data}
    
