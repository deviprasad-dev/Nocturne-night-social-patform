# Nocturne - Night Owl Social Platform

## Overview

Nocturne is a social platform designed for night owls, insomniacs, and deep thinkers who are active during late-night hours. It provides a digital sanctuary for meaningful conversations, anonymous sharing, voice interactions, and various forms of creative expression. The platform features multiple specialized sections including diaries, whispers, mind mazes, night circles, and more.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables optimized for dark themes
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **Error Handling**: Global error boundaries and comprehensive error catching

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Dual support for both Replit Auth (primary) and Firebase Auth (deployment)
- **Real-time Communication**: WebSocket implementation for live chat features and random pairing
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

## Key Components

### Database Schema
The application uses PostgreSQL with the following main entities:
- **Users**: Supports both Firebase UID and Replit Auth IDs with flexible authentication
- **Sessions**: PostgreSQL-backed session storage for authentication persistence
- **Diaries**: Personal journal entries with privacy controls and mood tracking
- **Whispers**: Anonymous short messages with heart-based engagement
- **MindMaze**: Philosophical discussions and brain teasers with response tracking
- **NightCircles**: Group conversation rooms with member management
- **MidnightCafe**: Casual chat discussions with reply functionality
- **AmFounder**: 3AM entrepreneur insights with upvote system
- **StarlitSpeaker**: Voice/speech sharing platform with recording capabilities
- **MoonMessenger**: Private messaging system with real-time chat

### Authentication System
- **Dual Provider Support**: Seamlessly handles both Replit Auth and Firebase Auth
- **Session Storage**: PostgreSQL-backed sessions for reliable state persistence
- **User Management**: Unified user model that accommodates different authentication providers
- **Environment-Based Configuration**: Automatically adapts to deployment environment

### Real-time Features
- **WebSocket Manager**: Handles real-time chat, random user pairing, and voice sessions
- **Room Management**: Support for both private and public chat rooms with member tracking
- **Random Pairing**: Anonymous chat matching system for spontaneous connections
- **Live Activity Feed**: Real-time updates of platform activity and user interactions

### UI/UX Design
- **Dark Theme Focus**: Optimized for night-time usage with glassmorphism effects
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Animation System**: Smooth transitions and engaging micro-interactions

## Data Flow

1. **Authentication Flow**: Users authenticate through either Replit or Firebase, creating unified user profiles
2. **Content Creation**: Various content types (diaries, whispers, etc.) are created through forms and stored in PostgreSQL
3. **Real-time Updates**: WebSocket connections enable live chat and instant notifications
4. **State Management**: TanStack Query handles API calls, caching, and optimistic updates
5. **Privacy Controls**: Content visibility is managed through privacy settings and user permissions

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations and migrations
- **express**: Web server framework
- **ws**: WebSocket implementation for real-time features
- **passport**: Authentication middleware
- **@tanstack/react-query**: Client-side state management

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe CSS class composition

### Development Tools
- **typescript**: Type safety across the stack
- **vite**: Build tool and development server
- **drizzle-kit**: Database schema management and migrations

## Deployment Strategy

### Replit Deployment (Primary)
- **Environment**: Optimized for Replit hosting with automatic provisioning
- **Database**: Uses Neon PostgreSQL for production data storage
- **Authentication**: Replit Auth integration for seamless user experience
- **WebSocket**: Full support for real-time features

### Firebase Deployment (Alternative)
- **Hosting**: Firebase Hosting for static assets
- **Functions**: Firebase Functions for serverless API endpoints
- **Authentication**: Firebase Auth for user management
- **Configuration**: Separate Vite config for Firebase-optimized builds
- **Limitations**: WebSocket features may need alternative implementation using Firestore

### Build Process
- **Development**: `npm run dev` starts Vite dev server with Express API
- **Production**: `npm run build` creates optimized bundle with esbuild for server code
- **Database**: `npm run db:push` applies schema changes using Drizzle

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier
- Firebase configuration variables for deployment builds

The architecture prioritizes developer experience with TypeScript throughout, scalable real-time features, and flexible deployment options while maintaining a focus on the unique needs of night owl communities.