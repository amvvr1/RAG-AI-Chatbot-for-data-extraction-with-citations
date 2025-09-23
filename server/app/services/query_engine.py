import chromadb
from services.text_extraction import ExtractText
from llama_index.core.query_engine import CitationQueryEngine
from llama_index.core import VectorStoreIndex, StorageContext, Document
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.chroma import ChromaVectorStore
from dotenv import load_dotenv
import os

load_dotenv()

class QueryEngine:
    def __init__(self):
        self.documents = []
    

    def build_index(self, file_path):
        chroma_client = chromadb.PersistentClient(path="./chroma_db")
        
        doc_collection = chroma_client.get_or_create_collection("doc_collection")

        doc_vector_store = ChromaVectorStore(chroma_collection=doc_collection)
        doc_storage_context = StorageContext.from_defaults(vector_store=doc_vector_store)

        embed_model = OpenAIEmbedding(model_name="text-embedding-3-small")
    
        docs = self.build_docs(file_path)

        index = VectorStoreIndex.from_documents(docs, 
                                                storage_context=doc_storage_context,
                                                embed_model=embed_model)
        
        return index
    
    def build_query_engine_from_index(self, index):

        index = self.build_index()
       
        query_engine = CitationQueryEngine.from_args(index,
                                                      similarity_top_k=3)
        

        return query_engine


    def build_docs(self, file_path):
        extractor = ExtractText()

        txt = extractor.read_document(file_path=file_path)

        doc = Document(text=txt)

        return [doc]


