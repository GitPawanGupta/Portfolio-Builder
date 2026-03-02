# Implementation Plan: Portfolio Builder System

## Overview

This implementation plan breaks down the Portfolio Builder System into incremental, testable steps. The system will be built using:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Vite + TailwindCSS
- **Testing**: Jest + fast-check for property-based testing

The implementation follows a bottom-up approach, starting with core backend functionality, then building the admin panel, and finally the public form.

## Tasks

- [x] 1. Project setup and infrastructure
  - Initialize monorepo structure with backend and frontend folders
  - Set up Node.js/Express backend with TypeScript configuration
  - Set up React/Vite frontend with TailwindCSS
  - Configure MongoDB connection with Mongoose
  - Set up environment variables (.env files)
  - Configure ESLint and Prettier for code quality
  - Initialize Git repository with .gitignore
  - _Requirements: All_

- [x] 2. Database models and schemas
  - [x] 2.1 Create Lead model with Mongoose schema
    - Define schema with all fields (name, email, phone, role, experienceYears, city, budget, message, resumeUrl, resumePath, status, assignedTo, notes, source, trackingId)
    - Add indexes for email, status, trackingId, createdAt
    - Add validation rules (required fields, email format, phone format)
    - Generate unique trackingId on creation
    - _Requirements: 1.1, 1.4, 1.6, 2.1, 3.1, 13.2_
  
  - [ ]* 2.2 Write property test for Lead model
    - **Property 5: Initial Lead Status**
    - **Validates: Requirements 1.6, 3.1**
  
  - [x] 2.3 Create Portfolio model with Mongoose schema
    - Define schema with leadId, templateId, portfolioUrl, pdfUrl, sentOnEmail, sentOnWhatsApp, sentAt
    - Add index for leadId
    - _Requirements: 8.1, 8.4, 9.4, 10.3_
  
  - [x] 2.4 Create Template model with Mongoose schema
    - Define schema with name, description, config, previewUrl, isActive
    - Add unique index for name
    - Create seed data for default template
    - _Requirements: 7.2, 7.5_
  
  - [ ]* 2.5 Write property test for default template
    - **Property 25: Default Template Existence**
    - **Validates: Requirements 7.5**
  
  - [x] 2.6 Create Admin model with Mongoose schema
    - Define schema with email, password, name, role, isActive, lastLogin
    - Add unique index for email
    - Add pre-save hook to hash passwords with bcrypt
    - _Requirements: 5.1, 15.7_
  
  - [ ]* 2.7 Write property test for password hashing
    - **Property 42: Password Security**
    - **Validates: Requirements 15.7**
  
  - [x] 2.8 Create ActivityLog model with Mongoose schema
    - Define schema with leadId, action, byAdminId, meta, createdAt
    - Add indexes for leadId and createdAt
    - _Requirements: 3.5, 4.3, 12.4_

- [x] 3. Core backend utilities and middleware
  - [x] 3.1 Create file storage service
    - Implement LocalFileStorage class for development
    - Implement S3FileStorage class for production (AWS SDK)
    - Create factory function to select storage based on environment
    - Add methods: uploadFile, getFileUrl, deleteFile, downloadFile
    - _Requirements: 1.5, 6.1, 6.2, 6.5, 6.6_
  
  - [ ]* 3.2 Write property test for file storage
    - **Property 4: Resume File Storage**
    - **Property 21: Resume File Uniqueness**
    - **Validates: Requirements 1.5, 6.1, 6.2**
  
  - [x] 3.3 Create JWT authentication middleware
    - Implement token generation function
    - Implement token verification middleware
    - Add error handling for invalid/expired tokens
    - _Requirements: 5.1, 5.3, 5.4_
  
  - [ ]* 3.4 Write property tests for authentication
    - **Property 18: Authentication Success**
    - **Property 19: Authentication Failure**
    - **Property 20: Authorization Token Validation**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
  
  - [x] 3.5 Create validation middleware
    - Implement request validation using express-validator
    - Create reusable validators for email, phone, file type, file size
    - Add error formatting middleware
    - _Requirements: 1.2, 1.3, 1.8, 15.2, 15.3_
  
  - [ ]* 3.6 Write property tests for validation
    - **Property 1: File Type Validation**
    - **Property 2: File Size Validation**
    - **Property 6: Input Validation Error Handling**
    - **Validates: Requirements 1.2, 1.3, 1.8**
  
  - [x] 3.7 Create rate limiting middleware
    - Implement rate limiter using express-rate-limit
    - Configure different limits for public and admin routes
    - _Requirements: 15.1_
  
  - [ ]* 3.8 Write property test for rate limiting
    - **Property 41: Rate Limiting Enforcement**
    - **Validates: Requirements 15.1**
  
  - [x] 3.9 Create error handling middleware
    - Implement global error handler
    - Format errors consistently
    - Sanitize error messages to prevent information leakage
    - Log errors with context
    - _Requirements: 16.1, 16.2, 16.5_
  
  - [ ]* 3.10 Write property tests for error handling
    - **Property 43: Error Response Format**
    - **Property 44: Error Message Security**
    - **Validates: Requirements 16.1, 16.2, 16.5**
  
  - [x] 3.11 Create CORS configuration
    - Configure CORS middleware with allowed origins
    - Set up environment-based configuration
    - _Requirements: 15.5_

- [x] 4. Authentication API endpoints
  - [x] 4.1 Implement POST /api/auth/login endpoint
    - Validate email and password
    - Find admin by email
    - Compare password hash
    - Generate JWT token
    - Return token and admin info
    - Update lastLogin timestamp
    - _Requirements: 5.1, 5.2_
  
  - [ ]* 4.2 Write unit tests for login endpoint
    - Test successful login
    - Test invalid email
    - Test invalid password
    - Test inactive admin account
  
  - [x] 4.3 Implement GET /api/auth/me endpoint
    - Verify JWT token
    - Return current admin info
    - _Requirements: 5.3_
  
  - [ ]* 4.4 Write unit tests for me endpoint
    - Test with valid token
    - Test with invalid token
    - Test with expired token

- [x] 5. Public lead submission API
  - [x] 5.1 Implement POST /api/leads endpoint
    - Configure Multer for file upload
    - Validate form data (name, email, phone, role, etc.)
    - Validate resume file (type and size)
    - Upload resume to file storage
    - Extract UTM parameters for source tracking
    - Create lead record with status NEW
    - Generate unique tracking ID
    - Return success response with tracking ID
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.9_
  
  - [ ]* 5.2 Write property tests for lead submission
    - **Property 3: Lead Data Persistence**
    - **Property 7: Lead Source Capture**
    - **Validates: Requirements 1.4, 1.7, 1.9**
  
  - [x] 5.3 Implement GET /api/leads/track/:id endpoint
    - Find lead by tracking ID
    - Return lead status and basic info
    - _Requirements: 2.1_
  
  - [ ]* 5.4 Write unit tests for tracking endpoint
    - Test with valid tracking ID
    - Test with invalid tracking ID

- [ ] 6. Checkpoint - Test public API
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Admin leads management API
  - [x] 7.1 Implement GET /api/admin/leads endpoint
    - Add JWT authentication middleware
    - Parse query parameters (status, search, page, limit, sortBy, sortOrder)
    - Build MongoDB query with filters
    - Implement search across name, email, role fields
    - Implement pagination
    - Return leads array and pagination metadata
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 7.2 Write property tests for leads listing
    - **Property 8: Status Filtering**
    - **Property 9: Search Functionality**
    - **Property 10: Pagination Consistency**
    - **Validates: Requirements 2.2, 2.3, 2.4**
  
  - [x] 7.3 Implement GET /api/admin/leads/:id endpoint
    - Add JWT authentication middleware
    - Find lead by ID with populated notes and assignedTo
    - Find associated portfolio if exists
    - Find activity log entries for the lead
    - Return complete lead details
    - _Requirements: 2.5, 2.6, 2.7, 12.5_
  
  - [ ]* 7.4 Write property test for lead details
    - **Property 11: Lead Detail Completeness**
    - **Property 37: Activity Log Retrieval**
    - **Validates: Requirements 2.5, 2.6, 2.7, 12.5**
  
  - [x] 7.5 Implement PATCH /api/admin/leads/:id endpoint
    - Add JWT authentication middleware
    - Validate status transitions if status is being updated
    - Update lead fields (status, assignedTo)
    - Add note to notes array if note text provided
    - Create activity log entry for status changes
    - Create activity log entry for note additions
    - Return updated lead
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.3_
  
  - [ ]* 7.6 Write property tests for lead updates
    - **Property 12: Status Transition Validation**
    - **Property 13: Status Change Persistence**
    - **Property 14: Activity Logging Completeness**
    - **Property 15: Note Persistence**
    - **Property 16: Note Chronological Ordering**
    - **Property 17: Note Immutability**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4**

- [ ] 8. Resume file handling API
  - [ ] 8.1 Implement GET /api/admin/resumes/:filename endpoint
    - Add JWT authentication middleware
    - Get file from file storage
    - Set appropriate Content-Type header based on file extension
    - Set Content-Disposition header for download
    - Stream file to response
    - _Requirements: 6.3_
  
  - [ ]* 8.2 Write property test for resume download
    - **Property 22: Resume Download Headers**
    - **Validates: Requirements 6.3**

- [x] 9. Template management API
  - [x] 9.1 Implement GET /api/admin/templates endpoint
    - Add JWT authentication middleware
    - Find all active templates
    - Return templates with name, description, config, previewUrl
    - _Requirements: 7.1, 7.4_
  
  - [ ]* 9.2 Write property test for template listing
    - **Property 23: Template Listing Completeness**
    - **Validates: Requirements 7.1, 7.4**
  
  - [x] 9.3 Implement POST /api/admin/templates endpoint
    - Add JWT authentication middleware
    - Validate template data
    - Create template record
    - Return created template
    - _Requirements: 7.2_
  
  - [x] 9.4 Implement PATCH /api/admin/templates/:id endpoint
    - Add JWT authentication middleware
    - Validate template data
    - Update template record with timestamp
    - Return updated template
    - _Requirements: 7.3_
  
  - [ ]* 9.5 Write property test for template persistence
    - **Property 24: Template Persistence**
    - **Validates: Requirements 7.2, 7.3**

- [x] 10. Portfolio generation service
  - [x] 10.1 Create portfolio generator service
    - Implement function to fetch lead data
    - Implement function to fetch template config
    - Implement HTML generation using template engine (Handlebars or EJS)
    - Implement function to upload generated HTML to file storage
    - Optionally implement PDF generation using Puppeteer
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [x] 10.2 Implement POST /api/admin/portfolio/generate endpoint
    - Add JWT authentication middleware
    - Validate leadId and templateId
    - Call portfolio generator service
    - Create portfolio record with URLs
    - Create activity log entry
    - Return portfolio URLs
    - Handle errors and return descriptive messages
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [ ]* 10.3 Write property tests for portfolio generation
    - **Property 26: Portfolio Record Creation**
    - **Property 27: Portfolio URL Generation**
    - **Property 28: Portfolio PDF Generation**
    - **Property 29: Portfolio Generation Error Handling**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

- [x] 11. Email service and API
  - [x] 11.1 Create email service
    - Configure Nodemailer with SMTP settings from environment
    - Create email template for portfolio delivery
    - Implement function to send email with portfolio link
    - Implement function to attach PDF if provided
    - Personalize email with lead's name
    - _Requirements: 9.1, 9.2, 9.3, 9.7_
  
  - [x] 11.2 Implement POST /api/admin/portfolio/send endpoint (email)
    - Add JWT authentication middleware
    - Validate leadId and portfolioUrl
    - Fetch lead data
    - Call email service to send portfolio
    - Update portfolio record with sentOnEmail and sentAt
    - Create activity log entry
    - Handle errors without updating portfolio record
    - Return success response
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  
  - [ ]* 11.3 Write property tests for email delivery
    - **Property 30: Email Content Validation**
    - **Property 31: Email PDF Attachment**
    - **Property 32: Email Delivery Tracking**
    - **Property 35: Delivery Failure Consistency**
    - **Validates: Requirements 9.2, 9.3, 9.4, 9.6, 9.7**

- [x] 12. WhatsApp service and API
  - [x] 12.1 Create WhatsApp service
    - Configure Twilio or Meta WhatsApp Cloud API with credentials from environment
    - Create message template for portfolio delivery
    - Implement function to send WhatsApp message with portfolio link
    - Personalize message with lead's name
    - _Requirements: 10.1, 10.2, 10.6_
  
  - [x] 12.2 Implement POST /api/admin/portfolio/send endpoint (WhatsApp)
    - Add JWT authentication middleware
    - Validate leadId and portfolioUrl
    - Fetch lead data
    - Call WhatsApp service to send portfolio
    - Update portfolio record with sentOnWhatsApp and sentAt
    - Create activity log entry
    - Handle errors without updating portfolio record
    - Return success response
    - _Requirements: 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [ ]* 12.3 Write property tests for WhatsApp delivery
    - **Property 33: WhatsApp Message Content**
    - **Property 34: WhatsApp Delivery Tracking**
    - **Property 35: Delivery Failure Consistency**
    - **Validates: Requirements 10.2, 10.3, 10.5, 10.6**

- [x] 13. Dashboard and analytics API
  - [x] 13.1 Implement GET /api/admin/dashboard endpoint
    - Add JWT authentication middleware
    - Count leads by status (NEW, IN_PROGRESS, COMPLETED, REJECTED)
    - Count total leads
    - Return all counts
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ]* 13.2 Write property test for dashboard counts
    - **Property 36: Dashboard Count Accuracy**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

- [x] 14. CSV export API
  - [x] 14.1 Implement GET /api/admin/export/leads endpoint
    - Add JWT authentication middleware
    - Parse query parameters for filters (same as leads list)
    - Build MongoDB query with filters
    - Fetch all matching leads
    - Generate CSV with columns: name, email, phone, role, experienceYears, city, budget, status, source, createdAt
    - Set Content-Type: text/csv header
    - Set Content-Disposition header for download
    - Stream CSV to response
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  
  - [ ]* 14.2 Write property tests for CSV export
    - **Property 38: CSV Export Completeness**
    - **Property 39: CSV Export Filtering**
    - **Property 40: CSV Download Headers**
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4**

- [ ] 15. Checkpoint - Test all backend APIs
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Frontend project setup
  - [x] 16.1 Initialize React app with Vite
    - Create React app using Vite template
    - Install dependencies: react-router-dom, axios, react-hook-form, zod, @tanstack/react-query
    - Configure TailwindCSS
    - Set up folder structure (components, pages, services, hooks, utils)
    - _Requirements: All frontend_
  
  - [x] 16.2 Create API service layer
    - Create axios instance with base URL
    - Create API functions for all endpoints
    - Add request interceptor to attach JWT token
    - Add response interceptor for error handling
    - _Requirements: All frontend_
  
  - [x] 16.3 Create authentication context
    - Create AuthContext with login, logout, and user state
    - Create ProtectedRoute component for admin routes
    - Store JWT token in localStorage or sessionStorage
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 17. Public lead form (frontend)
  - [x] 17.1 Create LeadForm component
    - Create form with fields: name, email, phone, role, experienceYears, city, budget, message
    - Implement form validation using React Hook Form + Zod
    - Add file upload component for resume
    - Validate file type (PDF, DOC, DOCX) on client side
    - Validate file size (max 10MB) on client side
    - Show upload progress
    - Handle form submission to POST /api/leads
    - Display success message with tracking ID on success
    - Display validation errors inline
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 1.8_
  
  - [x] 17.2 Create FileUpload component
    - Accept file input with drag-and-drop
    - Show file preview/name
    - Show upload progress bar
    - Display file validation errors
    - _Requirements: 1.2, 1.3_
  
  - [x] 17.3 Create SuccessMessage component
    - Display thank you message
    - Display tracking ID prominently
    - Provide option to submit another form
    - _Requirements: 1.7_
  
  - [ ]* 17.4 Write component tests for public form
    - Test form rendering
    - Test form validation
    - Test file upload
    - Test successful submission

- [x] 18. Admin authentication pages (frontend)
  - [x] 18.1 Create Login page
    - Create login form with email and password fields
    - Implement form validation
    - Handle login submission
    - Store JWT token on success
    - Redirect to dashboard on success
    - Display authentication errors
    - _Requirements: 5.1, 5.2_
  
  - [ ]* 18.2 Write component tests for login page
    - Test form rendering
    - Test successful login
    - Test failed login

- [x] 19. Admin dashboard page (frontend)
  - [x] 19.1 Create Dashboard component
    - Fetch dashboard data from GET /api/admin/dashboard
    - Display count cards for each status (NEW, IN_PROGRESS, COMPLETED, REJECTED)
    - Display total leads count
    - Add navigation links to leads list
    - Style with TailwindCSS
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ]* 19.2 Write component tests for dashboard
    - Test data fetching
    - Test count display

- [x] 20. Admin leads list page (frontend)
  - [x] 20.1 Create LeadsList component
    - Fetch leads from GET /api/admin/leads
    - Display leads in a table with columns: name, email, phone, role, status, created date
    - Implement status filter dropdown
    - Implement search input with debouncing
    - Implement pagination controls
    - Add click handler to navigate to lead detail
    - Style status badges with colors
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 20.2 Create StatusBadge component
    - Display status with appropriate color
    - NEW: blue, IN_PROGRESS: yellow, COMPLETED: green, REJECTED: red
    - _Requirements: 2.1_
  
  - [ ]* 20.3 Write component tests for leads list
    - Test table rendering
    - Test filtering
    - Test search
    - Test pagination

- [x] 21. Admin lead detail page (frontend)
  - [x] 21.1 Create LeadDetail component
    - Fetch lead details from GET /api/admin/leads/:id
    - Display all lead information in sections
    - Display resume download button
    - Display notes section
    - Display activity log section
    - Add status update dropdown
    - Add note input and submit button
    - Add portfolio generation section
    - Add portfolio sending section (email/WhatsApp buttons)
    - Handle all update actions
    - _Requirements: 2.5, 2.6, 2.7, 3.2, 3.3, 4.1, 12.5_
  
  - [x] 21.2 Create NotesSection component
    - Display all notes in chronological order
    - Show note text, author, and timestamp
    - Add form to add new note
    - Handle note submission
    - _Requirements: 4.1, 4.2_
  
  - [x] 21.3 Create PortfolioSection component
    - Display template selection dropdown
    - Add generate portfolio button
    - Display portfolio URL when generated
    - Add send via email button
    - Add send via WhatsApp button
    - Handle all portfolio actions
    - _Requirements: 8.1, 8.2, 9.2, 10.2_
  
  - [ ]* 21.4 Write component tests for lead detail
    - Test data display
    - Test status update
    - Test note addition
    - Test portfolio generation
    - Test portfolio sending

- [x] 22. Admin templates management page (frontend)
  - [x] 22.1 Create TemplatesList component
    - Fetch templates from GET /api/admin/templates
    - Display templates in a grid or list
    - Show template name, description, and preview
    - Add create new template button
    - Add edit template button for each template
    - _Requirements: 7.1, 7.4_
  
  - [x] 22.2 Create TemplateForm component
    - Create form for template name, description, and config
    - Handle create and update submissions
    - Display validation errors
    - _Requirements: 7.2, 7.3_
  
  - [ ]* 22.3 Write component tests for templates
    - Test templates list rendering
    - Test template creation
    - Test template editing

- [x] 23. Admin layout and navigation (frontend)
  - [x] 23.1 Create Layout component
    - Create sidebar with navigation links (Dashboard, Leads, Templates)
    - Create header with user info and logout button
    - Apply consistent styling
    - _Requirements: All admin pages_
  
  - [x] 23.2 Set up React Router
    - Configure routes for all pages
    - Add protected routes for admin pages
    - Add public route for lead form
    - Add 404 page
    - _Requirements: All pages_

- [x] 24. CSV export functionality (frontend)
  - [x] 24.1 Add export button to LeadsList component
    - Add export to CSV button
    - Call GET /api/admin/export/leads with current filters
    - Trigger file download
    - Show loading state during export
    - _Requirements: 14.1, 14.3, 14.4_
  
  - [ ]* 24.2 Write component test for CSV export
    - Test export button click
    - Test file download trigger

- [x] 25. Final integration and polish
  - [x] 25.1 Add loading states and error handling
    - Add loading spinners for all async operations
    - Add error toast notifications
    - Add success toast notifications
    - Handle network errors gracefully
    - _Requirements: 16.1, 16.2_
  
  - [x] 25.2 Add responsive design
    - Ensure all pages work on mobile devices
    - Test on different screen sizes
    - Adjust layouts for mobile
    - _Requirements: All frontend_
  
  - [x] 25.3 Add form validation feedback
    - Show inline validation errors
    - Show field-level error messages
    - Highlight invalid fields
    - _Requirements: 1.8, 16.4_
  
  - [x] 25.4 Create seed data script
    - Create script to seed database with sample admin user
    - Create script to seed default template
    - Document how to run seed script
    - _Requirements: 7.5_

- [ ] 26. Final checkpoint - End-to-end testing
  - Test complete workflow: lead submission → admin login → lead management → portfolio generation → portfolio delivery
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests should run with minimum 100 iterations
- Use fast-check library for property-based testing
- Mock external services (SMTP, WhatsApp, S3) in tests
- Checkpoints ensure incremental validation
- Frontend and backend can be developed in parallel after task 15
