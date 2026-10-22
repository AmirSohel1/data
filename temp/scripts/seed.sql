-- ============================================================================
-- AeroBook Platform Master Data Seeding Script (Expanded Dataset: 15-30 Samples Per Domain)
-- ============================================================================

-- 1. Ensure all 8 microservice databases exist
CREATE DATABASE IF NOT EXISTS aerobook_auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS aerobook_user_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS aerobook_flight_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS aerobook_fare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS aerobook_booking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS aerobook_checkin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS aerobook_notification_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS aerobook_payment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Ensure supporting schema tables exist
CREATE TABLE IF NOT EXISTS aerobook_fare_db.coupons (
    id BIGINT NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    max_discount DECIMAL(10, 2) NOT NULL,
    min_fare DECIMAL(10, 2) DEFAULT 0.00,
    usage_limit INT DEFAULT 1000,
    usage_count INT DEFAULT 0,
    valid_from DATE,
    valid_until DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME,
    updated_at DATETIME,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS aerobook_user_db.incident_reports (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    reported_by VARCHAR(100) NOT NULL,
    reason VARCHAR(500) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    notes VARCHAR(1000),
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. USERS (aerobook_user_db) & CREDENTIALS (aerobook_auth_db) [20 Accounts]
-- ============================================================================
-- Passwords:
-- Admin@123     -> $2a$10$kIC.hlmnRgBYSeaKbos/MuR97vc7TpPZW5C.KD6kghm2JJTOlv8c2
-- Staff@123     -> $2a$10$2pmUQcIGKfAhq1Q5C5lZEemkKod/aidhj1LRbm7mvMIsDUTzfR6Ce
-- Passenger@123 -> $2a$10$vfAZQsYzztoaFLKQrT21ZuzuzRHFrTrIgug9g9wlJgWBgHmp/ImWq
-- Password123!  -> $2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.

INSERT INTO aerobook_user_db.users (user_id, first_name, last_name, email, phone_number, date_of_birth, nationality, role, created_at, updated_at)
VALUES
(1, 'Asha', 'Khan', 'asha.khan@example.com', '9876543210', '1998-05-12', 'Indian', 'ROLE_USER', NOW(), NOW()),
(2, 'Priya', 'Sharma', 'priya@gmail.com', '9811122233', '1995-08-20', 'Indian', 'ROLE_USER', NOW(), NOW()),
(3, 'Rahul', 'Verma', 'rahul.verma@example.com', '9822233344', '1992-11-15', 'Indian', 'ROLE_USER', NOW(), NOW()),
(4, 'Rohan', 'Gupta', 'rohan.gupta@example.com', '9833344455', '1990-03-25', 'Indian', 'ROLE_USER', NOW(), NOW()),
(5, 'Ananya', 'Iyer', 'ananya.iyer@example.com', '9844455566', '1996-07-19', 'Indian', 'ROLE_USER', NOW(), NOW()),
(6, 'Vikram', 'Malhotra', 'vikram.m@example.com', '9855566677', '1989-02-14', 'Indian', 'ROLE_USER', NOW(), NOW()),
(7, 'Sneha', 'Patel', 'sneha.patel@example.com', '9866677788', '1994-09-30', 'Indian', 'ROLE_USER', NOW(), NOW()),
(8, 'Kabir', 'Mehta', 'kabir.mehta@example.com', '9877788899', '1991-12-05', 'Indian', 'ROLE_USER', NOW(), NOW()),
(9, 'Neha', 'Reddy', 'neha.reddy@example.com', '9888899900', '1997-04-18', 'Indian', 'ROLE_USER', NOW(), NOW()),
(10, 'System', 'Admin', 'admin@aerobook.com', '9999900001', '1985-01-01', 'Indian', 'ROLE_ADMIN', NOW(), NOW()),
(11, 'Airport', 'Staff', 'staff@aerobook.com', '9999900002', '1988-06-15', 'Indian', 'ROLE_STAFF', NOW(), NOW()),
(12, 'Amir', 'Sohel', 'sohel@aerobook.com', '9999900003', '1999-10-10', 'Indian', 'ROLE_USER', NOW(), NOW()),
(13, 'Rajesh', 'Koothrappali', 'rajesh.k@example.com', '9812345670', '1987-10-06', 'Indian', 'ROLE_USER', NOW(), NOW()),
(14, 'Meera', 'Nair', 'meera.nair@example.com', '9823456781', '1993-01-22', 'Indian', 'ROLE_USER', NOW(), NOW()),
(15, 'Arjun', 'Kapoor', 'arjun.k@example.com', '9834567892', '1990-08-11', 'Indian', 'ROLE_USER', NOW(), NOW()),
(16, 'Dev', 'Admin', 'admin2@aerobook.com', '9999900004', '1986-03-12', 'Indian', 'ROLE_ADMIN', NOW(), NOW()),
(17, 'Operations', 'Staff', 'staff2@aerobook.com', '9999900005', '1989-09-28', 'Indian', 'ROLE_STAFF', NOW(), NOW()),
(18, 'Gate', 'Officer', 'staff3@aerobook.com', '9999900006', '1991-05-14', 'Indian', 'ROLE_STAFF', NOW(), NOW()),
(19, 'Kavita', 'Krishnan', 'kavita.k@example.com', '9845678903', '1995-11-03', 'Indian', 'ROLE_USER', NOW(), NOW()),
(20, 'Sameer', 'Deshmukh', 'sameer.d@example.com', '9856789014', '1988-07-27', 'Indian', 'ROLE_USER', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    phone_number = VALUES(phone_number),
    role = VALUES(role),
    updated_at = NOW();

INSERT INTO aerobook_auth_db.credentials (credential_id, user_id, email, password, role, created_at, updated_at)
VALUES
(1, 1, 'asha.khan@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(2, 2, 'priya@gmail.com', '$2a$10$vfAZQsYzztoaFLKQrT21ZuzuzRHFrTrIgug9g9wlJgWBgHmp/ImWq', 'ROLE_USER', NOW(), NOW()),
(3, 3, 'rahul.verma@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(4, 4, 'rohan.gupta@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(5, 5, 'ananya.iyer@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(6, 6, 'vikram.m@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(7, 7, 'sneha.patel@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(8, 8, 'kabir.mehta@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(9, 9, 'neha.reddy@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(10, 10, 'admin@aerobook.com', '$2a$10$kIC.hlmnRgBYSeaKbos/MuR97vc7TpPZW5C.KD6kghm2JJTOlv8c2', 'ROLE_ADMIN', NOW(), NOW()),
(11, 11, 'staff@aerobook.com', '$2a$10$2pmUQcIGKfAhq1Q5C5lZEemkKod/aidhj1LRbm7mvMIsDUTzfR6Ce', 'ROLE_STAFF', NOW(), NOW()),
(12, 12, 'sohel@aerobook.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(13, 13, 'rajesh.k@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(14, 14, 'meera.nair@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(15, 15, 'arjun.k@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(16, 16, 'admin2@aerobook.com', '$2a$10$kIC.hlmnRgBYSeaKbos/MuR97vc7TpPZW5C.KD6kghm2JJTOlv8c2', 'ROLE_ADMIN', NOW(), NOW()),
(17, 17, 'staff2@aerobook.com', '$2a$10$2pmUQcIGKfAhq1Q5C5lZEemkKod/aidhj1LRbm7mvMIsDUTzfR6Ce', 'ROLE_STAFF', NOW(), NOW()),
(18, 18, 'staff3@aerobook.com', '$2a$10$2pmUQcIGKfAhq1Q5C5lZEemkKod/aidhj1LRbm7mvMIsDUTzfR6Ce', 'ROLE_STAFF', NOW(), NOW()),
(19, 19, 'kavita.k@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW()),
(20, 20, 'sameer.d@example.com', '$2a$10$KHWiMyWHCWIBzzwKMbPGjOpFasTmXZ4M9pzqbNS7qX3xNQo88rqc.', 'ROLE_USER', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    password = VALUES(password),
    role = VALUES(role),
    updated_at = NOW();

-- ============================================================================
-- 4. FLEET AIRCRAFT (aerobook_flight_db) [16 Models]
-- ============================================================================
INSERT INTO aerobook_flight_db.aircrafts (id, aircraft_code, aircraft_name, manufacturer, capacity, status, created_at, updated_at)
VALUES
(1, 'AI-A320-1', 'Airbus A320-200', 'Airbus', 180, 'ACTIVE', NOW(), NOW()),
(2, '6E-B738-1', 'Boeing 737-800', 'Boeing', 189, 'ACTIVE', NOW(), NOW()),
(3, 'AI-A359-1', 'Airbus A350-900', 'Airbus', 300, 'ACTIVE', NOW(), NOW()),
(4, 'UK-B77W-1', 'Boeing 777-300ER', 'Boeing', 350, 'ACTIVE', NOW(), NOW()),
(5, 'SG-AT76-1', 'ATR 72-600', 'ATR', 72, 'ACTIVE', NOW(), NOW()),
(6, '6E-A321-1', 'Airbus A321neo', 'Airbus', 222, 'ACTIVE', NOW(), NOW()),
(7, 'AI-B789-1', 'Boeing 787-9 Dreamliner', 'Boeing', 296, 'ACTIVE', NOW(), NOW()),
(8, 'UK-A320-2', 'Airbus A320neo', 'Airbus', 164, 'ACTIVE', NOW(), NOW()),
(9, 'QP-B38M-1', 'Boeing 737 MAX 8', 'Boeing', 189, 'ACTIVE', NOW(), NOW()),
(10, 'SG-DH8D-1', 'De Havilland Dash 8 Q400', 'De Havilland', 78, 'ACTIVE', NOW(), NOW()),
(11, 'IX-B738-2', 'Boeing 737-800 NextGen', 'Boeing', 186, 'ACTIVE', NOW(), NOW()),
(12, 'AI-A321-2', 'Airbus A321XLR', 'Airbus', 206, 'ACTIVE', NOW(), NOW()),
(13, '6E-A320-3', 'Airbus A320ceo', 'Airbus', 180, 'MAINTENANCE', NOW(), NOW()),
(14, 'AI-B772-1', 'Boeing 777-200LR', 'Boeing', 238, 'ACTIVE', NOW(), NOW()),
(15, 'UK-B789-2', 'Boeing 787-9 Dreamliner Star', 'Boeing', 299, 'ACTIVE', NOW(), NOW()),
(16, 'G8-A320-4', 'Airbus A320neo Express', 'Airbus', 186, 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    aircraft_name = VALUES(aircraft_name),
    capacity = VALUES(capacity),
    status = VALUES(status),
    updated_at = NOW();

-- ============================================================================
-- 5. FLIGHT SCHEDULES (aerobook_flight_db) [25 Scheduled Commercial Flights]
-- ============================================================================
INSERT INTO aerobook_flight_db.flights (id, flight_number, airline_name, source, destination, departure_time, arrival_time, total_seats, available_seats, base_fare, aircraft_id, status)
VALUES
-- Scheduled upcoming commercial flights (all active and bookable)
(1, 'AI101', 'Air India', 'Mumbai', 'Delhi', DATE_ADD(NOW(), INTERVAL 3 HOUR), DATE_ADD(NOW(), INTERVAL 5 HOUR), 180, 178, 4500.00, 1, 'SCHEDULED'),
(2, '6E202', 'IndiGo', 'Delhi', 'Mumbai', DATE_ADD(NOW(), INTERVAL 5 HOUR), DATE_ADD(NOW(), INTERVAL 7 HOUR), 189, 188, 4200.00, 2, 'SCHEDULED'),
(3, 'UK801', 'Vistara', 'Delhi', 'Bengaluru', DATE_ADD(NOW(), INTERVAL 7 HOUR), DATE_ADD(NOW(), INTERVAL 9 HOUR), 164, 162, 5200.00, 8, 'SCHEDULED'),
(4, 'AI205', 'Air India', 'Mumbai', 'Bengaluru', DATE_ADD(NOW(), INTERVAL 9 HOUR), DATE_ADD(NOW(), INTERVAL 11 HOUR), 180, 179, 3800.00, 1, 'SCHEDULED'),
(5, '6E501', 'IndiGo', 'Bengaluru', 'Delhi', DATE_ADD(NOW(), INTERVAL 11 HOUR), DATE_ADD(NOW(), INTERVAL 13 HOUR), 222, 220, 4900.00, 6, 'SCHEDULED'),

-- Today active / scheduled flights
(6, 'AI103', 'Air India', 'Mumbai', 'Delhi', NOW() + INTERVAL 2 HOUR, NOW() + INTERVAL 4 HOUR + INTERVAL 15 MINUTE, 180, 179, 4800.00, 1, 'SCHEDULED'),
(7, '6E303', 'IndiGo', 'Delhi', 'Bengaluru', NOW() + INTERVAL 4 HOUR, NOW() + INTERVAL 6 HOUR + INTERVAL 45 MINUTE, 189, 186, 5100.00, 2, 'SCHEDULED'),
(8, 'UK707', 'Vistara', 'Delhi', 'Goa', NOW() + INTERVAL 6 HOUR, NOW() + INTERVAL 8 HOUR + INTERVAL 30 MINUTE, 300, 298, 5500.00, 3, 'SCHEDULED'),
(9, 'SG401', 'SpiceJet', 'Goa', 'Mumbai', NOW() + INTERVAL 7 HOUR, NOW() + INTERVAL 8 HOUR + INTERVAL 15 MINUTE, 72, 71, 3200.00, 5, 'SCHEDULED'),
(10, 'AI301', 'Air India', 'Mumbai', 'Kolkata', NOW() + INTERVAL 8 HOUR, NOW() + INTERVAL 10 HOUR + INTERVAL 45 MINUTE, 350, 348, 4600.00, 4, 'SCHEDULED'),

-- Tomorrow flights
(11, '6E602', 'IndiGo', 'Kolkata', 'Delhi', DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 6 HOUR, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR + INTERVAL 30 MINUTE, 189, 189, 4400.00, 2, 'SCHEDULED'),
(12, 'UK905', 'Vistara', 'Delhi', 'Hyderabad', DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 11 HOUR + INTERVAL 15 MINUTE, 164, 163, 3900.00, 8, 'SCHEDULED'),
(13, '6E803', 'IndiGo', 'Hyderabad', 'Chennai', DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 13 HOUR, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 14 HOUR + INTERVAL 10 MINUTE, 189, 187, 3100.00, 2, 'SCHEDULED'),
(14, 'AI405', 'Air India', 'Chennai', 'Mumbai', DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 16 HOUR, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR + INTERVAL 05 MINUTE, 296, 294, 4300.00, 7, 'SCHEDULED'),
(15, 'QP110', 'Akasa Air', 'Mumbai', 'Ahmedabad', DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 19 HOUR, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 20 HOUR + INTERVAL 10 MINUTE, 189, 188, 2900.00, 9, 'SCHEDULED'),

-- In 2 days
(16, '6E415', 'IndiGo', 'Ahmedabad', 'Delhi', DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 7 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 8 HOUR + INTERVAL 35 MINUTE, 222, 221, 3600.00, 6, 'SCHEDULED'),
(17, 'AI512', 'Air India', 'Delhi', 'Kochi', DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 13 HOUR + INTERVAL 10 MINUTE, 296, 295, 6200.00, 7, 'SCHEDULED'),
(18, 'UK620', 'Vistara', 'Kochi', 'Bengaluru', DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 15 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 16 HOUR + INTERVAL 05 MINUTE, 164, 164, 2800.00, 8, 'SCHEDULED'),
(19, '6E721', 'IndiGo', 'Bengaluru', 'Jaipur', DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 19 HOUR + INTERVAL 25 MINUTE, 189, 189, 4700.00, 2, 'SCHEDULED'),
(20, 'SG830', 'SpiceJet', 'Jaipur', 'Mumbai', DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 21 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 22 HOUR + INTERVAL 50 MINUTE, 78, 78, 3700.00, 10, 'SCHEDULED'),

-- In 3 to 5 days
(21, 'AI601', 'Air India', 'Mumbai', 'Goa', DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 8 HOUR, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR + INTERVAL 15 MINUTE, 180, 180, 3400.00, 1, 'SCHEDULED'),
(22, '6E902', 'IndiGo', 'Goa', 'Hyderabad', DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 12 HOUR, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 13 HOUR + INTERVAL 20 MINUTE, 186, 186, 3300.00, 11, 'SCHEDULED'),
(23, 'UK711', 'Vistara', 'Hyderabad', 'Delhi', DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 10 HOUR, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 12 HOUR + INTERVAL 20 MINUTE, 299, 299, 4100.00, 15, 'SCHEDULED'),
(24, 'IX215', 'Air India Express', 'Delhi', 'Srinagar', DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 14 HOUR, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 15 HOUR + INTERVAL 30 MINUTE, 186, 186, 4800.00, 11, 'SCHEDULED'),
(25, '6E330', 'IndiGo', 'Srinagar', 'Mumbai', DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 11 HOUR, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 13 HOUR + INTERVAL 50 MINUTE, 222, 222, 6500.00, 6, 'SCHEDULED')
ON DUPLICATE KEY UPDATE 
    available_seats = VALUES(available_seats),
    base_fare = VALUES(base_fare),
    status = VALUES(status);

-- ============================================================================
-- 6. TIERED FARES & COUPONS (aerobook_fare_db) [25 Fares & 16 Coupons]
-- ============================================================================
INSERT INTO aerobook_fare_db.fares (id, flight_id, economy_fare, business_fare, first_class_fare, tax_percentage, discount_percentage, effective_date, active)
VALUES
(1, 1, 4500.00, 9500.00, 18000.00, 18.00, 0.00, CURDATE(), 1),
(2, 2, 4200.00, 9000.00, 17500.00, 18.00, 5.00, CURDATE(), 1),
(3, 3, 5200.00, 11000.00, 21000.00, 18.00, 10.00, CURDATE(), 1),
(4, 4, 3800.00, 8500.00, 16000.00, 12.00, 0.00, CURDATE(), 1),
(5, 5, 4900.00, 10000.00, 19000.00, 18.00, 5.00, CURDATE(), 1),
(6, 6, 4800.00, 10500.00, 19500.00, 18.00, 0.00, CURDATE(), 1),
(7, 7, 5100.00, 10800.00, 20500.00, 18.00, 5.00, CURDATE(), 1),
(8, 8, 5500.00, 12000.00, 22000.00, 18.00, 15.00, CURDATE(), 1),
(9, 9, 3200.00, 7500.00, 14000.00, 12.00, 0.00, CURDATE(), 1),
(10, 10, 4600.00, 9800.00, 18500.00, 18.00, 0.00, CURDATE(), 1),
(11, 11, 4400.00, 9200.00, 17800.00, 18.00, 10.00, CURDATE(), 1),
(12, 12, 3900.00, 8800.00, 16500.00, 12.00, 5.00, CURDATE(), 1),
(13, 13, 3100.00, 7000.00, 13500.00, 5.00, 0.00, CURDATE(), 1),
(14, 14, 4300.00, 9100.00, 17200.00, 18.00, 0.00, CURDATE(), 1),
(15, 15, 2900.00, 6500.00, 12500.00, 5.00, 0.00, CURDATE(), 1),
(16, 16, 3600.00, 8000.00, 15000.00, 12.00, 5.00, CURDATE(), 1),
(17, 17, 6200.00, 13500.00, 24000.00, 18.00, 10.00, CURDATE(), 1),
(18, 18, 2800.00, 6200.00, 12000.00, 5.00, 0.00, CURDATE(), 1),
(19, 19, 4700.00, 9900.00, 18800.00, 18.00, 0.00, CURDATE(), 1),
(20, 20, 3700.00, 8200.00, 15500.00, 12.00, 5.00, CURDATE(), 1),
(21, 21, 3400.00, 7800.00, 14800.00, 12.00, 0.00, CURDATE(), 1),
(22, 22, 3300.00, 7600.00, 14200.00, 12.00, 0.00, CURDATE(), 1),
(23, 23, 4100.00, 8900.00, 16800.00, 18.00, 5.00, CURDATE(), 1),
(24, 24, 4800.00, 10200.00, 19200.00, 18.00, 0.00, CURDATE(), 1),
(25, 25, 6500.00, 14000.00, 25000.00, 18.00, 8.00, CURDATE(), 1)
ON DUPLICATE KEY UPDATE 
    economy_fare = VALUES(economy_fare),
    business_fare = VALUES(business_fare),
    first_class_fare = VALUES(first_class_fare),
    tax_percentage = VALUES(tax_percentage),
    discount_percentage = VALUES(discount_percentage),
    active = VALUES(active);

INSERT INTO aerobook_fare_db.coupons (id, code, description, discount_percentage, max_discount, min_fare, usage_limit, usage_count, valid_from, valid_until, status, created_at, updated_at)
VALUES
(1, 'AERO2026', 'Flat 20% platform discount for 2026 season', 20.00, 1500.00, 3000.00, 1000, 48, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), 'ACTIVE', NOW(), NOW()),
(2, 'FLYHIGH20', 'Fly High 20% discount on metro flights', 20.00, 1000.00, 2500.00, 500, 62, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'ACTIVE', NOW(), NOW()),
(3, 'GOLD15', 'Gold tier frequent flyer 15% discount', 15.00, 750.00, 2000.00, 500, 18, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 120 DAY), 'ACTIVE', NOW(), NOW()),
(4, 'SPECIAL15', 'Weekend getaway special 15% discount', 15.00, 500.00, 1500.00, 300, 24, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'ACTIVE', NOW(), NOW()),
(5, 'WELCOME10', 'Welcome first-time passenger 10% coupon', 10.00, 400.00, 1000.00, 2000, 115, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 365 DAY), 'ACTIVE', NOW(), NOW()),
(6, 'MONSOON25', 'Monsoon season special 25% discount', 25.00, 2000.00, 4000.00, 200, 14, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'ACTIVE', NOW(), NOW()),
(7, 'STUDENT12', 'Student identity verified 12% allowance', 12.00, 600.00, 1500.00, 800, 35, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 180 DAY), 'ACTIVE', NOW(), NOW()),
(8, 'SENIOR15', 'Senior citizen priority 15% discount', 15.00, 800.00, 2000.00, 500, 22, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 180 DAY), 'ACTIVE', NOW(), NOW()),
(9, 'SUMMER20', 'Summer holiday family rebate', 20.00, 1200.00, 3500.00, 400, 50, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'ACTIVE', NOW(), NOW()),
(10, 'CORPORATE10', 'Corporate tie-up business travel discount', 10.00, 1000.00, 5000.00, 1000, 85, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 300 DAY), 'ACTIVE', NOW(), NOW()),
(11, 'EARLYBIRD18', 'Book 15 days in advance for 18% savings', 18.00, 900.00, 2500.00, 300, 29, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), 'ACTIVE', NOW(), NOW()),
(12, 'WEEKEND15', 'Friday to Sunday departure discount', 15.00, 650.00, 2000.00, 450, 41, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'ACTIVE', NOW(), NOW()),
(13, 'APPEXCLUSIVE', 'Mobile app checkout special voucher', 15.00, 550.00, 1800.00, 1500, 180, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 180 DAY), 'ACTIVE', NOW(), NOW()),
(14, 'FAMILY20', 'Group reservation 4+ passengers rebate', 20.00, 2500.00, 8000.00, 250, 19, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 120 DAY), 'ACTIVE', NOW(), NOW()),
(15, 'DIWALI30', 'Diwali festival celebratory offer', 30.00, 3000.00, 6000.00, 500, 0, DATE_ADD(CURDATE(), INTERVAL 30 DAY), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'ACTIVE', NOW(), NOW()),
(16, 'REDHOT10', 'Express flash sale discount code', 10.00, 350.00, 1200.00, 500, 88, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    discount_percentage = VALUES(discount_percentage),
    max_discount = VALUES(max_discount),
    status = VALUES(status),
    updated_at = NOW();

-- ============================================================================
-- 7. BOOKINGS & PASSENGERS (aerobook_booking_db) [22 Bookings & 25 Passengers]
-- ============================================================================
INSERT INTO aerobook_booking_db.bookings (booking_id, user_id, flight_id, pnr, total_fare, status, booking_date)
VALUES
-- Past completed bookings
(1, 1, 1, 'AB7K9M2Q', 5310.00, 'BOOKED', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 2, 3, 'AB3F8X1P', 5664.00, 'BOOKED', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 3, 4, 'AB9Y4K7L', 4256.00, 'BOOKED', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4, 4, 2, 'AB1C6V9Z', 4738.00, 'CANCELLED', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 5, 5, 'AB8R3T5N', 5488.00, 'BOOKED', DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- Active today bookings
(6, 1, 6, 'AB2M9W4Q', 5664.00, 'BOOKED', NOW() - INTERVAL 5 HOUR),
(7, 2, 7, 'AB4P1K8S', 6018.00, 'BOOKED', NOW() - INTERVAL 4 HOUR),
(8, 6, 8, 'AB6L3D7Y', 6125.00, 'BOOKED', NOW() - INTERVAL 3 HOUR),
(9, 7, 9, 'AB8T5F2V', 3584.00, 'BOOKED', NOW() - INTERVAL 3 HOUR),
(10, 8, 10, 'AB9X7N1J', 5428.00, 'BOOKED', NOW() - INTERVAL 2 HOUR),

-- Upcoming bookings (scheduled)
(11, 3, 11, 'AB1Z4C8H', 4928.00, 'BOOKED', NOW() - INTERVAL 1 HOUR),
(12, 9, 12, 'AB3Q8B5R', 4368.00, 'BOOKED', NOW() - INTERVAL 1 HOUR),
(13, 12, 13, 'AB5E2T9K', 3255.00, 'BOOKED', NOW()),
(14, 13, 14, 'AB7U6Y3P', 5074.00, 'BOOKED', NOW()),
(15, 14, 15, 'AB9W1A7X', 3045.00, 'BOOKED', NOW()),
(16, 15, 16, 'AB2D8S4M', 4032.00, 'BOOKED', NOW()),
(17, 19, 17, 'AB4G3H9L', 6944.00, 'BOOKED', NOW()),
(18, 20, 18, 'AB6J7V2K', 2940.00, 'BOOKED', NOW()),
(19, 1, 19, 'AB8K2X5N', 5546.00, 'BOOKED', NOW()),
(20, 2, 20, 'AB1L9M6P', 4144.00, 'PENDING', NOW()),
(21, 3, 21, 'AB3N5Q8R', 3808.00, 'PENDING', NOW()),
(22, 4, 10, 'AB5P7T1Z', 5428.00, 'CANCELLED', DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE 
    status = VALUES(status),
    total_fare = VALUES(total_fare);

INSERT INTO aerobook_booking_db.passengers (passenger_id, booking_id, first_name, last_name, gender, age, seat_number)
VALUES
(1, 1, 'Asha', 'Khan', 'Female', 26, '12A'),
(2, 2, 'Priya', 'Sharma', 'Female', 29, '14C'),
(3, 3, 'Rahul', 'Verma', 'Male', 32, '10B'),
(4, 4, 'Rohan', 'Gupta', 'Male', 34, '18F'),
(5, 5, 'Ananya', 'Iyer', 'Female', 28, '7D'),
(6, 6, 'Asha', 'Khan', 'Female', 26, '3A'),
(7, 7, 'Priya', 'Sharma', 'Female', 29, '15B'),
(8, 8, 'Vikram', 'Malhotra', 'Male', 35, '4C'),
(9, 9, 'Sneha', 'Patel', 'Female', 30, '11A'),
(10, 10, 'Kabir', 'Mehta', 'Male', 33, '8F'),
(11, 11, 'Rahul', 'Verma', 'Male', 32, '16C'),
(12, 12, 'Neha', 'Reddy', 'Female', 27, '9D'),
(13, 13, 'Amir', 'Sohel', 'Male', 25, '12B'),
(14, 14, 'Rajesh', 'Koothrappali', 'Male', 37, '5A'),
(15, 15, 'Meera', 'Nair', 'Female', 31, '14E'),
(16, 16, 'Arjun', 'Kapoor', 'Male', 34, '6C'),
(17, 17, 'Kavita', 'Krishnan', 'Female', 29, '8B'),
(18, 18, 'Sameer', 'Deshmukh', 'Male', 36, '10A'),
(19, 19, 'Asha', 'Khan', 'Female', 26, '15C'),
(20, 20, 'Priya', 'Sharma', 'Female', 29, '11D'),
(21, 21, 'Rahul', 'Verma', 'Male', 32, '7A'),
(22, 22, 'Rohan', 'Gupta', 'Male', 34, '19F'),
(23, 7, 'Karan', 'Sharma', 'Male', 32, '15C'),
(24, 8, 'Ritu', 'Malhotra', 'Female', 31, '4D'),
(25, 17, 'Ramesh', 'Krishnan', 'Male', 62, '8C')
ON DUPLICATE KEY UPDATE 
    seat_number = VALUES(seat_number);

-- ============================================================================
-- 8. CHECK-INS (aerobook_checkin_db) [18 Check-In Records]
-- ============================================================================
INSERT INTO aerobook_checkin_db.check_in (id, booking_id, passenger_name, seat_number, boarding_pass_number, status, checked_in_at)
VALUES
(1, 1, 'Asha Khan', '12A', 'BP-1-12A', 'BOARDED', DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 5 HOUR),
(2, 2, 'Priya Sharma', '14C', 'BP-2-14C', 'BOARDED', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 6 HOUR),
(3, 3, 'Rahul Verma', '10B', 'BP-3-10B', 'BOARDED', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 13 HOUR),
(4, 5, 'Ananya Iyer', '7D', 'BP-5-7D', 'BOARDED', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR),
(5, 6, 'Asha Khan', '3A', 'BP-6-3A', 'CHECKED_IN', NOW() - INTERVAL 1 HOUR),
(6, 7, 'Priya Sharma', '15B', 'BP-7-15B', 'CHECKED_IN', NOW() - INTERVAL 2 HOUR),
(7, 8, 'Vikram Malhotra', '4C', 'BP-8-4C', 'CHECKED_IN', NOW() - INTERVAL 3 HOUR),
(8, 9, 'Sneha Patel', '11A', 'BP-9-11A', 'CHECKED_IN', NOW() - INTERVAL 2 HOUR),
(9, 10, 'Kabir Mehta', '8F', 'BP-10-8F', 'CHECKED_IN', NOW() - INTERVAL 1 HOUR),
(10, 11, 'Rahul Verma', '16C', 'BP-11-16C', 'CHECKED_IN', NOW() - INTERVAL 45 MINUTE),
(11, 12, 'Neha Reddy', '9D', 'BP-12-9D', 'CHECKED_IN', NOW() - INTERVAL 30 MINUTE),
(12, 13, 'Amir Sohel', '12B', 'BP-13-12B', 'CHECKED_IN', NOW() - INTERVAL 25 MINUTE),
(13, 14, 'Rajesh Koothrappali', '5A', 'BP-14-5A', 'CHECKED_IN', NOW() - INTERVAL 20 MINUTE),
(14, 15, 'Meera Nair', '14E', 'BP-15-14E', 'CHECKED_IN', NOW() - INTERVAL 15 MINUTE),
(15, 16, 'Arjun Kapoor', '6C', 'BP-16-6C', 'CHECKED_IN', NOW() - INTERVAL 10 MINUTE),
(16, 17, 'Kavita Krishnan', '8B', 'BP-17-8B', 'CHECKED_IN', NOW() - INTERVAL 5 MINUTE),
(17, 18, 'Sameer Deshmukh', '10A', 'BP-18-10A', 'CHECKED_IN', NOW() - INTERVAL 2 MINUTE),
(18, 19, 'Asha Khan', '15C', 'BP-19-15C', 'CHECKED_IN', NOW() - INTERVAL 1 MINUTE)
ON DUPLICATE KEY UPDATE 
    seat_number = VALUES(seat_number),
    status = VALUES(status);

-- ============================================================================
-- 9. PAYMENTS (aerobook_payment_db) [22 Payment Transactions]
-- ============================================================================
INSERT INTO aerobook_payment_db.payments (id, booking_id, pnr, order_id, payment_id, amount, amount_in_paise, currency, receipt, status, signature, refund_id, refund_amount, created_at, updated_at)
VALUES
(1, 1, 'AB7K9M2Q', 'order_RzpDev00000001', 'pay_RzpDev00000001', 5310.00, 531000, 'INR', 'RCP-1', 'CAPTURED', 'sig_simulated_dev_0001', NULL, NULL, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 2, 'AB3F8X1P', 'order_RzpDev00000002', 'pay_RzpDev00000002', 5664.00, 566400, 'INR', 'RCP-2', 'CAPTURED', 'sig_simulated_dev_0002', NULL, NULL, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 3, 'AB9Y4K7L', 'order_RzpDev00000003', 'pay_RzpDev00000003', 4256.00, 425600, 'INR', 'RCP-3', 'CAPTURED', 'sig_simulated_dev_0003', NULL, NULL, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4, 4, 'AB1C6V9Z', 'order_RzpDev00000004', 'pay_RzpDev00000004', 4738.00, 473800, 'INR', 'RCP-4', 'REFUNDED', 'sig_simulated_dev_0004', 'rfnd_RzpDev00000004', 4738.00, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 5, 'AB8R3T5N', 'order_RzpDev00000005', 'pay_RzpDev00000005', 5488.00, 548800, 'INR', 'RCP-5', 'CAPTURED', 'sig_simulated_dev_0005', NULL, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, 6, 'AB2M9W4Q', 'order_RzpDev00000006', 'pay_RzpDev00000006', 5664.00, 566400, 'INR', 'RCP-6', 'CAPTURED', 'sig_simulated_dev_0006', NULL, NULL, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 5 HOUR),
(7, 7, 'AB4P1K8S', 'order_RzpDev00000007', 'pay_RzpDev00000007', 6018.00, 601800, 'INR', 'RCP-7', 'CAPTURED', 'sig_simulated_dev_0007', NULL, NULL, NOW() - INTERVAL 4 HOUR, NOW() - INTERVAL 4 HOUR),
(8, 8, 'AB6L3D7Y', 'order_RzpDev00000008', 'pay_RzpDev00000008', 6125.00, 612500, 'INR', 'RCP-8', 'CAPTURED', 'sig_simulated_dev_0008', NULL, NULL, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 3 HOUR),
(9, 9, 'AB8T5F2V', 'order_RzpDev00000009', 'pay_RzpDev00000009', 3584.00, 358400, 'INR', 'RCP-9', 'CAPTURED', 'sig_simulated_dev_0009', NULL, NULL, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 3 HOUR),
(10, 10, 'AB9X7N1J', 'order_RzpDev00000010', 'pay_RzpDev00000010', 5428.00, 542800, 'INR', 'RCP-10', 'CAPTURED', 'sig_simulated_dev_0010', NULL, NULL, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR),
(11, 11, 'AB1Z4C8H', 'order_RzpDev00000011', 'pay_RzpDev00000011', 4928.00, 492800, 'INR', 'RCP-11', 'CAPTURED', 'sig_simulated_dev_0011', NULL, NULL, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 1 HOUR),
(12, 12, 'AB3Q8B5R', 'order_RzpDev00000012', 'pay_RzpDev00000012', 4368.00, 436800, 'INR', 'RCP-12', 'CAPTURED', 'sig_simulated_dev_0012', NULL, NULL, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 1 HOUR),
(13, 13, 'AB5E2T9K', 'order_RzpDev00000013', 'pay_RzpDev00000013', 3255.00, 325500, 'INR', 'RCP-13', 'CAPTURED', 'sig_simulated_dev_0013', NULL, NULL, NOW(), NOW()),
(14, 14, 'AB7U6Y3P', 'order_RzpDev00000014', 'pay_RzpDev00000014', 5074.00, 507400, 'INR', 'RCP-14', 'CAPTURED', 'sig_simulated_dev_0014', NULL, NULL, NOW(), NOW()),
(15, 15, 'AB9W1A7X', 'order_RzpDev00000015', 'pay_RzpDev00000015', 3045.00, 304500, 'INR', 'RCP-15', 'CAPTURED', 'sig_simulated_dev_0015', NULL, NULL, NOW(), NOW()),
(16, 16, 'AB2D8S4M', 'order_RzpDev00000016', 'pay_RzpDev00000016', 4032.00, 403200, 'INR', 'RCP-16', 'CAPTURED', 'sig_simulated_dev_0016', NULL, NULL, NOW(), NOW()),
(17, 17, 'AB4G3H9L', 'order_RzpDev00000017', 'pay_RzpDev00000017', 6944.00, 694400, 'INR', 'RCP-17', 'CAPTURED', 'sig_simulated_dev_0017', NULL, NULL, NOW(), NOW()),
(18, 18, 'AB6J7V2K', 'order_RzpDev00000018', 'pay_RzpDev00000018', 2940.00, 294000, 'INR', 'RCP-18', 'CAPTURED', 'sig_simulated_dev_0018', NULL, NULL, NOW(), NOW()),
(19, 19, 'AB8K2X5N', 'order_RzpDev00000019', 'pay_RzpDev00000019', 5546.00, 554600, 'INR', 'RCP-19', 'CAPTURED', 'sig_simulated_dev_0019', NULL, NULL, NOW(), NOW()),
(20, 20, 'AB1L9M6P', 'order_RzpDev00000020', NULL, 4144.00, 414400, 'INR', 'RCP-20', 'CREATED', NULL, NULL, NULL, NOW(), NOW()),
(21, 21, 'AB3N5Q8R', 'order_RzpDev00000021', NULL, 3808.00, 380800, 'INR', 'RCP-21', 'CREATED', NULL, NULL, NULL, NOW(), NOW()),
(22, 22, 'AB5P7T1Z', 'order_RzpDev00000022', 'pay_RzpDev00000022', 5428.00, 542800, 'INR', 'RCP-22', 'REFUNDED', 'sig_simulated_dev_0022', 'rfnd_RzpDev00000022', 5428.00, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW())
ON DUPLICATE KEY UPDATE 
    status = VALUES(status),
    payment_id = VALUES(payment_id),
    updated_at = NOW();

-- ============================================================================
-- 10. NOTIFICATIONS (aerobook_notification_db) [22 Notifications]
-- ============================================================================
INSERT INTO aerobook_notification_db.notifications (id, user_id, recipient_email, flight_number, type, title, message, status, read_at, created_at)
VALUES
(1, 1, 'asha.khan@example.com', 'AI101', 'BOOKING_CONFIRMED', 'Booking Confirmed - PNR AB7K9M2Q', 'Your flight AI101 from Mumbai to Delhi is confirmed. Seat: 12A.', 'READ', NOW(), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 1, 'asha.khan@example.com', 'AI101', 'CHECKIN_SUCCESS', 'Check-in Successful - Seat 12A', 'Boarding pass BP-1-12A generated. Please report at Gate 3.', 'READ', NOW(), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 2, 'priya@gmail.com', 'AI103', 'BOOKING_CONFIRMED', 'Booking Confirmed - PNR AB3F8X1P', 'Your flight AI103 from Mumbai to Delhi is confirmed. Seat: 14C.', 'READ', NOW(), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4, 2, 'priya@gmail.com', 'AI103', 'GATE_CHANGE', 'Gate Update - Flight AI103', 'Attention passenger: Flight AI103 gate changed to Gate 14B at Terminal 2.', 'UNREAD', NULL, NOW() - INTERVAL 2 HOUR),
(5, 3, 'rahul.verma@example.com', 'AI205', 'BOOKING_CONFIRMED', 'Booking Confirmed - PNR AB9Y4K7L', 'Your flight AI205 from Mumbai to Bengaluru is confirmed. Seat: 10B.', 'READ', NOW(), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(6, NULL, NULL, NULL, 'BROADCAST', 'Monsoon Weather Advisory', 'Flights across Mumbai and Delhi may experience minor routing delays due to rainfall.', 'UNREAD', NULL, NOW()),
(7, 1, 'asha.khan@example.com', NULL, 'INFO', 'Special 20% Holiday Discount', 'Use coupon code AERO2026 for 20% off on your next holiday trip with AeroBook.', 'UNREAD', NULL, NOW()),
(8, 4, 'rohan.gupta@example.com', '6E202', 'INFO', 'Booking Cancellation Refund', 'Your booking AB1C6V9Z has been cancelled. Refund of ₹4738 has been processed to source account.', 'READ', NOW(), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(9, 5, 'ananya.iyer@example.com', '6E501', 'BOOKING_CONFIRMED', 'Booking Confirmed - PNR AB8R3T5N', 'Your flight 6E501 from Bengaluru to Delhi is confirmed. Seat: 7D.', 'READ', NOW(), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(10, 6, 'vikram.m@example.com', 'UK707', 'BOOKING_CONFIRMED', 'Booking Confirmed - PNR AB6L3D7Y', 'Your flight UK707 from Delhi to Goa is confirmed. Seat: 4C.', 'UNREAD', NULL, NOW() - INTERVAL 3 HOUR),
(11, 7, 'sneha.patel@example.com', 'SG401', 'BOOKING_CONFIRMED', 'Booking Confirmed - PNR AB8T5F2V', 'Your flight SG401 from Goa to Mumbai is confirmed. Seat: 11A.', 'UNREAD', NULL, NOW() - INTERVAL 3 HOUR),
(12, 8, 'kabir.mehta@example.com', 'AI301', 'FLIGHT_DELAY', 'Flight Delay Notice - AI301', 'Flight AI301 departure rescheduled by 25 minutes due to air traffic control.', 'UNREAD', NULL, NOW() - INTERVAL 2 HOUR),
(13, 9, 'neha.reddy@example.com', 'UK905', 'BOOKING_CONFIRMED', 'Booking Confirmed - PNR AB3Q8B5R', 'Your flight UK905 from Delhi to Hyderabad is confirmed. Seat: 9D.', 'UNREAD', NULL, NOW() - INTERVAL 1 HOUR),
(14, 12, 'sohel@aerobook.com', '6E803', 'BOOKING_CONFIRMED', 'Booking Confirmed - PNR AB5E2T9K', 'Your flight 6E803 from Hyderabad to Chennai is confirmed. Seat: 12B.', 'UNREAD', NULL, NOW()),
(15, 13, 'rajesh.k@example.com', 'AI405', 'BOOKING_CONFIRMED', 'Booking Confirmed - PNR AB7U6Y3P', 'Your flight AI405 from Chennai to Mumbai is confirmed. Seat: 5A.', 'UNREAD', NULL, NOW()),
(16, 14, 'meera.nair@example.com', 'QP110', 'BOOKING_CONFIRMED', 'Booking Confirmed - PNR AB9W1A7X', 'Your flight QP110 from Mumbai to Ahmedabad is confirmed. Seat: 14E.', 'UNREAD', NULL, NOW()),
(17, 15, 'arjun.k@example.com', '6E415', 'CHECKIN_SUCCESS', 'Online Check-in Open - 6E415', 'Web check-in is now open for your flight 6E415 to Delhi.', 'UNREAD', NULL, NOW()),
(18, 19, 'kavita.k@example.com', 'AI512', 'BOOKING_CONFIRMED', 'Booking Confirmed - PNR AB4G3H9L', 'Your flight AI512 from Delhi to Kochi is confirmed. Seat: 8B.', 'UNREAD', NULL, NOW()),
(19, 20, 'sameer.d@example.com', 'UK620', 'BOOKING_CONFIRMED', 'Booking Confirmed - PNR AB6J7V2K', 'Your flight UK620 from Kochi to Bengaluru is confirmed. Seat: 10A.', 'UNREAD', NULL, NOW()),
(20, 2, 'priya@gmail.com', 'AI103', 'BOARDING_CALL', 'Final Boarding Call - AI103', 'Final boarding call for Flight AI103 at Gate 14B. Please board immediately.', 'UNREAD', NULL, NOW() - INTERVAL 15 MINUTE),
(21, NULL, NULL, NULL, 'BROADCAST', 'Baggage Allowance Policy Update', 'Cabin baggage allowance strictly restricted to 7kg + 1 personal laptop bag.', 'UNREAD', NULL, NOW()),
(22, 1, 'asha.khan@example.com', 'AI103', 'BOARDING_CALL', 'Boarding Started - AI103', 'Boarding is now underway for Flight AI103 at Gate 14B.', 'UNREAD', NULL, NOW() - INTERVAL 30 MINUTE)
ON DUPLICATE KEY UPDATE 
    title = VALUES(title),
    message = VALUES(message),
    status = VALUES(status);

-- ============================================================================
-- 11. INCIDENT REPORTS (aerobook_user_db) [16 Operational Incident Reports]
-- ============================================================================
INSERT INTO aerobook_user_db.incident_reports (id, user_id, user_name, user_email, reported_by, reason, severity, status, notes, created_at, updated_at)
VALUES
(1, 4, 'Rohan Gupta', 'rohan.gupta@example.com', 'DEL-Staff-04', 'Flight cancellation refund query', 'LOW', 'RESOLVED', 'Refund of ₹4738 processed successfully via Razorpay.', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
(2, 3, 'Rahul Verma', 'rahul.verma@example.com', 'BOM-Staff-02', 'Wheelchair assistance requested', 'LOW', 'RESOLVED', 'Wheelchair confirmed for Flight AI205 departure.', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
(3, 2, 'Priya Sharma', 'priya@gmail.com', 'DEL-Staff-01', 'Special meal request - Asian Vegetarian', 'LOW', 'IN_PROGRESS', 'Meal preference updated for Flight UK801.', NOW() - INTERVAL 5 HOUR, NOW()),
(4, 5, 'Ananya Iyer', 'ananya.iyer@example.com', 'BLR-Staff-03', 'Delayed checked baggage query', 'MEDIUM', 'RESOLVED', 'Baggage located on baggage belt 4 and handed to passenger.', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
(5, 6, 'Vikram Malhotra', 'vikram.m@example.com', 'DEL-Staff-02', 'Infant bassinet seat request', 'LOW', 'RESOLVED', 'Reallocated to row 4 bulkhead with bassinet fitting.', NOW() - INTERVAL 4 HOUR, NOW()),
(6, 7, 'Sneha Patel', 'sneha.patel@example.com', 'GOI-Staff-01', 'Damaged luggage wheel reported', 'MEDIUM', 'OPEN', 'Baggage inspection report filed; compensation voucher initiated.', NOW() - INTERVAL 3 HOUR, NOW()),
(7, 8, 'Kabir Mehta', 'kabir.mehta@example.com', 'BOM-Staff-05', 'Gate change guidance needed', 'LOW', 'RESOLVED', 'Passenger guided to Gate 14B.', NOW() - INTERVAL 2 HOUR, NOW()),
(8, 9, 'Neha Reddy', 'neha.reddy@example.com', 'HYD-Staff-02', 'Medical assistance - airsickness medication', 'MEDIUM', 'RESOLVED', 'First aid administered at Airport Medical Centre.', NOW() - INTERVAL 1 HOUR, NOW()),
(9, 12, 'Amir Sohel', 'sohel@aerobook.com', 'HYD-Staff-01', 'Overweight baggage payment query', 'LOW', 'RESOLVED', 'Extra 3kg baggage voucher purchased via payment portal.', NOW() - INTERVAL 45 MINUTE, NOW()),
(10, 13, 'Rajesh Koothrappali', 'rajesh.k@example.com', 'MAA-Staff-03', 'Boarding pass reprint due to water spill', 'LOW', 'RESOLVED', 'New thermal boarding pass issued at counter 12.', NOW() - INTERVAL 30 MINUTE, NOW()),
(11, 14, 'Meera Nair', 'meera.nair@example.com', 'BOM-Staff-01', 'Pet in cabin documentation check', 'LOW', 'RESOLVED', 'Veterinary health certificate approved for certified small dog in carrier.', NOW() - INTERVAL 20 MINUTE, NOW()),
(12, 15, 'Arjun Kapoor', 'arjun.k@example.com', 'AMD-Staff-02', 'Unaccompanied minor escort check-in', 'HIGH', 'IN_PROGRESS', 'Assigned ground officer escort through security to flight 6E415.', NOW() - INTERVAL 15 MINUTE, NOW()),
(13, 19, 'Kavita Krishnan', 'kavita.k@example.com', 'DEL-Staff-04', 'Connecting flight transit time advisory', 'LOW', 'RESOLVED', 'Transit time verified as 1h 45m; gate transfer information provided.', NOW() - INTERVAL 10 MINUTE, NOW()),
(14, 20, 'Sameer Deshmukh', 'sameer.d@example.com', 'COK-Staff-01', 'Lost item left at security frisking booth', 'MEDIUM', 'OPEN', 'CISF notified regarding left-behind wristwatch; tracking in progress.', NOW() - INTERVAL 5 MINUTE, NOW()),
(15, 1, 'Asha Khan', 'asha.khan@example.com', 'BOM-Staff-03', 'Seat upgrade request to Business Class', 'LOW', 'RESOLVED', 'Upgrade purchased at departure gate counter.', NOW() - INTERVAL 1 MINUTE, NOW()),
(16, 2, 'Priya Sharma', 'priya@gmail.com', 'BOM-Staff-02', 'Priority baggage tag request', 'LOW', 'RESOLVED', 'Priority yellow tags attached to check-in baggage.', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    status = VALUES(status),
    notes = VALUES(notes),
    updated_at = NOW();
