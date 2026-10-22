#!/usr/bin/env bash
# ============================================================================
# AeroBook Platform Smoke Check (Bash)
# ============================================================================
set -euo pipefail

DIRECT="${1:-}"

services=(
    "API Gateway|http://localhost:8083/api/gateway/health|http://localhost:8083/api/gateway/health"
    "Auth Service|http://localhost:8083/api/auth/health|http://localhost:8082/api/auth/health"
    "User Service|http://localhost:8083/api/v1/users/health|http://localhost:8084/api/v1/users/health"
    "Flight Service|http://localhost:8083/api/flights/health|http://localhost:8087/api/flights/health"
    "Fare Service|http://localhost:8083/api/fares/health|http://localhost:8089/api/fares/health"
    "Booking Service|http://localhost:8083/api/bookings/health|http://localhost:8088/api/bookings/health"
    "Check-In Service|http://localhost:8083/api/check-ins/health|http://localhost:8090/api/check-ins/health"
    "Notification Service|http://localhost:8083/api/notifications/health|http://localhost:8091/api/notifications/health"
    "Payment Service|http://localhost:8083/api/payments/health|http://localhost:8092/api/payments/health"
)

echo "============================================================"
echo "       AeroBook Platform Microservices Health Probe        "
echo "============================================================"

all_pass=true

for entry in "${services[@]}"; do
    IFS="|" read -r name gateway_url direct_url <<< "${entry}"
    if [ "${DIRECT}" = "--direct" ]; then
        target="${direct_url}"
    else
        target="${gateway_url}"
    fi

    if curl -s -f -m 5 "${target}" > /dev/null; then
        printf "[PASS] %-22s -> %s\n" "${name}" "${target}"
    else
        printf "[FAIL] %-22s -> %s\n" "${name}" "${target}"
        all_pass=false
    fi
done

echo "------------------------------------------------------------"
if [ "${all_pass}" = true ]; then
    echo "All tested services are HEALTHY and reachable!"
    exit 0
else
    echo "One or more services did not respond."
    exit 1
fi
