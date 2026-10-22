@echo off
setlocal
echo ============================================================
echo   Checking AeroBook Microservices Status...
echo ============================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\run-services.ps1" status %*
endlocal
