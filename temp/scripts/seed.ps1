<#
.SYNOPSIS
    AeroBook Platform Master Database Seeding Runner (PowerShell)
.DESCRIPTION
    Idempotently seeds all 8 microservice databases with realistic sample data
    for users, roles, aircraft, flight schedules, fares, coupons, bookings,
    check-in records, payments, notifications, and incident reports.
.PARAMETER Action
    Operation mode: "seed" (default), "--reset" / "reset", "--check" / "check".
.EXAMPLE
    .\scripts\seed.ps1
    .\scripts\seed.ps1 --reset
    .\scripts\seed.ps1 --check
#>
param(
    [Parameter(Position=0)]
    [string]$Action = "seed",
    [switch]$Reset,
    [switch]$Check,
    [string]$DbUser = $(if ($env:MYSQL_USERNAME) { $env:MYSQL_USERNAME } else { "root" }),
    [string]$DbPassword = $(if ($env:MYSQL_PASSWORD) { $env:MYSQL_PASSWORD } else { "Amir1121@" }),
    [string]$DbHost = $(if ($env:MYSQL_HOST) { $env:MYSQL_HOST } else { "localhost" }),
    [string]$DbPort = $(if ($env:MYSQL_PORT) { $env:MYSQL_PORT } else { "3306" })
)

$ErrorActionPreference = "Stop"

# Determine target operation
if ($Reset -or $Action -in @("reset", "--reset", "-r")) {
    $Op = "reset"
} elseif ($Check -or $Action -in @("check", "--check", "-c")) {
    $Op = "check"
} else {
    $Op = "seed"
}

# Locate mysql CLI
$mysqlCmd = Get-Command "mysql" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -First 1

if (-not $mysqlCmd) {
    $candidatePaths = @(
        "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 9.0\bin\mysql.exe",
        "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\xampp\mysql\bin\mysql.exe",
        "C:\laragon\bin\mysql\*\bin\mysql.exe"
    )
    foreach ($path in $candidatePaths) {
        $resolved = Resolve-Path $path -ErrorAction SilentlyContinue
        if ($resolved) {
            $mysqlCmd = $resolved[0].Path
            break
        }
    }
}

if (-not $mysqlCmd) {
    Write-Error "ERROR: MySQL client (mysql.exe) could not be located in PATH or standard installation folders."
    exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$seedSql = Join-Path $scriptDir "seed.sql"
$resetSql = Join-Path $scriptDir "reset.sql"
$checkSql = Join-Path $scriptDir "check.sql"

function Invoke-SqlFile([string]$sqlFilePath) {
    $argsList = @(
        "-h", $DbHost,
        "-P", $DbPort,
        "-u", $DbUser,
        "-p$DbPassword",
        "--default-character-set=utf8mb4"
    )
    & $mysqlCmd @argsList -e "source $sqlFilePath"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "SQL Execution failed for: $sqlFilePath"
        exit $LASTEXITCODE
    }
}

function Show-TableCounts {
    Write-Host "`n=== AeroBook Microservices Database Table Row Counts ===" -ForegroundColor Cyan
    $argsList = @(
        "-h", $DbHost,
        "-P", $DbPort,
        "-u", $DbUser,
        "-p$DbPassword",
        "-t"
    )
    & $mysqlCmd @argsList -e "source $checkSql"
}

Write-Host "============================================================" -ForegroundColor Blue
Write-Host "   AeroBook Cloud Airline Platform - Data Seeding Tool      " -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Blue
Write-Host "Target Host: ${DbHost}:${DbPort} | User: $DbUser | Operation: $Op"

switch ($Op) {
    "reset" {
        Write-Host "`n[1/3] Truncating development databases..." -ForegroundColor Yellow
        Invoke-SqlFile $resetSql
        Write-Host "Databases truncated successfully." -ForegroundColor Green

        Write-Host "`n[2/3] Seeding clean baseline data across all microservices..." -ForegroundColor Yellow
        Invoke-SqlFile $seedSql
        Write-Host "Master data seeded successfully." -ForegroundColor Green

        Write-Host "`n[3/3] Verifying table counts..." -ForegroundColor Yellow
        Show-TableCounts
    }
    "check" {
        Show-TableCounts
    }
    default {
        Write-Host "`n[1/2] Executing idempotent data seed..." -ForegroundColor Yellow
        Invoke-SqlFile $seedSql
        Write-Host "Master data seeded successfully." -ForegroundColor Green

        Write-Host "`n[2/2] Checking current row counts..." -ForegroundColor Yellow
        Show-TableCounts
    }
}

Write-Host "`nReady for testing! Logins:" -ForegroundColor Green
Write-Host "  Admin:     admin@aerobook.com   / Admin@123 (or Password123!)"
Write-Host "  Staff:     staff@aerobook.com   / Staff@123 (or Password123!)"
Write-Host "  Passenger: priya@gmail.com      / Passenger@123"
Write-Host "  Passenger: asha.khan@example.com / Password123!"
