import { useState } from 'react';

function QuestionAnswer({ onNext }) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [documentName, setDocumentName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasAskedQuestion, setHasAskedQuestion] = useState(false);

    const handleSubmitQuestion = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setIsLoading(true);
        setAnswer('');
        setDocumentName('');

        try {
            const response = await fetch('https://docuapp-gbe3fyfae6c9bth6.centralus-01.azurewebsites.net/questions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: question }),
            });

            if (response.ok) {
                const data = await response.json();
                setAnswer(data.answer);
                setDocumentName(data.document_name);
                setHasAskedQuestion(true);
            } else {
                setAnswer('Sorry, I couldn\'t process your question. Please try again.');
            }
        } catch (error) {
            setAnswer('Sorry, I couldn\'t process your question. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAskAnother = () => {
        setQuestion('');
        setAnswer('');
        setDocumentName('');
        setHasAskedQuestion(false);
    };

    const handleFinish = () => {
        onNext();
    };

    return (
        <div className="question-answer-step">
            <h2>Step 3: Ask Questions</h2>
            <p>Ask questions about your uploaded documents</p>

            <div className="qa-container">
                <form onSubmit={handleSubmitQuestion} className="question-form">
                    <div className="question-input-group">
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Type your question here..."
                            rows="4"
                            className="question-input"
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={!question.trim() || isLoading}
                            className="ask-btn"
                        >
                            {isLoading ? 'Processing...' : 'Ask Question'}
                        </button>
                    </div>
                </form>

                {isLoading && (
                    <div className="loading-answer">
                        <div className="spinner"></div>
                        <p>Searching through your documents...</p>
                    </div>
                )}

                {answer && (
                    <div className="answer-section">
                        <h3>Answer:</h3>
                        <div className="answer-content">
                            <p>{answer}</p>
                        </div>

                        {documentName && (
                            <div className="source-section">
                                <h4>Source:</h4>
                                <p className="source-name">{documentName}</p>
                            </div>
                        )}

                        <div className="action-buttons">
                            <button onClick={handleAskAnother} className="ask-another-btn">
                                Ask Another Question
                            </button>
                            <button onClick={handleFinish} className="finish-btn">
                                Finish & Clear Documents
                            </button>
                        </div>
                    </div>
                )}

                {!hasAskedQuestion && !isLoading && (
                    <div className="qa-placeholder">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9,9h0a3,3,0,0,1,5.12,2.12A3,3,0,0,1,12,14"/>
                            <circle cx="12" cy="17.5" r=".5"/>
                        </svg>
                        <p>Ask your first question about the uploaded documents</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuestionAnswer;