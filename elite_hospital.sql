-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 22, 2025 at 04:05 AM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elite_hospital`
--

-- --------------------------------------------------------

--
-- Table structure for table `hospital_admin`
--

DROP TABLE IF EXISTS `hospital_admin`;
CREATE TABLE IF NOT EXISTS `hospital_admin` (
  `hospital_id` int NOT NULL AUTO_INCREMENT,
  `hospital_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `hospital_address` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `hospital_number` varchar(21) NOT NULL,
  `hospital_password` varchar(21) NOT NULL,
  `hospital_email` varchar(21) NOT NULL,
  `hospital_resgstrion` varchar(21) NOT NULL,
  `hospital_gst` int NOT NULL,
  `status` varchar(12) NOT NULL,
  `created_date` datetime NOT NULL,
  `modify_date` datetime NOT NULL,
  `auth_token` int NOT NULL,
  `user_type` varchar(12) NOT NULL,
  PRIMARY KEY (`hospital_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `hospital_admin`
--

INSERT INTO `hospital_admin` (`hospital_id`, `hospital_name`, `hospital_address`, `hospital_number`, `hospital_password`, `hospital_email`, `hospital_resgstrion`, `hospital_gst`, `status`, `created_date`, `modify_date`, `auth_token`, `user_type`) VALUES
(1, 'City Hospital', 'Bhopal', '9806701954', '123', 'h@gmail.com', 'RG1234', 0, '1', '2025-05-21 21:57:16', '2025-05-21 22:24:29', 0, '1');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
