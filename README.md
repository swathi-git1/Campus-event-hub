# Campus Event Hub

Campus Event Hub is a role-based campus activity prototype for clubs, instructors, membership students, and public users.

---

## Run Locally
Double click **START-APP.bat** in this folder. It will automatically start the server and open **http://localhost:5173/** in your browser.

---

ahul.k@college.edu | 
ahul123 |
## Roles

- **Admin**: manages instructors, clubs, memberships, events, registrations, schedules, and attendance.
- **Instructor**: manages the assigned club, its membership queue, events, posters, rosters, and attendance.
- **Membership Student**: views eligible events, registers, and reviews attendance history.
- **Public User**: sees public events and public club information only.

## Event Workflow

`Admin -> Club -> Instructor -> Membership Student -> Event -> Registration -> Attendance Record`

Events support public, membership-only, and club-specific access. Instructors see registered contestants in an event-scoped roster, can mark attendance only for those registrations, and can print or export the roster.

## Prototype Boundary

This repository is a frontend prototype. Authentication and records currently use browser storage for demonstration. Production confidentiality requires a backend identity service, server-side authorization, durable database records, and protected file storage. Credentials must be provisioned outside source files and documentation before deployment.
