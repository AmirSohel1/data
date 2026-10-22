@echo off
setlocal
echo ============================================================
echo   Stopping AeroBook Microservices...
echo ============================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\run-services.ps1" stop %*
endlocal
