-- ============================================================================
-- AeroBook Platform Data Count / Health Check Script
-- ============================================================================

SELECT 'aerobook_auth_db.credentials' AS `table_name`, COUNT(*) AS `row_count` FROM aerobook_auth_db.credentials
UNION ALL
SELECT 'aerobook_auth_db.refresh_tokens', COUNT(*) FROM aerobook_auth_db.refresh_tokens
UNION ALL
SELECT 'aerobook_user_db.users', COUNT(*) FROM aerobook_user_db.users
UNION ALL
SELECT 'aerobook_user_db.incident_reports', COUNT(*) FROM aerobook_user_db.incident_reports
UNION ALL
SELECT 'aerobook_flight_db.aircrafts', COUNT(*) FROM aerobook_flight_db.aircrafts
UNION ALL
SELECT 'aerobook_flight_db.flights', COUNT(*) FROM aerobook_flight_db.flights
UNION ALL
SELECT 'aerobook_fare_db.fares', COUNT(*) FROM aerobook_fare_db.fares
UNION ALL
SELECT 'aerobook_fare_db.coupons', COUNT(*) FROM aerobook_fare_db.coupons
UNION ALL
SELECT 'aerobook_booking_db.bookings', COUNT(*) FROM aerobook_booking_db.bookings
UNION ALL
SELECT 'aerobook_booking_db.passengers', COUNT(*) FROM aerobook_booking_db.passengers
UNION ALL
SELECT 'aerobook_checkin_db.check_in', COUNT(*) FROM aerobook_checkin_db.check_in
UNION ALL
SELECT 'aerobook_payment_db.payments', COUNT(*) FROM aerobook_payment_db.payments
UNION ALL
SELECT 'aerobook_notification_db.notifications', COUNT(*) FROM aerobook_notification_db.notifications;
