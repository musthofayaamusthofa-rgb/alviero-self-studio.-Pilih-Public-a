@echo off
title Alviero Studio Manager - Control Hub
color 0A
echo ===================================================================
echo   ALVIERO STUDIO MANAGER (PENGATUR BACKGROUND, JAM & SYNC WEB)
echo ===================================================================
echo Membuka dashboard pengatur di browser Anda...
timeout /t 2 /nobreak >nul
start "" "http://localhost:3001"
node scripts\admin-server.cjs
pause
