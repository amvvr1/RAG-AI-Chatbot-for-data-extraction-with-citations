import { useState, useEffect } from 'react';

function DocumentProcessing({ files, onNext }) {
    const [processingStatus, setProcessingStatus] = useState('Processing documents...');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Simulate processing since server processes during upload
        const timer = setTimeout(() => {
            setProcessingStatus('Documents processed successfully!');
            setIsComplete(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleContinue = () => {
        onNext();
    };

    return (
        <div className="processing-step">
            <h2>Step 2: Processing Documents</h2>
            <div className="processing-content">
                <div className="processing-animation">
                    {!isComplete ? (
                        <div className="spinner"></div>
                    ) : (
                        <div className="success-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22,4 12,14.01 9,11.01"/>
                            </svg>
                        </div>
                    )}
                </div>
                
                <div className="processing-status">
                    <p>{processingStatus}</p>
                </div>

                {files && files.length > 0 && (
                    <div className="processed-files">
                        <h3>Processed Files:</h3>
                        <ul>
                            {files.map((file, index) => (
                                <li key={index}>
                                    <span className="file-name">{file.name}</span>
                                    {isComplete && <span className="status-check">✓</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {isComplete && (
                    <button onClick={handleContinue} className="continue-btn">
                        Continue to Ask Questions
                    </button>
                )}
            </div>
        </div>
    );
}

export default DocumentProcessing;