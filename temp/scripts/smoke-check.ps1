<#
.SYNOPSIS
    AeroBook Platform Smoke Check (PowerShell)
.DESCRIPTION
    Pings the health probe of each microservice directly and through the API Gateway,
    verifying service discovery, reverse proxy routing, and operational status.
#>
param(
    [switch]$Direct = $false
)

$services = @(
    @{ Name = "API Gateway";            Url = "http://localhost:8083/api/gateway/health"; Direct = "http://localhost:8083/api/gateway/health" },
    @{ Name = "Auth Service";           Url = "http://localhost:8083/api/auth/health";    Direct = "http://localhost:8082/api/auth/health" },
    @{ Name = "User Service";           Url = "http://localhost:8083/api/v1/users/health";Direct = "http://localhost:8084/api/v1/users/health" },
    @{ Name = "Flight Service";         Url = "http://localhost:8083/api/flights/health"; Direct = "http://localhost:8087/api/flights/health" },
    @{ Name = "Fare Service";           Url = "http://localhost:8083/api/fares/health";   Direct = "http://localhost:8089/api/fares/health" },
    @{ Name = "Booking Service";        Url = "http://localhost:8083/api/bookings/health";Direct = "http://localhost:8088/api/bookings/health" },
    @{ Name = "Check-In Service";       Url = "http://localhost:8083/api/check-ins/health";Direct = "http://localhost:8090/api/check-ins/health" },
    @{ Name = "Notification Service";   Url = "http://localhost:8083/api/notifications/health";Direct = "http://localhost:8091/api/notifications/health" },
    @{ Name = "Payment Service";        Url = "http://localhost:8083/api/payments/health";Direct = "http://localhost:8092/api/payments/health" }
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "       AeroBook Platform Microservices Health Probe        " -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

$allPass = $true

foreach ($svc in $services) {
    $targetUrl = if ($Direct) { $svc.Direct } else { $svc.Url }
    try {
        $response = Invoke-RestMethod -Uri $targetUrl -Method Get -TimeoutSec 5 -ErrorAction Stop
        Write-Host "[PASS] $($svc.Name.PadRight(22)) -> $targetUrl" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] $($svc.Name.PadRight(22)) -> $targetUrl ($($_.Exception.Message))" -ForegroundColor Red
        $allPass = $false
    }
}

Write-Host "------------------------------------------------------------" -ForegroundColor Cyan
if ($allPass) {
    Write-Host "All tested services are HEALTHY and reachable!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "One or more services did not respond. Check service startup." -ForegroundColor Red
    exit 1
}
