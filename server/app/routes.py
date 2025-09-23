from fastapi import FastAPI, UploadFile, File
from services.query_engine import QueryEngine
from typing import List


app = FastAPI()

query_engine = QueryEngine()

@app.post("/uploadmultiplefiles")
def create_upload_files(files: List[UploadFile] = File(...)):
    uploaded_files = []
    file_paths = []

    for file in files: 
        uploaded_files.append(file.filename)

        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(file.file.read())

        file_paths.append(file_path)
    
    full_index = []

    for file_path in file_paths:
        file_index = query_engine.build_index(file_path)
        full_index.extend(file_index)

    engine = query_engine.build_query_engine_from_index(index= full_index)

    return {"message" : "files uploaded successfully and ready for querying",
             "filenames" : uploaded_files}



@app.post("/questions/")
def get_response(query: str, file_path: str) -> str:
    response = query_engine.query(query)

    return {
        "answer" : response.response,
        "citation" : response.source_nodes
    }



