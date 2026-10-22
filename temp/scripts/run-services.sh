#!/usr/bin/env bash
# ============================================================================
# AeroBook Microservices Orchestrator (Bash)
# ============================================================================
set -euo pipefail

ACTION="${1:-start}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Declare services in order: [key:port:dir:name]
SERVICES=(
    "discovery:8761:service-discovery:Service Discovery (Eureka)"
    "gateway:8083:api-gateway:API Gateway"
    "auth:8082:auth-service:Auth Service"
    "user:8084:user-service:User Service"
    "flight:8087:flight-service:Flight Service"
    "booking:8088:booking-service:Booking Service"
    "fare:8089:fare-service:Fare Service"
    "checkin:8090:check-in-service:Check-In Service"
    "notification:8091:notification-service:Notification Service"
    "payment:8092:payment-service:Payment Service"
)

get_pid_by_port() {
    local port="$1"
    if command -v lsof &>/dev/null; then
        lsof -ti tcp:"${port}" || true
    elif command -v netstat &>/dev/null; then
        netstat -nlp 2>/dev/null | grep ":${port} " | awk '{print $7}' | cut -d'/' -f1 || true
    fi
}

stop_all() {
    echo "============================================================"
    echo "       Stopping AeroBook Microservices                      "
    echo "============================================================"
    for entry in "${SERVICES[@]}"; do
        IFS=":" read -r key port dir name <<< "${entry}"
        pid=$(get_pid_by_port "${port}")
        if [ -n "${pid}" ]; then
            echo "Stopping ${name} (Port ${port}, PID ${pid})..."
            kill -9 ${pid} 2>/dev/null || true
        fi
    done
    echo "All services stopped."
}

show_status() {
    echo "============================================================"
    echo "       AeroBook Microservices Status Dashboard              "
    echo "============================================================"
    printf "%-32s %-8s %-10s %-15s\n" "Service Name" "Port" "PID" "Status"
    printf "%-32s %-8s %-10s %-15s\n" "--------------------------------" "------" "---------" "--------------"
    for entry in "${SERVICES[@]}"; do
        IFS=":" read -r key port dir name <<< "${entry}"
        pid=$(get_pid_by_port "${port}")
        if [ -n "${pid}" ]; then
            printf "%-32s %-8s %-10s \033[0;32mUP\033[0m\n" "${name}" "${port}" "${pid}"
        else
            printf "%-32s %-8s %-10s \033[0;31mDOWN\033[0m\n" "${name}" "${port}" "-"
        fi
    done
}

start_all() {
    echo "============================================================"
    echo "       Starting AeroBook Microservices                      "
    echo "============================================================"
    mkdir -p "${ROOT_DIR}/logs"

    # 1. Start Eureka first
    echo "[1/2] Launching Service Discovery (Eureka) on port 8761..."
    (cd "${ROOT_DIR}/service-discovery" && ./mvnw spring-boot:run > "${ROOT_DIR}/logs/service-discovery.log" 2>&1 &)

    echo -n "Waiting for Eureka to bind port 8761..."
    for i in {1..40}; do
        pid=$(get_pid_by_port 8761)
        if [ -n "${pid}" ]; then
            echo " [READY]"
            break
        fi
        sleep 1
        echo -n "."
    done

    # 2. Start remaining microservices
    echo "[2/2] Launching backend microservices..."
    for entry in "${SERVICES[@]:1}"; do
        IFS=":" read -r key port dir name <<< "${entry}"
        echo "  -> Starting ${name} (Port ${port})..."
        (cd "${ROOT_DIR}/${dir}" && ./mvnw spring-boot:run > "${ROOT_DIR}/logs/${dir}.log" 2>&1 &)
        sleep 1
    done

    echo ""
    echo "All microservices launched in the background. Logs in ${ROOT_DIR}/logs/"
    echo "Run './scripts/run-services.sh status' to monitor progress."
}

case "${ACTION}" in
    stop)
        stop_all
        ;;
    status)
        show_status
        ;;
    restart)
        stop_all
        sleep 2
        start_all
        ;;
    start|*)
        start_all
        ;;
esac
