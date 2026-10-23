@echo off
title minilab.app Local Server
echo ====================================================
echo  Iniciando minilab.app (Lucas Leite - NYC Portfolio)
echo ====================================================
cd /d "%~dp0"
start http://localhost:5173
npx serve dist -l 5173
pause
