# Verification notes

- `npm run build` succeeds after installing dependencies.
- Browser at `http://localhost:5173/` renders a blank page.
- Browser console reports repeated React invalid hook call warnings and an error in `<ThemeProvider>`.
- Installed tree reports a single React 18.3.1 / React DOM 18.3.1 pair, so the runtime issue needs source/bundler diagnosis.

The supplied implementation plan is in `/home/ubuntu/upload/pasted_content.txt` and calls for instructor confidentiality, attendance/self-check-in, contestant PDF/CSV export, poster uploads, members-only gating, club hierarchy roles, and admin management.

## Sources inspected
- `src/App.jsx`
- `src/context/ThemeContext.jsx`
- `src/context/AuthContext.jsx`
- `src/context/DataContext.jsx`
- `src/pages/instructor/ManageEvents.jsx`
- `src/pages/admin/Dashboard.jsx`

## Existing feature coverage
Most requested domain fields and UI flows are already partially implemented in the current source. The priority is fixing runtime behavior, validating end-to-end flows, and filling concrete gaps found in testing.


## Runtime fix
The archive contained duplicate top-level dependency folders (`react/`, `react-dom/`, and other package trees) alongside the actual `node_modules/`. Removing those stray top-level package trees restored Vite development rendering. `vite.config.js` also now keeps React modules deduplicated. The landing page renders successfully in both production preview and development mode.


## Browser findings
In development mode, the seeded CSI advisor login reaches the instructor dashboard and Manage Events page. The sidebar is scoped to `CSI Chapter`, and Manage Events currently shows only the two CSI events. The page visibly includes poster thumbnails, access-level badges, venue PINs, contestant/attendance actions, PDF export, and CSV export.


## Access-control hardening
The shared data layer now validates event status, capacity, duplicate registrations, and approved-members-only enrollment. Venue PINs are normalized to four digits, and self check-in matches the logged-in student email exactly, rejects invalid PINs, and is idempotent. Student catalogs and registrations no longer use the old Ananya Rao / student ID fallback that could expose another student’s data. The legacy instructor switcher API was removed from auth context. `npm run build` passes after these changes.


## Student portal verification
The seeded Ananya Rao account reaches the student dashboard successfully. It shows the event catalog and the student’s existing event passes and approved CSI memberships.


## Access and attendance UI verification
The student catalog displays public and members-only badges. A direct visit to the Fine Arts members-only event as Ananya Rao shows the full poster, organizing team, and a clear “Join Fine Arts Chapter to Enroll” CTA with no enrollment button. My Registrations shows poster thumbnails, ticket IDs, verified attendance states, certificate eligibility, and a 4-digit PIN self-check-in input for the Robotics registration.


## Self-check-in verification
Submitting the correct Robotics venue PIN (`7219`) updates the student card immediately to “Attendance Confirmed: Present,” records the check-in time and “Self PIN Verified,” and unlocks certificate eligibility.


## Instructor portal verification
The CSI advisor fast sign-in returns to the CSI-only dashboard, which exposes scoped membership approvals, event scheduling, attendance desk, achievement publishing, and the advisor profile. No instructor switcher is visible.


## Instructor attendance verification
The CSI live attendance console displays only CSI events, the projected venue PIN, registered/present/pending counts, and an attendance percentage. Toggling Vikram S. from absent to present updated the roster, verification method, and metrics from 60% to 80%.


## Admin portal verification
The seeded administrator portal loads the campus-wide control center with 8 accredited clubs, 8 faculty advisors, 9 events, and student membership records. The default screen visibly lists one-to-one advisor allocations and reassignment controls.


## Admin membership verification
The admin Student Memberships tab supports search and status filtering. Filtering to Pending review isolated Vikram S.’s CSI application, and approving it changed the filter count from 1 pending / 5 approved to 0 pending / 6 approved while updating the admin metric and notifications.


## Final public verification
The landing page renders successfully after the final change, and all three upcoming event cards expose accessible poster images sourced from `posterUrl` / `coverImage`. Final `npm run build` completed successfully with Vite.
