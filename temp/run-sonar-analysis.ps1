<#
.SYNOPSIS
    AeroBook End-to-End SonarQube Analysis Orchestrator
.DESCRIPTION
    Compiles, tests, generates coverage reports (JaCoCo XML & LCOV),
    and executes SonarQube analysis for all 11 backend microservices
    and the Angular frontend.
#>

[CmdletBinding()]
param(
    [string]$SonarHostUrl = $(if ($env:SONAR_HOST_URL) { $env:SONAR_HOST_URL } else { "http://localhost:9000" }),
    [string]$SonarToken   = $(if ($env:SONAR_TOKEN) { $env:SONAR_TOKEN } else { "" }),
    [switch]$SkipTests,
    [switch]$SkipBackend,
    [switch]$SkipFrontend
)

$ErrorActionPreference = "Continue"
$RootPath = $PSScriptRoot

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "         AEROBOOK END-TO-END SONARQUBE ANALYSIS PIPELINE           " -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "Working Directory : $RootPath"
Write-Host "SonarQube Server  : $SonarHostUrl"
Write-Host "Skip Tests        : $SkipTests"
Write-Host "Skip Backend      : $SkipBackend"
Write-Host "Skip Frontend     : $SkipFrontend"
Write-Host "--------------------------------------------------------------------"

# Set Chrome binary for headless frontend testing
if (-not $env:CHROME_BIN) {
    if (Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe") {
        $env:CHROME_BIN = "C:\Program Files\Google\Chrome\Application\chrome.exe"
    } elseif (Test-Path "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe") {
        $env:CHROME_BIN = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    }
}
Write-Host "Chrome Binary     : $env:CHROME_BIN"

# Check SonarQube Server Availability
$ServerOnline = $false
try {
    $response = Invoke-RestMethod -Uri "$SonarHostUrl/api/system/status" -TimeoutSec 3 -ErrorAction Stop
    $ServerOnline = $true
    Write-Host "[OK] SonarQube Server is ONLINE (Status: $($response.status))" -ForegroundColor Green
} catch {
    try {
        $ver = Invoke-RestMethod -Uri "$SonarHostUrl/api/server/version" -TimeoutSec 3 -ErrorAction Stop
        $ServerOnline = $true
        Write-Host "[OK] SonarQube Server is ONLINE (Version: $ver)" -ForegroundColor Green
    } catch {
        Write-Host "[WARNING] SonarQube Server at '$SonarHostUrl' is OFFLINE or UNREACHABLE." -ForegroundColor Yellow
        Write-Host "          Tests and code coverage reports will be fully generated and verified." -ForegroundColor Yellow
        Write-Host "          SonarQube upload will be skipped until the server is running." -ForegroundColor Yellow
    }
}

$BackendServices = @(
    @{ Name = "service-discovery";   Dir = "service-discovery";   Key = "aerobook-service-discovery" },
    @{ Name = "config-server";       Dir = "config-server";       Key = "aerobook-config-server" },
    @{ Name = "api-gateway";         Dir = "api-gateway";         Key = "aerobook-api-gateway" },
    @{ Name = "auth-service";        Dir = "auth-service";        Key = "aerobook-auth-service" },
    @{ Name = "user-service";        Dir = "user-service";        Key = "aerobook-user-service" },
    @{ Name = "flight-service";      Dir = "flight-service";      Key = "aerobook-flight-service" },
    @{ Name = "fare-service";        Dir = "fare-service";        Key = "aerobook-fare-service" },
    @{ Name = "booking-service";     Dir = "booking-service";     Key = "aerobook-booking-service" },
    @{ Name = "check-in-service";    Dir = "check-in-service";    Key = "aerobook-check-in-service" },
    @{ Name = "notification-service";Dir = "notification-service";Key = "aerobook-notification-service" },
    @{ Name = "payment-service";     Dir = "payment-service";     Key = "aerobook-payment-service" }
)

$Results = @()

# -----------------------------------------------------------------------------
# 1. BACKEND SERVICES EXECUTION & COVERAGE
# -----------------------------------------------------------------------------
if (-not $SkipBackend) {
    Write-Host "`n>>> [1/3] Building and Testing Backend Services..." -ForegroundColor Cyan

    if (-not $SkipTests) {
        Write-Host "Executing root multi-module Maven test & JaCoCo instrumentation..." -ForegroundColor Gray
        $mvnArgs = @("test")
        & "$RootPath\mvnw.cmd" @mvnArgs
    } else {
        Write-Host "Skipping test execution as requested (-SkipTests)." -ForegroundColor Yellow
    }

    foreach ($svc in $BackendServices) {
        $reportPath = Join-Path $RootPath "$($svc.Dir)\target\site\jacoco\jacoco.xml"
        $hasReport = Test-Path $reportPath
        $status = if ($hasReport) { "SUCCESS" } else { "NO_REPORT" }

        $scanStatus = "PENDING"
        if ($ServerOnline) {
            Write-Host "Uploading SonarQube analysis for $($svc.Name)..." -ForegroundColor Gray
            $sonarArgs = @("sonar:sonar", "-Dsonar.host.url=$SonarHostUrl")
            if ($SonarToken) { $sonarArgs += "-Dsonar.token=$SonarToken" }
            Push-Location "$RootPath\$($svc.Dir)"
            & "$RootPath\mvnw.cmd" @sonarArgs
            if ($LASTEXITCODE -eq 0) { $scanStatus = "SCANNED" } else { $scanStatus = "FAILED" }
            Pop-Location
        } else {
            $scanStatus = "OFFLINE"
        }

        $Results += [PSCustomObject]@{
            Component  = $svc.Name
            Type       = "Java Microservice"
            Coverage   = if ($hasReport) { "JaCoCo XML OK" } else { "Missing" }
            ScanStatus = $scanStatus
        }
    }
}

# -----------------------------------------------------------------------------
# 2. FRONTEND EXECUTION & COVERAGE
# -----------------------------------------------------------------------------
if (-not $SkipFrontend) {
    Write-Host "`n>>> [2/3] Building and Testing Angular Frontend..." -ForegroundColor Cyan
    Push-Location "$RootPath\frontend"

    $frontendReportPath = Join-Path $RootPath "frontend\coverage\frontend\lcov.info"

    if (-not $SkipTests) {
        Write-Host "Running Karma Headless tests and generating LCOV coverage..." -ForegroundColor Gray
        & npm run test:ci
    }

    $hasFrontendReport = Test-Path $frontendReportPath
    $fScanStatus = "PENDING"

    if ($ServerOnline) {
        Write-Host "Uploading SonarQube analysis for Angular Frontend..." -ForegroundColor Gray
        $env:SONAR_HOST_URL = $SonarHostUrl
        if ($SonarToken) { $env:SONAR_TOKEN = $SonarToken }
        & npm run sonar
        if ($LASTEXITCODE -eq 0) { $fScanStatus = "SCANNED" } else { $fScanStatus = "FAILED" }
    } else {
        $fScanStatus = "OFFLINE"
    }

    Pop-Location

    $Results += [PSCustomObject]@{
        Component  = "frontend"
        Type       = "Angular 18 SPA"
        Coverage   = if ($hasFrontendReport) { "LCOV OK" } else { "Missing" }
        ScanStatus = $fScanStatus
    }
}

# -----------------------------------------------------------------------------
# 3. SUMMARY REPORT
# -----------------------------------------------------------------------------
Write-Host "`n====================================================================" -ForegroundColor Cyan
Write-Host "                 AEROBOOK QUALITY ANALYSIS SUMMARY                  " -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
$Results | Format-Table -AutoSize -Property Component, Type, Coverage, ScanStatus

Write-Host "`nServer Status: $(if ($ServerOnline) { 'Connected (' + $SonarHostUrl + ')' } else { 'Offline / Pending Docker startup' })"
Write-Host "Total Components Configured: $($Results.Count)"
Write-Host "====================================================================" -ForegroundColor Cyan

