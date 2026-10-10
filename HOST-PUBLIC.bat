@echo off
title Campus Event Hub - Instant Public Web Host
color 0B
cls
echo ===================================================================
echo             CAMPUS EVENT HUB - INSTANT PUBLIC HOST
echo ===================================================================
echo.
echo 1. Making sure local server is active on port 5173...
echo 2. Starting secure public internet tunnel...
echo.
echo -------------------------------------------------------------------
echo If prompted for a tunnel password in your browser, enter your IP:
for /f %%a in ('powershell -command "(Invoke-RestMethod -Uri https://api.ipify.org)"') do set MYIP=%%a
echo YOUR TUNNEL PASSWORD / IP: %MYIP%
echo -------------------------------------------------------------------
echo.
call npx.cmd --yes localtunnel --port 5173
pause
