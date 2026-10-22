@echo off
setlocal
echo ============================================================
echo   Starting AeroBook Microservices...
echo ============================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\run-services.ps1" start %*
endlocal
