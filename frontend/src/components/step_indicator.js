function StepIndicator({ currentStep }) {
    const steps = [
        { number: 1, label: "Upload" },
        { number: 2, label: "Process" },
        { number: 3, label: "Ask Questions" },
        { number: 4, label: "Complete" }
    ];

    return (
        <div className="step-indicator">
            {steps.map((step, index) => (
                <>
                    <div key={step.number} className="step-item">
                        <div className={`step ${currentStep === step.number ? 'active' : currentStep > step.number ? 'completed' : ''}`}>
                            {currentStep > step.number ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20,6 9,17 4,12"/>
                                </svg>
                            ) : (
                                step.number
                            )}
                        </div>
                        <span className="step-label">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && <div className="line"></div>}
                </>
            ))}
        </div>
    );
}

export default StepIndicator;