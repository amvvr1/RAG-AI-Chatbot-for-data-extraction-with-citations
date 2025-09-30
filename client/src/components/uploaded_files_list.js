import { useState, useEffect } from 'react';

function UploadedFilesList() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUploadedFiles = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://127.0.0.1:8000/uploaded-files/');
            const data = await response.json();

            if (data.files) {
                setFiles(data.files);
                setError('');
            } else if (data.message) {
                setFiles([]);
                setError('');
            } else if (data.error) {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to fetch uploaded files');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUploadedFiles();

        // Poll for updates every 5 seconds
        const interval = setInterval(fetchUploadedFiles, 5000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="uploaded-files-list">
                <h3>Uploaded Files</h3>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="uploaded-files-list">
                <h3>Uploaded Files</h3>
                <p className="error">{error}</p>
            </div>
        );
    }

    return (
        <div className="uploaded-files-list">
            <h3>Uploaded Files ({files.length})</h3>
            {files.length === 0 ? (
                <p className="no-files">No files uploaded yet</p>
            ) : (
                <ul className="files-list">
                    {files.map((file, index) => (
                        <li key={index} className="file-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                            </svg>
                            <span>{file}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UploadedFilesList;
