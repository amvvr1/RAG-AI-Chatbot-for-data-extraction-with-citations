from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from services.query_engine import QueryEngine
from typing import List
from schemas import Response, ChatRequest
import os
import shutil
from pathlib import Path
import chromadb
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

app = FastAPI()

app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

engine = None

query_engine = QueryEngine()

@app.post("/uploadmultiplefiles")
def create_upload_files(files: List[UploadFile] = File(...)):
    global engine
    uploaded_files = []
    file_paths = []

    os.makedirs("uploads", exist_ok=True)

    for file in files: 
        uploaded_files.append(file.filename)

        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(file.file.read())

        file_paths.append(file_path)
    
    index = query_engine.build_index(file_paths=file_paths)

    engine = query_engine.build_query_engine(index=index)

    return {"message" : "files uploaded successfully and ready for querying",
             "filenames" : uploaded_files}

def clear_uploads():
    dir_path = Path("uploads")
    if dir_path.exists():
        for item in dir_path.iterdir():
            if item.is_file():
                item.unlink()
            else: 
                shutil.rmtree(item)



@app.post("/questions/", response_model=Response)
@limiter.limit("10/day")
def get_response(query: ChatRequest, request: Request):
    if engine is None:  
        raise HTTPException(status_code=400, detail="Please start by uploading documents first")

    response = engine.query(query.query)
 

    for node in response.source_nodes:
        return{
            "answer" : response.response,
            "document_name": node.node.metadata.get("filename", "Unknown")
        }

  

@app.delete("/clear-uploads")
def delete_uploads_and_clear_index():
    global engine

    clear_uploads()

    if engine is not None:
        try: 
            chroma_client = chromadb.PersistentClient(path="./chroma_db")
            chroma_client.delete_collection("doc_collection")
        except Exception:
            pass

    engine = None
    
    return f"files cleared successfully"


@app.get("/uploaded-files/")
def list_uploaded_files():
    upload_directory = "uploads"
    
    try:
        files = os.listdir(upload_directory)
        return {"files" : files}
    
    except FileNotFoundError:
        return {"message" : "No Uploaded Files Found"}
    
    except Exception as e:
        return {"error" : str(e)}
    



    


