@echo off
setlocal
echo ============================================================
echo   Restarting AeroBook Microservices...
echo ============================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\run-services.ps1" restart %*
endlocal
