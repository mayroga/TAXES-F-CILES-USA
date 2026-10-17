import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
app = FastAPI(title="TAXES FÁCILES USA", version="2025.1.0")
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

@app.get("/", include_in_schema=False)
async def home():
    return FileResponse(STATIC_DIR / "index.html")

@app.get("/health")
async def health():
    return {"status": "ok", "app": "TAXES FÁCILES USA", "tax_year": 2025,
            "tax_answers_received": False, "tax_data_stored": False}

@app.get("/api/info")
async def info():
    return JSONResponse({
        "name": "TAXES FÁCILES USA",
        "tax_year": 2025,
        "purpose": "Educational tax calculations and guidance",
        "filing_or_submission": False,
        "tax_answers_sent_to_server": False,
        "official_sources": {
            "form_1040": "https://www.irs.gov/pub/irs-pdf/f1040.pdf",
            "form_1040_prior_year": "https://www.irs.gov/pub/irs-prior/f1040--2025.pdf",
            "schedule_1": "https://www.irs.gov/pub/irs-prior/f1040s1--2025.pdf",
            "schedule_1a": "https://www.irs.gov/pub/irs-pdf/f1040s1a.pdf",
            "schedule_c": "https://www.irs.gov/pub/irs-pdf/f1040sc.pdf",
            "schedule_se": "https://www.irs.gov/pub/irs-pdf/f1040sse.pdf",
            "instructions_1040": "https://www.irs.gov/instructions/i1040gi",
            "instructions_schedule_c": "https://www.irs.gov/instructions/i1040sc",
            "instructions_schedule_se": "https://www.irs.gov/instructions/i1040sse"
        }
    })

@app.get("/robots.txt", include_in_schema=False)
async def robots():
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse("User-agent: *\nDisallow: /\n")

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return JSONResponse({}, status_code=204)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0",
                port=int(os.environ.get("PORT", "8000")))
