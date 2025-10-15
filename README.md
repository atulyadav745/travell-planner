# 🧭 Travel Itinerary Planner

An AI-assisted travel itinerary planner that helps users organize their trips efficiently by automatically scheduling activities based on proximity, timing, and preferences.

## 🤖 Building with AI: The Journey

### 1. Problem Understanding with AI

#### Initial Prompting Strategy
- Started with broad problem exploration: "Help me build a travel itinerary planner"
- Refined with specific constraints:
  ```
  Requirements:
  - Users can create trips with dates and destination
  - Activities should be grouped by proximity
  - Daily schedules should respect time constraints
  - Drag-and-drop interface for manual adjustments
  ```

#### Key Components Identified Through AI Analysis
1. Trip Management
   - Create/view trips
   - Date and destination handling
2. Activity Management
   - Activity database
   - Proximity-based grouping
3. Schedule Optimization
   - Time-slot allocation
   - Duration management
4. User Interface
   - Interactive calendar view
   - Drag-and-drop functionality

### 2. Design & Architecture Planning

#### Technology Stack (AI-Assisted Decisions)
- **Frontend**: Next.js 14 + TypeScript
  - Why: Server components, file-based routing, TypeScript safety
- **UI Framework**: Material UI
  - Why: Rich component library, consistent design
- **Database**: PostgreSQL + Prisma
  - Why: Type safety, easy schema management
- **DnD Library**: @dnd-kit
  - Why: Accessible, customizable drag-and-drop

#### Architecture Decisions
```mermaid
graph TD
    A[Client] --> B[Next.js API Routes]
    B --> C[Prisma ORM]
    C --> D[PostgreSQL]
    B --> E[Scheduling Algorithm]
    E --> F[Proximity Groups]
    F --> G[Time Allocation]
```

### 3. Iterative Development Process

#### Phase 1: Core Database Schema
```typescript
// Initial AI-generated schema, refined through iterations
model Trip {
  id                 String   @id @default(cuid())
  destination        String
  startDate         DateTime
  endDate           DateTime
  scheduledActivities ScheduledActivity[]
}
```

#### Phase 2: Scheduling Algorithm Evolution
1. Initial Version: Simple day-based distribution
2. Added proximity grouping
3. Implemented time-slot optimization
4. Added priority-based sorting

### 4. Testing & Quality Assurance

#### Test Strategy
1. **Unit Tests**
   - Activity scheduling algorithm
   - Date handling utilities
2. **Integration Tests**
   - API endpoints
   - Database operations
3. **E2E Tests**
   - Trip creation flow
   - Schedule manipulation

#### Sample Test Data
```json
{
  "activities": [
    {
      "name": "Eiffel Tower Visit",
      "duration": 120,
      "location": {"lat": 48.8584, "lng": 2.2945}
    }
  ]
}
```
  Generates a unique read-only itinerary link to share with others.

---

## 🧠 3. Tech Stack & Design Choices

| Component         | Technology           | Reasoning                                                                              |
| ----------------- | -------------------- | -------------------------------------------------------------------------------------- |
| **Framework**     | Next.js (TypeScript) | Combines frontend (React) and backend (API Routes) logic efficiently with SSR support. |
| **Database**      | PostgreSQL (Render)  | Robust relational database suitable for trip, activity, and schedule data.             |
| **ORM**          | Prisma               | Type-safe and schema-first ORM that simplifies data handling.                          |
| **UI Library**    | Material-UI (MUI)    | Provides polished, production-ready components for rapid development.                  |
| **Drag-and-Drop** | Dnd Kit              | Lightweight and modern library for accessible drag-and-drop functionality.             |

---

## ⚙️ 4. Project Setup

### 🔧 Clone the Repository

```bash
git clone [your-repo-url]
cd travel-planner
```

### 📦 Install Dependencies

```bash
npm install
```

### 🔑 Environment Variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
```

### 🗄️ Run Migrations

```bash
npx prisma migrate dev
```

### 🌱 Seed the Database

```bash
npx prisma db seed
```

### 🚀 Run the Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## 🤖 5. AI-Assisted Development Process

Our development process was significantly enhanced through strategic collaboration with GitHub Copilot. Here's how we leveraged AI throughout the project:

### 🎯 Problem Understanding
- Used iterative prompting to break down complex features into manageable tasks
- Explored edge cases and potential user scenarios through AI-guided discussions
- Refined user stories and acceptance criteria with AI assistance

### 🏗️ Architecture & Design
- Generated initial schema designs with AI suggestions for optimization
- Explored technology trade-offs through guided discussions
- Refined API endpoints and data structures iteratively

### 💻 Implementation
- Utilized AI for scaffolding complex components
- Generated optimized database queries with proper indexes
- Implemented drag-and-drop functionality with accessibility in mind

### 🧪 Testing & Quality
- Generated comprehensive test cases for critical paths
- Implemented error handling and validation with AI guidance
- Conducted security review of implemented features

### 📝 Example Prompts Used

1. **Schema Design:**
   ```
   Help me design a schema for a travel planner app that needs to store trips,
   activities, and scheduling information.
   ```

2. **Drag-and-Drop Implementation:**
   ```
   How can I implement drag-and-drop for activities in a calendar view while
   maintaining accessibility and mobile support?
   ```

3. **Optimization:**
   ```
   Review my current trip fetching logic and suggest optimizations for
   reducing database queries and improving response time.
   ```

### 🔄 Iterative Refinement Process
1. Initial prompt for feature implementation
2. Review and refine generated code
3. Follow-up prompts for optimization
4. Final review and testing
5. Documentation updates

## 📚 6. Project Documentation

### 📋 API Documentation

#### Trip Management
- `POST /api/trips` - Create a new trip
- `GET /api/trips/[tripId]` - Get trip details
- `PUT /api/trips/[tripId]` - Update trip details
- `DELETE /api/trips/[tripId]` - Delete a trip

#### Activity Management
- `GET /api/activities` - List all activities
- `POST /api/activities` - Add a new activity
- `PUT /api/activities/[id]` - Update activity details

#### Schedule Management
- `POST /api/trips/[tripId]/schedule` - Update trip schedule
- `GET /api/trips/[tripId]/schedule` - Get trip schedule

### 🔒 Error Handling

The application implements comprehensive error handling:

```typescript
type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

// Example error response
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid trip dates provided",
  "details": {
    "startDate": "Must be before endDate",
    "endDate": "Must be after startDate"
  }
}
```

### 🎯 Future Enhancements

1. **Multi-City Trips**
   - Support for multiple destinations in a single trip
   - Transit time calculations between cities

2. **Social Features**
   - Trip sharing with collaborative editing
   - Public trip templates

3. **AI Integration**
   - Smart activity recommendations
   - Optimal schedule generation

4. **Mobile App**
   - Native mobile experience
   - Offline functionality

---

✅ **End of README**