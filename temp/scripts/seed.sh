#!/usr/bin/env bash
# ============================================================================
# AeroBook Platform Master Database Seeding Runner (Bash)
# ============================================================================
set -euo pipefail

ACTION="${1:-seed}"
DB_USER="${MYSQL_USERNAME:-root}"
DB_PASS="${MYSQL_PASSWORD:-Amir1121@}"
DB_HOST="${MYSQL_HOST:-localhost}"
DB_PORT="${MYSQL_PORT:-3306}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SEED_SQL="${SCRIPT_DIR}/seed.sql"
RESET_SQL="${SCRIPT_DIR}/reset.sql"
CHECK_SQL="${SCRIPT_DIR}/check.sql"

if ! command -v mysql &> /dev/null; then
    echo "ERROR: mysql CLI command not found in PATH." >&2
    exit 1
fi

invoke_sql() {
    local file="$1"
    mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASS}" --default-character-set=utf8mb4 -e "source ${file}"
}

show_counts() {
    echo ""
    echo "=== AeroBook Microservices Database Table Row Counts ==="
    mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASS}" -t -e "source ${CHECK_SQL}"
}

echo "============================================================"
echo "   AeroBook Cloud Airline Platform - Data Seeding Tool      "
echo "============================================================"
echo "Target Host: ${DB_HOST}:${DB_PORT} | User: ${DB_USER} | Action: ${ACTION}"

case "${ACTION}" in
    --reset|reset|-r)
        echo ""
        echo "[1/3] Truncating development databases..."
        invoke_sql "${RESET_SQL}"
        echo "Databases truncated successfully."
        echo ""
        echo "[2/3] Seeding clean baseline data across all microservices..."
        invoke_sql "${SEED_SQL}"
        echo "Master data seeded successfully."
        show_counts
        ;;
    --check|check|-c)
        show_counts
        ;;
    *)
        echo ""
        echo "[1/2] Executing idempotent data seed..."
        invoke_sql "${SEED_SQL}"
        echo "Master data seeded successfully."
        show_counts
        ;;
esac

echo ""
echo "Ready for testing! Logins:"
echo "  Admin:     admin@aerobook.com   / Admin@123 (or Password123!)"
echo "  Staff:     staff@aerobook.com   / Staff@123 (or Password123!)"
echo "  Passenger: priya@gmail.com      / Passenger@123"
echo "  Passenger: asha.khan@example.com / Password123!"
