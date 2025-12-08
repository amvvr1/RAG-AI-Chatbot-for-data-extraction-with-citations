import { useState } from 'react';

function ClearDocuments({ onReset }) {
    const [isClearing, setIsClearing] = useState(false);
    const [clearStatus, setClearStatus] = useState('');

    const handleClearDocuments = async () => {
        setIsClearing(true);
        setClearStatus('Clearing documents...');

        try {
            const response = await fetch('http://127.0.0.1:8000/clear-uploads', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setClearStatus('Documents cleared successfully!');
                setTimeout(() => {
                    onReset();
                }, 1500);
            } else {
                setClearStatus('Failed to clear documents. Please try again.');
                setIsClearing(false);
            }
        } catch (error) {
            setClearStatus('Failed to clear documents. Please try again.');
            setIsClearing(false);
        }
    };

    const handleStartOver = () => {
        onReset();
    };

    return (
        <div className="clear-documents-step">
            <h2>Step 4: Session Complete</h2>
            
            <div className="completion-content">
                <div className="completion-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                </div>

                <h3>Great! You've successfully queried your documents.</h3>
                <p>You can now clear the current documents and start a new session, or continue asking more questions.</p>

                {clearStatus && (
                    <div className={`clear-status ${clearStatus.includes('success') ? 'success' : clearStatus.includes('Failed') ? 'error' : ''}`}>
                        {clearStatus}
                    </div>
                )}

                <div className="action-buttons">
                    <button 
                        onClick={handleClearDocuments}
                        disabled={isClearing}
                        className="clear-btn"
                    >
                        {isClearing ? 'Clearing...' : 'Clear Documents & Start New Session'}
                    </button>

                    <button 
                        onClick={handleStartOver}
                        className="start-over-btn"
                    >
                        Start Over
                    </button>
                </div>

                <div className="session-info">
                    <p><strong>What happens when you clear documents?</strong></p>
                    <ul>
                        <li>All uploaded documents will be removed from the system</li>
                        <li>The query engine will be reset</li>
                        <li>You'll return to Step 1 to upload new documents</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ClearDocuments;