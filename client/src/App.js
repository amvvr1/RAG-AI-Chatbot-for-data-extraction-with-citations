import { useState } from 'react';
import './App.css';
import Header from './components/header';
import StepIndicator from './components/step_indicator';
import FileUpload from './components/file_upload';
import DocumentProcessing from './components/document_processing';
import QuestionAnswer from './components/question_answer';
import ClearDocuments from './components/clear_documents';
import UploadedFilesList from './components/uploaded_files_list';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const resetApp = () => {
    setCurrentStep(1);
    setUploadedFiles([]);
  };

  const renderCurrentStep = () => {
    switch(currentStep) {
      case 1:
        return <FileUpload onFilesUploaded={setUploadedFiles} onNext={nextStep} />;
      case 2:
        return <DocumentProcessing files={uploadedFiles} onNext={nextStep} />;
      case 3:
        return <QuestionAnswer onNext={nextStep} />;
      case 4:
        return <ClearDocuments onReset={resetApp} />;
      default:
        return <FileUpload onFilesUploaded={setUploadedFiles} onNext={nextStep} />;
    }
  };

  return (
    <div className="App">
      <div className='App-header'>
         <Header />
      </div>

      <div className='step-indicator'>
        <StepIndicator currentStep={currentStep} />
      </div>

      <div className='main-content'>
        {renderCurrentStep()}
      </div>

      {currentStep > 1 && (
        <div className='uploaded-files-sidebar'>
          <UploadedFilesList />
        </div>
      )}
    </div>
  );
}

export default App;