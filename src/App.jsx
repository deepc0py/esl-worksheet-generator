import React from 'react';
import { Link } from 'react-router-dom';
import ConversationGuide from './components/ConversationGuide';
import StudentForm from './components/StudentForm';
import { StudentProfile } from './components/StudentProfile';
import StudentProfileEditor from './components/StudentProfileEditor';
import { useAuth } from './lib/auth';

/**
 * Demo student data for development and testing purposes.
 * This object follows the Student type structure and provides
 * a realistic example of a Latin American ESL student profile.
 */
const demoStudent = {
  // Personal and Demographic Information
  name: "Maria González",
  gender: "Female",
  age_range: "25-30",
  native_language: "Spanish",
  other_languages: ["Portuguese"],
  english_level: "intermediate",

  // Professional Background
  job_title: "Software Developer",
  job_description: "Full-stack developer at a tech startup",
  industry: "Technology",
  years_of_experience: 3,
  work_environment: "hybrid",

  // Location and Living Situation
  hometown: "Mexico City, Mexico",
  current_city: "San Francisco, USA",
  years_in_current_country: 2,
  family_status: "Single",
  living_situation: "Shared apartment",

  // Personal Interests and Activities
  interests: ["Technology", "Photography", "Travel"],
  hobbies: ["Hiking", "Cooking", "Reading"],
  favorite_activities: ["Beach trips", "City exploration", "Coffee shop hopping"],
  sports: ["Yoga", "Swimming"],

  // English Learning Context
  reason_for_learning: "Career advancement and daily life in the US",
  english_usage_context: ["Work meetings", "Daily life", "Social situations"],
  learning_goals: ["Improve professional communication", "Reduce accent", "Build confidence"],
  preferred_learning_style: ["Visual", "Interactive"],

  // Cultural and Social Preferences
  favorite_foods: ["Tacos", "Sushi", "Pizza"],
  travel_experience: ["Mexico", "USA", "Brazil", "Spain"],
  cultural_interests: ["International movies", "World music", "Different cuisines"],
  music_preferences: ["Latin pop", "Rock", "Jazz"],
  communication_style: "Enthusiastic and engaging",
  group_work_preference: true,
  social_interests: ["Meeting new people", "Cultural exchange", "Language meetups"]
};

/**
 * App Component
 * 
 * The main application component that serves as the root layout for the ESL Worksheet Generator.
 * It implements a responsive design with a sticky header and footer, and organizes content
 * into a two-column layout for larger screens.
 * 
 * Layout Structure:
 * - Header: Sticky navigation with app title
 * - Main Content:
 *   - Left Column (60%): Conversation Guide for teachers
 *   - Right Column (40%): Student Interview form with sticky positioning
 *   - Full Width: Student Profile preview section
 * - Footer: App information
 */
function App() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#1a365d]">ESL Worksheet Generator</h1>
          <div className="flex items-center space-x-4">
            <Link to="/about" className="text-[#4a5568] hover:text-[#2d3748]">About Us</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-[#4a5568] hover:text-[#2d3748]">
                  {user?.username || 'Profile'}
                </Link>
                <button 
                  onClick={() => logout()}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[#4a5568] hover:text-[#2d3748]">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto py-12 px-6">
        <div className="grid gap-12">
          {/* Two Column Layout with Emphasized Guide */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Conversation Guide Section - Wider Column (60%) */}
            <section className="md:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#1a365d]">Teacher's Conversation Guide</h2>
              </div>
              <div className="w-full bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow duration-300">
                <ConversationGuide />
              </div>
            </section>

            {/* Student Interview Section - Narrower Column (40%) with Sticky Positioning */}
            <section className="md:col-span-2 space-y-4">
              <div className="sticky top-20 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-[#1a365d]">New Student Interview</h2>
                </div>
                <div className="w-full bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow duration-300">
                  <StudentForm />
                </div>
              </div>
            </section>
          </div>

          {/* Student Profile Preview Section - Full Width */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#1a365d]">Student Profile Preview</h2>
            </div>
            <div className="w-full bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow duration-300">
              <StudentProfile 
                student={demoStudent}
                profileImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
              />
            </div>
          </section>

          {/* Student Profile Editor Section - Full Width */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#1a365d]">Student Profile Editor</h2>
            </div>
            <div className="w-full bg-white p-6 rounded-lg border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow duration-300">
              <StudentProfileEditor studentId="demo" /> {/* Using "demo" as a placeholder ID */}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto py-6 text-center text-sm text-[#4a5568]">
          <p>ESL Worksheet Generator - A Professional Tool for Language Educators</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
