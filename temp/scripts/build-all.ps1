param(
    [switch]$SkipTests
)

$rootDir = Split-Path -Parent $PSScriptRoot
$services = @(
    "service-discovery",
    "config-server",
    "api-gateway",
    "auth-service",
    "user-service",
    "flight-service",
    "booking-service",
    "fare-service",
    "check-in-service",
    "notification-service",
    "payment-service"
)

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "   Compiling All 11 AeroBook Microservices                  " -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

$failed = @()
foreach ($svc in $services) {
    $dir = Join-Path $rootDir $svc
    Write-Host -NoNewline "Compiling $($svc.PadRight(24))... "
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $cmd = "mvnw.cmd compile -q"
    $proc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d `"$dir`" && $cmd" -Wait -PassThru -NoNewWindow
    if ($proc.ExitCode -eq 0) {
        Write-Host "[PASS] ($([math]::Round($sw.Elapsed.TotalSeconds, 1))s)" -ForegroundColor Green
    } else {
        Write-Host "[FAIL]" -ForegroundColor Red
        $failed += $svc
    }
}

Write-Host "------------------------------------------------------------" -ForegroundColor Cyan
if ($failed.Count -eq 0) {
    Write-Host "SUCCESS: All 11 microservices compiled with 0 errors!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Compilation failed for: $($failed -join ', ')" -ForegroundColor Red
    exit 1
}

