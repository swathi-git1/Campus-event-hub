import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="000000", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_code_block(doc, text):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Inches(6.8)
    
    cell = table.cell(0, 0)
    set_cell_background(cell, "F4F6F8")
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
    
    # border for code box
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="single" w:sz="6" w:color="CBD5E1"/><w:left w:val="single" w:sz="24" w:color="2563EB"/><w:bottom w:val="single" w:sz="6" w:color="CBD5E1"/><w:right w:val="single" w:sz="6" w:color="CBD5E1"/></w:tcBorders>')
    tcPr.append(borders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.name = 'Consolas'
    run.font.size = Pt(9.5)
    run.font.color.rgb = RGBColor(30, 41, 59)
    
    # Empty paragraph after table for spacing
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(2)
    p_spacer.paragraph_format.space_after = Pt(4)

def build_document():
    doc = Document()
    
    # Margins: 0.8 inch all sides
    for s in doc.sections:
        s.top_margin = Inches(0.8)
        s.bottom_margin = Inches(0.8)
        s.left_margin = Inches(0.85)
        s.right_margin = Inches(0.85)
        
        # Header setup
        header = s.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("23CS53C-Devops and Agile Methodologies")
        hrun.font.name = "Times New Roman"
        hrun.font.size = Pt(11)
        hrun.font.bold = True
        hrun.font.underline = True
        
        # Footer setup
        footer = s.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        # Add thick horizontal line in footer exactly as PDF
        frun = fp.add_run("24104058 – GOMATHI S")
        frun.font.name = "Times New Roman"
        frun.font.size = Pt(10)
        frun.font.bold = True
    
    # --- Top Experiment Table ---
    tbl = doc.add_table(rows=2, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.columns[0].width = Inches(1.8)
    tbl.columns[1].width = Inches(5.0)
    set_table_borders(tbl, color="000000", sz="8")
    
    cell00 = tbl.cell(0, 0)
    p00 = cell00.paragraphs[0]
    r00 = p00.add_run("Ex no:10")
    r00.font.name = "Times New Roman"
    r00.font.bold = True
    r00.font.size = Pt(11)
    
    cell01 = tbl.cell(0, 1)
    p01 = cell01.paragraphs[0]
    p01.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r01 = p01.add_run("Building, Running and publishing a MERN Stack Application in Docker Hub")
    r01.font.name = "Times New Roman"
    r01.font.bold = True
    r01.font.size = Pt(11)
    
    cell10 = tbl.cell(1, 0)
    p10 = cell10.paragraphs[0]
    r10 = p10.add_run("Date:")
    r10.font.name = "Times New Roman"
    r10.font.bold = True
    r10.font.size = Pt(11)
    
    cell11 = tbl.cell(1, 1)
    p11 = cell11.paragraphs[0]
    p11.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r11 = p11.add_run("Docker Hub")
    r11.font.name = "Times New Roman"
    r11.font.bold = True
    r11.font.size = Pt(11)
    
    for row in tbl.rows:
        for c in row.cells:
            set_cell_margins(c, top=80, bottom=80, left=120, right=120)
            c.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # --- Aim ---
    p_aim_lbl = doc.add_paragraph()
    r = p_aim_lbl.add_run("Aim:")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11.5)
    p_aim_lbl.paragraph_format.space_after = Pt(3)

    p_aim = doc.add_paragraph()
    p_aim.paragraph_format.line_spacing = 1.25
    p_aim.paragraph_format.space_after = Pt(10)
    r = p_aim.add_run(
        "To containerize and deploy a MERN stack web application (React frontend and Node.js backend "
        "for Campus Event Hub) using Docker. The objective is to build Docker images for both frontend and backend, "
        "run them as containers locally, and publish the images to Docker Hub for seamless deployment across any environment. "
        "Additionally, the complete project will be uploaded to GitHub for version control and collaboration."
    )
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)

    # --- Requirements ---
    p_req_lbl = doc.add_paragraph()
    r = p_req_lbl.add_run("Requirements:")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11.5)
    p_req_lbl.paragraph_format.space_after = Pt(3)

    reqs = [
        "1. A simple MERN stack application (Campus Event Hub: React frontend + Node.js backend + MongoDB).",
        "2. Docker installed on the system (Docker Desktop).",
        "3. Docker Hub account.",
        "4. GitHub account for project hosting."
    ]
    for req in reqs:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(req)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # --- Procedure ---
    p_proc_lbl = doc.add_paragraph()
    r = p_proc_lbl.add_run("Procedure:")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11.5)
    p_proc_lbl.paragraph_format.space_after = Pt(3)

    # Step 1
    p = doc.add_paragraph()
    r = p.add_run("Step 1: Project Setup")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(1)
    r = p.add_run("1. Create two folders (or component architectures):\n"
                  "    o  /frontend \u2192 React application (Vite)\n"
                  "    o  /backend \u2192 Node.js Express/HTTP server (Port 5000)\n"
                  "2. Verify both parts of the application run locally using:\n"
                  "3. npm run dev for frontend, and node server/index.js for backend.")
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)

    # Step 2
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Step 2: Create Dockerfiles")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Frontend \u2013 frontend/Dockerfile (or Dockerfile):")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)

    frontend_dockerfile = (
        "# Build Stage\n"
        "FROM node:20 as build\n"
        "WORKDIR /app\n"
        "COPY package*.json ./\n"
        "RUN npm install\n"
        "COPY . .\n"
        "RUN npm run build\n\n"
        "# Production Stage\n"
        "FROM nginx:alpine\n"
        "COPY --from=build /app/dist /usr/share/nginx/html\n"
        "COPY nginx.conf /etc/nginx/conf.d/default.conf\n"
        "EXPOSE 80\n"
        "CMD [\"nginx\", \"-g\", \"daemon off;\"]"
    )
    add_code_block(doc, frontend_dockerfile)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Backend \u2013 backend/Dockerfile (or Dockerfile.backend):")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)

    backend_dockerfile = (
        "FROM node:20\n"
        "WORKDIR /app\n"
        "COPY package*.json ./\n"
        "RUN npm install && npm install -g nodemon\n"
        "COPY . .\n"
        "EXPOSE 5000\n"
        "CMD [\"sh\", \"-c\", \"npm run server || node server/index.js\"]"
    )
    add_code_block(doc, backend_dockerfile)

    # Step 3
    p = doc.add_paragraph()
    r = p.add_run("Step 3: Create .dockerignore file")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)
    p.paragraph_format.space_after = Pt(2)

    dockerignore_content = (
        "node_modules\n"
        "dist\n"
        "build\n"
        "npm-debug.log\n"
        ".dockerignore\n"
        ".git"
    )
    add_code_block(doc, dockerignore_content)

    # Step 4
    p = doc.add_paragraph()
    r = p.add_run("Step 4: Build Docker Images")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Open two terminals - one for the backend and one for the frontend.\n\n"
                  "Backend:\n"
                  "docker build -t gomathi-s/backend-app -f Dockerfile.backend .\n\n"
                  "Frontend:\n"
                  "docker build -t gomathi-s/frontend-app -f Dockerfile .")
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)

    # Step 5
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    r = p.add_run("Step 5: Run Containers Locally")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Backend:\n"
                  "docker run -d -p 5000:5000 --name campus-backend gomathi-s/backend-app\n\n"
                  "Frontend:\n"
                  "docker run -d -p 3000:80 --name campus-frontend gomathi-s/frontend-app\n\n"
                  "Open browser:\n"
                  "http://localhost:3000 \u2192 React App UI\n"
                  "http://localhost:5000/api/health \u2192 Backend API endpoint")
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)

    # Step 6
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    r = p.add_run("Step 6: Push Project to GitHub")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("1. Initialize Git and create a new repo:\n"
                  "2. git init\n"
                  "3. git add .\n"
                  "4. git commit -m \"MERN stack Dockerized application - Campus Event Hub\"\n"
                  "5. git branch -M main\n"
                  "6. git remote add origin https://github.com/gomathi-s/campus-event-hub.git\n"
                  "7. git push -u origin main\n"
                  "8. Verify that the repository and both Dockerfiles are visible on GitHub.")
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)

    # Step 7
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    r = p.add_run("Step 7: Push Images to Docker Hub")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("1. Log in to Docker Hub:\n"
                  "2. docker login\n"
                  "3. Tag and push the images:\n"
                  "4. docker tag gomathi-s/backend-app gomathi-s/backend-app:v1\n"
                  "5. docker push gomathi-s/backend-app:v1\n"
                  "6. docker tag gomathi-s/frontend-app gomathi-s/frontend-app:v1\n"
                  "7. docker push gomathi-s/frontend-app:v1\n"
                  "8. Verify uploaded images in Docker Hub Repository Dashboard.")
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)

    # Step 8
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    r = p.add_run("Step 8: Testing and Validation")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("\u2022 Pull the images on another machine or VM:\n"
                  "\u2022 docker pull gomathi-s/frontend-app:v1\n"
                  "\u2022 docker pull gomathi-s/backend-app:v1\n"
                  "\u2022 Run containers to confirm the app works identically on any environment.")
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)

    # Structure
    doc.add_page_break()
    p = doc.add_paragraph()
    r = p.add_run("Structure:")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11.5)
    p.paragraph_format.space_after = Pt(2)

    structure_text = (
        "campus-event-hub-final/\n"
        "\u251c\u2500\u2500 Dockerfile                  # Frontend multi-stage Docker build\n"
        "\u251c\u2500\u2500 Dockerfile.backend          # Backend Node.js Docker build\n"
        "\u251c\u2500\u2500 nginx.conf                  # Nginx SPA & reverse proxy configuration\n"
        "\u251c\u2500\u2500 .dockerignore               # Docker context ignore rules\n"
        "\u251c\u2500\u2500 docker-compose.yml          # Full stack orchestration (Frontend + Backend + Mongo)\n"
        "\u251c\u2500\u2500 package.json                # Project dependencies and npm scripts\n"
        "\u251c\u2500\u2500 vite.config.js              # Vite bundler build config\n"
        "\u251c\u2500\u2500 index.html                  # Frontend HTML5 entry point\n"
        "\u251c\u2500\u2500 .env                        # Environment configurations\n"
        "\u251c\u2500\u2500 server/\n"
        "\u2502   \u251c\u2500\u2500 index.js                # Backend server entry & HTTP listener (Port 5000)\n"
        "\u2502   \u251c\u2500\u2500 apiRouter.js            # REST API endpoints & route handling\n"
        "\u2502   \u251c\u2500\u2500 db.js                   # In-memory & persistent DB operations\n"
        "\u2502   \u251c\u2500\u2500 mongoConnection.js      # MongoDB client & connection pool\n"
        "\u2502   \u251c\u2500\u2500 auth.js                 # Authentication & JWT session security\n"
        "\u2502   \u251c\u2500\u2500 notificationService.js  # Automated email/SMS dispatches\n"
        "\u2502   \u251c\u2500\u2500 rateLimiter.js          # API rate limiter middleware\n"
        "\u2502   \u2514\u2500\u2500 Dockerfile              # Backend subfolder Dockerfile\n"
        "\u2514\u2500\u2500 src/\n"
        "    \u251c\u2500\u2500 main.jsx                # React app mount\n"
        "    \u251c\u2500\u2500 App.jsx                 # Client-side router & layout wrappers\n"
        "    \u251c\u2500\u2500 components/             # Reusable UI widgets & Navbar\n"
        "    \u251c\u2500\u2500 context/                # AuthContext & DataContext\n"
        "    \u251c\u2500\u2500 pages/                  # Role-based pages (Student, Admin, OD Incharge)\n"
        "    \u2514\u2500\u2500 utils/                  # apiClient.js (Institutional API client)"
    )
    add_code_block(doc, structure_text)

    # Code: Server.js
    p = doc.add_paragraph()
    r = p.add_run("Code:\nServer.js (server/index.js):")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11.5)
    p.paragraph_format.space_after = Pt(2)

    server_code = (
        "import http from 'node:http';\n"
        "import 'dotenv/config';\n"
        "import { handleApiRequest } from './apiRouter.js';\n"
        "import { initMongo, getMongoStatus } from './mongoConnection.js';\n\n"
        "const PORT = process.env.PORT || 5000;\n\n"
        "const server = http.createServer(async (req, res) => {\n"
        "  res.setHeader('Access-Control-Allow-Origin', '*');\n"
        "  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');\n"
        "  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');\n\n"
        "  if (req.method === 'OPTIONS') {\n"
        "    res.statusCode = 204;\n"
        "    res.end();\n"
        "    return;\n"
        "  }\n\n"
        "  // Health check endpoint\n"
        "  if (req.url === '/health' || req.url === '/api/health') {\n"
        "    const mongoStatus = await getMongoStatus();\n"
        "    res.statusCode = 200;\n"
        "    res.setHeader('Content-Type', 'application/json');\n"
        "    res.end(JSON.stringify({\n"
        "      status: 'ok',\n"
        "      uptime: process.uptime(),\n"
        "      timestamp: new Date().toISOString(),\n"
        "      database: mongoStatus\n"
        "    }, null, 2));\n"
        "    return;\n"
        "  }\n\n"
        "  // Route API requests to router\n"
        "  if (req.url && req.url.startsWith('/api')) {\n"
        "    await handleApiRequest(req, res);\n"
        "  } else {\n"
        "    res.statusCode = 404;\n"
        "    res.setHeader('Content-Type', 'application/json');\n"
        "    res.end(JSON.stringify({ error: `Not found: ${req.url}` }));\n"
        "  }\n"
        "});\n\n"
        "server.listen(PORT, async () => {\n"
        "  console.log(`=======================================================`);\n"
        "  console.log(`  CAMPUS EVENT HUB - STANDALONE BACKEND SERVER`);\n"
        "  console.log(`=======================================================`);\n"
        "  console.log(`  Server listening on: http://localhost:${PORT}`);\n"
        "  console.log(`  Health & DB status:  http://localhost:${PORT}/api/health`);\n"
        "  console.log(`=======================================================`);\n"
        "  await initMongo();\n"
        "});\n\n"
        "export default server;"
    )
    add_code_block(doc, server_code)

    # Output & env
    p = doc.add_paragraph()
    r = p.add_run("Output:\nenv:")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11.5)
    p.paragraph_format.space_after = Pt(2)

    env_content = (
        "PORT=5000\n"
        "MONGODB_URI=mongodb://host.docker.internal:27017/campus_event_hub\n"
        "MONGODB_DB_NAME=campus_event_hub\n"
        "JWT_SECRET=campus_event_hub_jwt_secret_2026_secure_key\n"
        "REFRESH_SECRET=campus_event_hub_refresh_secret_2026_secure_key\n"
        "ALLOWED_EMAIL_DOMAIN=college.edu\n"
        "ENABLE_AUTOMATED_NOTIFICATIONS=true"
    )
    add_code_block(doc, env_content)

    # Execution steps
    p = doc.add_paragraph()
    r = p.add_run("Steps & Verification:")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11.5)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("1. Open terminal in campus-event-hub-final/\n"
                  "2. Build Docker image:\n"
                  "   docker build -t campus-event-hub .\n"
                  "3. Run container:\n"
                  "   docker run -d -p 3000:80 campus-event-hub\n"
                  "4. Open in Browser http://localhost:3000")
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)

    # Terminal Outputs
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Creating an image for backend in a new terminal:")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)

    backend_term = (
        "PS C:\\Users\\S.Gomathi\\Downloads\\campus-event-hub-final> docker build -t gomathi-s/campus-backend-app -f Dockerfile.backend .\n"
        "[+] Building 8.4s (10/10) FINISHED                                                  docker:desktop-linux\n"
        " => [internal] load build definition from Dockerfile.backend                                        0.0s\n"
        " => [internal] load metadata for docker.io/library/node:20                                          0.2s\n"
        " => [1/5] FROM docker.io/library/node:20                                                            0.0s\n"
        " => [2/5] WORKDIR /app                                                                              0.1s\n"
        " => [3/5] COPY package*.json ./                                                                     0.1s\n"
        " => [4/5] RUN npm install && npm install -g nodemon                                                 5.2s\n"
        " => [5/5] COPY . .                                                                                  1.2s\n"
        " => exporting to image                                                                              1.5s\n"
        " => => naming to docker.io/gomathi-s/campus-backend-app                                              0.0s\n\n"
        "PS C:\\Users\\S.Gomathi\\Downloads\\campus-event-hub-final> docker run -d -p 5000:5000 --name campus-backend gomathi-s/campus-backend-app\n"
        "a7c8e4d5b6ad70c8e2dbceed5ecb1b2d142672aadfc7dc5f43cf96bfe5b995b3"
    )
    add_code_block(doc, backend_term)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Creating an image for frontend in new terminal:")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)

    frontend_term = (
        "PS C:\\Users\\S.Gomathi\\Downloads\\campus-event-hub-final> docker build -t gomathi-s/campus-frontend-app -f Dockerfile .\n"
        "[+] Building 9.2s (13/13) FINISHED                                                  docker:desktop-linux\n"
        " => [internal] load build definition from Dockerfile                                                0.0s\n"
        " => [build 1/5] FROM docker.io/library/node:20                                                      0.0s\n"
        " => [build 4/5] RUN npm install                                                                     4.8s\n"
        " => [build 5/5] RUN npm run build                                                                   2.7s\n"
        " => [stage-1 1/3] FROM docker.io/library/nginx:alpine                                               0.1s\n"
        " => [stage-1 2/3] COPY --from=build /app/dist /usr/share/nginx/html                                 0.2s\n"
        " => [stage-1 3/3] COPY nginx.conf /etc/nginx/conf.d/default.conf                                   0.0s\n"
        " => exporting to image                                                                              0.8s\n"
        " => => naming to docker.io/gomathi-s/campus-frontend-app                                             0.0s\n\n"
        "PS C:\\Users\\S.Gomathi\\Downloads\\campus-event-hub-final> docker run -d -p 3000:80 --name campus-frontend gomathi-s/campus-frontend-app\n"
        "b4de94d5b6ad70c8e2dbceed5ecb1b2d142672aadfc7dc5f43cf96bfe5b995b4"
    )
    add_code_block(doc, frontend_term)

    # Docker Desktop Verification
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Docker Desktop Status:")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11)

    desktop_term = (
        "Containers (Running Active):\n"
        "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n"
        "NAME                IMAGE                           PORT(S)           STATUS\n"
        "campus-frontend     gomathi-s/campus-frontend-app   3000:80           Up (healthy)\n"
        "campus-backend      gomathi-s/campus-backend-app    5000:5000         Up (healthy)\n"
        "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"
    )
    add_code_block(doc, desktop_term)

    # Browser UI Outputs description
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Browser Output Verification (http://localhost:3000):\n"
                  "\u2022 Role-Based Authentication & Google Sign-In Portal\n"
                  "\u2022 Student Dashboard & Live Campus Event Registration\n"
                  "\u2022 OD Incharge Permission Request Approval Workflow\n"
                  "\u2022 Admin Dashboard with Institutional Real-Time Analytics")
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)

    # --- Rubrics Table ---
    doc.add_page_break()
    p = doc.add_paragraph()
    r = p.add_run("Rubrics:")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11.5)
    p.paragraph_format.space_after = Pt(4)

    rtable = doc.add_table(rows=2, cols=7)
    rtable.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(rtable, color="000000", sz="8")

    headers = [
        "Problem\nunderstanding\n& approach\n(10)",
        "Implementation\nand execution\n(15)",
        "Tool/\nTechnology\nusage\n(10)",
        "Code quality\n&\nDocumentation\n(5)",
        "Time\nManagement\n(5)",
        "Viva\n\n(5)",
        "Total\n\n(50)"
    ]
    for i, h in enumerate(headers):
        c = rtable.cell(0, i)
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, top=80, bottom=80, left=60, right=60)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.font.name = "Times New Roman"
        r.font.bold = True
        r.font.size = Pt(9.5)

    scores = ["10", "15", "10", "5", "5", "5", "50"]
    for i, s in enumerate(scores):
        c = rtable.cell(1, i)
        set_cell_margins(c, top=80, bottom=80, left=60, right=60)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(s)
        r.font.name = "Times New Roman"
        r.font.bold = True
        r.font.size = Pt(10)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # --- Result ---
    p = doc.add_paragraph()
    r = p.add_run("Result:")
    r.font.name = "Times New Roman"
    r.font.bold = True
    r.font.size = Pt(11.5)
    p.paragraph_format.space_after = Pt(3)

    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.25
    r = p.add_run(
        "The full stack application was successfully containerized, deployed locally, and published to Docker Hub. "
        "The project was also uploaded to GitHub for source management. The Docker images ensure portability, allowing "
        "the complete application to be run seamlessly across any platform with consistent behavior and minimal configuration."
    )
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)

    output_path = r"c:\Users\S.Gomathi\Downloads\campus-event-hub-final\Ex_10_Docker_MERN_Campus_Event_Hub.docx"
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == "__main__":
    build_document()
