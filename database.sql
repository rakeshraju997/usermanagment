-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 09, 2022 at 05:20 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `usermanagement`
--

-- --------------------------------------------------------

--
-- Table structure for table `skill_action`
--

CREATE TABLE `skill_action` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `try_1` varchar(45) NOT NULL,
  `try_count` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `skill_action`
--

INSERT INTO `skill_action` (`id`, `user_id`, `try_1`, `try_count`) VALUES
(1, 1, '/4-5/2-3,4/1-1,2', 1),
(2, 2, '/1-1/3-7', 1);

-- --------------------------------------------------------

--
-- Table structure for table `template_lists`
--

CREATE TABLE `template_lists` (
  `id` int(11) NOT NULL,
  `list_items` varchar(45) NOT NULL,
  `description` varchar(200) NOT NULL,
  `template_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `template_lists`
--

INSERT INTO `template_lists` (`id`, `list_items`, `description`, `template_id`) VALUES
(1, 'list item 1', 'description 1', 1),
(2, 'list item 2', 'description 2', 1),
(3, 'list item usersnnknknlkrfe', 'grgrebcfbgfhfj', 2),
(4, 'list item fasfnklnfljewjr', 'ggregegevdfvdfgre', 2),
(5, 'list item 1 1', 'greghtuyiumkm', 4),
(6, 'dasttretgg', 'g5y54yh5hhghgfh', 4),
(7, 'list item 3', 'frett34', 3);

-- --------------------------------------------------------

--
-- Table structure for table `template_main`
--

CREATE TABLE `template_main` (
  `id` int(11) NOT NULL,
  `template` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `template_main`
--

INSERT INTO `template_main` (`id`, `template`, `status`) VALUES
(1, 'OSCE', 'active'),
(2, 'CBT', 'active'),
(3, 'IELTS', 'active'),
(4, 'IELTS2', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `role` varchar(11) NOT NULL,
  `template_assigned` varchar(45) NOT NULL,
  `status` varchar(11) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `template_assigned`, `status`) VALUES
(1, 'Rakesh', '', 'rakesh@gmail.com', 'admin1', 'admin', '3/2/4/1', 'active'),
(2, 'Raju', '', 'rakeshraju997@gmail.com', 'admin', 'tutor', '/1/3', 'active'),
(3, 'student', '', 'student@g.com', 'admin', 'candidate', '2', 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `skill_action`
--
ALTER TABLE `skill_action`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `template_lists`
--
ALTER TABLE `template_lists`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `template_main`
--
ALTER TABLE `template_main`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `skill_action`
--
ALTER TABLE `skill_action`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `template_lists`
--
ALTER TABLE `template_lists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `template_main`
--
ALTER TABLE `template_main`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
