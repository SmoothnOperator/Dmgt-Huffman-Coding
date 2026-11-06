@echo off
title DMGT Topic 14 - Node.js Backend Server
cd /d "%~dp0"
echo =======================================================================
echo   STARTING DMGT TOPIC 14 NODE.JS EXPRESS BACKEND API & FULL-STACK APP
echo   Port: 3000
echo   Faculty of Engineering and Technology, JAIN (Deemed-to-be University)
echo =======================================================================
echo.
start "" "http://localhost:3000"
call npm start
pause
