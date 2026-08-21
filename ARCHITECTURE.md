# 🏛️ Retrivo — System Architecture & Flowcharts

This document contains complete visual architecture diagrams, user journey flows, matching engine pipelines, and database entity relationships for **Retrivo (AI-Powered Lost & Found Platform)**. All diagrams are formatted using standard [Mermaid.js](https://mermaid.js.org/) and render natively on GitHub.

---

## 📑 Table of Contents
1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [End-to-End User Journey Flowchart](#2-end-to-end-user-journey-flowchart)
3. [4-Factor AI Matching Engine Pipeline](#3-4-factor-ai-matching-engine-pipeline)
4. [Ownership Verification & Claim State Machine](#4-ownership-verification--claim-state-machine)
5. [Database Schema & Entity Relationship Diagram (ERD)](#5-database-schema--entity-relationship-diagram-erd)
6. [Security & Authentication Middleware Flow](#6-security--authentication-middleware-flow)

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph ClientLayer ["Client Layer (Port 3000)"]
        UI["Next.js App Router (TypeScript)"]
        Components["Glassmorphic UI Components"]
        Services["Client Services SDK"]
    end

    subgraph APILayer ["Backend API Layer (Port 5000)"]
        Express["Express.js Server"]
        Middleware["Auth & Upload Middleware (JWT / Multer)"]
        Controllers["Controllers (MVC Pattern)"]
        ServiceLayer["Business Service Layer"]
    end

    subgraph DataLayer ["Data & Storage Layer (Port 27017)"]
        MongoDB[(MongoDB Database)]
        Mongoose["Mongoose ORM Schemas & Indexes"]
    end

    subgraph AILayer ["AI Microservice Layer (Port 8000)"]
        FastAPI["FastAPI Python Microservice"]
        Transformer["Sentence-Transformers (all-MiniLM-L6-v2)"]
        EmbeddingEngine["Dense Vector Embedding & Cosine Engine"]
    end

    UI --> Components
    Components --> Services
    Services -- "HTTP REST (JSON / Multipart)" --> Express
    Express --> Middleware
    Middleware --> Controllers
    Controllers --> ServiceLayer
    ServiceLayer --> Mongoose
    Mongoose --> MongoDB
    ServiceLayer -- "Async HTTP (2s Timeout + Fallback)" --> FastAPI
    FastAPI --> Transformer
    Transformer --> EmbeddingEngine
```

---

## 2. End-to-End User Journey Flowchart

```mermaid
sequenceDiagram
    autonumber
    actor UserA as Finder (User A)
    actor UserB as Lost Owner (User B)
    participant Client as Next.js Web App
    participant Backend as Node.js Backend
    participant AI as Python AI Service
    participant DB as MongoDB

    Note over UserA,DB: Step 1: Finder Reports Found Item
    UserA->>Client: Fills "Report Found Item" + Verification Q&A
    Client->>Backend: POST /api/found-items (Multipart)
    Backend->>DB: Save FoundItem (status: 'active')
    Backend-->>Client: 201 Created

    Note over UserB,DB: Step 2: Owner Reports Lost Item & Triggers AI Match
    UserB->>Client: Fills "Report Lost Item"
    Client->>Backend: POST /api/lost-items (Multipart)
    Backend->>DB: Save LostItem (status: 'active')
    Backend->>AI: POST /api/text-similarity (Lost vs Active Found Items)
    AI-->>Backend: Semantic Cosine Score (0-100)
    Backend->>DB: Upsert Match (Score >= 40%)
    Backend->>DB: Create In-App Notifications for UserA & UserB
    Backend-->>Client: 201 Created (with Match Suggestions)

    Note over UserB,DB: Step 3: Owner Submits Ownership Claim
    UserB->>Client: Clicks "Claim Item" & Answers Finder's Questions
    Client->>Backend: POST /api/claims (Answers + Proof Note)
    Backend->>DB: Save Claim (status: 'pending')
    Backend->>DB: Create Notification for UserA
    Backend-->>Client: 201 Claim Submitted

    Note over UserA,DB: Step 4: Finder Reviews & Approves Claim
    UserA->>Client: Views Notification -> Reviews Claimant Q&A
    UserA->>Client: Clicks "Approve Ownership"
    Client->>Backend: PUT /api/claims/:id/approve
    Backend->>DB: Set Claim status = 'approved'
    Backend->>DB: Set FoundItem status = 'claimed'
    Backend->>DB: Atomic Auto-Reject other pending claims
    Backend->>DB: Notify UserB of Approval
    Backend-->>Client: 200 OK (Item Resolved!)
```

---

## 3. 4-Factor AI Matching Engine Pipeline

```mermaid
flowchart TD
    Start([New Lost/Found Item Event]) --> FetchPool[Fetch Active Candidate Items from DB]
    
    FetchPool --> Factor1[1. Category Check (Weight: 25%)]
    FetchPool --> Factor2[2. Semantic Text Engine (Weight: 30%)]
    FetchPool --> Factor3[3. Location Proximity (Weight: 25%)]
    FetchPool --> Factor4[4. Time Decay Factor (Weight: 20%)]

    Factor1 --> |Exact Match: 100 / Mismatch: 0| CalcComposite
    
    Factor2 --> CallAI{FastAPI Available?}
    CallAI -->|Yes| TransformerScore[all-MiniLM-L6-v2 Cosine Similarity]
    CallAI -->|No / Timeout > 2s| FallbackScore[Tokenized Word Jaccard + Substring Boost]
    TransformerScore --> CalcComposite
    FallbackScore --> CalcComposite

    Factor3 --> TokenOverlap[Token Overlap & Substring Match]
    TokenOverlap --> CalcComposite

    Factor4 --> LinearDecay[Max(0, 100 - DaysDiff × 5%)]
    LinearDecay --> CalcComposite

    CalcComposite[Composite Score Formula:\n0.25*Cat + 0.30*Text + 0.25*Loc + 0.20*Time] --> SanityCheck{Category Match?}
    SanityCheck -->|No| CapScore[Cap Total Score at 30%]
    SanityCheck -->|Yes| RawScore[Final Score 0 - 100%]
    
    CapScore --> ThresholdCheck{Score >= 40%?}
    RawScore --> ThresholdCheck
    
    ThresholdCheck -->|Yes| SaveMatch[Upsert Match in DB & Dispatch Alerts]
    ThresholdCheck -->|No| Discard[Ignore Sub-Threshold Candidate]
```

---

## 4. Ownership Verification & Claim State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending: Claimant Submits Answers to Verification Questions
    
    state Pending {
        [*] --> AwaitingReview
        AwaitingReview --> FinderReviewing: Finder Opens Claim
    }

    Pending --> Approved: Finder Verifies Answers & Approves
    Pending --> Rejected: Finder Rejects Claim OR Competing Claim Approved

    state Approved {
        [*] --> ItemClaimed: Set FoundItem.status = 'claimed'
        ItemClaimed --> CompetingAutoRejected: Auto-Reject Other Pending Claims
        CompetingAutoRejected --> [*]
    }

    state Rejected {
        [*] --> Notified: Send Rejection Reason Notification
        Notified --> [*]
    }

    Approved --> [*]
    Rejected --> [*]
```

---

## 5. Database Schema & Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ LOST_ITEM : "reports"
    USER ||--o{ FOUND_ITEM : "reports"
    USER ||--o{ CLAIM : "submits"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ ADMIN_LOG : "performs action"

    LOST_ITEM ||--o{ MATCH : "linked in"
    FOUND_ITEM ||--o{ MATCH : "linked in"
    FOUND_ITEM ||--o{ CLAIM : "targeted by"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password "bcrypt hash"
        string role "user | admin"
        string avatar
        string phone
        date createdAt
    }

    LOST_ITEM {
        ObjectId _id PK
        ObjectId user FK
        string title
        string description
        string category
        string location
        date date
        string[] images
        string status "active | matched | resolved | closed"
        boolean isFlagged
        string flagReason
        date createdAt
    }

    FOUND_ITEM {
        ObjectId _id PK
        ObjectId user FK
        string title
        string description
        string category
        string location
        string handoverLocation
        string[] verificationQuestions
        date date
        string[] images
        string status "active | matched | claimed | closed"
        boolean isFlagged
        string flagReason
        date createdAt
    }

    MATCH {
        ObjectId _id PK
        ObjectId lostItem FK
        ObjectId foundItem FK
        number matchScore "0 - 100"
        object breakdown "text, loc, time, cat"
        string status "pending | confirmed | rejected"
        date createdAt
    }

    CLAIM {
        ObjectId _id PK
        ObjectId foundItem FK
        ObjectId claimant FK
        object[] verificationAnswers "question, answer"
        string proofMessage
        string status "pending | approved | rejected"
        ObjectId reviewedBy FK
        string rejectionReason
        date createdAt
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId user FK
        string type "match_found | claim_submitted | claim_approved | ..."
        string title
        string message
        ObjectId relatedItem
        string link
        boolean isRead
        date createdAt
    }

    ADMIN_LOG {
        ObjectId _id PK
        ObjectId admin FK
        string action "delete_item | flag_item | block_user | ..."
        string targetType "LostItem | FoundItem | User | Claim"
        ObjectId targetId
        object details
        date createdAt
    }
```

---

## 6. Security & Authentication Middleware Flow

```mermaid
flowchart LR
    IncomingReq[Incoming Client Request] --> AuthCheck{Protected Route?}
    
    AuthCheck -->|No| Controller[Route Controller Handler]
    AuthCheck -->|Yes| HeaderCheck{Authorization Header Present?}
    
    HeaderCheck -->|No| Error401[401 Unauthorized: No Token]
    HeaderCheck -->|Yes| VerifyJWT{jwt.verify Secret & Expiry}
    
    VerifyJWT -->|Invalid / Expired| Error401Invalid[401 Unauthorized: Invalid Token]
    VerifyJWT -->|Valid| AttachUser[Fetch User & Attach to req.user]
    
    AttachUser --> AdminCheck{Admin Route?}
    AdminCheck -->|No| Controller
    AdminCheck -->|Yes| CheckRole{req.user.role == 'admin'?}
    
    CheckRole -->|No| Error403[403 Forbidden: Admin Access Required]
    CheckRole -->|Yes| Controller
    
    Controller --> AuditLog[Execute Action & Record in AdminLog]
    AuditLog --> Response([200/201 JSON Response])
```
