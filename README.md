# US Citizenship Test Practice

## Overview

The US Citizenship Test Practice is a web application designed to help users prepare for the United States citizenship test. This interactive quiz app provides a platform for users to test their knowledge of U.S. history, government, and civic responsibilities, which are essential components of the naturalization process.

## Features

- User Authentication: Sign up and sign in functionality for personalized experience.
- Interactive Quiz: Randomly generated questions from a database of citizenship test questions.
- Progress Tracking: Keep track of correct answers and overall progress.
- Explanations: Detailed explanations for each question to enhance learning.
- Responsive Design: Works seamlessly on desktop and mobile devices.

## Technology Stack

- Frontend: React.js with Next.js framework
- Backend: Next.js API routes
- Database: MongoDB
- Authentication: NextAuth.js
- Styling: Tailwind CSS and DaisyUI

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB database

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/us-citizenship-test-practice.git
   cd us-citizenship-test-practice
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Sign Up/Sign In**: 
   - Navigate to the Sign Up page to create a new account.
   - If you already have an account, use the Sign In option.

2. **Taking the Quiz**:
   - After signing in, you'll be directed to the quiz page.
   - Questions are presented one at a time.
   - Select an answer and click "Submit" to move to the next question.

3. **Viewing Explanations**:
   - After answering a question, you can view the explanation by clicking the "Show Explanation" button.

4. **Tracking Progress**:
   - Your progress is automatically saved and displayed, showing the number of correct answers and total questions attempted.

5. **Completing the Quiz**:
   - After answering all questions, you'll see your final score and have the option to retake the quiz.

## Project Structure

- `app/`: Contains the main application code
  - `components/`: React components used throughout the app
  - `pages/`: Next.js pages for routing
  - `api/`: API routes for backend functionality
- `lib/`: Utility functions and database connection
- `models/`: MongoDB schema definitions
- `public/`: Static assets

## Key Components

1. Sign Up Component:
   - Handles user registration and authentication.
   - Uses NextAuth for secure authentication.

2. Quiz Component:
   - Displays questions randomly from a database.
   - Tracks user answers and provides immediate feedback.

3. Progress Tracking:
   - Stores user progress in MongoDB.
   - Displays progress on the quiz page.