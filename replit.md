# Overview

This is a comprehensive medical assistant application called "MediCare Pro" that provides AI-powered healthcare tools and services. The system includes symptom checking, medical chatbot functionality, offline medical resources, doctor portal access, and health tracking features. It's built as a full-stack web application with modern technologies and focuses on providing accessible healthcare information and tools.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React SPA**: Modern React application using TypeScript with Vite as the build tool
- **UI Framework**: Shadcn/ui components with Radix UI primitives for consistent design
- **Styling**: Tailwind CSS with custom medical-themed color palette and responsive design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

## Backend Architecture
- **Server Framework**: Express.js with TypeScript for RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **Development Setup**: Hot module reloading with Vite middleware integration

## Core Features
- **Symptom Analysis**: Interactive body diagram with AI-powered symptom evaluation
- **Medical Chat**: Real-time AI assistant for medical questions and guidance
- **Voice Assistant**: Speech recognition and synthesis for hands-free interaction
- **Offline Support**: Service Worker with IndexedDB for offline medical resources
- **Doctor Portal**: Secure authentication system for healthcare professionals
- **Health Tracking**: Gamified health scoring and follow-up care management

## Database Schema
- **Users**: Patient information and health scores
- **Medical Records**: Symptom tracking with risk assessments and AI diagnoses
- **Follow-ups**: Care plan tracking with progress monitoring
- **Chat Messages**: AI conversation history
- **Doctors**: Healthcare professional verification and access
- **Medical Resources**: Offline-capable medical information and emergency guides

## AI Integration
- **OpenAI GPT-4**: Advanced medical reasoning and conversation capabilities
- **Risk Assessment**: Multi-level health risk categorization (LOW/MEDIUM/HIGH/CRITICAL)
- **Personalized Recommendations**: Tailored medical advice based on symptoms and history

## Offline Capabilities
- **Service Worker**: Caches essential medical resources for offline access
- **IndexedDB**: Local storage for emergency medical information
- **Progressive Web App**: Installable with offline-first design for critical features

# External Dependencies

## Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database queries and schema management
- **Connect-pg-simple**: PostgreSQL session store for user authentication

## AI and Medical Services
- **OpenAI API**: GPT-4 integration for medical reasoning and chat functionality
- **FDA OpenFDA API**: Drug information and interaction checking
- **Medical API Services**: External health data and drug interaction databases

## Frontend Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **TanStack Query**: Server state management with intelligent caching
- **React Hook Form**: Form validation and state management
- **Zod**: Runtime type validation and schema definition
- **Lucide React**: Consistent icon library optimized for React

## Development and Build Tools
- **Vite**: Fast development server and optimized production builds
- **TypeScript**: Type safety across the entire application stack
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **ESBuild**: Fast JavaScript bundling for server-side code

## Browser APIs and PWA
- **Web Speech API**: Voice recognition and synthesis capabilities
- **Service Workers**: Offline functionality and resource caching
- **IndexedDB**: Client-side database for offline medical resources
- **Notification API**: Health reminders and follow-up alerts