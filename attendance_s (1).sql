-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 13, 2025 at 09:54 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `attendance_s`
--

-- --------------------------------------------------------

--
-- Table structure for table `allowed_ips`
--

DROP TABLE IF EXISTS `allowed_ips`;
CREATE TABLE IF NOT EXISTS `allowed_ips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `description` varchar(25) NOT NULL,
  `created_at` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `allowed_ips`
--

INSERT INTO `allowed_ips` (`id`, `ip_address`, `description`, `created_at`) VALUES
(3, ' 223.233.81.77', 'mediTree Healthcare -1', '2025-06-10 10:07:58'),
(2, '103.174.140.75', 'MediTree Office', '2025-06-08 00:04:16'),
(4, ' 182.156.142.138', 'mediTree Healthcare', '2025-06-10 10:28:30'),
(5, '223.233.85.121', 'mediTree Healthcare wired', '2025-06-11 10:22:56');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_records`
--

DROP TABLE IF EXISTS `attendance_records`;
CREATE TABLE IF NOT EXISTS `attendance_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `username` varchar(20) NOT NULL,
  `date` varchar(20) DEFAULT NULL,
  `morning_check_in` varchar(20) DEFAULT NULL,
  `morning_check_out` varchar(25) DEFAULT NULL,
  `evening_check_in` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `evening_check_out` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('present','absent','half-day') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `workingHours` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_records`
--

INSERT INTO `attendance_records` (`id`, `user_id`, `username`, `date`, `morning_check_in`, `morning_check_out`, `evening_check_in`, `evening_check_out`, `status`, `ip_address`, `workingHours`) VALUES
(37, 2, 'Rohit Kurmi', '2025-06-12', '09:50:29 AM', '1:30:59 PM', '2:29:01 PM', '6:50:07 PM', 'present', '223.233.85.121', '16:17'),
(38, 2, 'Rohit Kurmi', '2025-06-13', '9:50:43 AM', '1:20:00 PM', '2:15:00 PM', NULL, 'present', '223.233.85.121', '04:33'),
(30, 3, 'prasoon Asati', '2025-06-10', '10:33:51 AM', '5:20:01 PM', '5:20:42 PM', '5:29:02 PM', 'present', '223.233.81.77', NULL),
(28, 3, 'prasoon Asati', '2025-06-09', '06:50:01', '06:50:24', '', '', 'present', '182.156.142.138', NULL),
(31, 4, 'krushna', '2025-06-10', '5:38:32 PM', '6:39:51 PM', '6:39:53 PM', '6:39:55 PM', 'present', '223.233.81.77', NULL),
(33, 4, 'krushna', '2025-06-11', '10:26:12 AM', NULL, NULL, NULL, 'present', '223.233.85.121', ''),
(34, 5, 'niranjan', '2025-06-11', '10:27:51 AM', NULL, NULL, NULL, 'present', '223.233.85.121', ''),
(35, 3, 'prasoon Asati', '2025-06-11', '10:28:38 AM', NULL, NULL, NULL, 'present', '223.233.85.121', '');

-- --------------------------------------------------------

--
-- Table structure for table `device_fingerprints`
--

DROP TABLE IF EXISTS `device_fingerprints`;
CREATE TABLE IF NOT EXISTS `device_fingerprints` (
  `device_id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) NOT NULL,
  `fingerprints` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` varchar(25) NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`device_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `device_fingerprints`
--

INSERT INTO `device_fingerprints` (`device_id`, `user_id`, `fingerprints`, `created_at`, `status`) VALUES
(1, '2', '95aa3d93be0b2a758eff7568ee1def29', '2025-06-13T07:17:55.096Z', '1'),
(2, '2', 'c3e83d131d1b918072aaecd66', '2025-06-13T07:32:36.481Z', '1'),
(3, '4', '70b1b3974528faecb271f17df0c17866', '2025-06-13T09:25:31.392Z', '1'),
(4, '2', '70b1b3974528faecb271f17df0c17866', '2025-06-13T09:26:14.175Z', '0');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(25) NOT NULL,
  `password_hash` varchar(25) NOT NULL,
  `name` varchar(25) NOT NULL,
  `role` varchar(20) NOT NULL,
  `is_active` varchar(1) NOT NULL,
  `created_at` varchar(20) NOT NULL,
  `auth_token` varchar(40) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `name`, `role`, `is_active`, `created_at`, `auth_token`) VALUES
(1, 'admin@company.com', 'admin123', 'Admin', 'admin', '1', '2025-06-13 15:22:34', '6j7nzcRL9JukVLxjL7fv'),
(2, 'john.doe@company.com', 'employee123', 'Rohit Kurmi', 'employee', '1', '2025-06-13 15:22:22', 'c2LEZTezxPVT6CBIo9A2'),
(3, 'pr@gmail.com', 'prasoon123', 'prasoon Asati', 'employee', '1', '2025-06-11 10:28:25', 'Qo7otqBD0Q23yz1QIHa7'),
(4, 'krushna@gmail.com', '123456', 'krushna', 'employee', '1', '2025-06-13 14:55:48', 's0a9h0qYgu9VNErzDtAS'),
(5, 'niranjan@gmail.com', '123456', 'niranjan', 'employee', '1', '2025-06-11 10:27:46', 'GkV3u9P4AQ1BAJW096nG');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
