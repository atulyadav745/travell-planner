# 🧭 Travel Itinerary Planner

**Live Application:** [https://YOUR_DEPLOYED_URL_HERE](https://YOUR_DEPLOYED_URL_HERE)

---

## 📝 1. Project Overview

The **Travel Itinerary Planner** is a full-stack web application designed to simplify trip organization. Instead of manually juggling maps and spreadsheets, users can create a trip, select activities, and automatically generate an optimized, day-by-day itinerary.

This project fulfills the requirements of the **AI-Assisted Coding Interview Problem**, showcasing the ability to rapidly build a feature-complete product using modern web technologies and AI assistance.
The application includes a “smart” scheduling feature that groups nearby attractions to minimize travel time and avoid backtracking.

---

## ✨ 2. Core Features

* **Trip Creation:**
  Users can create a new trip by specifying a destination (hardcoded to Paris for this MVP) and travel dates.

* **Activity Selection:**
  Displays a master list of activities; users can add them to their trip’s “wishlist” in one click.

* **Smart Schedule Generation:**
  A “Reset & Optimize Schedule” button calls the backend to use the **Google Maps Directions API**, calculating the most efficient route and generating a daily itinerary.

* **Manual Itinerary Editing:**
  Fully editable itinerary via drag-and-drop, allowing reordering within or between days.

* **Shareable Link:**
  Generates a unique read-only itinerary link to share with others.

---

## 🧠 3. Tech Stack & Design Choices

| Component         | Technology           | Reasoning                                                                              |
| ----------------- | -------------------- | -------------------------------------------------------------------------------------- |
| **Framework**     | Next.js (TypeScript) | Combines frontend (React) and backend (API Routes) logic efficiently with SSR support. |
| **Database**      | PostgreSQL (Render)  | Robust relational database suitable for trip, activity, and schedule data.             |
| **ORM**           | Prisma               | Type-safe and schema-first ORM that simplifies data handling.                          |
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

## 🤖 5. AI Assistant Prompts Used

This project was developed with AI assistance. Below are the main prompt categories used during development.

<details>
<summary><strong>🧩 Block 1: Foundation & Setup</strong></summary>

**Prisma Schema Prompt:**

> “Generate a complete `schema.prisma` for a travel itinerary app with models Trip, Activity, and ScheduledActivity...”

**Seed Script Prompt:**

> “Create a TypeScript `prisma/seed.ts` script that populates the Activity table with sample Paris data...”

</details>

<details>
<summary><strong>⚙️ Block 2: Backend API Logic</strong></summary>

**Basic API Routes:**

> “Provide POST /api/trips, GET /api/trips/[tripId], and GET /api/activities routes using Prisma.”

**Core Algorithm:**

> “Implement POST /api/trips/[tripId]/generate-schedule that uses Google Maps Directions API with optimizedWaypointOrder.”

**Drag-and-Drop Update:**

> “Create PUT /api/trips/[tripId]/update-schedule to update ScheduledActivity records.”

</details>

<details>
<summary><strong>🎨 Block 3: Frontend UI & Functionality</strong></summary>

**Layout:**

> “Use MUI Grid to create a two-column planner layout.”

**Homepage Form:**

> “Create a form in app/page.tsx to start a new trip and redirect to /trip/[tripId].”

**Drag-and-Drop:**

> “Use Dnd Kit to make DayColumn and ActivityCard draggable between days.”

</details>

<details>
<summary><strong>🔗 Block 4: Sharing & Final Polish</strong></summary>

**Share Page:**

> “Build a read-only share page at app/share/[tripId]/page.tsx using server-side data fetching.”

**Share Button:**

> “Add a Share button that copies the trip URL and shows a Snackbar ‘Link Copied!’ message.”

</details>

---

✅ **End of README**

---

Would you like me to format this for **GitHub with emoji headings and collapsible sections (like docs style)** or keep it in **plain Markdown** for simpler rendering (e.g., npm or text viewers)?
