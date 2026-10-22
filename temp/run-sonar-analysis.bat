@echo off
setlocal enabledelayedexpansion

echo ====================================================================
echo          AEROBOOK END-TO-END SONARQUBE ANALYSIS PIPELINE           
echo ====================================================================

set SCRIPT_DIR=%~dp0
set SONAR_HOST_URL=%SONAR_HOST_URL%
if "%SONAR_HOST_URL%"=="" set SONAR_HOST_URL=http://localhost:9000

echo Working Directory : %SCRIPT_DIR%
echo SonarQube Server  : %SONAR_HOST_URL%
echo.

powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_DIR%run-sonar-analysis.ps1" %*

exit /b %ERRORLEVEL%

