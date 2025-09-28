import chromadb
from services.text_extraction import ExtractText
from llama_index.core.query_engine import CitationQueryEngine
from llama_index.core import VectorStoreIndex, StorageContext, Document
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.chroma import ChromaVectorStore
from dotenv import load_dotenv
import os
from PyPDF2 import PdfReader  
from pathlib import Path  

load_dotenv()

class QueryEngine:
    def __init__(self):
        self.documents = []
        self.index = None
    

    def build_index(self, file_paths):
        if isinstance(file_paths, str):
            file_paths = [file_paths]

        chroma_client = chromadb.PersistentClient(path="./chroma_db")
        doc_collection = chroma_client.get_or_create_collection("doc_collection")
        doc_vector_store = ChromaVectorStore(chroma_collection=doc_collection)
        doc_storage_context = StorageContext.from_defaults(vector_store=doc_vector_store)
        embed_model = OpenAIEmbedding(model_name="text-embedding-3-small")
    

        all_docs= []
        for file_path in file_paths:
            docs = self.build_docs(file_path)
            all_docs.extend(docs)

        
        index = VectorStoreIndex.from_documents(all_docs, 
                                                storage_context=doc_storage_context,
                                                embed_model=embed_model)
    
        return index
    
    def build_query_engine(self, index):
        query_engine = CitationQueryEngine.from_args(index,
                                                      similarity_top_k=3)
        
        return query_engine
    

    def build_docs(self, file_path):
        path = Path(file_path)
        extension = path.suffix.lower()

        if extension == ".pdf": 
            return self.build_pdf_doc(file_path)

        else:                   
            extractor = ExtractText()
            txt = extractor.read_document(file_path=file_path)

            doc = Document(text=txt, 
                       metadata = {
                           "filename" : os.path.basename(file_path)
                       })

            return [doc]
        
        
    
    def build_pdf_doc(self, file_path):
        reader = PdfReader(file_path)

        docs = []

        for page_num, page in enumerate(reader.pages, 1):
            text = page.extract_text()
            if text.strip(): 
                doc = Document(
                    text = text,
                    metadata = {
                        "filename" : os.path.basename(file_path), 
                        "page_number" : page_num
                    }
                )
            
                docs.append(doc)
        
        return docs
    





