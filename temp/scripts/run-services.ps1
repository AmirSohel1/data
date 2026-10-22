<#
.SYNOPSIS
    AeroBook Microservices Orchestrator (PowerShell)
.DESCRIPTION
    Runs, stops, checks, or restarts all AeroBook microservices with a single command.
    Features smart startup ordering (Eureka first, then business services), port polling,
    process tree termination, and colored dashboard reporting.
.PARAMETER Action
    start (default), stop, status, restart, logs
.PARAMETER Window
    Switch to open each microservice in its own visible console window instead of background.
.PARAMETER ConfigServer
    Switch to also start the optional Spring Cloud Config Server (port 8080).
.PARAMETER Frontend
    Switch to also start the Angular frontend (port 4200).
.PARAMETER Service
    Filter for logs or restart on a specific service (e.g. auth-service).
.EXAMPLE
    .\scripts\run-services.ps1
    .\scripts\run-services.ps1 stop
    .\scripts\run-services.ps1 status
    .\scripts\run-services.ps1 restart
    .\scripts\run-services.ps1 -Window
    .\scripts\run-services.ps1 logs -Service auth-service
#>

[CmdletBinding()]
param(
    [Parameter(Position=0)]
    [ValidateSet("start", "stop", "status", "restart", "logs")]
    [string]$Action = "start",

    [switch]$Window,
    [switch]$ConfigServer,
    [switch]$Frontend,
    [string]$Service = "",
    [int]$TimeoutSeconds = 120
)

$ErrorActionPreference = "Continue"

# Root workspace directory
$rootDir = (Get-Item (Split-Path -Parent $PSScriptRoot)).FullName
if (-not (Test-Path (Join-Path $rootDir "service-discovery"))) {
    $rootDir = (Get-Location).Path
}

$logsDir = Join-Path $rootDir "logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

# Define all AeroBook microservices in startup-order preference
$allServices = @(
    [PSCustomObject]@{
        Key        = "discovery"
        Name       = "Service Discovery (Eureka)"
        Dir        = "service-discovery"
        Port       = 8761
        Url        = "http://localhost:8761"
        Command    = "mvnw.cmd spring-boot:run"
        Tier       = 1
        Enabled    = $true
    },
    [PSCustomObject]@{
        Key        = "config"
        Name       = "Config Server"
        Dir        = "config-server"
        Port       = 8080
        Url        = "http://localhost:8080/actuator/health"
        Command    = "mvnw.cmd spring-boot:run"
        Tier       = 1
        Enabled    = [bool]$ConfigServer
    },
    [PSCustomObject]@{
        Key        = "gateway"
        Name       = "API Gateway"
        Dir        = "api-gateway"
        Port       = 8083
        Url        = "http://localhost:8083/api/gateway/health"
        Command    = "mvnw.cmd spring-boot:run"
        Tier       = 2
        Enabled    = $true
    },
    [PSCustomObject]@{
        Key        = "auth"
        Name       = "Auth Service"
        Dir        = "auth-service"
        Port       = 8082
        Url        = "http://localhost:8082/api/auth/health"
        Command    = "mvnw.cmd spring-boot:run"
        Tier       = 2
        Enabled    = $true
    },
    [PSCustomObject]@{
        Key        = "user"
        Name       = "User Service"
        Dir        = "user-service"
        Port       = 8084
        Url        = "http://localhost:8084/api/v1/users/health"
        Command    = "mvnw.cmd spring-boot:run"
        Tier       = 2
        Enabled    = $true
    },
    [PSCustomObject]@{
        Key        = "flight"
        Name       = "Flight Service"
        Dir        = "flight-service"
        Port       = 8087
        Url        = "http://localhost:8087/api/flights/health"
        Command    = "mvnw.cmd spring-boot:run"
        Tier       = 2
        Enabled    = $true
    },
    [PSCustomObject]@{
        Key        = "booking"
        Name       = "Booking Service"
        Dir        = "booking-service"
        Port       = 8088
        Url        = "http://localhost:8088/api/bookings/health"
        Command    = "mvnw.cmd spring-boot:run"
        Tier       = 2
        Enabled    = $true
    },
    [PSCustomObject]@{
        Key        = "fare"
        Name       = "Fare Service"
        Dir        = "fare-service"
        Port       = 8089
        Url        = "http://localhost:8089/api/fares/health"
        Command    = "mvnw.cmd spring-boot:run"
        Tier       = 2
        Enabled    = $true
    },
    [PSCustomObject]@{
        Key        = "checkin"
        Name       = "Check-In Service"
        Dir        = "check-in-service"
        Port       = 8090
        Url        = "http://localhost:8090/api/check-ins/health"
        Command    = "mvnw.cmd spring-boot:run"
        Tier       = 2
        Enabled    = $true
    },
    [PSCustomObject]@{
        Key        = "notification"
        Name       = "Notification Service"
        Dir        = "notification-service"
        Port       = 8091
        Url        = "http://localhost:8091/api/notifications/health"
        Command    = "mvnw.cmd spring-boot:run"
        Tier       = 2
        Enabled    = $true
    },
    [PSCustomObject]@{
        Key        = "payment"
        Name       = "Payment Service"
        Dir        = "payment-service"
        Port       = 8092
        Url        = "http://localhost:8092/api/payments/health"
        Command    = "mvnw.cmd spring-boot:run"
        Tier       = 2
        Enabled    = $true
    },
    [PSCustomObject]@{
        Key        = "frontend"
        Name       = "Angular Frontend"
        Dir        = "frontend"
        Port       = 4200
        Url        = "http://localhost:4200"
        Command    = "npm start"
        Tier       = 3
        Enabled    = [bool]$Frontend
    }
)

$activeServices = $allServices | Where-Object { $_.Enabled }

function Get-PortProcess([int]$port) {
    try {
        $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($conn) {
            $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            return @{
                PID         = $conn.OwningProcess
                ProcessName = if ($proc) { $proc.ProcessName } else { "Unknown" }
            }
        }
    } catch { }
    return $null
}

function Stop-AllServices {
    Write-Host "`n============================================================" -ForegroundColor Cyan
    Write-Host "       Stopping AeroBook Microservices                      " -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Cyan

    $stoppedCount = 0
    foreach ($svc in $allServices) {
        $procInfo = Get-PortProcess -port $svc.Port
        if ($procInfo) {
            Write-Host "Stopping $($svc.Name.PadRight(28)) (Port $($svc.Port), PID $($procInfo.PID))..." -ForegroundColor Yellow -NoNewline
            try {
                & taskkill.exe /PID $procInfo.PID /T /F 2>&1 | Out-Null
                Write-Host " [STOPPED]" -ForegroundColor Green
                $stoppedCount++
            } catch {
                Write-Host " [FAILED: $($_.Exception.Message)]" -ForegroundColor Red
            }
        }
    }

    if ($stoppedCount -eq 0) {
        Write-Host "No active microservice processes were found running on ports." -ForegroundColor Gray
    } else {
        Write-Host "`nSuccessfully stopped $stoppedCount service(s)." -ForegroundColor Green
    }
}

function Show-Status {
    Write-Host "`n============================================================" -ForegroundColor Cyan
    Write-Host "       AeroBook Microservices Status Dashboard              " -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Cyan

    $statusList = @()
    foreach ($svc in $allServices) {
        $procInfo = Get-PortProcess -port $svc.Port
        $isListening = ($null -ne $procInfo)
        $statusText = if ($isListening) { "UP (Listening)" } else { "DOWN" }
        $pidText = if ($isListening) { $procInfo.PID } else { "-" }

        $statusList += [PSCustomObject]@{
            "Service Name" = $svc.Name
            "Port"         = $svc.Port
            "PID"          = $pidText
            "Status"       = $statusText
            "Endpoint"     = $svc.Url
        }
    }

    $statusList | Format-Table -AutoSize

    Write-Host "Quick Links:" -ForegroundColor Cyan
    Write-Host "  Eureka Registry:     http://localhost:8761"
    Write-Host "  API Gateway:         http://localhost:8083"
    Write-Host "  Frontend (Angular):  http://localhost:4200"
    Write-Host "  Logs Directory:      $logsDir"
}

function Show-Logs {
    $target = if ($Service) { $Service } else { "service-discovery" }
    $logFile = Get-ChildItem -Path $logsDir -Filter "*$target*.log" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($logFile) {
        Write-Host "`n=== Displaying tail of $($logFile.FullName) ===" -ForegroundColor Cyan
        Get-Content -Path $logFile.FullName -Tail 50
    } else {
        Write-Host ("Available log files in {0}:" -f $logsDir) -ForegroundColor Yellow
        Get-ChildItem -Path $logsDir -Filter "*.log" | Select-Object Name, Length, LastWriteTime | Format-Table
    }
}

function Start-AllServices {
    Write-Host "`n============================================================" -ForegroundColor Cyan
    Write-Host "       Starting AeroBook Microservices                      " -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Cyan
    $modeText = if ($Window) { "Separate Console Windows" } else { "Background Services (Logs in .\logs\)" }
    Write-Host "Mode: $modeText | Root: $rootDir" -ForegroundColor Gray
    Write-Host "Services to launch: $($activeServices.Count) services`n" -ForegroundColor Gray

    # Step 1: Pre-flight check - clear any lingering ports
    $conflictServices = @()
    foreach ($svc in $activeServices) {
        $procInfo = Get-PortProcess -port $svc.Port
        if ($procInfo) {
            $conflictServices += @{ Service = $svc; Proc = $procInfo }
        }
    }

    if ($conflictServices.Count -gt 0) {
        Write-Host "Warning: Found $($conflictServices.Count) port(s) already in use. Cleaning up..." -ForegroundColor Yellow
        foreach ($c in $conflictServices) {
            & taskkill.exe /PID $c.Proc.PID /T /F 2>&1 | Out-Null
        }
        Start-Sleep -Seconds 2
    }

    # Step 2: Start Tier 1 Services (Service Discovery / Eureka first!)
    $tier1 = $activeServices | Where-Object { $_.Tier -eq 1 }
    foreach ($svc in $tier1) {
        $svcDir = Join-Path $rootDir $svc.Dir
        $logPath = Join-Path $logsDir "$($svc.Dir).log"
        $title = "[AeroBook] $($svc.Name) - Port $($svc.Port)"
        Write-Host "[1/3] Launching $($svc.Name) on port $($svc.Port)..." -ForegroundColor Cyan

        if ($Window) {
            $cmdArgs = "/k `"title $title && cd /d `"$svcDir`" && $($svc.Command)`""
            Start-Process -FilePath "cmd.exe" -ArgumentList $cmdArgs -WindowStyle Normal | Out-Null
        } else {
            $cmdArgs = "/c cd /d `"$svcDir`" && $($svc.Command) > `"$logPath`" 2>&1"
            Start-Process -FilePath "cmd.exe" -ArgumentList $cmdArgs -WindowStyle Hidden | Out-Null
        }
    }

    # Wait for Service Discovery (8761) to become active before starting dependent microservices
    $discovery = $activeServices | Where-Object { $_.Key -eq "discovery" }
    if ($discovery) {
        Write-Host "Waiting for Service Discovery (Eureka) to bind port $($discovery.Port)..." -ForegroundColor Yellow -NoNewline
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $ready = $false
        while ($sw.Elapsed.TotalSeconds -lt 45) {
            if (Get-PortProcess -port $discovery.Port) {
                $ready = $true
                break
            }
            Start-Sleep -Seconds 1
            Write-Host "." -NoNewline
        }
        if ($ready) {
            Write-Host " [READY] ($([math]::Round($sw.Elapsed.TotalSeconds, 1))s)" -ForegroundColor Green
        } else {
            Write-Host " [WARN: Port check timed out, proceeding anyway]" -ForegroundColor Red
        }
    }

    # Step 3: Launch Tier 2 Services (API Gateway & Backend Microservices)
    $tier2 = $activeServices | Where-Object { $_.Tier -eq 2 }
    Write-Host "`n[2/3] Launching $($tier2.Count) business microservices..." -ForegroundColor Cyan

    foreach ($svc in $tier2) {
        $svcDir = Join-Path $rootDir $svc.Dir
        $logPath = Join-Path $logsDir "$($svc.Dir).log"
        $title = "[AeroBook] $($svc.Name) - Port $($svc.Port)"
        Write-Host "  -> Launching $($svc.Name.PadRight(26)) (Port $($svc.Port))..." -ForegroundColor Gray

        if ($Window) {
            $cmdArgs = "/k `"title $title && cd /d `"$svcDir`" && $($svc.Command)`""
            Start-Process -FilePath "cmd.exe" -ArgumentList $cmdArgs -WindowStyle Normal | Out-Null
        } else {
            $cmdArgs = "/c cd /d `"$svcDir`" && $($svc.Command) > `"$logPath`" 2>&1"
            Start-Process -FilePath "cmd.exe" -ArgumentList $cmdArgs -WindowStyle Hidden | Out-Null
        }
        # 1-second gentle stagger prevents CPU spike on Maven compilation
        Start-Sleep -Milliseconds 800
    }

    # Step 4: Launch Tier 3 Services (Frontend if enabled)
    $tier3 = $activeServices | Where-Object { $_.Tier -eq 3 }
    if ($tier3) {
        Write-Host "`n[3/3] Launching frontend application..." -ForegroundColor Cyan
        foreach ($svc in $tier3) {
            $svcDir = Join-Path $rootDir $svc.Dir
            $logPath = Join-Path $logsDir "$($svc.Dir).log"
            $title = "[AeroBook] $($svc.Name) - Port $($svc.Port)"
            Write-Host "  -> Launching $($svc.Name) on port $($svc.Port)..." -ForegroundColor Gray
            if ($Window) {
                $cmdArgs = "/k `"title $title && cd /d `"$svcDir`" && $($svc.Command)`""
                Start-Process -FilePath "cmd.exe" -ArgumentList $cmdArgs -WindowStyle Normal | Out-Null
            } else {
                $cmdArgs = "/c cd /d `"$svcDir`" && $($svc.Command) > `"$logPath`" 2>&1"
                Start-Process -FilePath "cmd.exe" -ArgumentList $cmdArgs -WindowStyle Hidden | Out-Null
            }
        }
    }

    # Step 5: Live monitor services until all ports are listening
    Write-Host "`n============================================================" -ForegroundColor Cyan
    Write-Host "       Awaiting Service Initialization                      " -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "Monitoring microservice ports (timeout: ${TimeoutSeconds}s)...`n" -ForegroundColor Gray

    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $pending = [System.Collections.ArrayList]@($activeServices)

    while ($pending.Count -gt 0 -and $stopwatch.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
        $toRemove = @()
        foreach ($svc in $pending) {
            $procInfo = Get-PortProcess -port $svc.Port
            if ($procInfo) {
                $elapsedSec = [math]::Round($stopwatch.Elapsed.TotalSeconds, 1)
                Write-Host "  [OK] $($svc.Name.PadRight(28)) listening on Port $($svc.Port) (PID $($procInfo.PID)) [${elapsedSec}s]" -ForegroundColor Green
                $toRemove += $svc
            }
        }
        foreach ($r in $toRemove) {
            $pending.Remove($r)
        }

        if ($pending.Count -gt 0) {
            Start-Sleep -Seconds 2
        }
    }

    Write-Host ""
    if ($pending.Count -eq 0) {
        Write-Host "============================================================" -ForegroundColor Green
        Write-Host "  ALL MICROSERVICES ARE UP AND READY!                       " -ForegroundColor Green
        Write-Host "============================================================" -ForegroundColor Green
    } else {
        Write-Host "============================================================" -ForegroundColor Yellow
        Write-Host "  $($activeServices.Count - $pending.Count)/$($activeServices.Count) services ready. Still initializing: $(($pending | ForEach-Object { $_.Name }) -join ', ')" -ForegroundColor Yellow
        Write-Host "  (Check individual service logs in .\logs\ for details)" -ForegroundColor Gray
        Write-Host "============================================================" -ForegroundColor Yellow
    }

    Write-Host "`nAccess URLs:" -ForegroundColor Cyan
    Write-Host "  Eureka Registry Dashboard: http://localhost:8761"
    Write-Host "  API Gateway Ingress:       http://localhost:8083"
    Write-Host "  Auth Service:              http://localhost:8082"
    Write-Host "  Flight Service:            http://localhost:8087"
    Write-Host "  Booking Service:           http://localhost:8088"
    Write-Host "  Payment Service:           http://localhost:8092"
    if ($Frontend) {
        Write-Host "  Frontend Application:      http://localhost:4200"
    }

    Write-Host "`nUseful Commands:" -ForegroundColor Gray
    Write-Host "  Check Status:  .\status-all.bat    (or .\scripts\run-services.ps1 status)"
    Write-Host "  Stop All:      .\stop-all.bat      (or .\scripts\run-services.ps1 stop)"
    Write-Host "  Restart All:   .\restart-all.bat   (or .\scripts\run-services.ps1 restart)"
    Write-Host "  View Logs:     powershell -ExecutionPolicy Bypass -File .\scripts\run-services.ps1 logs -Service <name>"
    Write-Host "  Smoke Check:   powershell -ExecutionPolicy Bypass -File .\scripts\smoke-check.ps1"
}

# Main Execution Switch
switch ($Action) {
    "stop" {
        Stop-AllServices
    }
    "status" {
        Show-Status
    }
    "logs" {
        Show-Logs
    }
    "restart" {
        Stop-AllServices
        Start-Sleep -Seconds 2
        Start-AllServices
    }
    default {
        Start-AllServices
    }
}

