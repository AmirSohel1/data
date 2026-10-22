-- ============================================================================
-- AeroBook Platform Data Reset Script (Clears development tables safely)
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE aerobook_checkin_db.check_in;
TRUNCATE TABLE aerobook_payment_db.payments;
TRUNCATE TABLE aerobook_booking_db.passengers;
TRUNCATE TABLE aerobook_booking_db.bookings;

-- Truncate fare tables if present
TRUNCATE TABLE aerobook_fare_db.fares;
DROP TABLE IF EXISTS aerobook_fare_db.coupons;

-- Truncate flight tables
TRUNCATE TABLE aerobook_flight_db.flights;
TRUNCATE TABLE aerobook_flight_db.aircrafts;

-- Truncate notification tables
TRUNCATE TABLE aerobook_notification_db.notifications;

-- Truncate user & incident tables
DROP TABLE IF EXISTS aerobook_user_db.incident_reports;
TRUNCATE TABLE aerobook_user_db.users;

-- Truncate auth credentials and refresh tokens
TRUNCATE TABLE aerobook_auth_db.refresh_tokens;
TRUNCATE TABLE aerobook_auth_db.credentials;

SET FOREIGN_KEY_CHECKS = 1;
