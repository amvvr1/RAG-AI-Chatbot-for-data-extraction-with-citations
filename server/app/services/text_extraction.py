from pathlib import Path
from PyPDF2 import PdfReader
import easyocr
from spire.doc import *
from spire.doc.common import *


class ExtractText:
    def __init__(self):
        self.text = []

    def read_document(self, file_path):
        try:
            path = Path(file_path)
            extension = path.suffix.lower()

            if extension == ".pdf":
                return self.pdf_extractor(file_path)
            
            elif extension in [".jpg", ".jpeg", ".png"]:
                return self.image_extractor(file_path)
            
            elif extension in [".docx", ".doc"]:
                return self.doc_extractor(file_path)
            
            elif extension == ".txt":
                return self.text_extractor(file_path)

        except Exception as e:
            return f"error {str(e)}"
        
        
    def pdf_extractor(self, file_path):
        reader = PdfReader(file_path)

        all_text = ""
        
        for page in reader.pages:
            all_text += page.extract_text()

        self.text.append(all_text)
        return all_text

    
    def image_extractor(self, file_path):
        reader = easyocr.Reader(['en'])
        img_txt = reader.readtext(file_path)

        extracted_text = " ".join([result[1] for result in img_txt])

        self.text.append(extracted_text)
        return extracted_text
    
    def doc_extractor(self, file_path):
        document = Document()

        document.LoadFromFile(file_path)

        doc_text = document.GetText()

        self.text.append(doc_text)
        return doc_text
    
    def text_extractor(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
                txt = file.read()
        
        self.text.append(txt)
        return txt
