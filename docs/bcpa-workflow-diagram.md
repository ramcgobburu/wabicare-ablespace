# BCPA Appointment Workflow Diagram

## Complete Workflow Overview

```mermaid
graph TD
    A[Doctor Recommends BCPA] --> B[Parent Calls Office]
    B --> C[BCPA Admin Receives Call]
    C --> D[Create Patient Record]
    D --> E[Schedule Initial Assessment - Code 151]
    E --> F[Send Portal Link to Parent]
    F --> G[Parent Uploads Documents]
    G --> H[BCPA Reviews Documents]
    H --> I[Initial Assessment Appointment]
    I --> J[BCPA Completes Assessment]
    J --> K[Generate Assessment Report]
    K --> L[Parent Reviews & Signs Report]
    L --> M[Submit to Insurance]
    M --> N[Parent Calls for Next Steps]
    N --> O[Schedule Technician Sessions]
    O --> P[Plan 30 Hours Across Months]
    P --> Q[Distribute Sessions Automatically]
    Q --> R[Technician Sessions Begin]
    R --> S[Monitor Session Progress]
    S --> T[Schedule BCPA Follow-up - Code 155]
    T --> U[BCPA Follow-up Appointment]
    U --> V[Final Assessment]
    V --> W[Case Completion]

    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#f3e5f5
    style O fill:#e8f5e8
    style R fill:#e8f5e8
    style T fill:#f3e5f5
    style W fill:#e8f5e8
```

## Appointment Types and Codes

```mermaid
graph LR
    A[Appointment Types] --> B[Code 151 - Initial Assessment]
    A --> C[Code 155 - BCPA Follow-up]
    A --> D[Technician Sessions]
    
    B --> B1[Single Appointment]
    B --> B2[60-90 Minutes]
    B --> B3[Document Review]
    B --> B4[Assessment Report]
    
    C --> C1[Single Appointment]
    C --> C2[60 Minutes]
    C --> C3[Final Assessment]
    C --> C4[Case Closure]
    
    D --> D1[Multiple Sessions]
    D --> D2[30 Hours Total]
    D --> D3[2-5 Sessions/Week]
    D --> D4[60 Minutes Each]
    
    style B fill:#bbdefb
    style C fill:#c8e6c9
    style D fill:#f8bbd9
```

## System Architecture

```mermaid
graph TB
    subgraph "Frontend Components"
        A[BCPAAppointmentManager]
        B[BCPACalendarView]
        C[AppointmentScheduler]
        D[DocumentUploadPortal]
        E[PatientRecordManager]
    end
    
    subgraph "Core Types"
        F[BCPAAppointment]
        G[PatientRecord]
        H[DocumentUpload]
        I[TechnicianSessionPlan]
        J[BCPACalendar]
    end
    
    subgraph "Smart Features"
        K[AI Scheduling Engine]
        L[Drag & Drop Calendar]
        M[Document Management]
        N[Status Tracking]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    
    B --> F
    C --> F
    D --> G
    E --> G
    
    F --> K
    B --> L
    D --> M
    E --> N
    
    style A fill:#e3f2fd
    style K fill:#f3e5f5
    style L fill:#e8f5e8
    style M fill:#fff3e0
```

## Calendar System Features

```mermaid
graph TD
    A[BCPA Calendar System] --> B[Multiple Views]
    A --> C[Drag & Drop]
    A --> D[Smart Scheduling]
    A --> E[Conflict Detection]
    
    B --> B1[Month View]
    B --> B2[Week View]
    B --> B3[Day View]
    
    C --> C1[Move Appointments]
    C --> C2[Reschedule Instantly]
    C --> C3[Visual Feedback]
    
    D --> D1[AI Suggestions]
    D --> D2[Optimal Timing]
    D --> D3[Provider Availability]
    
    E --> E1[Real-time Checking]
    E --> E2[Automatic Prevention]
    E --> E3[Alternative Suggestions]
    
    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style D fill:#e8f5e8
```

## Document Management Flow

```mermaid
graph LR
    A[Parent Receives Portal Link] --> B[Secure Login]
    B --> C[Document Upload Interface]
    C --> D[File Selection]
    D --> E[Category Selection]
    E --> F[Upload Progress]
    F --> G[BCPA Review Queue]
    G --> H[Document Approval]
    H --> I[Patient Record Updated]
    
    style A fill:#e3f2fd
    style G fill:#fff3e0
    style I fill:#e8f5e8
```

## Technician Session Planning

```mermaid
graph TD
    A[Technician Session Planning] --> B[Input Total Hours]
    B --> C[Select Start Date]
    C --> D[Select End Date]
    D --> E[Choose Sessions per Week]
    E --> F[Select Session Duration]
    F --> G[AI Distribution Algorithm]
    G --> H[Generate Schedule]
    H --> I[Check Technician Availability]
    I --> J[Create Multiple Appointments]
    J --> K[Send Notifications]
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
    style J fill:#e8f5e8
```

## Status Workflow

```mermaid
stateDiagram-v2
    [*] --> New: Doctor Referral
    New --> AssessmentScheduled: BCPA Schedules
    AssessmentScheduled --> AssessmentCompleted: Assessment Done
    AssessmentCompleted --> TechnicianSessions: Parent Approves
    TechnicianSessions --> FollowUpScheduled: Sessions Complete
    FollowUpScheduled --> Completed: Follow-up Done
    Completed --> [*]
    
    note right of New: Patient record created
    note right of AssessmentScheduled: Code 151 appointment
    note right of TechnicianSessions: Multiple sessions scheduled
    note right of FollowUpScheduled: Code 155 appointment
    note right of Completed: Case closed
```

This comprehensive BCPA Appointment Workflow System provides a complete solution for managing the entire patient journey from initial referral to treatment completion, with intelligent scheduling, document management, and calendar integration.




