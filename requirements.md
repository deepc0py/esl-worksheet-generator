# Project Refactor and Integration Requirements

## Current Functionality to Preserve
- Frontend streams audio to local Whisper service
- Whisper service returns transcription to frontend
- Frontend submits transcription to backend
- Backend processes transcription and stores data

## Database Schema Changes
Replace all current models with the following SQLModel schema:

```python
from typing import Optional, Dict, Any
from datetime import datetime, date
from sqlmodel import SQLModel, Field, Relationship
from typing import List

# Base Tables
class StudentBase(SQLModel):
    profile_image_url: Optional[str] = None
    first_name: str
    last_name: str
    proficiency_level: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Student(StudentBase, table=True):
    student_id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relationships
    basic_info: Optional["BasicInformation"] = Relationship(back_populates="student")
    professional_background: Optional["ProfessionalBackground"] = Relationship(back_populates="student")
    personal_background: Optional["PersonalBackground"] = Relationship(back_populates="student")
    interests_hobbies: List["InterestHobby"] = Relationship(back_populates="student")
    learning_context: Optional["LearningContext"] = Relationship(back_populates="student")
    cultural_elements: Optional["CulturalElements"] = Relationship(back_populates="student")
    social_aspects: Optional["SocialAspects"] = Relationship(back_populates="student")
    interviews: List["Interview"] = Relationship(back_populates="student")
    classes: List["StudentClass"] = Relationship(back_populates="student")
    personalized_homeworks: List["PersonalizedHomework"] = Relationship(back_populates="student")
    personalized_activities: List["PersonalizedActivity"] = Relationship(back_populates="student")
    activity_groups: List["ActivityGroup"] = Relationship(back_populates="student")

# Student-Related Tables
class BasicInformation(SQLModel, table=True):
    basic_info_id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.student_id")
    date_of_birth: date
    email: str
    phone: str
    native_language: str
    current_address: str
    
    student: Student = Relationship(back_populates="basic_info")

class ProfessionalBackground(SQLModel, table=True):
    prof_background_id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.student_id")
    current_occupation: str
    company: str
    industry: str
    work_responsibilities: str
    years_of_experience: int
    education_level: str
    
    student: Student = Relationship(back_populates="professional_background")

class PersonalBackground(SQLModel, table=True):
    personal_background_id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.student_id")
    hometown: str
    country_of_origin: str
    family_background: str
    life_experiences: str
    personal_goals: str
    
    student: Student = Relationship(back_populates="personal_background")

class InterestHobby(SQLModel, table=True):
    interest_id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.student_id")
    category: str
    name: str
    description: str
    experience_years: int
    frequency: str
    
    student: Student = Relationship(back_populates="interests_hobbies")

class LearningContext(SQLModel, table=True):
    learning_context_id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.student_id")
    learning_goals: str
    preferred_learning_style: str
    previous_language_experience: str
    challenges: str
    strengths: str
    areas_for_improvement: str
    
    student: Student = Relationship(back_populates="learning_context")

class CulturalElements(SQLModel, table=True):
    cultural_elements_id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.student_id")
    cultural_background: str
    traditions: str
    value_systems: str
    cultural_practices: str
    dietary_preferences: str
    
    student: Student = Relationship(back_populates="cultural_elements")

class SocialAspects(SQLModel, table=True):
    social_aspects_id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.student_id")
    communication_style: str
    group_work_preference: str
    social_interests: str
    community_involvement: str
    interaction_preferences: str
    
    student: Student = Relationship(back_populates="social_aspects")

# Professor and Class-Related Tables
class Professor(SQLModel, table=True):
    professor_id: Optional[int] = Field(default=None, primary_key=True)
    first_name: str
    last_name: str
    email: str
    
    classes: List["Class"] = Relationship(back_populates="professor")

class Class(SQLModel, table=True):
    class_id: Optional[int] = Field(default=None, primary_key=True)
    professor_id: int = Field(foreign_key="professor.professor_id")
    class_name: str
    semester: str
    year: int
    proficiency_level: str
    
    professor: Professor = Relationship(back_populates="classes")
    students: List["StudentClass"] = Relationship(back_populates="class_")
    homework_templates: List["HomeworkTemplate"] = Relationship(back_populates="class_")
    activity_templates: List["ActivityTemplate"] = Relationship(back_populates="class_")
    interview_template: Optional["InterviewTemplate"] = Relationship(back_populates="class_")

class StudentClass(SQLModel, table=True):
    student_id: int = Field(foreign_key="student.student_id", primary_key=True)
    class_id: int = Field(foreign_key="class.class_id", primary_key=True)
    enrollment_date: date
    
    student: Student = Relationship(back_populates="classes")
    class_: Class = Relationship(back_populates="students")

# Interview-Related Tables
class InterviewTemplate(SQLModel, table=True):
    template_id: Optional[int] = Field(default=None, primary_key=True)
    class_id: int = Field(foreign_key="class.class_id")
    template_name: str
    questions: Dict[str, Any]
    instructions: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class_: Class = Relationship(back_populates="interview_template")
    interviews: List["Interview"] = Relationship(back_populates="template")

class Interview(SQLModel, table=True):
    interview_id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.student_id")
    class_id: int = Field(foreign_key="class.class_id")
    template_id: int = Field(foreign_key="interviewtemplate.template_id")
    interview_date: date
    transcript: str
    parsed_data: Dict[str, Any]
    interview_status: str
    parsing_status: str
    
    student: Student = Relationship(back_populates="interviews")
    template: InterviewTemplate = Relationship(back_populates="interviews")

# Homework and Activity-Related Tables
class HomeworkTemplate(SQLModel, table=True):
    template_id: Optional[int] = Field(default=None, primary_key=True)
    class_id: int = Field(foreign_key="class.class_id")
    name: str
    objective: str
    base_questions: Dict[str, Any]
    due_date: date
    
    class_: Class = Relationship(back_populates="homework_templates")
    personalized_homeworks: List["PersonalizedHomework"] = Relationship(back_populates="template")

class PersonalizedHomework(SQLModel, table=True):
    homework_id: Optional[int] = Field(default=None, primary_key=True)
    template_id: int = Field(foreign_key="homeworktemplate.template_id")
    student_id: int = Field(foreign_key="student.student_id")
    personalized_questions: Dict[str, Any]
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    generation_status: str
    
    template: HomeworkTemplate = Relationship(back_populates="personalized_homeworks")
    student: Student = Relationship(back_populates="personalized_homeworks")

class ActivityTemplate(SQLModel, table=True):
    template_id: Optional[int] = Field(default=None, primary_key=True)
    class_id: int = Field(foreign_key="class.class_id")
    name: str
    objective: str
    base_conversation_template: Dict[str, Any]
    
    class_: Class = Relationship(back_populates="activity_templates")
    personalized_activities: List["PersonalizedActivity"] = Relationship(back_populates="template")
    activity_groups: List["ActivityGroup"] = Relationship(back_populates="activity_template")

class PersonalizedActivity(SQLModel, table=True):
    activity_id: Optional[int] = Field(default=None, primary_key=True)
    template_id: int = Field(foreign_key="activitytemplate.template_id")
    student_id: int = Field(foreign_key="student.student_id")
    personalized_conversation: Dict[str, Any]
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    generation_status: str
    
    template: ActivityTemplate = Relationship(back_populates="personalized_activities")
    student: Student = Relationship(back_populates="personalized_activities")

class ActivityGroup(SQLModel, table=True):
    group_id: Optional[int] = Field(default=None, primary_key=True)
    activity_template_id: int = Field(foreign_key="activitytemplate.template_id")
    student_id_1: int = Field(foreign_key="student.student_id")
    student_id_2: int = Field(foreign_key="student.student_id")
    completion_date: date
    
    activity_template: ActivityTemplate = Relationship(back_populates="activity_groups")
    student: Student = Relationship(back_populates="activity_groups")

## Required Backend Structure
```
backend/
├── app/
    ├── api/
    │   ├── main.py
    │   ├── routes/
    │   │   ├── students.py
    │   │   ├── worksheets.py
    │   │   ├── transcriptions.py
    │   │   └── pdf.py
    ├── services/
    │   ├── conversation_analyzer.py
    │   ├── student_extractor.py
    │   ├── worksheet_extractor.py
    │   ├── content_generator.py
    │   └── pdf_generator.py
    └── core/
        ├── config.py
        └── dependencies.py
```

## Implementation Requirements

1. Database Changes:
- Remove existing models
- Implement new SQLModel schema
- Create migration scripts

2. New Service Integration:
- Implement service interfaces
- Add configuration for services
- Create dependency injection system

3. API Endpoints:
- Maintain existing transcription endpoint
- Add new worksheet endpoints
- Add PDF generation endpoints

4. Service Classes:

```python
# student_extractor.py
class StudentExtractionService:
    def process_transcription(self, transcription: str) -> Dict[str, Any]:
        # Extract student information
        pass

# worksheet_extractor.py
class WorksheetExtractionService:
    def extract_content(self, file: UploadFile) -> Dict[str, Any]:
        # Extract worksheet content
        pass

# content_generator.py
class ContentGenerationService:
    def generate(self, student: Student, template: Dict[str, Any]) -> Dict[str, Any]:
        # Generate personalized content
        pass

# pdf_generator.py
class PDFGenerationService:
    def create_pdf(self, content: Dict[str, Any]) -> str:
        # Generate PDF and return URL
        pass
```

5. API Routes:

```python
# worksheets.py
@router.post("/worksheets/upload")
async def upload_worksheet(
    file: UploadFile,
    class_id: int,
    template_type: str
)

@router.post("/worksheets/generate/{student_id}")
async def generate_personalized_worksheet(
    student_id: int,
    template_id: int
)

# transcriptions.py
@router.post("/transcriptions/")
async def process_transcription(
    transcription: TranscriptionCreate
)
```

6. Configuration:

```python
# config.py
class Settings:
    DATABASE_URL: str
    AI_SERVICE_URL: str
    AI_SERVICE_KEY: str
    PDF_SERVICE_URL: str
    STORAGE_PATH: str
```

## Behavior Requirements

1. Transcription Processing:
- Accept transcription from frontend
- Extract student information
- Store in appropriate tables
- Return processed result

2. Worksheet Processing:
- Accept PDF upload
- Extract content and structure
- Store as template
- Support personalization

3. Content Generation:
- Use student information
- Use worksheet template
- Generate personalized content
- Create PDF output

## Testing Requirements

1. Unit Tests:
- Test each service independently
- Mock external services
- Verify data transformations

2. Integration Tests:
- Test complete workflows
- Verify database operations
- Test file handling

## Security Requirements

1. Input Validation:
- Validate all input data
- Sanitize file uploads
- Verify file types

2. Authentication:
- Require authentication for all endpoints
- Validate user permissions
- Protect sensitive data

## Error Handling

1. Implement proper error handling:
- Service errors
- Database errors
- File processing errors
- External service errors

2. Return appropriate error responses:
- HTTP status codes
- Error messages
- Suggested actions

Please maintain existing functionality while implementing these changes. Ensure backward compatibility where possible.

## Frontend Integration

1. API Client Structure:
```typescript
// src/lib/api.ts
interface APIClient {
  // Existing Methods
  submitTranscription: (transcription: string) => Promise;
  
  // New Methods
  uploadWorksheet: (file: File, classId: number, type: string) => Promise;
  generateWorksheet: (studentId: number, templateId: number) => Promise;
  getStudentProfile: (studentId: number) => Promise;
  updateStudentProfile: (studentId: number, data: Partial) => Promise;
}

interface TranscriptionResponse {
  id: string;
  status: 'success' | 'processing' | 'failed';
  extracted_info?: StudentProfile;
}

interface TemplateResponse {
  template_id: number;
  status: string;
  preview_url?: string;
}

interface WorksheetResponse {
  worksheet_id: number;
  pdf_url: string;
  status: string;
}
```

2. Type Definitions:
```typescript
// src/types/student.ts
interface StudentProfile {
  student_id: number;
  profile_image_url?: string;
  first_name: string;
  last_name: string;
  proficiency_level: string;
  basic_info: BasicInformation;
  professional_background?: ProfessionalBackground;
  personal_background?: PersonalBackground;
  interests_hobbies: InterestHobby[];
  learning_context?: LearningContext;
  cultural_elements?: CulturalElements;
  social_aspects?: SocialAspects;
}

interface BasicInformation {
  date_of_birth: string;
  email: string;
  phone: string;
  native_language: string;
  current_address: string;
}

[Include all other interface definitions matching the backend models]

// src/types/worksheet.ts
interface WorksheetTemplate {
  template_id: number;
  class_id: number;
  name: string;
  objective: string;
  base_questions: any;
  due_date: string;
}
```

3. API Implementation:
```typescript
// src/lib/api.ts
export const api: APIClient = {
  // Existing implementation
  submitTranscription: async (transcription: string) => {
    const response = await fetch('/api/transcriptions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcription }),
    });
    return response.json();
  },

  // New implementations
  uploadWorksheet: async (file: File, classId: number, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('class_id', classId.toString());
    formData.append('template_type', type);

    const response = await fetch('/api/worksheets/upload', {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  generateWorksheet: async (studentId: number, templateId: number) => {
    const response = await fetch(`/api/worksheets/generate/${studentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ template_id: templateId }),
    });
    return response.json();
  },

  getStudentProfile: async (studentId: number) => {
    const response = await fetch(`/api/students/${studentId}`);
    return response.json();
  },

  updateStudentProfile: async (studentId: number, data: Partial) => {
    const response = await fetch(`/api/students/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
```

4. Component Updates:

```typescript
// src/components/StudentForm.tsx updates
const StudentForm = () => {
  // Existing state
  const [transcription, setTranscription] = useState('');
  
  // New state
  const [extractedInfo, setExtractedInfo] = useState(null);
  
  const handleTranscriptionComplete = async (transcription: string) => {
    try {
      const response = await api.submitTranscription(transcription);
      if (response.extracted_info) {
        setExtractedInfo(response.extracted_info);
      }
    } catch (error) {
      console.error('Error processing transcription:', error);
    }
  };
  
  // ... rest of component
};

// src/components/WorksheetUpload.tsx
const WorksheetUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const response = await api.uploadWorksheet(
        selectedFile,
        currentClassId,
        'homework'
      );
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
      console.error('Error uploading worksheet:', error);
    }
  };
  
  return (
    // Component JSX
  );
};

// src/components/WorksheetGeneration.tsx
const WorksheetGeneration = () => {
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null);
  
  const generateWorksheet = async (studentId: number, templateId: number) => {
    try {
      const response = await api.generateWorksheet(studentId, templateId);
      setGeneratedPdfUrl(response.pdf_url);
    } catch (error) {
      console.error('Error generating worksheet:', error);
    }
  };
  
  return (
    // Component JSX
  );
};
```

5. Component Integration:
```typescript
// src/App.tsx updates
function App() {
  return (
    
      {/* Existing components */}
      
        
          {/* New components */}
          
          
        
      
    
  );
}
```

6. Error Handling in Components:
```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return Error: {this.state.error?.message};
    }
    return this.props.children;
  }
}
```