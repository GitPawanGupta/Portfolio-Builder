# Requirements Document: Portfolio Builder System

## Introduction

The Portfolio Builder System is a lead management and portfolio generation platform that enables businesses to collect client information and resumes through a public form, manage leads through an admin panel, and generate professional portfolios that can be delivered via email or WhatsApp.

## Glossary

- **Lead**: A potential client who has submitted their information through the public form
- **Resume**: A document (PDF/DOC/DOCX) uploaded by the lead containing their professional experience
- **Portfolio**: A generated professional website or document showcasing a lead's work and experience
- **Template**: A pre-designed portfolio layout that can be applied to lead data
- **Admin**: An authenticated user with access to the admin panel
- **Status**: The current stage of a lead in the workflow (NEW, IN_PROGRESS, COMPLETED, REJECTED)
- **Activity_Log**: A record of actions performed on leads by admins
- **Public_Form**: The web form accessible to visitors for submitting lead information
- **Admin_Panel**: The authenticated interface for managing leads and portfolios
- **JWT**: JSON Web Token used for authentication
- **File_Storage**: The system for storing uploaded resumes (local or cloud)

## Requirements

### Requirement 1: Lead Submission

**User Story:** As a visitor, I want to submit my information and resume through a web form, so that I can request a professional portfolio.

#### Acceptance Criteria

1. WHEN a visitor accesses the public form, THE Public_Form SHALL display input fields for name, email, phone, role, experience years, city, budget, and message
2. WHEN a visitor uploads a resume file, THE Public_Form SHALL validate that the file is PDF, DOC, or DOCX format
3. WHEN a visitor uploads a resume file, THE Public_Form SHALL validate that the file size does not exceed 10MB
4. WHEN a visitor submits the form with valid data, THE System SHALL save the lead data to the database
5. WHEN a visitor submits the form with valid data, THE System SHALL save the resume file to File_Storage
6. WHEN a lead is successfully created, THE System SHALL assign status NEW to the lead
7. WHEN a lead is successfully created, THE System SHALL display a thank you message with a tracking ID
8. IF a visitor submits invalid data, THEN THE Public_Form SHALL display validation error messages
9. WHEN form submission occurs, THE System SHALL capture the lead source from URL parameters

### Requirement 2: Lead Data Management

**User Story:** As an admin, I want to view and manage all submitted leads, so that I can track and process portfolio requests.

#### Acceptance Criteria

1. WHEN an admin accesses the leads list, THE Admin_Panel SHALL display all leads with their name, email, phone, role, status, and submission date
2. WHEN an admin applies a status filter, THE Admin_Panel SHALL display only leads matching the selected status
3. WHEN an admin enters a search term, THE Admin_Panel SHALL display leads matching the search term in name, email, or role fields
4. WHEN an admin views the leads list, THE Admin_Panel SHALL support pagination with configurable page size
5. WHEN an admin clicks on a lead, THE Admin_Panel SHALL display the lead detail view with all lead information
6. WHEN an admin views lead details, THE Admin_Panel SHALL provide a download link for the uploaded resume
7. WHEN an admin views lead details, THE Admin_Panel SHALL display all notes associated with the lead

### Requirement 3: Lead Status Workflow

**User Story:** As an admin, I want to update lead status through a defined workflow, so that I can track progress on each portfolio request.

#### Acceptance Criteria

1. WHEN a new lead is created, THE System SHALL set the initial status to NEW
2. WHEN an admin changes a lead status from NEW, THE System SHALL allow transition to IN_PROGRESS or REJECTED
3. WHEN an admin changes a lead status from IN_PROGRESS, THE System SHALL allow transition to COMPLETED or REJECTED
4. WHEN an admin changes a lead status, THE System SHALL save the status change with timestamp
5. WHEN an admin changes a lead status, THE System SHALL create an Activity_Log entry recording the change
6. THE System SHALL prevent invalid status transitions

### Requirement 4: Lead Notes Management

**User Story:** As an admin, I want to add notes to leads, so that I can track communication and decisions.

#### Acceptance Criteria

1. WHEN an admin adds a note to a lead, THE System SHALL save the note with the admin's ID and timestamp
2. WHEN an admin views lead details, THE Admin_Panel SHALL display all notes in chronological order
3. WHEN a note is added, THE System SHALL create an Activity_Log entry recording the action
4. THE System SHALL preserve all historical notes without modification

### Requirement 5: Authentication and Authorization

**User Story:** As an admin, I want to securely log in to the admin panel, so that only authorized users can manage leads.

#### Acceptance Criteria

1. WHEN an admin submits valid credentials, THE System SHALL generate a JWT token
2. WHEN an admin submits invalid credentials, THE System SHALL return an authentication error
3. WHEN an admin accesses a protected route, THE System SHALL validate the JWT token
4. WHEN a JWT token is invalid or expired, THE System SHALL return an authorization error
5. WHEN an admin logs out, THE System SHALL invalidate the session on the client side
6. THE System SHALL store JWT tokens securely using HTTP-only cookies or secure storage

### Requirement 6: Resume File Handling

**User Story:** As an admin, I want to view and download uploaded resumes, so that I can review candidate information.

#### Acceptance Criteria

1. WHEN a resume is uploaded, THE System SHALL store the file in File_Storage with a unique filename
2. WHEN a resume is uploaded, THE System SHALL save the file path or URL in the lead record
3. WHEN an admin requests a resume download, THE System SHALL serve the file with appropriate headers
4. WHEN an admin views a PDF resume, THE Admin_Panel SHALL display the resume inline in the browser
5. WHERE the environment is production, THE System SHALL store files in cloud storage (AWS S3, Cloudinary, or Google Cloud Storage)
6. WHERE the environment is development, THE System SHALL store files in the local filesystem

### Requirement 7: Portfolio Template Management

**User Story:** As an admin, I want to manage portfolio templates, so that I can offer different design options to clients.

#### Acceptance Criteria

1. WHEN an admin accesses the templates list, THE Admin_Panel SHALL display all available templates
2. WHEN an admin creates a new template, THE System SHALL save the template configuration to the database
3. WHEN an admin updates a template, THE System SHALL save the changes with a timestamp
4. WHEN an admin views templates, THE Admin_Panel SHALL display template name, description, and preview
5. THE System SHALL maintain at least one default template

### Requirement 8: Portfolio Generation

**User Story:** As an admin, I want to generate a portfolio for a lead using a selected template, so that I can create a professional showcase of their work.

#### Acceptance Criteria

1. WHEN an admin selects a template and generates a portfolio, THE System SHALL create a portfolio record linked to the lead
2. WHEN a portfolio is generated, THE System SHALL produce a hosted portfolio URL
3. WHEN a portfolio is generated, THE System SHALL optionally produce a PDF version
4. WHEN a portfolio is generated, THE System SHALL save the portfolio URL and PDF URL in the portfolio record
5. WHEN portfolio generation fails, THE System SHALL return a descriptive error message
6. WHEN a portfolio is generated, THE System SHALL create an Activity_Log entry

### Requirement 9: Portfolio Delivery via Email

**User Story:** As an admin, I want to send generated portfolios to leads via email, so that clients receive their portfolios promptly.

#### Acceptance Criteria

1. WHEN an admin sends a portfolio via email, THE System SHALL use the configured SMTP settings
2. WHEN an admin sends a portfolio via email, THE System SHALL include the portfolio URL in the email body
3. WHEN an admin sends a portfolio via email, THE System SHALL optionally attach the PDF version
4. WHEN an email is sent successfully, THE System SHALL update the portfolio record with sentOnEmail true and sentAt timestamp
5. WHEN an email is sent successfully, THE System SHALL create an Activity_Log entry
6. IF email sending fails, THEN THE System SHALL return an error message and not update the portfolio record
7. THE System SHALL personalize the email with the lead's name

### Requirement 10: Portfolio Delivery via WhatsApp

**User Story:** As an admin, I want to send generated portfolios to leads via WhatsApp, so that clients receive their portfolios through their preferred channel.

#### Acceptance Criteria

1. WHEN an admin sends a portfolio via WhatsApp, THE System SHALL use the configured WhatsApp API (Twilio or Meta WhatsApp Cloud)
2. WHEN an admin sends a portfolio via WhatsApp, THE System SHALL include the portfolio URL in the message
3. WHEN a WhatsApp message is sent successfully, THE System SHALL update the portfolio record with sentOnWhatsApp true and sentAt timestamp
4. WHEN a WhatsApp message is sent successfully, THE System SHALL create an Activity_Log entry
5. IF WhatsApp sending fails, THEN THE System SHALL return an error message and not update the portfolio record
6. THE System SHALL personalize the message with the lead's name

### Requirement 11: Dashboard Analytics

**User Story:** As an admin, I want to view summary statistics on the dashboard, so that I can monitor overall system activity.

#### Acceptance Criteria

1. WHEN an admin accesses the dashboard, THE Admin_Panel SHALL display the count of leads with status NEW
2. WHEN an admin accesses the dashboard, THE Admin_Panel SHALL display the count of leads with status IN_PROGRESS
3. WHEN an admin accesses the dashboard, THE Admin_Panel SHALL display the count of leads with status COMPLETED
4. WHEN an admin accesses the dashboard, THE Admin_Panel SHALL display the count of leads with status REJECTED
5. WHEN an admin accesses the dashboard, THE Admin_Panel SHALL display the total count of all leads

### Requirement 12: Activity Logging

**User Story:** As an admin, I want to track all actions performed on leads, so that I can maintain an audit trail.

#### Acceptance Criteria

1. WHEN an admin changes a lead status, THE System SHALL create an Activity_Log entry with action STATUS_CHANGED
2. WHEN an admin adds a note, THE System SHALL create an Activity_Log entry with action NOTE_ADDED
3. WHEN a portfolio is sent, THE System SHALL create an Activity_Log entry with action PORTFOLIO_SENT
4. WHEN an Activity_Log entry is created, THE System SHALL record the admin ID, lead ID, action type, metadata, and timestamp
5. WHEN an admin views lead details, THE Admin_Panel SHALL display the activity log for that lead

### Requirement 13: Lead Source Tracking

**User Story:** As an admin, I want to track where leads come from, so that I can measure marketing effectiveness.

#### Acceptance Criteria

1. WHEN a visitor submits the form, THE System SHALL capture UTM parameters from the URL
2. WHEN a lead is created, THE System SHALL save the source information (Facebook, Google, Direct, or custom)
3. WHEN an admin views lead details, THE Admin_Panel SHALL display the lead source
4. WHERE no UTM parameters are present, THE System SHALL record the source as Direct

### Requirement 14: Data Export

**User Story:** As an admin, I want to export leads to CSV, so that I can analyze data in external tools.

#### Acceptance Criteria

1. WHEN an admin requests a CSV export, THE System SHALL generate a CSV file containing all leads
2. WHEN generating CSV, THE System SHALL include columns for name, email, phone, role, experience years, city, budget, status, source, and created date
3. WHEN an admin applies filters before export, THE System SHALL export only the filtered leads
4. WHEN CSV generation is complete, THE System SHALL trigger a file download in the browser

### Requirement 15: Security and Rate Limiting

**User Story:** As a system administrator, I want to protect the system from abuse, so that the service remains available and secure.

#### Acceptance Criteria

1. WHEN the public form receives multiple submissions from the same IP, THE System SHALL enforce rate limiting to prevent spam
2. WHEN file uploads occur, THE System SHALL validate file types to prevent malicious uploads
3. WHEN file uploads occur, THE System SHALL enforce size limits to prevent resource exhaustion
4. WHEN API requests are made, THE System SHALL validate and sanitize all input data
5. THE System SHALL use CORS configuration to restrict API access to authorized domains
6. THE System SHALL store sensitive configuration in environment variables
7. THE System SHALL hash and salt passwords before storage

### Requirement 16: Error Handling and Logging

**User Story:** As a developer, I want comprehensive error handling and logging, so that I can troubleshoot issues effectively.

#### Acceptance Criteria

1. WHEN an error occurs in the API, THE System SHALL return appropriate HTTP status codes
2. WHEN an error occurs in the API, THE System SHALL return descriptive error messages
3. WHEN an error occurs, THE System SHALL log the error with stack trace and context
4. WHEN validation fails, THE System SHALL return field-specific error messages
5. THE System SHALL not expose sensitive information in error messages
