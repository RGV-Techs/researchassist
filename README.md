# Autonomous Research Assistant

An AI-powered full-stack web application for academic paper discovery, summarization, and citation management.

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue) ![Deno](https://img.shields.io/badge/Deno-Edge_Functions-black)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Integrations](#api-integrations)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Screenshots](#screenshots)

---

## Overview

The **Autonomous Research Assistant** automates the traditionally manual process of literature review. Researchers can create projects, discover relevant papers from a corpus of 200M+ academic publications, receive AI-generated summaries and keyword extractions, and export formatted citations — all from a single interface.

---

## Features

| Feature | Description |
|---|---|
| **User Authentication** | Secure email-based signup/login with session management via JWT tokens |
| **Project Management** | Create, organize, and manage multiple research projects |
| **Paper Discovery** | Search 200M+ papers via the Semantic Scholar Academic Graph API |
| **AI Summarization** | Abstracts are condensed into 2-3 sentence summaries using Google Gemini 2.5 Flash |
| **Keyword Extraction** | AI-powered extraction of 5-7 key technical terms per paper |
| **Citation Generation** | Automatic formatting in APA, MLA, and IEEE styles |
| **Citation Export** | Bulk export citations as `.txt` files |
| **Presentation Generator** | Generate and download a 16-slide `.pptx` project presentation |

---

## Tech Stack

### Frontend
- **React 18** — Component-based UI with hooks
- **TypeScript** — Static type safety
- **Vite** — Fast HMR and optimized builds
- **Tailwind CSS** — Utility-first styling
- **ShadCN/UI** — Accessible, customizable component library (Radix UI primitives)
- **TanStack Query** — Server state management and caching
- **React Router v6** — Client-side routing
- **pptxgenjs** — Client-side PowerPoint generation

### Backend
- **PostgreSQL** — Relational database with Row-Level Security (RLS)
- **Deno Edge Functions** — Serverless API endpoints
- **JWT Authentication** — Secure session-based auth

### External APIs
- **Semantic Scholar Academic Graph API** — Paper metadata retrieval
- **Google Gemini 2.5 Flash** — LLM for summarization and keyword extraction

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Frontend (React)                    │
│  Landing ─── Auth ─── Dashboard ─── Project ─── PPT  │
└──────────────────────┬───────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼───────────────────────────────┐
│               Edge Functions (Deno)                   │
│          discover-papers/index.ts                     │
│   ┌─────────────┐   ┌─────────────┐                  │
│   │  Semantic    │   │  Gemini 2.5 │                  │
│   │  Scholar API │   │  Flash API  │                  │
│   └─────────────┘   └─────────────┘                  │
└──────────────────────┬───────────────────────────────┘
                       │ SQL
┌──────────────────────▼───────────────────────────────┐
│            PostgreSQL Database                        │
│   profiles  │  projects  │  papers                    │
│   (RLS enforced per user)                             │
└──────────────────────────────────────────────────────┘
```

---

## Database Schema

### `profiles`
| Column | Type | Description |
|---|---|---|
| id | UUID (PK) | References auth user |
| email | TEXT | User email |
| full_name | TEXT | Display name |
| created_at | TIMESTAMPTZ | Account creation |
| updated_at | TIMESTAMPTZ | Last update |

### `projects`
| Column | Type | Description |
|---|---|---|
| id | UUID (PK) | Auto-generated |
| user_id | UUID (FK → profiles) | Owner |
| name | TEXT | Project name |
| description | TEXT | Optional description |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update |

### `papers`
| Column | Type | Description |
|---|---|---|
| id | UUID (PK) | Auto-generated |
| project_id | UUID (FK → projects) | Parent project |
| title | TEXT | Paper title |
| authors | TEXT[] | Author list (array) |
| abstract | TEXT | Full abstract |
| summary | TEXT | AI-generated summary |
| keywords | TEXT[] | AI-extracted keywords |
| citation_apa | TEXT | APA formatted citation |
| citation_mla | TEXT | MLA formatted citation |
| citation_ieee | TEXT | IEEE formatted citation |
| year | INTEGER | Publication year |
| venue | TEXT | Journal/Conference |
| url | TEXT | Paper URL |
| external_id | TEXT | Semantic Scholar ID |

> All tables enforce **Row-Level Security** — users can only access their own data via `WHERE user_id = auth.uid()`.

---

## API Integrations

### Semantic Scholar API
- **Endpoint:** `https://api.semanticscholar.org/graph/v1/paper/search`
- **Fields:** title, authors, abstract, year, venue, url, paperId
- **Limit:** 5 papers per query (configurable)
- **No API key required** (public access)

### Google Gemini 2.5 Flash
- **Used for:**
  - Abstract summarization (2-3 sentence output)
  - Keyword extraction (5-7 terms, comma-separated)
- **Model:** `google/gemini-2.5-flash`

---

## Project Structure

```
src/
├── components/
│   ├── PaperCard.tsx          # Paper display with summary, keywords, citations
│   └── ui/                    # ShadCN/UI component library (40+ components)
├── data/
│   └── presentationContent.ts # Static content for PPTX slides
├── hooks/
│   ├── use-mobile.tsx         # Responsive breakpoint hook
│   └── use-toast.ts           # Toast notification hook
├── lib/
│   ├── pptGenerator.ts        # PowerPoint generation logic
│   └── utils.ts               # Utility functions (cn, etc.)
├── pages/
│   ├── Index.tsx               # Landing page with feature cards
│   ├── Auth.tsx                # Login / Signup page
│   ├── Dashboard.tsx           # Project management dashboard
│   ├── Project.tsx             # Paper discovery & citation view
│   ├── Presentation.tsx        # PPT preview & download
│   └── NotFound.tsx            # 404 page
├── App.tsx                     # Route definitions
├── main.tsx                    # Entry point
└── index.css                   # Global styles & design tokens

supabase/
└── functions/
    └── discover-papers/
        └── index.ts            # Edge function: search + AI processing
```

---

## Setup & Installation

### Prerequisites
- Node.js ≥ 18
- npm or bun

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/autonomous-research-assistant.git
cd autonomous-research-assistant

# 2. Install dependencies
npm install

# 3. Set environment variables
#    Create a .env file with:
#    VITE_SUPABASE_URL=<your-supabase-url>
#    VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>

# 4. Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Usage

1. **Sign Up** — Create an account with email and password
2. **Create Project** — Define a research topic/project on the dashboard
3. **Discover Papers** — Enter a research query (e.g., "transformer architecture") to fetch papers
4. **Review Results** — View AI summaries, keywords, and full abstracts
5. **Export Citations** — Download APA/MLA/IEEE citations as text files
6. **Generate Presentation** — Download a pre-built 16-slide `.pptx` overview

---

## License

This project was developed as an academic project for research assistance purposes.
