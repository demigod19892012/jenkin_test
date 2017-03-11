-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 05, 2015 at 09:40 AM
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `batdongsan`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_admin`
--

CREATE TABLE IF NOT EXISTS `tbl_admin` (
`id` int(11) NOT NULL,
  `email` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(70) COLLATE utf8_unicode_ci NOT NULL,
  `access_token` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `active_status` int(11) NOT NULL DEFAULT '1',
  `is_root` tinyint(4) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tbl_admin`
--

INSERT INTO `tbl_admin` (`id`, `email`, `name`, `password`, `access_token`, `active_status`, `is_root`, `deleted_at`, `updated_at`, `created_at`) VALUES
(1, 'quocviet.cntt.bk@gmail.com', 'Quoc Viet', '$2y$10$G3cbFmKz5sjvFZFNOe/h7ODXarKKFK5nBfOwFQNYVmkLu1D8413re', NULL, 2, 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_image`
--

CREATE TABLE IF NOT EXISTS `tbl_image` (
`id` int(11) NOT NULL,
  `category` int(11) DEFAULT NULL,
  `filename` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cap_text` text COLLATE utf8_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_image_own`
--

CREATE TABLE IF NOT EXISTS `tbl_image_own` (
`id` int(11) NOT NULL,
  `image` int(11) NOT NULL,
  `own_object` int(11) NOT NULL,
  `own_object_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_investor`
--

CREATE TABLE IF NOT EXISTS `tbl_investor` (
`id` int(11) NOT NULL,
  `name` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `address` text COLLATE utf8_unicode_ci,
  `website_url` text COLLATE utf8_unicode_ci,
  `system_rating` float DEFAULT NULL,
  `active_status` int(11) NOT NULL DEFAULT '1',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project`
--

CREATE TABLE IF NOT EXISTS `tbl_project` (
`id` int(11) NOT NULL,
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `address` text COLLATE utf8_unicode_ci,
  `address_coor_x` float DEFAULT NULL,
  `address_coor_y` float DEFAULT NULL,
  `avg_price` float DEFAULT NULL,
  `price_unit` int(11) DEFAULT '1',
  `avg_price_rent` float DEFAULT NULL,
  `rent_price_unit` int(11) DEFAULT NULL,
  `open_bid_date` datetime DEFAULT NULL,
  `start_construct_date` datetime DEFAULT NULL,
  `end_construct_plan_date` datetime DEFAULT NULL,
  `end_construct_date` datetime DEFAULT NULL,
  `land_type` int(11) NOT NULL DEFAULT '1',
  `per_construct_complete` float NOT NULL DEFAULT '0',
  `system_rate` float DEFAULT NULL,
  `project_status` int(11) NOT NULL DEFAULT '1',
  `active_status` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project_data_history`
--

CREATE TABLE IF NOT EXISTS `tbl_project_data_history` (
`id` int(11) NOT NULL,
  `project` int(11) NOT NULL,
  `log_type` int(11) NOT NULL,
  `old_value` text COLLATE utf8_unicode_ci,
  `new_value` text COLLATE utf8_unicode_ci,
  `change_time` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project_investor_mid`
--

CREATE TABLE IF NOT EXISTS `tbl_project_investor_mid` (
`id` int(11) NOT NULL,
  `project` int(11) NOT NULL,
  `investor` int(11) NOT NULL,
  `is_main_investor` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- Indexes for table `tbl_image`
--
ALTER TABLE `tbl_image`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_image_own`
--
ALTER TABLE `tbl_image_own`
 ADD PRIMARY KEY (`id`), ADD KEY `FK_IMAGE_OWN_TO_IMAGE_idx` (`image`);

--
-- Indexes for table `tbl_investor`
--
ALTER TABLE `tbl_investor`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_project`
--
ALTER TABLE `tbl_project`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_project_data_history`
--
ALTER TABLE `tbl_project_data_history`
 ADD PRIMARY KEY (`id`), ADD KEY `FK_PROJECT_DEVELOPMENT_LOG_TO_PROJECT_idx` (`project`);

--
-- Indexes for table `tbl_project_investor_mid`
--
ALTER TABLE `tbl_project_investor_mid`
 ADD PRIMARY KEY (`id`), ADD KEY `FK_PROJECT_INVERSTOR_MID_TO_PROJECT_idx` (`project`), ADD KEY `FK_PROJECT_INVERSTOR_MID_TO_INVESTOR_idx` (`investor`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tbl_image`
--
ALTER TABLE `tbl_image`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_image_own`
--
ALTER TABLE `tbl_image_own`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_investor`
--
ALTER TABLE `tbl_investor`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_project`
--
ALTER TABLE `tbl_project`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_project_data_history`
--
ALTER TABLE `tbl_project_data_history`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_project_investor_mid`
--
ALTER TABLE `tbl_project_investor_mid`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_image_own`
--
ALTER TABLE `tbl_image_own`
ADD CONSTRAINT `FK_IMAGE_OWN_TO_IMAGE` FOREIGN KEY (`image`) REFERENCES `tbl_image` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_project_data_history`
--
ALTER TABLE `tbl_project_data_history`
ADD CONSTRAINT `FK_PROJECT_DATA_HISTORY_TO_PROJECT` FOREIGN KEY (`project`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_project_investor_mid`
--
ALTER TABLE `tbl_project_investor_mid`
ADD CONSTRAINT `FK_PROJECT_INVERSTOR_MID_TO_INVESTOR` FOREIGN KEY (`investor`) REFERENCES `tbl_investor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `FK_PROJECT_INVERSTOR_MID_TO_PROJECT` FOREIGN KEY (`project`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
