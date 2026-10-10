import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

FIGURES_DIR = 'Campus_Event_Hub_Report/figures'
os.makedirs(FIGURES_DIR, exist_ok=True)

def generate_tree(title, lines, filename, w=4.0, h=3.0):
    fig, ax = plt.subplots(figsize=(w, h), dpi=220)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    rect = patches.FancyBboxPatch((2, 2), 96, 96, boxstyle="round,pad=1.0,rounding_size=2.0",
                                  linewidth=1.0, edgecolor='#CBD5E1', facecolor='#F8FAFC')
    ax.add_patch(rect)

    # Header bar
    h_bar = patches.Rectangle((2, 85), 96, 13, linewidth=1.0, edgecolor='#CBD5E1', facecolor='#E2E8F0')
    ax.add_patch(h_bar)
    ax.text(6, 91.5, title, fontsize=8.5, fontweight='bold', color='#1E293B', va='center')

    curr_y = 78
    n_lines = len(lines)
    y_step = 72.0 / max(n_lines, 1)
    
    for line in lines:
        is_dir = line.endswith('/') or line.startswith('📁') or 'folder' in line.lower()
        col = '#1E3A8A' if is_dir else '#334155'
        weight = 'bold' if is_dir else 'normal'
        ax.text(6, curr_y, line, fontsize=7.2, color=col, fontweight=weight, family='monospace', va='top')
        curr_y -= y_step

    plt.tight_layout(pad=0.1)
    plt.savefig(os.path.join(FIGURES_DIR, filename), bbox_inches='tight', dpi=220)
    plt.close()
    print(f'Generated {filename}')

trees = [
    ("Fig 8.1.1 Highlevel view of project", [
        "campus-event-hub-final/",
        "  server/",
        "  src/",
        "  public/",
        "  package.json",
        "  vite.config.js",
        "  Dockerfile",
        "  nginx.conf",
        "  START-APP.bat"
    ], "fig_8.1.1_highlevel_project.png", 3.8, 2.2),

    ("Fig 8.1.2 Backend Folder Structure", [
        "server/",
        "  apiRouter.js",
        "  assistant.js",
        "  auth.js",
        "  db.js",
        "  mongoConnection.js",
        "  notificationService.js",
        "  rateLimiter.js",
        "  vitePlugin.js",
        "  index.js"
    ], "fig_8.1.2_backend_folder.png", 3.4, 2.6),

    ("Fig 8.1.3 Config & Database Connection Structure", [
        "server/config/",
        "  mongoConnection.js",
        "  db.js (in-memory & sync)",
        "  .env",
        "  Dockerfile"
    ], "fig_8.1.3_config_folder.png", 3.4, 1.6),

    ("Fig 8.1.4 Router & Controller Modules", [
        "server/controllers/",
        "  authController.js",
        "  clubController.js",
        "  eventController.js",
        "  membershipController.js",
        "  attendanceController.js",
        "  odController.js",
        "  reportController.js",
        "  assistant.js (Gemini AI)"
    ], "fig_8.1.4_controller_folder.png", 3.4, 2.5),

    ("Fig 8.1.5 Server Middleware Structure", [
        "server/middleware/",
        "  auth.js (JWT verify + roles)",
        "  rateLimiter.js (IP throttling)",
        "  corsPolicy.js",
        "  securityHeaders.js"
    ], "fig_8.1.5_middleware_folder.png", 3.4, 1.7),

    ("Fig 8.1.6 Database Models & Collections", [
        "server/models/",
        "  User.js",
        "  Student.js",
        "  Instructor.js",
        "  Club.js",
        "  Event.js",
        "  Registration.js",
        "  PermissionRequest.js",
        "  ODRecord.js"
    ], "fig_8.1.6_model_folder.png", 3.4, 2.5),

    ("Fig 8.1.7 Structure of Frontend Folder", [
        "src/",
        "  components/",
        "  context/",
        "  data/",
        "  layouts/",
        "  pages/",
        "  utils/",
        "  App.jsx",
        "  main.jsx",
        "  index.css"
    ], "fig_8.1.7_frontend_folder.png", 3.4, 2.6),

    ("Fig 8.1.8 Structure of frontend/src", [
        "src/layouts/",
        "  DashboardLayout.jsx",
        "src/data/",
        "  mockData.js",
        "  octoberAnalyticsData.js",
        "index.css (Design System)"
    ], "fig_8.1.8_src_folder.png", 3.4, 2.0),

    ("Fig 8.1.9 Structure of frontend/src/pages Folder", [
        "src/pages/",
        "  admin/ (Dashboard, Permissions)",
        "  instructor/ (Events, CheckIn, Memberships)",
        "  od_incharge/ (Requests, Verify, Archive)",
        "  student/ (Dashboard, Clubs, Passes, OD)",
        "  auth/ (Login, Register, GoogleAuth)"
    ], "fig_8.1.9_pages_folder.png", 3.4, 2.2),

    ("Fig 8.1.10 Structure of routes and services", [
        "src/routes & services/",
        "  App.jsx (Route Hierarchy)",
        "  ProtectedRoute.jsx",
        "  apiClient.js (Axios/JWT)",
        "  accessControl.js"
    ], "fig_8.1.10_routes_services.png", 3.4, 1.8),

    ("Fig 8.1.11 Structure of frontend/src/components", [
        "src/components/",
        "  Navbar.jsx & Sidebar.jsx",
        "  FilterBar.jsx & SearchInput.jsx",
        "  AIAssistant.jsx",
        "  ODStatusTracker.jsx",
        "  ThemeToggle.jsx",
        "  NotificationBell.jsx"
    ], "fig_8.1.11_components_folder.png", 3.4, 2.4)
]

for title, lines, fn, w, h in trees:
    generate_tree(title, lines, fn, w, h)
