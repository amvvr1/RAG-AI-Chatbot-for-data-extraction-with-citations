import { useState, useRef } from 'react';

function FileUpload({ onFilesUploaded, onNext }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = (files) => {
        const fileArray = Array.from(files);
        setSelectedFiles(fileArray);
        onFilesUploaded(fileArray);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setUploadStatus('Please select files first');
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            setUploadStatus('Uploading...');
            const response = await fetch('http://127.0.0.1:8000/uploadmultiplefiles', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('Files uploaded successfully!');
                setTimeout(() => {
                    onNext();
                }, 1000);
            } else {
                setUploadStatus('Upload failed. Please try again.');
            }
        } catch (error) {
            setUploadStatus('Upload failed. Please try again.');
        }
    };

    return (
        <div className="upload-step">
            <h2>Step 1: Upload Documents</h2>
            <p>Select your documents to get started</p>
            <FileDropZone 
                onFileSelect={handleFileSelect}
                isDragOver={isDragOver}
                setIsDragOver={setIsDragOver}
                fileInputRef={fileInputRef}
            />
            
            {selectedFiles.length > 0 && (
                <div className="file-list">
                    <h3>Selected Files:</h3>
                    <ul>
                        {selectedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {uploadStatus && (
                <div className={`upload-status ${uploadStatus.includes('success') ? 'success' : uploadStatus.includes('failed') ? 'error' : ''}`}>
                    {uploadStatus}
                </div>
            )}

            <button 
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || uploadStatus === 'Uploading...'}
                className="upload-btn"
            >
                {uploadStatus === 'Uploading...' ? 'Uploading...' : 'Upload Documents'}
            </button>
        </div>
    );
}

function FileDropZone({ onFileSelect, isDragOver, setIsDragOver, fileInputRef }) {
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        onFileSelect(files);
    };

    const handleFileInputChange = (e) => {
        onFileSelect(e.target.files);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div 
            className={`file-dropzone ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <div className="dropzone-content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                </svg>
                <p>Drag and drop your files here</p>
                <span>or click to browse</span>
            </div>
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileInputChange}
                multiple
                style={{display: 'none'}}
            />
        </div>
    );
}

export default FileUpload;