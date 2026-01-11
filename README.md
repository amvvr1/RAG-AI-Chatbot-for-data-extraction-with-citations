# RAG-AI-Chatbot-for-data-extraction-with-citations

An intelligent document analysis application that allows users to upload their documents and ask questions about their content. The system provides accurate answers with source attribution and zero hallucinations, showing exactly which document the information came from.

## VIDEO DEMO


https://github.com/user-attachments/assets/f0d5a5c6-a9b3-4963-a545-84f34423bd57



## FEATURES

- **Document Import:** Upload and process multiple document formats
- **Intelligent Q&A:** Ask natural language questions about your documents
- **Source Attribution:** Every answer includes the specific file from which the information was extracted
- **Vector Search:** Powered by embeddings for accurate semantic search
- **Fast Responses:** Optimized query engine for quick results


## Tech Stack

- **Frontend**: React
- **Backend API**: Python FastAPI
- **Vector Database**: ChromaDB
- **Embeddings**: OpenAI Embedding Model
- **Query Engine**: LlamaIndex
- **RAG Pipeline**: Custom retrieval-augmented generation implementation


### Prerequisites

- Node.js (v14 or higher)
- Python 3.11
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/amvvr1/QnA-APP.git
cd qna-app
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

5. Run the application
```bash
#start the backend (from backend directory)
uvicorn app.main:app --reload

# Start frontend (from frontend directory)
npm start
```

## Usage

1. Upload your documents using the import interface
2. Wait for the documents to be processed and embedded
3. Ask questions about your documents in natural language
4. Receive answers with source file attribution

## Architecture

The application uses a Retrieval-Augmented Generation (RAG) architecture:

1. Documents are chunked and converted to embeddings using OpenAI's embedding model
2. Embeddings are stored in ChromaDB for efficient vector similarity search
3. User queries are embedded and matched against stored document embeddings
4. LlamaIndex orchestrates the retrieval and response generation process
5. Responses include citations showing the source document


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

- **email:** scholarammar@gmail.com
