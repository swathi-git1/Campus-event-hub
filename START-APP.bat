@echo off
title Campus Event Hub
color 0A
cls
echo ===================================================================
echo             CAMPUS EVENT HUB - ROLE-BASED PLATFORM
echo ===================================================================
echo.
echo Starting development server on http://localhost:5173 ...
echo.
start "" "http://localhost:5173/"
npm.cmd run dev -- --port 5173 --host
pause
