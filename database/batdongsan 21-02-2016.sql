-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 21, 2016 at 04:11 PM
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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `project_geo_distribution_statistic`(IN parent_code VARCHAR(50), IN address_component_type VARCHAR(50))
BEGIN

	declare loop_finished int default 0;
	declare c_current_address_component_id int default 0;
	declare c_current_address_component_value varchar(200);
	declare c_current_address_component_non_unicode_value varchar(200);
	declare c_current_address_component_key varchar(200);
	declare c_current_address_component_total_project int default 0;

	-- first we get list of component and total of item on each project
	declare address_component_cursor cursor for
	SELECT 
		tbl_address_component.id, 
		tbl_address_component.value, 
		tbl_address_component.non_unicode_value,
		tbl_address_component.key,
		COUNT(tbl_project.id) as total_project
	FROM tbl_address_component
	LEFT JOIN 
		tbl_address_component as parent
		ON parent.id = tbl_address_component.parent
	LEFT JOIN 
		tbl_object_address
		ON 
			tbl_address_component.id = tbl_object_address.address_component
			AND
			tbl_object_address.object_type = 'project'
	LEFT JOIN 
		tbl_project
		ON tbl_project.id = tbl_object_address.target_object
	WHERE 
		tbl_address_component.type = address_component_type
		AND parent.key = parent_code
	GROUP BY
		tbl_address_component.id
	ORDER BY 
		tbl_address_component.value;

	-- stop if not found anything more
	declare continue handler for not found set loop_finished = 1;

	-- create temporary table contains result statistic
    drop table if exists tbl_temp_result;
    create temporary table tbl_temp_result(
		c_component_id int not null,
		c_component_value varchar(200) not null,
		c_component_non_unicode_value varchar(200) not null,
		c_component_key varchar(200) not null,
        c_total_project int
    );

	-- loop through the component and pick the top view project
	open address_component_cursor;
    component_loop: loop
    fetch address_component_cursor into 
						c_current_address_component_id,
						c_current_address_component_value,
						c_current_address_component_non_unicode_value,
						c_current_address_component_key,
						c_current_address_component_total_project;
	
    if loop_finished = 1 then 
		leave component_loop;
	end if;
		
		COMPONENT_BLOCK: begin

		end COMPONENT_BLOCK;

    end loop component_loop;
    close address_component_cursor;

	SELECT * FROM tbl_temp_result;
	drop table if exists tbl_temp_result;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_address_component`
--

CREATE TABLE IF NOT EXISTS `tbl_address_component` (
`id` int(11) NOT NULL,
  `type` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `value` text COLLATE utf8_unicode_ci NOT NULL,
  `non_unicode_value` text COLLATE utf8_unicode_ci,
  `key` text COLLATE utf8_unicode_ci NOT NULL,
  `parent` int(11) DEFAULT NULL,
  `cen_lat` double DEFAULT NULL,
  `cen_long` double DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tbl_address_component`
--

INSERT INTO `tbl_address_component` (`id`, `type`, `value`, `non_unicode_value`, `key`, `parent`, `cen_lat`, `cen_long`, `updated_at`, `deleted_at`, `created_at`) VALUES
(2, 'postal_code', '10000', NULL, '10000', NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'country', 'Việt Nam', 'Viet Nam', 'VN', NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'route', 'Nguyễn Trãi', 'Nguyen Trai', 'Nguyen Trai', 7, NULL, NULL, NULL, NULL, NULL),
(5, 'administrative_area_level_2', 'Hà Đông', 'Ha Dong', 'Ha Dong', 6, NULL, NULL, NULL, NULL, NULL),
(6, 'administrative_area_level_1', 'Hà Nội', 'Ha Noi', 'HN', 3, 21.027789519296693, 105.84245681762694, NULL, NULL, NULL),
(7, 'locality', 'Thanh Xuân', 'Thanh Xuan', 'Thanh Xuan', 5, NULL, NULL, NULL, NULL, NULL),
(8, 'administrative_area_level_1', 'Hồ Chí Minh', 'Ho Chi Minh', 'HCM', 3, 10.775469903163094, 106.70084953308105, NULL, NULL, NULL),
(9, 'administrative_area_level_2', 'Quận 1', 'Quan 1', 'Quan 1', 8, NULL, NULL, NULL, NULL, NULL);

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
  `upload_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tbl_image`
--

INSERT INTO `tbl_image` (`id`, `category`, `filename`, `name`, `cap_text`, `upload_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, '231c2ee287d639adda1cdb44c189ae93.jpg', 'Toà nhà sông đà SDU', 'Toà nhà sông đà SDU', '2015-11-13 00:00:00', NULL, NULL, NULL),
(2, 2, '231c2ee287d639adda1cdb44c189ae92.jpg', 'Công ty cổ phần đầu tư và phát triển nhà đô thị Sông Đà ', 'Công ty cổ phần đầu tư và phát triển nhà đô thị Sông Đà ', '2015-11-13 00:00:00', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_image_own`
--

CREATE TABLE IF NOT EXISTS `tbl_image_own` (
`id` int(11) NOT NULL,
  `image` int(11) NOT NULL,
  `own_object` int(11) NOT NULL,
  `own_object_type` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `purpose` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tbl_image_own`
--

INSERT INTO `tbl_image_own` (`id`, `image`, `own_object`, `own_object_type`, `purpose`, `updated_at`, `deleted_at`, `created_at`) VALUES
(1, 1, 1, 'project', 'main_image', NULL, NULL, NULL),
(2, 2, 1, 'investor', 'logo', NULL, NULL, NULL);

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
  `address_coor` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `website_url` text COLLATE utf8_unicode_ci,
  `system_rating` float DEFAULT NULL,
  `active_status` int(11) NOT NULL DEFAULT '1',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `view_count` int(11) DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tbl_investor`
--

INSERT INTO `tbl_investor` (`id`, `name`, `code`, `description`, `address`, `address_coor`, `website_url`, `system_rating`, `active_status`, `deleted_at`, `created_at`, `updated_at`, `view_count`) VALUES
(1, 'Công ty Cổ Phần Đầu Tư Xây Dựng Và Phát Triển Đô Thị Sông Đà', 'HNX', NULL, 'P 702 nhà G10 - Tập Đoàn Sông Đà', '', 'www.dothisongda.com.vn', NULL, 0, NULL, '2015-11-07 10:25:34', '2015-11-07 10:25:34', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_object_address`
--

CREATE TABLE IF NOT EXISTS `tbl_object_address` (
`id` int(11) NOT NULL,
  `target_object` int(11) NOT NULL,
  `address_component` int(11) NOT NULL,
  `object_type` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tbl_object_address`
--

INSERT INTO `tbl_object_address` (`id`, `target_object`, `address_component`, `object_type`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 1, 2, 'project', NULL, NULL, NULL),
(3, 1, 3, 'project', NULL, NULL, NULL),
(4, 1, 4, 'project', NULL, NULL, NULL),
(5, 1, 5, 'project', NULL, NULL, NULL),
(6, 1, 6, 'project', NULL, NULL, NULL),
(7, 1, 7, 'project', NULL, NULL, NULL),
(8, 1, 5, 'investor', NULL, NULL, NULL),
(9, 1, 6, 'investor', NULL, NULL, NULL),
(10, 1, 7, 'investor', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project`
--

CREATE TABLE IF NOT EXISTS `tbl_project` (
`id` int(11) NOT NULL,
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `full_description` text COLLATE utf8_unicode_ci,
  `address` text COLLATE utf8_unicode_ci,
  `address_coor` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `land_size_min` float DEFAULT NULL,
  `land_size_max` float DEFAULT NULL,
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
  `deleted_at` timestamp NULL DEFAULT NULL,
  `view_count` int(11) DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tbl_project`
--

INSERT INTO `tbl_project` (`id`, `name`, `code`, `description`, `full_description`, `address`, `address_coor`, `land_size_min`, `land_size_max`, `avg_price`, `price_unit`, `avg_price_rent`, `rent_price_unit`, `open_bid_date`, `start_construct_date`, `end_construct_plan_date`, `end_construct_date`, `land_type`, `per_construct_complete`, `system_rate`, `project_status`, `active_status`, `created_at`, `updated_at`, `deleted_at`, `view_count`) VALUES
(1, 'Toà nhà Sông Đà Hà Đông SDU', 'SDU', 'Tòa nhà Sông Đà – Hà Đông tọa lạc trên đường Trần Phú, Hà Đông, cạnh Trường Đại học Kiến trúc Hà Nội. Tòa nhà nằm ngay cửa ngõ của Hà Đông và nằm trên trục đường chính từ nối từ trung tâm thành phố Hà Nội đến khu vực phía Tây Thành phố, một khu vực đang có tốc độ đô thị hóa nhanh nhất Thành phố. Với vị trí đắc địa này, Tòa nhà phù hợp cho việc kinh doanh thương mại và làm văn phòng làm việc. Tòa nhà cao 34 tầng nổi và 02 tầng hầm trong đó có 5 tầng đế làm thương mại dịch vụ, từ tầng 6 đến tầng 8 làm văn phòng làm việc và tầng 9 đến tầng 34 làm nhà ở.', NULL, 'Số 1', NULL, 80, 120, 23000000, 0, 8000000, 0, NULL, '2007-12-01 00:00:00', '2011-06-15 00:00:00', '2011-06-15 00:00:00', 1, 100, NULL, 1, 2, NULL, NULL, NULL, 0);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tbl_project_investor_mid`
--

INSERT INTO `tbl_project_investor_mid` (`id`, `project`, `investor`, `is_main_investor`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE IF NOT EXISTS `tbl_user` (
`id` int(11) NOT NULL,
  `email` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(70) COLLATE utf8_unicode_ci NOT NULL,
  `access_token` text COLLATE utf8_unicode_ci,
  `active_status` int(11) NOT NULL DEFAULT '1',
  `is_root` tinyint(4) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `authority` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `email`, `name`, `password`, `access_token`, `active_status`, `is_root`, `deleted_at`, `updated_at`, `created_at`, `authority`) VALUES
(1, 'quocviet.cntt.bk@gmail.com', 'Quoc Viet', '$2y$10$G3cbFmKz5sjvFZFNOe/h7ODXarKKFK5nBfOwFQNYVmkLu1D8413re', NULL, 2, 1, NULL, '2015-12-19 02:44:51', NULL, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_address_component`
--
ALTER TABLE `tbl_address_component`
 ADD PRIMARY KEY (`id`), ADD KEY `FK_ADDRESS_COMPONENT_TO_PARENT_idx` (`parent`);

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
-- Indexes for table `tbl_object_address`
--
ALTER TABLE `tbl_object_address`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `UNI_NO_DUPLICATE` (`target_object`,`object_type`,`address_component`), ADD KEY `FK_TBL_OBJECT_ADDRESS_TO_ADDRESS_COMPONENT_idx` (`address_component`);

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
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_address_component`
--
ALTER TABLE `tbl_address_component`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `tbl_image`
--
ALTER TABLE `tbl_image`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `tbl_image_own`
--
ALTER TABLE `tbl_image_own`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `tbl_investor`
--
ALTER TABLE `tbl_investor`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tbl_object_address`
--
ALTER TABLE `tbl_object_address`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `tbl_project`
--
ALTER TABLE `tbl_project`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tbl_project_data_history`
--
ALTER TABLE `tbl_project_data_history`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_project_investor_mid`
--
ALTER TABLE `tbl_project_investor_mid`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_address_component`
--
ALTER TABLE `tbl_address_component`
ADD CONSTRAINT `FK_ADDRESS_COMPONENT_TO_PARENT` FOREIGN KEY (`parent`) REFERENCES `tbl_address_component` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `tbl_image_own`
--
ALTER TABLE `tbl_image_own`
ADD CONSTRAINT `FK_IMAGE_OWN_TO_IMAGE` FOREIGN KEY (`image`) REFERENCES `tbl_image` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_object_address`
--
ALTER TABLE `tbl_object_address`
ADD CONSTRAINT `FK_TBL_OBJECT_ADDRESS_TO_ADDRESS_COMPONENT` FOREIGN KEY (`address_component`) REFERENCES `tbl_address_component` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
