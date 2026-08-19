-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: ballast.proxy.rlwy.net:30274
-- Generation Time: May 09, 2026 at 02:40 PM
-- Server version: 9.4.0
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `railway`
--

-- --------------------------------------------------------

--
-- Table structure for table `advertisement`
--

CREATE TABLE `advertisement` (
  `id` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BANNER',
  `targetAudience` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'ALL',
  `displayOrder` int NOT NULL DEFAULT '0',
  `startDate` datetime(3) DEFAULT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `advertisement`
--

INSERT INTO `advertisement` (`id`, `title`, `content`, `imageUrl`, `linkUrl`, `isActive`, `type`, `targetAudience`, `displayOrder`, `startDate`, `endDate`, `createdAt`, `updatedAt`) VALUES
(1, 'High speed internet services free for chairman and office.', 'High speed internet services ', 'https://res.cloudinary.com/dw48hcxi5/image/upload/v1776702762/advertisements/upnz1fcugxcirqrdcrcs.jpg', NULL, 1, 'BANNER', 'ADMINS', 0, '2026-04-20 22:04:00.000', '2026-04-20 12:04:00.000', '2026-04-20 16:32:42.610', '2026-04-20 16:32:42.610');

-- --------------------------------------------------------

--
-- Table structure for table `amenity`
--

CREATE TABLE `amenity` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'other',
  `description` text COLLATE utf8mb4_unicode_ci,
  `capacity` int NOT NULL DEFAULT '0',
  `chargesPerHour` double NOT NULL DEFAULT '0',
  `availableDays` json DEFAULT NULL,
  `timings` json DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `societyId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `amenity`
--

INSERT INTO `amenity` (`id`, `name`, `type`, `description`, `capacity`, `chargesPerHour`, `availableDays`, `timings`, `status`, `societyId`, `createdAt`, `updatedAt`) VALUES
(10, 'Power Gym', 'gym', NULL, 20, 0, NULL, NULL, 'available', 2, '2026-04-18 08:44:22.161', '2026-04-18 08:44:22.161');

-- --------------------------------------------------------

--
-- Table structure for table `amenitybooking`
--

CREATE TABLE `amenitybooking` (
  `id` int NOT NULL,
  `amenityId` int NOT NULL,
  `userId` int NOT NULL,
  `date` datetime(3) NOT NULL,
  `startTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purpose` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `amountPaid` double NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `asset`
--

CREATE TABLE `asset` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` double NOT NULL,
  `purchaseDate` datetime(3) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `societyId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `billingplan`
--

CREATE TABLE `billingplan` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `planType` enum('BASIC','PROFESSIONAL','ENTERPRISE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BASIC',
  `price` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `billingplan`
--

INSERT INTO `billingplan` (`id`, `name`, `type`, `planType`, `price`, `description`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Basic Plan', 'Quarterly', 'BASIC', '4000', 'Features: Benefits include always approve deliveries from verified partners, unlimited frequent pre-approvals, and visitor approvals via smartwatches. ', 'active', '2026-04-18 08:43:54.334', '2026-04-18 19:19:10.178'),
(2, 'Professional Plan', 'Yearly', 'PROFESSIONAL', '4999', NULL, 'ACTIVE', '2026-04-18 08:43:54.334', '2026-04-18 08:43:54.334'),
(3, 'Basic Plan with Camera maintenance ', 'Yearly', 'BASIC', '6000', 'Features: Benefits include always approve deliveries from verified partners, unlimited frequent pre-approvals, and visitor approvals via smartwatches. \nCCTV camera maintenance 4 visits annual.', 'active', '2026-04-18 19:20:33.426', '2026-04-18 19:20:33.426'),
(4, 'Premium Plan (CCTV+Pest Control)', 'Yearly', 'PROFESSIONAL', '12000', 'Features: Benefits include always approve deliveries from verified partners, unlimited frequent pre-approvals, and visitor approvals via smartwatches. \nCCTV Maintenance annual 4 visit \nPest control annual 2 visit', 'active', '2026-04-18 19:22:38.789', '2026-04-18 19:22:38.789'),
(5, 'Professional Package Plan', 'Yearly', 'PROFESSIONAL', '20000', 'Features: Benefits include always approve deliveries from verified partners, unlimited frequent pre-approvals, and visitor approvals via smartwatches. \nCCTV - 6 visits\nPest Control - annual pest services 4 visit', 'active', '2026-04-18 19:24:23.008', '2026-04-18 19:24:23.008');

-- --------------------------------------------------------

--
-- Table structure for table `buzzlike`
--

CREATE TABLE `buzzlike` (
  `id` int NOT NULL,
  `buzzId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chargemaster`
--

CREATE TABLE `chargemaster` (
  `id` int NOT NULL,
  `societyId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `defaultAmount` double NOT NULL DEFAULT '0',
  `calculationMethod` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FIXED',
  `isOptional` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chatgroup`
--

CREATE TABLE `chatgroup` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `createdById` int NOT NULL,
  `societyId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chatmessage`
--

CREATE TABLE `chatmessage` (
  `id` int NOT NULL,
  `conversationId` int NOT NULL,
  `senderId` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachments` json DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'sent',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chatmessage`
--

INSERT INTO `chatmessage` (`id`, `conversationId`, `senderId`, `content`, `attachments`, `status`, `createdAt`) VALUES
(1, 2, 1, 'xcv', '[]', 'read', '2026-04-20 04:08:07.057'),
(2, 5, 29, 'Hello A101', '[]', 'read', '2026-04-20 18:22:32.815'),
(3, 6, 30, 'Hello Allow parcel ', '[]', 'sent', '2026-04-20 18:23:16.215'),
(4, 6, 30, 'r yu there', '[]', 'sent', '2026-04-20 18:26:33.872'),
(5, 7, 34, 'Hello Madamji', '[]', 'read', '2026-04-20 18:28:24.014');

-- --------------------------------------------------------

--
-- Table structure for table `communitybuzz`
--

CREATE TABLE `communitybuzz` (
  `id` int NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `authorId` int NOT NULL,
  `societyId` int NOT NULL,
  `hasResult` tinyint(1) NOT NULL DEFAULT '0',
  `imageUrls` json DEFAULT NULL,
  `likes` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `communitychat`
--

CREATE TABLE `communitychat` (
  `id` int NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int NOT NULL,
  `societyId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `communitycomment`
--

CREATE TABLE `communitycomment` (
  `id` int NOT NULL,
  `buzzId` int NOT NULL,
  `authorId` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `communityguideline`
--

CREATE TABLE `communityguideline` (
  `id` int NOT NULL,
  `societyId` int DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetAudience` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'ALL',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `communityguideline`
--

INSERT INTO `communityguideline` (`id`, `societyId`, `title`, `content`, `category`, `targetAudience`, `createdAt`, `updatedAt`) VALUES
(1, 3, 'Transferring and Safeguarding', 'Transferring and Safeguarding\nResale: When selling a flat, the seller must surrender the original certificate. The society then issues a fresh one in the buyer\'s name after verification and payment of transfer fees (which cannot exceed ₹25,000 in certain states).\nLoss of Certificate: If lost, you must file a police report (FIR), submit an indemnity bond to the society, and may be required to publish a public notice before a duplicate is issued.\nRecord Keeping: Societies are responsible for maintaining an updated Register of Members (I-form and J-form) to track shareholding and ownership changes', 'SOCIETY', 'ALL', '2026-04-18 10:55:23.500', '2026-04-18 10:55:23.500'),
(2, 4, 'Financial & Legal Responsibilities', 'Financial & Legal Responsibilities\nTimely Maintenance: Pay maintenance charges promptly to ensure the upkeep of essential services like water, security, and common lighting.\nAdherence to Bye-Laws: All residents must follow the society\'s foundational rules (bye-laws). Non-compliance can lead to penalties or even legal action.\nStructural Alterations: No significant internal renovations or structural changes can be made without prior written permission from the Managing Committee.', 'SOCIETY', 'ALL', '2026-04-18 10:56:49.257', '2026-04-18 10:56:49.257'),
(3, NULL, 'Physical Security & Visitor Management', 'Physical Security & Visitor Management\nRobust access control is the first line of defence against unauthorised entry. \nNoBrokerHood\nNoBrokerHood\n +1\nGate Protocols: Maintain a 24/7 manned security presence at entry and exit points. All visitors, including delivery personnel and guests, should be registered in a digital log with their ID verified before entry is permitted.\nSurveillance: Install high-resolution CCTV cameras with night vision at strategic locations like gates, parking lots, lift lobbies, and staircases. Ensure these are regularly maintained and monitored live by guards.\nResident Verification: Use intercom systems or society management apps (like NoBrokerHood or ADDA) to get instant approval from residents before allowing any visitor inside.\nStaff Tracking: Maintain records and photographs of all domestic help, drivers, and vendors. Police verification for all permanent and temporary staff is highly recommended to mitigate risks', 'SOCIETY', 'RESIDENTS', '2026-04-18 10:58:51.167', '2026-04-18 10:58:51.167'),
(4, NULL, 'Transferring and Safeguarding', 'Transferring and Safeguarding\nSOCIETY\n· Ganesha CHS\nTransferring and Safeguarding Resale: When selling a flat, the seller must surrender the original certificate. The society then issues a fresh one in the buyer\'s name after verification and payment of transfer fees (which cannot exceed ₹25,000 in certain states). Loss of Certificate: If lost, you must file a police report (FIR), submit an indemnity bond to the society, and may be require', 'SOCIETY', 'ALL', '2026-04-18 19:41:36.294', '2026-04-18 19:41:36.294'),
(5, 1, 'test', 'test', 'PARKING', 'VENDORS', '2026-04-20 05:48:04.320', '2026-04-20 06:03:04.734'),
(6, 1, 'recident', 'recident', 'SECURITY', 'RESIDENTS', '2026-04-20 06:12:15.173', '2026-04-20 06:12:15.173'),
(7, 1, 'gard', 'gard', 'SECURITY', 'GUARDS', '2026-04-20 06:13:10.462', '2026-04-20 06:13:10.462'),
(8, 1, 'vendor', 'vendor', 'SOCIETY', 'VENDORS', '2026-04-20 06:13:33.040', '2026-04-20 06:13:33.040');

-- --------------------------------------------------------

--
-- Table structure for table `complaint`
--

CREATE TABLE `complaint` (
  `id` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` enum('LOW','MEDIUM','HIGH','URGENT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEDIUM',
  `status` enum('OPEN','IN_PROGRESS','RESOLVED','CLOSED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OPEN',
  `isPrivate` tinyint(1) NOT NULL DEFAULT '0',
  `escalatedToTech` tinyint(1) NOT NULL DEFAULT '0',
  `escalatedToSuperAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `images` json DEFAULT NULL,
  `societyId` int NOT NULL,
  `reportedById` int NOT NULL,
  `assignedToId` int DEFAULT NULL,
  `vendorId` int DEFAULT NULL,
  `timeline` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `complaint`
--

INSERT INTO `complaint` (`id`, `title`, `description`, `category`, `priority`, `status`, `isPrivate`, `escalatedToTech`, `escalatedToSuperAdmin`, `images`, `societyId`, `reportedById`, `assignedToId`, `vendorId`, `timeline`, `createdAt`, `updatedAt`) VALUES
(1, 'Water pressure low', 'The water pressure in floor 1 is very low since morning.', 'plumbing', 'MEDIUM', 'OPEN', 0, 0, 0, NULL, 2, 11, NULL, NULL, NULL, '2026-04-18 08:44:25.646', '2026-04-18 08:44:25.646'),
(2, 'ELECTRICITY LOOSE CONNECTION WIRE ISSUE', 'ELECTRICITY LOOSE CONNECTION WIRE ISSUE', 'Maintenance', 'HIGH', 'RESOLVED', 1, 0, 0, NULL, 3, 19, NULL, NULL, NULL, '2026-04-18 12:21:35.394', '2026-04-18 12:32:45.093'),
(3, 'CLEANING ISSUE ', 'CLEANING COMMON PASSAGE NEED TO CHECK URGENT ', 'cleaning', 'MEDIUM', 'RESOLVED', 0, 0, 0, NULL, 3, 19, NULL, NULL, NULL, '2026-04-18 12:35:04.362', '2026-04-18 12:36:16.189'),
(4, 'PLUMING ', 'PLUMBING ', 'plumbing', 'MEDIUM', 'OPEN', 1, 0, 1, NULL, 3, 14, NULL, NULL, NULL, '2026-04-18 13:21:50.452', '2026-04-18 13:21:50.452'),
(5, 'PEST ISSUAE AT SOCIETY COMMON AREA', 'PEST', 'pest', 'MEDIUM', 'OPEN', 0, 0, 0, NULL, 3, 14, NULL, 5, NULL, '2026-04-18 13:26:15.813', '2026-04-18 13:26:15.813'),
(6, 'PEST ISSUE', 'PEST ISSUE', 'pest', 'URGENT', 'OPEN', 0, 0, 0, NULL, 3, 14, NULL, 5, NULL, '2026-04-18 13:27:46.121', '2026-04-18 13:27:46.121'),
(7, 'PEST ISSUE', 'PEST ISSUE AT GANESHA CHS SOCIETY', 'pest', 'URGENT', 'RESOLVED', 0, 0, 0, NULL, 3, 14, NULL, 5, NULL, '2026-04-18 13:32:05.301', '2026-04-18 13:33:33.124'),
(8, 'PLUMBING ISSSSS', 'PLIUMBING.   ', 'plumbing', 'MEDIUM', 'OPEN', 0, 0, 0, NULL, 3, 19, NULL, NULL, NULL, '2026-04-18 13:38:15.688', '2026-04-18 13:38:15.688'),
(9, 'CEEEEE', 'CEEEE', 'cleaning', 'MEDIUM', 'RESOLVED', 1, 0, 1, NULL, 3, 14, NULL, NULL, NULL, '2026-04-18 13:40:48.761', '2026-04-18 13:44:23.719'),
(10, 'cleaning issue ', 'passage area cleaning issue ', 'Other', 'URGENT', 'OPEN', 1, 0, 0, NULL, 3, 19, NULL, NULL, NULL, '2026-04-18 20:15:28.294', '2026-04-18 20:15:28.294'),
(11, 'cleaning issue 123', 'passage area cleaning issue ', 'Other', 'URGENT', 'OPEN', 1, 0, 0, NULL, 3, 19, NULL, NULL, NULL, '2026-04-18 20:32:28.532', '2026-04-18 20:32:28.532'),
(12, 'electric ', 'elctric ', 'electric', 'MEDIUM', 'OPEN', 0, 0, 0, NULL, 3, 19, NULL, NULL, NULL, '2026-04-18 20:33:44.112', '2026-04-18 20:33:44.112'),
(13, 'LLL', 'LLL', 'cleaning', 'MEDIUM', 'OPEN', 0, 0, 0, NULL, 3, 19, NULL, NULL, NULL, '2026-04-18 21:17:59.131', '2026-04-18 21:17:59.131'),
(14, 'MAINTENANCE PAYMENT ', 'Payment has done -online please check and confirm', 'Maintenance', 'MEDIUM', 'OPEN', 1, 0, 0, NULL, 3, 19, NULL, NULL, NULL, '2026-04-20 19:50:39.241', '2026-04-20 19:50:39.241'),
(15, 'cleaning issue ', 'cleaning issue', 'Other', 'HIGH', 'OPEN', 1, 0, 0, NULL, 3, 19, NULL, NULL, NULL, '2026-04-20 19:56:59.350', '2026-04-20 19:56:59.350'),
(16, 'technical issue ', 'technical issue ', 'Technical', 'URGENT', 'RESOLVED', 1, 0, 0, NULL, 10, 30, NULL, NULL, NULL, '2026-04-20 19:58:19.457', '2026-04-20 20:08:24.146');

-- --------------------------------------------------------

--
-- Table structure for table `complaintcomment`
--

CREATE TABLE `complaintcomment` (
  `id` int NOT NULL,
  `complaintId` int NOT NULL,
  `userId` int NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

CREATE TABLE `conversation` (
  `id` int NOT NULL,
  `societyId` int NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `participantId` int DEFAULT NULL,
  `directParticipantId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversation`
--

INSERT INTO `conversation` (`id`, `societyId`, `type`, `participantId`, `directParticipantId`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'DIRECT', 4, 5, '2026-04-17 13:58:59.353', '2026-04-17 13:58:59.353'),
(2, 1, 'DIRECT', 1, 3, '2026-04-20 04:08:00.983', '2026-04-20 04:08:07.083'),
(5, 10, 'DIRECT', 29, 30, '2026-04-20 18:22:11.868', '2026-04-20 18:22:32.845'),
(6, 10, 'SUPPORT_SECURITY', 30, NULL, '2026-04-20 18:23:03.552', '2026-04-20 18:26:33.902'),
(7, 10, 'DIRECT', 30, 34, '2026-04-20 18:28:13.102', '2026-04-20 18:28:24.042'),
(8, 1, 'DIRECT', 7, 9, '2026-04-23 13:09:50.623', '2026-04-23 13:09:50.623');

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `id` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `societyId` int NOT NULL,
  `visibility` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'all',
  `size` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emergencyalert`
--

CREATE TABLE `emergencyalert` (
  `id` int NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `resolution` text COLLATE utf8mb4_unicode_ci,
  `societyId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emergencybarcode`
--

CREATE TABLE `emergencybarcode` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `residentName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `qrCodeUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `societyId` int DEFAULT NULL,
  `userId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `emergencybarcode`
--

INSERT INTO `emergencybarcode` (`id`, `residentName`, `unit`, `phone`, `label`, `type`, `status`, `qrCodeUrl`, `createdAt`, `societyId`, `userId`) VALUES
('eb-pf3rlv8jvx', 'Rahul Resident', 'N/A', '7787564534545', 'car', 'property', 'active', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fsocity.kiaantechnology.com%2Femergency%3Fid%3Deb-pf3rlv8jvx', '2026-04-18 08:47:23.514', 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `emergencycontact`
--

CREATE TABLE `emergencycontact` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'custom',
  `available` tinyint(1) NOT NULL DEFAULT '1',
  `societyId` int DEFAULT NULL,
  `residentId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emergencylog`
--

CREATE TABLE `emergencylog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `visitorName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `visitorPhone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `residentName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isEmergency` tinyint(1) NOT NULL DEFAULT '0',
  `reason` text COLLATE utf8mb4_unicode_ci,
  `barcodeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `societyId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `id` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date` datetime(3) NOT NULL,
  `time` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UPCOMING',
  `maxAttendees` int NOT NULL DEFAULT '0',
  `organizer` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `societyId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`id`, `title`, `description`, `date`, `time`, `location`, `category`, `status`, `maxAttendees`, `organizer`, `societyId`, `createdAt`, `updatedAt`) VALUES
(1, 'buddha purnima', 'fewstiwal', '2026-05-01 00:00:00.000', '19:40', 'community hall', 'festival', 'UPCOMING', 100, 'socity', 1, '2026-04-20 12:06:48.615', '2026-04-20 12:06:48.615');

-- --------------------------------------------------------

--
-- Table structure for table `eventrsvp`
--

CREATE TABLE `eventrsvp` (
  `id` int NOT NULL,
  `eventId` int NOT NULL,
  `userId` int NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'RSVP',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `eventrsvp`
--

INSERT INTO `eventrsvp` (`id`, `eventId`, `userId`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'RSVP', '2026-04-20 12:06:54.624', '2026-04-20 12:07:04.930');

-- --------------------------------------------------------

--
-- Table structure for table `facilityrequest`
--

CREATE TABLE `facilityrequest` (
  `id` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `upvotes` int NOT NULL DEFAULT '0',
  `downvotes` int NOT NULL DEFAULT '0',
  `societyId` int NOT NULL,
  `userId` int NOT NULL,
  `votes` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gate`
--

CREATE TABLE `gate` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `societyId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gate`
--

INSERT INTO `gate` (`id`, `name`, `isActive`, `societyId`, `createdAt`, `updatedAt`) VALUES
(1, 'main gate', 1, 1, '2026-04-18 08:46:36.849', '2026-04-18 08:46:36.849');

-- --------------------------------------------------------

--
-- Table structure for table `goodsreceipt`
--

CREATE TABLE `goodsreceipt` (
  `id` int NOT NULL,
  `grNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `items` json NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COMPLETED',
  `receivedBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qualityCheckStatus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `invoiceNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `societyId` int NOT NULL,
  `vendorId` int NOT NULL,
  `poId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groupmember`
--

CREATE TABLE `groupmember` (
  `id` int NOT NULL,
  `groupId` int NOT NULL,
  `userId` int NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEMBER',
  `joinedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groupmessage`
--

CREATE TABLE `groupmessage` (
  `id` int NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `groupId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `incident`
--

CREATE TABLE `incident` (
  `id` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `severity` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `societyId` int NOT NULL,
  `reportedById` int DEFAULT NULL,
  `assignedToId` int DEFAULT NULL,
  `images` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `id` int NOT NULL,
  `invoiceNo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `societyId` int NOT NULL,
  `unitId` int NOT NULL,
  `residentId` int DEFAULT NULL,
  `amount` double NOT NULL,
  `maintenance` double NOT NULL,
  `utilities` double NOT NULL,
  `penalty` double NOT NULL DEFAULT '0',
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dueDate` datetime(3) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paidDate` datetime(3) DEFAULT NULL,
  `paymentMode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`id`, `invoiceNo`, `societyId`, `unitId`, `residentId`, `amount`, `maintenance`, `utilities`, `penalty`, `description`, `dueDate`, `status`, `paidDate`, `paymentMode`, `createdAt`, `updatedAt`) VALUES
(1, 'INV-2024-001', 2, 2, 11, 2500, 2000, 500, 0, NULL, '2026-04-28 08:44:35.654', 'PENDING', NULL, NULL, '2026-04-18 08:44:35.656', '2026-04-18 08:44:35.656'),
(2, 'INV-04544036-276', 10, 13, NULL, 3000, 0, 0, 0, 'Car parking charges', '2026-05-05 00:00:00.000', 'PENDING', NULL, NULL, '2026-04-20 17:02:24.037', '2026-04-20 17:02:24.037');

-- --------------------------------------------------------

--
-- Table structure for table `invoiceitem`
--

CREATE TABLE `invoiceitem` (
  `id` int NOT NULL,
  `invoiceId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoiceitem`
--

INSERT INTO `invoiceitem` (`id`, `invoiceId`, `name`, `amount`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Car parking charges', 3000, '2026-04-20 17:02:24.037', '2026-04-20 17:02:24.037');

-- --------------------------------------------------------

--
-- Table structure for table `journalentry`
--

CREATE TABLE `journalentry` (
  `id` int NOT NULL,
  `voucherNo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `narration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `societyId` int NOT NULL,
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `journalline`
--

CREATE TABLE `journalline` (
  `id` int NOT NULL,
  `journalEntryId` int NOT NULL,
  `accountId` int NOT NULL,
  `debit` double NOT NULL DEFAULT '0',
  `credit` double NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `latefeeconfigmodel`
--

CREATE TABLE `latefeeconfigmodel` (
  `id` int NOT NULL,
  `societyId` int NOT NULL,
  `gracePeriod` int NOT NULL DEFAULT '5',
  `feeType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FIXED',
  `amount` double NOT NULL DEFAULT '0',
  `maxCap` double DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ledgeraccount`
--

CREATE TABLE `ledgeraccount` (
  `id` int NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `societyId` int NOT NULL,
  `balance` double NOT NULL DEFAULT '0',
  `isSystem` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `bankDetails` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `maintenancerule`
--

CREATE TABLE `maintenancerule` (
  `id` int NOT NULL,
  `societyId` int NOT NULL,
  `unitType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `calculationType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FLAT',
  `amount` double NOT NULL DEFAULT '0',
  `ratePerSqFt` double NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marketplaceitem`
--

CREATE TABLE `marketplaceitem` (
  `id` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double DEFAULT NULL,
  `originalPrice` double DEFAULT NULL,
  `condition` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SELL',
  `priceType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'fixed',
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AVAILABLE',
  `images` json DEFAULT NULL,
  `views` int NOT NULL DEFAULT '0',
  `likes` int NOT NULL DEFAULT '0',
  `ownerId` int NOT NULL,
  `societyId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meeting`
--

CREATE TABLE `meeting` (
  `id` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date` datetime(3) NOT NULL,
  `time` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attendees` json DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SCHEDULED',
  `societyId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `moverequest`
--

CREATE TABLE `moverequest` (
  `id` int NOT NULL,
  `type` enum('MOVE_IN','MOVE_OUT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `unitId` int DEFAULT NULL,
  `residentName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scheduledDate` datetime(3) NOT NULL,
  `timeSlot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','SCHEDULED','COMPLETED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `vehicleType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vehicleNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nocStatus` enum('PENDING','OBTAINED','ISSUED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `depositStatus` enum('PAID','REFUND_PENDING','REFUNDED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `depositAmount` double DEFAULT NULL,
  `checklistItems` json DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `societyId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notice`
--

CREATE TABLE `notice` (
  `id` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `audience` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'announcement',
  `priority` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `isPinned` tinyint(1) NOT NULL DEFAULT '0',
  `societyId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `expiresAt` datetime(3) DEFAULT NULL,
  `startDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `viewsCount` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notice`
--

INSERT INTO `notice` (`id`, `title`, `content`, `audience`, `type`, `priority`, `status`, `isPinned`, `societyId`, `createdAt`, `updatedAt`, `expiresAt`, `startDate`, `viewsCount`) VALUES
(10, 'gard', 'gard', 'GUARD', 'announcement', 'medium', 'PUBLISHED', 1, 1, '2026-04-18 05:44:08.663', '2026-04-20 18:25:34.606', NULL, '2026-04-18 00:00:00.000', 2),
(11, 'recident', 'recident', 'RESIDENTS', 'announcement', 'medium', 'PUBLISHED', 1, 1, '2026-04-18 05:56:05.322', '2026-05-07 05:12:37.514', NULL, '2026-04-18 00:00:00.000', 2),
(12, 'Monthly Maintenance Due', 'Maintenance bills for April 2024 are out. Pay by 10th to avoid late fee.', 'ALL', 'announcement', 'medium', 'PUBLISHED', 0, 2, '2026-04-18 08:44:28.255', '2026-04-18 08:44:28.255', NULL, '2026-04-18 08:44:28.255', 0),
(13, 'Notice- Announcement', 'Servey conduct Announcement 1213', 'ALL', 'announcement', 'high', 'PUBLISHED', 0, 10, '2026-04-20 16:58:19.690', '2026-04-20 18:26:59.229', '2026-04-30 00:00:00.000', '2026-04-20 00:00:00.000', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notice_view`
--

CREATE TABLE `notice_view` (
  `id` int NOT NULL,
  `noticeId` int NOT NULL,
  `userId` int NOT NULL,
  `viewedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notice_view`
--

INSERT INTO `notice_view` (`id`, `noticeId`, `userId`, `viewedAt`) VALUES
(1, 11, 5, '2026-04-18 06:13:04.124'),
(2, 10, 5, '2026-04-20 18:25:07.959'),
(3, 11, 4, '2026-05-07 05:12:37.482'),
(4, 10, 34, '2026-04-20 18:25:34.581'),
(5, 13, 34, '2026-04-20 18:26:59.196');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `userId`, `title`, `description`, `type`, `read`, `metadata`, `createdAt`) VALUES
(1, 3, 'Society Activated', 'Society \"Trinity CHS\" has successfully activated their dashboard.', 'society_activation', 0, '{\"invoiceId\": 1}', '2026-04-17 13:31:15.545'),
(2, 1, 'Welcome to Socity!', 'Your dashboard for \"Trinity CHS\" is now active. You can start managing your community now! Click to view your invoice.', 'welcome', 0, '{\"invoiceId\": 1}', '2026-04-17 13:31:17.070'),
(3, 3, 'New Service Booking', 'undefined booked for service', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 1, \"serviceName\": \"service\"}', '2026-04-18 08:41:02.617'),
(4, 1, 'New Service Booking', 'undefined booked for service', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 1, \"serviceName\": \"service\"}', '2026-04-18 08:41:02.617'),
(5, 3, 'New Service Payment', 'Received ₹200 from undefined for service. Invoice: INV-SERV-2026-663850', 'PAYMENT_RECEIVED', 0, '{\"amount\": 200, \"inquiryId\": 1, \"invoiceNo\": \"INV-SERV-2026-663850\"}', '2026-04-18 08:41:03.881'),
(6, 3, 'Society Activated', 'Society \"Saraswati CHS\" has successfully activated their dashboard.', 'society_activation', 0, '{\"invoiceId\": 2}', '2026-04-18 11:00:15.592'),
(7, 9, 'Society Activated', 'Society \"Saraswati CHS\" has successfully activated their dashboard.', 'society_activation', 0, '{\"invoiceId\": 2}', '2026-04-18 11:00:15.624'),
(8, 15, 'Welcome to Socity!', 'Your dashboard for \"Saraswati CHS\" is now active. You can start managing your community now! Click to view your invoice.', 'welcome', 1, '{\"invoiceId\": 2}', '2026-04-18 11:00:15.637'),
(9, 3, 'Society Activated', 'Society \"Ganesha CHS\" has successfully activated their dashboard.', 'society_activation', 0, '{\"invoiceId\": 5}', '2026-04-18 11:22:42.751'),
(10, 9, 'Society Activated', 'Society \"Ganesha CHS\" has successfully activated their dashboard.', 'society_activation', 0, '{\"invoiceId\": 5}', '2026-04-18 11:22:42.775'),
(11, 14, 'Welcome to Socity!', 'Your dashboard for \"Ganesha CHS\" is now active. You can start managing your community now! Click to view your invoice.', 'welcome', 0, '{\"invoiceId\": 5}', '2026-04-18 11:22:42.786'),
(12, 3, 'New Service Booking', 'undefined booked for service', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 2, \"serviceName\": \"service\"}', '2026-04-18 12:38:32.100'),
(13, 9, 'New Service Booking', 'undefined booked for service', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 2, \"serviceName\": \"service\"}', '2026-04-18 12:38:32.100'),
(14, 14, 'New Service Booking', 'undefined booked for service', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 2, \"serviceName\": \"service\"}', '2026-04-18 12:38:32.100'),
(15, 3, 'New Service Booking', 'undefined booked for service', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 3, \"serviceName\": \"service\"}', '2026-04-18 12:38:52.551'),
(16, 9, 'New Service Booking', 'undefined booked for service', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 3, \"serviceName\": \"service\"}', '2026-04-18 12:38:52.551'),
(17, 14, 'New Service Booking', 'undefined booked for service', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 3, \"serviceName\": \"service\"}', '2026-04-18 12:38:52.551'),
(18, 3, 'New Service Payment', 'Received ₹200 from undefined for service. Invoice: INV-SERV-2026-933214', 'PAYMENT_RECEIVED', 0, '{\"amount\": 200, \"inquiryId\": 3, \"invoiceNo\": \"INV-SERV-2026-933214\"}', '2026-04-18 12:38:53.235'),
(19, 9, 'New Service Payment', 'Received ₹200 from undefined for service. Invoice: INV-SERV-2026-933214', 'PAYMENT_RECEIVED', 0, '{\"amount\": 200, \"inquiryId\": 3, \"invoiceNo\": \"INV-SERV-2026-933214\"}', '2026-04-18 12:38:53.235'),
(20, 17, 'New lead assigned', 'You have been assigned: service for A101', 'lead_assigned', 0, NULL, '2026-04-18 12:40:12.981'),
(21, 3, 'Vendor Payout Generated', 'Job Completed by pestwala02. Pending Payout: ₹180', 'PAYOUT_GENERATED', 0, '{\"amount\": 180, \"vendorId\": 3, \"inquiryId\": 3}', '2026-04-18 12:41:55.314'),
(22, 9, 'Vendor Payout Generated', 'Job Completed by pestwala02. Pending Payout: ₹180', 'PAYOUT_GENERATED', 0, '{\"amount\": 180, \"vendorId\": 3, \"inquiryId\": 3}', '2026-04-18 12:41:55.314'),
(23, 3, 'New Callback Request', 'undefined requested callback for service', 'callback_request', 0, '{\"type\": \"CALLBACK\", \"inquiryId\": 4, \"serviceName\": \"service\"}', '2026-04-18 13:23:11.885'),
(24, 9, 'New Callback Request', 'undefined requested callback for service', 'callback_request', 0, '{\"type\": \"CALLBACK\", \"inquiryId\": 4, \"serviceName\": \"service\"}', '2026-04-18 13:23:11.885'),
(25, 14, 'New Callback Request', 'undefined requested callback for service', 'callback_request', 0, '{\"type\": \"CALLBACK\", \"inquiryId\": 4, \"serviceName\": \"service\"}', '2026-04-18 13:23:11.885'),
(26, 3, 'Society Activated', 'Society \"Kartik CHS\" has successfully activated their dashboard.', 'society_activation', 0, '{\"invoiceId\": 8}', '2026-04-18 19:31:40.319'),
(27, 9, 'Society Activated', 'Society \"Kartik CHS\" has successfully activated their dashboard.', 'society_activation', 0, '{\"invoiceId\": 8}', '2026-04-18 19:31:40.335'),
(28, 26, 'Welcome to Socity!', 'Your dashboard for \"Kartik CHS\" is now active. You can start managing your community now! Click to view your invoice.', 'welcome', 0, '{\"invoiceId\": 8}', '2026-04-18 19:31:40.347'),
(29, 3, 'New Service Booking', 'undefined booked for service', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 5, \"serviceName\": \"service\"}', '2026-04-20 04:01:02.645'),
(30, 9, 'New Service Booking', 'undefined booked for service', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 5, \"serviceName\": \"service\"}', '2026-04-20 04:01:02.645'),
(31, 1, 'New Service Booking', 'undefined booked for service', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 5, \"serviceName\": \"service\"}', '2026-04-20 04:01:02.645'),
(32, 3, 'New Service Payment', 'Received ₹500 from undefined for service. Invoice: INV-SERV-2026-663291', 'PAYMENT_RECEIVED', 0, '{\"amount\": 500, \"inquiryId\": 5, \"invoiceNo\": \"INV-SERV-2026-663291\"}', '2026-04-20 04:01:03.311'),
(33, 9, 'New Service Payment', 'Received ₹500 from undefined for service. Invoice: INV-SERV-2026-663291', 'PAYMENT_RECEIVED', 0, '{\"amount\": 500, \"inquiryId\": 5, \"invoiceNo\": \"INV-SERV-2026-663291\"}', '2026-04-20 04:01:03.311'),
(34, 3, 'New message from Sanjay Admin', 'xcv', 'chat_message', 0, NULL, '2026-04-20 04:08:07.104'),
(35, 3, 'Society Activated', 'Society \"gokule dham socity\" has successfully activated their dashboard.', 'society_activation', 0, '{\"invoiceId\": 9}', '2026-04-20 10:39:29.811'),
(36, 9, 'Society Activated', 'Society \"gokule dham socity\" has successfully activated their dashboard.', 'society_activation', 0, '{\"invoiceId\": 9}', '2026-04-20 10:39:29.829'),
(38, 3, 'Society Activated', 'Society \"Paradise CHS\" has successfully activated their dashboard.', 'society_activation', 0, '{\"invoiceId\": 10}', '2026-04-20 16:34:42.290'),
(39, 9, 'Society Activated', 'Society \"Paradise CHS\" has successfully activated their dashboard.', 'society_activation', 0, '{\"invoiceId\": 10}', '2026-04-20 16:34:42.306'),
(40, 29, 'Welcome to Socity!', 'Your dashboard for \"Paradise CHS\" is now active. You can start managing your community now! Click to view your invoice.', 'welcome', 1, '{\"invoiceId\": 10}', '2026-04-20 16:34:42.317'),
(41, 3, 'New Callback Request', 'undefined requested callback for High Speed Internet Service ', 'callback_request', 0, '{\"type\": \"CALLBACK\", \"inquiryId\": 6, \"serviceName\": \"High Speed Internet Service \"}', '2026-04-20 18:02:12.370'),
(42, 9, 'New Callback Request', 'undefined requested callback for High Speed Internet Service ', 'callback_request', 0, '{\"type\": \"CALLBACK\", \"inquiryId\": 6, \"serviceName\": \"High Speed Internet Service \"}', '2026-04-20 18:02:12.370'),
(43, 29, 'New Callback Request', 'undefined requested callback for High Speed Internet Service ', 'callback_request', 1, '{\"type\": \"CALLBACK\", \"inquiryId\": 6, \"serviceName\": \"High Speed Internet Service \"}', '2026-04-20 18:02:12.370'),
(44, 3, 'New Service Booking', 'undefined booked for High Speed Internet Service ', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 7, \"serviceName\": \"High Speed Internet Service \"}', '2026-04-20 18:04:30.758'),
(45, 9, 'New Service Booking', 'undefined booked for High Speed Internet Service ', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 7, \"serviceName\": \"High Speed Internet Service \"}', '2026-04-20 18:04:30.758'),
(46, 3, 'New Service Payment', 'Received ₹699 from undefined for High Speed Internet Service . Invoice: INV-SERV-2026-271289', 'PAYMENT_RECEIVED', 0, '{\"amount\": 699, \"inquiryId\": 7, \"invoiceNo\": \"INV-SERV-2026-271289\"}', '2026-04-20 18:04:31.314'),
(47, 9, 'New Service Payment', 'Received ₹699 from undefined for High Speed Internet Service . Invoice: INV-SERV-2026-271289', 'PAYMENT_RECEIVED', 0, '{\"amount\": 699, \"inquiryId\": 7, \"invoiceNo\": \"INV-SERV-2026-271289\"}', '2026-04-20 18:04:31.314'),
(48, 3, 'New Callback Request', 'undefined requested callback for High Speed Internet Service ', 'callback_request', 0, '{\"type\": \"CALLBACK\", \"inquiryId\": 8, \"serviceName\": \"High Speed Internet Service \"}', '2026-04-20 18:05:52.024'),
(49, 9, 'New Callback Request', 'undefined requested callback for High Speed Internet Service ', 'callback_request', 0, '{\"type\": \"CALLBACK\", \"inquiryId\": 8, \"serviceName\": \"High Speed Internet Service \"}', '2026-04-20 18:05:52.024'),
(50, 14, 'New Callback Request', 'undefined requested callback for High Speed Internet Service ', 'callback_request', 0, '{\"type\": \"CALLBACK\", \"inquiryId\": 8, \"serviceName\": \"High Speed Internet Service \"}', '2026-04-20 18:05:52.024'),
(51, 8, 'New lead assigned', 'You have been assigned: High Speed Internet Service  for Mangle Singh', 'lead_assigned', 0, NULL, '2026-04-20 18:06:15.352'),
(52, 33, 'New lead assigned', 'You have been assigned: High Speed Internet Service  for Mangle Singh', 'lead_assigned', 0, NULL, '2026-04-20 18:06:44.343'),
(53, 8, 'New lead assigned', 'You have been assigned: High Speed Internet Service  for A101', 'lead_assigned', 0, NULL, '2026-04-20 18:07:05.494'),
(54, 33, 'New lead assigned', 'You have been assigned: High Speed Internet Service  for A101 Paradise', 'lead_assigned', 0, NULL, '2026-04-20 18:07:20.733'),
(55, 3, 'New Service Booking', 'undefined booked for Pest Services ', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 9, \"serviceName\": \"Pest Services \"}', '2026-04-20 18:12:18.442'),
(56, 9, 'New Service Booking', 'undefined booked for Pest Services ', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 9, \"serviceName\": \"Pest Services \"}', '2026-04-20 18:12:18.442'),
(57, 29, 'New Service Booking', 'undefined booked for Pest Services ', 'service_booking', 1, '{\"type\": \"BOOKING\", \"inquiryId\": 9, \"serviceName\": \"Pest Services \"}', '2026-04-20 18:12:18.442'),
(58, 3, 'New Service Payment', 'Received ₹500 from undefined for Pest Services . Invoice: INV-SERV-2026-738960', 'PAYMENT_RECEIVED', 0, '{\"amount\": 500, \"inquiryId\": 9, \"invoiceNo\": \"INV-SERV-2026-738960\"}', '2026-04-20 18:12:18.990'),
(59, 9, 'New Service Payment', 'Received ₹500 from undefined for Pest Services . Invoice: INV-SERV-2026-738960', 'PAYMENT_RECEIVED', 0, '{\"amount\": 500, \"inquiryId\": 9, \"invoiceNo\": \"INV-SERV-2026-738960\"}', '2026-04-20 18:12:18.990'),
(60, 16, 'New lead assigned', 'You have been assigned: Pest Services  for A101 Paradise', 'lead_assigned', 0, NULL, '2026-04-20 18:12:39.853'),
(61, 3, 'Vendor Payout Generated', 'Job Completed by pestwala . Pending Payout: ₹300', 'PAYOUT_GENERATED', 0, '{\"amount\": 300, \"vendorId\": 2, \"inquiryId\": 9}', '2026-04-20 18:13:40.329'),
(62, 9, 'Vendor Payout Generated', 'Job Completed by pestwala . Pending Payout: ₹300', 'PAYOUT_GENERATED', 0, '{\"amount\": 300, \"vendorId\": 2, \"inquiryId\": 9}', '2026-04-20 18:13:40.329'),
(63, 3, 'New Service Booking', 'undefined booked for Pest Services ', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 10, \"serviceName\": \"Pest Services \"}', '2026-04-20 18:14:42.427'),
(64, 9, 'New Service Booking', 'undefined booked for Pest Services ', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 10, \"serviceName\": \"Pest Services \"}', '2026-04-20 18:14:42.427'),
(65, 29, 'New Service Booking', 'undefined booked for Pest Services ', 'service_booking', 1, '{\"type\": \"BOOKING\", \"inquiryId\": 10, \"serviceName\": \"Pest Services \"}', '2026-04-20 18:14:42.427'),
(66, 3, 'New Service Payment', 'Received ₹2000 from undefined for Pest Services . Invoice: INV-SERV-2026-883105', 'PAYMENT_RECEIVED', 0, '{\"amount\": 2000, \"inquiryId\": 10, \"invoiceNo\": \"INV-SERV-2026-883105\"}', '2026-04-20 18:14:43.134'),
(67, 9, 'New Service Payment', 'Received ₹2000 from undefined for Pest Services . Invoice: INV-SERV-2026-883105', 'PAYMENT_RECEIVED', 0, '{\"amount\": 2000, \"inquiryId\": 10, \"invoiceNo\": \"INV-SERV-2026-883105\"}', '2026-04-20 18:14:43.134'),
(68, 16, 'New lead assigned', 'You have been assigned: Pest Services  for A101 Paradise', 'lead_assigned', 0, NULL, '2026-04-20 18:15:03.140'),
(69, 3, 'Vendor Payout Generated', 'Job Completed by pestwala . Pending Payout: ₹1500', 'PAYOUT_GENERATED', 0, '{\"amount\": 1500, \"vendorId\": 2, \"inquiryId\": 10}', '2026-04-20 18:16:12.609'),
(70, 9, 'Vendor Payout Generated', 'Job Completed by pestwala . Pending Payout: ₹1500', 'PAYOUT_GENERATED', 0, '{\"amount\": 1500, \"vendorId\": 2, \"inquiryId\": 10}', '2026-04-20 18:16:12.609'),
(71, 17, 'Payment Received', 'You have received a payment of ₹180 for Service ID #3.', 'PAYMENT_RECEIVED', 0, '{\"amount\": 180, \"payoutId\": 1, \"inquiryId\": 3}', '2026-04-20 18:17:00.706'),
(72, 16, 'Payment Received', 'You have received a payment of ₹1500 for Service ID #10.', 'PAYMENT_RECEIVED', 0, '{\"amount\": 1500, \"payoutId\": 3, \"inquiryId\": 10}', '2026-04-20 18:17:47.395'),
(73, 30, 'New message from Mangle Singh', 'Hello A101', 'chat_message', 0, NULL, '2026-04-20 18:22:32.871'),
(74, 30, 'New message from guardbaba', 'Hello Madamji', 'chat_message', 0, NULL, '2026-04-20 18:28:24.067'),
(75, 3, 'New Service Booking', 'undefined booked for Cleaning Services ', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 11, \"serviceName\": \"Cleaning Services \"}', '2026-04-20 18:31:44.934'),
(76, 9, 'New Service Booking', 'undefined booked for Cleaning Services ', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 11, \"serviceName\": \"Cleaning Services \"}', '2026-04-20 18:31:44.934'),
(77, 3, 'New Service Payment', 'Received ₹200 from undefined for Cleaning Services . Invoice: INV-SERV-2026-905822', 'PAYMENT_RECEIVED', 0, '{\"amount\": 200, \"inquiryId\": 11, \"invoiceNo\": \"INV-SERV-2026-905822\"}', '2026-04-20 18:31:45.829'),
(78, 9, 'New Service Payment', 'Received ₹200 from undefined for Cleaning Services . Invoice: INV-SERV-2026-905822', 'PAYMENT_RECEIVED', 0, '{\"amount\": 200, \"inquiryId\": 11, \"invoiceNo\": \"INV-SERV-2026-905822\"}', '2026-04-20 18:31:45.829'),
(79, 18, 'New lead assigned', 'You have been assigned: Cleaning Services  for Radhe Mohan', 'lead_assigned', 0, NULL, '2026-04-20 18:32:12.780'),
(80, 16, 'New lead assigned', 'You have been assigned: Cleaning Services  for Radhe Mohan', 'lead_assigned', 0, NULL, '2026-04-20 18:32:28.461'),
(81, 3, 'Vendor Payout Generated', 'Job Completed by pestwala . Pending Payout: ₹500', 'PAYOUT_GENERATED', 0, '{\"amount\": 500, \"vendorId\": 2, \"inquiryId\": 11}', '2026-04-20 18:33:23.180'),
(82, 9, 'Vendor Payout Generated', 'Job Completed by pestwala . Pending Payout: ₹500', 'PAYOUT_GENERATED', 0, '{\"amount\": 500, \"vendorId\": 2, \"inquiryId\": 11}', '2026-04-20 18:33:23.180'),
(83, 3, 'New Service Booking', 'undefined booked for Cleaning Services ', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 12, \"serviceName\": \"Cleaning Services \"}', '2026-04-22 06:40:16.239'),
(84, 9, 'New Service Booking', 'undefined booked for Cleaning Services ', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 12, \"serviceName\": \"Cleaning Services \"}', '2026-04-22 06:40:16.239'),
(85, 1, 'New Service Booking', 'undefined booked for Cleaning Services ', 'service_booking', 0, '{\"type\": \"BOOKING\", \"inquiryId\": 12, \"serviceName\": \"Cleaning Services \"}', '2026-04-22 06:40:16.239'),
(86, 3, 'New Service Payment', 'Received ₹500 from undefined for Cleaning Services . Invoice: INV-SERV-2026-017288', 'PAYMENT_RECEIVED', 0, '{\"amount\": 500, \"inquiryId\": 12, \"invoiceNo\": \"INV-SERV-2026-017288\"}', '2026-04-22 06:40:17.313'),
(87, 9, 'New Service Payment', 'Received ₹500 from undefined for Cleaning Services . Invoice: INV-SERV-2026-017288', 'PAYMENT_RECEIVED', 0, '{\"amount\": 500, \"inquiryId\": 12, \"invoiceNo\": \"INV-SERV-2026-017288\"}', '2026-04-22 06:40:17.313'),
(88, 8, 'New lead assigned', 'You have been assigned: Cleaning Services  for Rahul Resident', 'lead_assigned', 0, NULL, '2026-04-22 06:41:15.963'),
(89, 18, 'New lead assigned', 'You have been assigned: Cleaning Services  for Rahul Resident', 'lead_assigned', 0, NULL, '2026-04-22 06:44:18.094'),
(90, 16, 'New lead assigned', 'You have been assigned: Cleaning Services  for Rahul Resident', 'lead_assigned', 0, NULL, '2026-04-22 06:47:28.262'),
(91, 36, 'New lead assigned', 'You have been assigned: Cleaning Services  for Rahul Resident', 'lead_assigned', 0, NULL, '2026-04-22 06:47:36.567'),
(92, 3, 'Vendor Payout Generated', 'Job Completed by ju. Pending Payout: ₹450', 'PAYOUT_GENERATED', 0, '{\"amount\": 450, \"vendorId\": 7, \"inquiryId\": 12}', '2026-04-22 06:48:19.057'),
(93, 9, 'Vendor Payout Generated', 'Job Completed by ju. Pending Payout: ₹450', 'PAYOUT_GENERATED', 0, '{\"amount\": 450, \"vendorId\": 7, \"inquiryId\": 12}', '2026-04-22 06:48:19.057'),
(94, 3, 'Vendor Payout Generated', 'Job Completed by ju. Pending Payout: ₹120', 'PAYOUT_GENERATED', 0, '{\"amount\": 120, \"vendorId\": 7, \"inquiryId\": 12}', '2026-04-22 06:56:03.290'),
(95, 9, 'Vendor Payout Generated', 'Job Completed by ju. Pending Payout: ₹120', 'PAYOUT_GENERATED', 0, '{\"amount\": 120, \"vendorId\": 7, \"inquiryId\": 12}', '2026-04-22 06:56:03.290'),
(96, 8, 'New lead assigned', 'You have been assigned: High Speed Internet Service  for A101', 'lead_assigned', 0, NULL, '2026-04-22 09:09:20.236'),
(97, 36, 'New lead assigned', 'You have been assigned: High Speed Internet Service  for A101', 'lead_assigned', 0, NULL, '2026-04-22 09:09:25.983'),
(98, 11, 'Payment Reminder', 'Reminder: Your payment of ₹2500 for invoice INV-2024-001 is due on 4/28/2026. Please pay on time to avoid late fees.', 'payment', 0, '{\"amount\": 2500, \"dueDate\": \"2026-04-28T08:44:35.654Z\", \"invoiceId\": 1, \"invoiceNo\": \"INV-2024-001\"}', '2026-04-23 12:20:36.337'),
(99, 11, 'Payment Reminder', 'Reminder: Your payment of ₹2500 for invoice INV-2024-001 is due on 4/28/2026. Please pay on time to avoid late fees.', 'payment', 0, '{\"amount\": 2500, \"dueDate\": \"2026-04-28T08:44:35.654Z\", \"invoiceId\": 1, \"invoiceNo\": \"INV-2024-001\"}', '2026-04-24 12:20:36.352'),
(100, 11, 'Payment Reminder', 'Reminder: Your payment of ₹2500 for invoice INV-2024-001 is due on 4/28/2026. Please pay on time to avoid late fees.', 'payment', 0, '{\"amount\": 2500, \"dueDate\": \"2026-04-28T08:44:35.654Z\", \"invoiceId\": 1, \"invoiceNo\": \"INV-2024-001\"}', '2026-04-25 12:20:36.442'),
(101, 11, 'Payment Reminder', 'Reminder: Your payment of ₹2500 for invoice INV-2024-001 is due on 4/28/2026. Please pay on time to avoid late fees.', 'payment', 0, '{\"amount\": 2500, \"dueDate\": \"2026-04-28T08:44:35.654Z\", \"invoiceId\": 1, \"invoiceNo\": \"INV-2024-001\"}', '2026-04-26 12:20:36.386'),
(102, 11, 'Payment Reminder', 'Reminder: Your payment of ₹2500 for invoice INV-2024-001 is due on 4/28/2026. Please pay on time to avoid late fees.', 'payment', 0, '{\"amount\": 2500, \"dueDate\": \"2026-04-28T08:44:35.654Z\", \"invoiceId\": 1, \"invoiceNo\": \"INV-2024-001\"}', '2026-04-27 12:20:36.409');

-- --------------------------------------------------------

--
-- Table structure for table `parcel`
--

CREATE TABLE `parcel` (
  `id` int NOT NULL,
  `unitId` int NOT NULL,
  `courierName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trackingNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receivedBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `collectedBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `collectedAt` datetime(3) DEFAULT NULL,
  `societyId` int NOT NULL,
  `loggedByGuardId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parkingpayment`
--

CREATE TABLE `parkingpayment` (
  `id` int NOT NULL,
  `paymentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slotId` int NOT NULL,
  `residentId` int DEFAULT NULL,
  `amount` double NOT NULL,
  `month` datetime(3) NOT NULL,
  `dueDate` datetime(3) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `paymentDate` datetime(3) DEFAULT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transactionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `societyId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parkingslot`
--

CREATE TABLE `parkingslot` (
  `id` int NOT NULL,
  `number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `block` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floor` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monthlyCharge` double NOT NULL DEFAULT '0',
  `societyId` int NOT NULL,
  `allocatedToUnitId` int DEFAULT NULL,
  `vehicleNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `parkingslot`
--

INSERT INTO `parkingslot` (`id`, `number`, `type`, `status`, `block`, `floor`, `monthlyCharge`, `societyId`, `allocatedToUnitId`, `vehicleNumber`, `createdAt`, `updatedAt`) VALUES
(1, 'P-A1', '4-Wheeler', 'ALLOCATED', NULL, NULL, 0, 2, 2, NULL, '2026-04-18 08:44:20.421', '2026-04-18 08:44:20.421'),
(2, 'P-A2', '4-Wheeler', 'ALLOCATED', NULL, NULL, 0, 2, 4, NULL, '2026-04-18 08:44:20.421', '2026-04-18 08:44:20.421'),
(3, 'P-B1', '2-Wheeler', 'VACANT', NULL, NULL, 0, 2, NULL, NULL, '2026-04-18 08:44:20.421', '2026-04-18 08:44:20.421');

-- --------------------------------------------------------

--
-- Table structure for table `patrollog`
--

CREATE TABLE `patrollog` (
  `id` int NOT NULL,
  `area` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
  `societyId` int NOT NULL,
  `guardId` int NOT NULL,
  `startTime` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endTime` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `platforminvoice`
--

CREATE TABLE `platforminvoice` (
  `id` int NOT NULL,
  `invoiceNo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `societyId` int NOT NULL,
  `amount` double NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `issueDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `dueDate` datetime(3) NOT NULL,
  `paidDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `platforminvoice`
--

INSERT INTO `platforminvoice` (`id`, `invoiceNo`, `societyId`, `amount`, `status`, `issueDate`, `dueDate`, `paidDate`, `createdAt`, `updatedAt`) VALUES
(1, 'INV-1-673509', 1, 0, 'PAID', '2026-04-17 13:31:13.512', '2026-04-17 13:31:13.509', '2026-04-17 13:31:13.509', '2026-04-17 13:31:13.512', '2026-04-17 13:31:13.512'),
(2, 'INV-4-015561', 4, 0, 'PAID', '2026-04-18 11:00:15.561', '2026-04-18 11:00:15.561', '2026-04-18 11:00:15.561', '2026-04-18 11:00:15.561', '2026-04-18 11:00:15.561'),
(3, 'INV-1776510204989', 3, 999, 'PENDING', '2026-04-18 11:03:24.990', '2026-04-18 00:00:00.000', NULL, '2026-04-18 11:03:24.990', '2026-04-18 11:03:24.990'),
(4, 'INV-1776510421044', 4, 4999, 'PAID', '2026-04-18 11:07:01.045', '2026-04-18 00:00:00.000', '2026-04-18 11:08:07.516', '2026-04-18 11:07:01.045', '2026-04-18 11:08:07.516'),
(5, 'INV-3-362726', 3, 0, 'PAID', '2026-04-18 11:22:42.727', '2026-04-18 11:22:42.726', '2026-04-18 11:22:42.726', '2026-04-18 11:22:42.727', '2026-04-18 11:22:42.727'),
(6, 'INV-2-493621', 2, 4999, 'PENDING', '2026-04-18 19:28:13.622', '2026-05-18 19:28:13.621', NULL, '2026-04-18 19:28:13.622', '2026-04-18 19:28:13.622'),
(7, 'INV-5-493648', 5, 20000, 'PENDING', '2026-04-18 19:28:13.649', '2026-05-18 19:28:13.648', NULL, '2026-04-18 19:28:13.649', '2026-04-18 19:28:13.649'),
(8, 'INV-5-700297', 5, 20000, 'PAID', '2026-04-18 19:31:40.298', '2026-04-18 19:31:40.297', '2026-04-18 19:31:40.297', '2026-04-18 19:31:40.298', '2026-04-18 19:31:40.298'),
(10, 'INV-10-882266', 10, 20000, 'PAID', '2026-04-20 16:34:42.267', '2026-04-20 16:34:42.266', '2026-04-20 16:34:42.266', '2026-04-20 16:34:42.267', '2026-04-20 16:34:42.267'),
(11, 'INV-1776703528721', 10, 20000, 'PENDING', '2026-04-20 16:45:28.722', '2027-05-20 00:00:00.000', NULL, '2026-04-20 16:45:28.722', '2026-04-20 16:45:28.722');

-- --------------------------------------------------------

--
-- Table structure for table `purchaseorder`
--

CREATE TABLE `purchaseorder` (
  `id` int NOT NULL,
  `poNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `items` json NOT NULL,
  `subtotal` double NOT NULL DEFAULT '0',
  `taxAmount` double NOT NULL DEFAULT '0',
  `totalAmount` double NOT NULL DEFAULT '0',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expectedDeliveryDate` datetime(3) DEFAULT NULL,
  `deliveryDate` datetime(3) DEFAULT NULL,
  `paymentTerms` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `societyId` int NOT NULL,
  `vendorId` int NOT NULL,
  `prId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchaserequest`
--

CREATE TABLE `purchaserequest` (
  `id` int NOT NULL,
  `prNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `items` json DEFAULT NULL,
  `societyId` int NOT NULL,
  `requestedById` int NOT NULL,
  `department` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEDIUM',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING_CM',
  `estimatedAmount` double NOT NULL,
  `cmActionBy` int DEFAULT NULL,
  `cmActionDate` datetime(3) DEFAULT NULL,
  `financeActionBy` int DEFAULT NULL,
  `financeActionDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rolemodel`
--

CREATE TABLE `rolemodel` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rolemodel`
--

INSERT INTO `rolemodel` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Manager', 'society manager check accounting and staff entery and reminder to resident for due', '2026-04-18 10:51:54.096', '2026-04-18 10:51:54.096');

-- --------------------------------------------------------

--
-- Table structure for table `rolepermission`
--

CREATE TABLE `rolepermission` (
  `roleId` int NOT NULL,
  `permissionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `servicecategory`
--

CREATE TABLE `servicecategory` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'blue',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `servicecategory`
--

INSERT INTO `servicecategory` (`id`, `name`, `description`, `icon`, `color`, `createdAt`) VALUES
('cleaning_services_', 'Cleaning Services ', 'Cleaning Services in the citi ', 'Wrench', 'blue', '2026-04-20 17:59:05.568'),
('electric_services_', 'Electric Services ', 'Best electric services in the city special offer 10 % discount ', 'Wrench', 'blue', '2026-04-20 17:55:46.776'),
('high_speed_internet_service_', 'High Speed Internet Service ', 'High Speed Internet Service ', 'Wrench', 'blue', '2026-04-20 18:01:17.529'),
('pest_services_', 'Pest Services ', 'Pest services In the citi ', 'Wrench', 'blue', '2026-04-20 17:57:20.955');

-- --------------------------------------------------------

--
-- Table structure for table `serviceinquiry`
--

CREATE TABLE `serviceinquiry` (
  `id` int NOT NULL,
  `residentId` int DEFAULT NULL,
  `societyId` int DEFAULT NULL,
  `serviceId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serviceName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `preferredDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferredTime` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `vendorName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vendorId` int DEFAULT NULL,
  `paymentStatus` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `payableAmount` double DEFAULT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transactionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentDate` datetime(3) DEFAULT NULL,
  `vendorPrice` double DEFAULT NULL,
  `contactedAt` datetime(3) DEFAULT NULL,
  `contactedBy` int DEFAULT NULL,
  `activityLog` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `serviceinquiry`
--

INSERT INTO `serviceinquiry` (`id`, `residentId`, `societyId`, `serviceId`, `serviceName`, `type`, `status`, `preferredDate`, `preferredTime`, `phone`, `pincode`, `notes`, `vendorName`, `vendorId`, `paymentStatus`, `payableAmount`, `paymentMethod`, `transactionId`, `paymentDate`, `vendorPrice`, `contactedAt`, `contactedBy`, `activityLog`, `createdAt`, `updatedAt`) VALUES
(1, 4, 1, NULL, 'service', 'BOOKING', 'CONFIRMED', '2026-04-23', '3pm', NULL, NULL, '', NULL, NULL, 'PAID', 200, 'CASH', 'CASH-1776501663850', '2026-04-18 08:41:03.850', NULL, NULL, NULL, NULL, '2026-04-18 08:41:02.587', '2026-04-18 08:41:03.896'),
(2, 19, 3, NULL, 'service', 'BOOKING', 'PENDING', '2026-04-18', '6pm', NULL, NULL, '', NULL, NULL, 'PENDING', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 12:38:32.069', '2026-04-18 12:38:32.069'),
(3, 19, 3, NULL, 'service', 'BOOKING', 'done', '2026-04-18', '6pm', NULL, NULL, 'PEST SOLUTION ', 'pestwala02', 3, 'PAID', 200, 'CASH', 'CASH-1776515933214', '2026-04-20 18:17:00.652', NULL, '2026-04-18 12:41:40.720', 3, '[{\"time\": \"2026-04-18T12:41:40.720Z\", \"action\": \"Vendor contacted customer\", \"byVendorId\": 3}]', '2026-04-18 12:38:52.533', '2026-04-20 18:17:00.654'),
(4, 19, 3, NULL, 'service', 'CALLBACK', 'PENDING', NULL, 'morning', '8519090890', NULL, 'REQUIRED PEST ', NULL, NULL, 'PENDING', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 13:23:11.855', '2026-04-18 13:23:11.855'),
(5, 4, 1, NULL, 'service', 'BOOKING', 'CONFIRMED', '', '12pm', NULL, NULL, 'z cxv', NULL, NULL, 'PAID', 500, 'CASH', 'CASH-1776657663291', '2026-04-20 04:01:03.291', NULL, NULL, NULL, NULL, '2026-04-20 04:01:02.614', '2026-04-20 04:01:03.322'),
(6, 30, 10, 'high_speed_internet_service_', 'High Speed Internet Service ', 'CALLBACK', 'booked', NULL, 'morning', '09876543210', NULL, 'looking for internet services', 'Internet Wala', 6, 'PENDING', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-20 18:02:12.333', '2026-04-20 18:07:20.705'),
(7, 29, 10, 'high_speed_internet_service_', 'High Speed Internet Service ', 'BOOKING', 'confirmed', '2026-04-21', '12pm', NULL, NULL, 'LOOKING 200 MBPS PLAN ', 'Internet Wala', 6, 'PAID', 699, 'CASH', 'CASH-1776708271289', '2026-04-20 18:04:31.289', 500, NULL, NULL, NULL, '2026-04-20 18:04:30.723', '2026-04-20 18:08:27.901'),
(8, 19, 3, 'high_speed_internet_service_', 'High Speed Internet Service ', 'CALLBACK', 'booked', NULL, 'afternoon', '8519090890', NULL, 'SHARE DISCOUNT PLAN OR LATEST', 'ju', 7, 'PENDING', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-20 18:05:51.999', '2026-04-22 09:09:25.944'),
(9, 30, 10, 'pest_services_', 'Pest Services ', 'BOOKING', 'done', '2026-04-21', '12pm', NULL, NULL, '', 'pestwala ', 2, 'PAID', 500, 'CASH', 'CASH-1776708738960', '2026-04-20 18:12:18.960', 300, NULL, NULL, NULL, '2026-04-20 18:12:18.355', '2026-04-20 18:15:27.698'),
(10, 30, 10, 'pest_services_', 'Pest Services ', 'BOOKING', 'done', '2026-04-21', '12pm', NULL, NULL, '', 'pestwala ', 2, 'PAID', 2000, 'CASH', 'CASH-1776708883105', '2026-04-20 18:17:47.366', 1500, NULL, NULL, NULL, '2026-04-20 18:14:42.399', '2026-04-20 18:17:47.368'),
(11, 35, NULL, 'cleaning_services_', 'Cleaning Services ', 'BOOKING', 'done', '2026-04-22', '3pm', NULL, '400615', '', 'pestwala ', 2, 'PAID', 200, 'CASH', 'CASH-1776709905822', '2026-04-20 18:31:45.822', 500, NULL, NULL, NULL, '2026-04-20 18:31:44.720', '2026-04-20 18:33:23.132'),
(12, 4, 1, 'cleaning_services_', 'Cleaning Services ', 'BOOKING', 'done', '2026-04-24', '3pm', NULL, NULL, 'gghg', 'ju', 7, 'PAID', 500, 'CASH', 'CASH-1776840017287', '2026-04-22 06:40:17.287', 120, NULL, NULL, NULL, '2026-04-22 06:40:16.207', '2026-04-22 06:56:06.654');

-- --------------------------------------------------------

--
-- Table structure for table `servicevariant`
--

CREATE TABLE `servicevariant` (
  `id` int NOT NULL,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `servicevariant`
--

INSERT INTO `servicevariant` (`id`, `categoryId`, `name`, `price`, `createdAt`) VALUES
(3, 'electric_services_', 'Wirirng charges ', 200, '2026-04-20 17:55:46.776'),
(4, 'electric_services_', 'switches installation ', 100, '2026-04-20 17:55:46.776'),
(5, 'pest_services_', 'General Pest annual package 3 services ', 2000, '2026-04-20 17:57:20.955'),
(6, 'pest_services_', 'General Pest 1 time service ', 500, '2026-04-20 17:57:20.955'),
(7, 'cleaning_services_', 'Daily help or cleaning 30 minutes ', 200, '2026-04-20 17:59:05.568'),
(8, 'cleaning_services_', 'Sofa and dish wahing windows cleaning 30 minutes ', 300, '2026-04-20 17:59:05.568'),
(9, 'high_speed_internet_service_', '100 mbps monthly unlimted ', 499, '2026-04-20 18:01:17.529'),
(10, 'high_speed_internet_service_', '200 mbps monthly unlimited ', 699, '2026-04-20 18:01:17.529');

-- --------------------------------------------------------

--
-- Table structure for table `society`
--

CREATE TABLE `society` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ACTIVE','PENDING','INACTIVE','SUSPENDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `subscriptionPlan` enum('BASIC','PROFESSIONAL','ENTERPRISE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BASIC',
  `isPaid` tinyint(1) NOT NULL DEFAULT '0',
  `discount` double DEFAULT '0',
  `billingPlanId` int DEFAULT NULL,
  `expectedUnits` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdByUserId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `society`
--

INSERT INTO `society` (`id`, `name`, `address`, `city`, `state`, `pincode`, `code`, `status`, `subscriptionPlan`, `isPaid`, `discount`, `billingPlanId`, `expectedUnits`, `createdAt`, `updatedAt`, `createdByUserId`) VALUES
(1, 'Trinity CHS', 'Near Central Park', 'Noida', 'UP', '201301', 'SOC001', 'ACTIVE', 'BASIC', 1, 0, NULL, 0, '2026-04-17 13:27:50.452', '2026-04-17 13:31:10.972', NULL),
(2, 'Modern Living Apartments', '7th Avenue, Green Park', 'Delhi', 'Delhi', '110001', 'LIVE99', 'ACTIVE', 'PROFESSIONAL', 1, 0, 2, 0, '2026-04-18 08:43:59.612', '2026-04-18 08:43:59.612', NULL),
(3, 'Ganesha CHS', 'Kasarwadavli Naka, Thane', 'Thane', 'Maharashtra', '400615', 'GAN1374', 'ACTIVE', 'BASIC', 1, 0, NULL, 4, '2026-04-18 10:45:48.631', '2026-04-18 11:22:42.673', 3),
(4, 'Saraswati CHS', 'Navpada, Thane station', 'Thane', 'Maharashtra', '400602', 'SAR8782', 'ACTIVE', 'BASIC', 1, 0, NULL, 4, '2026-04-18 10:46:54.605', '2026-04-18 11:00:15.526', 3),
(5, 'Kartik CHS', 'Malad west ', 'Mumbai', 'Maharashtra', '400064', 'KAR3517', 'ACTIVE', 'PROFESSIONAL', 1, 0, 5, 4, '2026-04-18 19:27:42.175', '2026-04-18 19:31:40.268', 3),
(10, 'Paradise CHS', 'Bandra Mumbai', 'Mumbai', 'Maharashtra', '400080', 'PAR4259', 'ACTIVE', 'PROFESSIONAL', 1, 0, 5, 4, '2026-04-20 16:17:03.454', '2026-04-20 16:35:04.348', 3),
(11, 'Trinity Housing', 'Kothrud', 'Pune', 'Maharashtra', '411038', 'TRI7952', 'ACTIVE', 'BASIC', 0, 0, NULL, 40, '2026-05-07 05:08:56.754', '2026-05-07 05:09:11.582', 3);

-- --------------------------------------------------------

--
-- Table structure for table `sosalert`
--

CREATE TABLE `sosalert` (
  `id` int NOT NULL,
  `residentId` int NOT NULL,
  `societyId` int NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `resolvedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GUARD',
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shift` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `workingDays` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OFF_DUTY',
  `attendanceStatus` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `checkInTime` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` double NOT NULL DEFAULT '0',
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joiningDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergencyContact` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idProof` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `societyId` int NOT NULL,
  `createdByGuardId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `name`, `role`, `phone`, `password`, `email`, `shift`, `gate`, `workingDays`, `status`, `attendanceStatus`, `checkInTime`, `rating`, `photo`, `joiningDate`, `address`, `emergencyContact`, `idProof`, `idNumber`, `societyId`, `createdByGuardId`, `createdAt`, `updatedAt`) VALUES
(2, 'guardbaba', 'GUARD', '123456789', '$2b$10$EnhzMVxCR0XLvMvR.6dk0OhZyb2jeYK.1PdaXQUhz.nSm/MmBEjnu', 'guardparadise@gmail.com', 'Afternoon (2 PM - 10 PM)', 'Main Gate', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 'OFF_DUTY', 'UPCOMING', NULL, 0, NULL, '2026-04-20 18:24:57.169', 'thane', '1234567890', 'Driving License', '123456', 10, NULL, '2026-04-20 18:24:57.169', '2026-04-20 18:24:57.169');

-- --------------------------------------------------------

--
-- Table structure for table `systemsetting`
--

CREATE TABLE `systemsetting` (
  `id` int NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `systemsetting`
--

INSERT INTO `systemsetting` (`id`, `key`, `value`) VALUES
(1, 'currency', 'INR');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `id` int NOT NULL,
  `type` enum('INCOME','EXPENSE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `date` datetime(3) NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentMethod` enum('CASH','ONLINE','UPI','CHEQUE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `societyId` int NOT NULL,
  `invoiceNo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paidTo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receivedFrom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `bankAccountId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`id`, `type`, `category`, `amount`, `date`, `description`, `paymentMethod`, `status`, `societyId`, `invoiceNo`, `paidTo`, `receivedFrom`, `createdAt`, `updatedAt`, `bankAccountId`) VALUES
(2, 'INCOME', 'Maintenance', 2500, '2026-04-18 08:44:33.485', NULL, 'UPI', 'PAID', 2, NULL, NULL, 'John Doe', '2026-04-18 08:44:33.487', '2026-04-18 08:44:33.487', NULL),
(3, 'EXPENSE', 'Salary', 15000, '2026-04-18 08:44:33.485', NULL, 'ONLINE', 'PAID', 2, NULL, 'Bahadur Singh', NULL, '2026-04-18 08:44:33.487', '2026-04-18 08:44:33.487', NULL),
(4, 'INCOME', 'SERVICE_BOOKING', 200, '2026-04-18 12:38:53.214', 'Service Payment: service - Resident', 'CASH', 'PAID', 3, 'INV-SERV-2026-933214', NULL, 'Resident', '2026-04-18 12:38:53.215', '2026-04-18 12:38:53.215', NULL),
(6, 'INCOME', 'Parking', 4, '2026-04-20 00:00:00.000', 'asdf', 'ONLINE', 'PAID', 1, 'sfsfg', NULL, 'fd', '2026-04-20 04:10:21.898', '2026-04-20 04:10:21.898', NULL),
(7, 'INCOME', 'SERVICE_BOOKING', 699, '2026-04-20 18:04:31.289', 'Service Payment: High Speed Internet Service  - Resident', 'CASH', 'PAID', 10, 'INV-SERV-2026-271289', NULL, 'Resident', '2026-04-20 18:04:31.291', '2026-04-20 18:04:31.291', NULL),
(8, 'INCOME', 'SERVICE_BOOKING', 500, '2026-04-20 18:12:18.960', 'Service Payment: Pest Services  - Resident', 'CASH', 'PAID', 10, 'INV-SERV-2026-738960', NULL, 'Resident', '2026-04-20 18:12:18.961', '2026-04-20 18:12:18.961', NULL),
(9, 'INCOME', 'SERVICE_BOOKING', 2000, '2026-04-20 18:14:43.105', 'Service Payment: Pest Services  - Resident', 'CASH', 'PAID', 10, 'INV-SERV-2026-883105', NULL, 'Resident', '2026-04-20 18:14:43.106', '2026-04-20 18:14:43.106', NULL),
(10, 'INCOME', 'SERVICE_BOOKING', 500, '2026-04-22 06:40:17.288', 'Service Payment: Cleaning Services  - Resident', 'CASH', 'PAID', 1, 'INV-SERV-2026-017288', NULL, 'Resident', '2026-04-22 06:40:17.289', '2026-04-22 06:40:17.289', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `unit`
--

CREATE TABLE `unit` (
  `id` int NOT NULL,
  `block` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor` int NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `areaSqFt` double NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OCCUPIED',
  `pets` int NOT NULL DEFAULT '0',
  `membersCount` int NOT NULL DEFAULT '0',
  `societyId` int NOT NULL,
  `ownerId` int DEFAULT NULL,
  `tenantId` int DEFAULT NULL,
  `leaseStartDate` datetime(3) DEFAULT NULL,
  `leaseEndDate` datetime(3) DEFAULT NULL,
  `rentAmount` double DEFAULT NULL,
  `securityDeposit` double DEFAULT NULL,
  `maintenanceCharges` double DEFAULT NULL,
  `parkingSlot` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vehicleNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `emergencyContact` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `unit`
--

INSERT INTO `unit` (`id`, `block`, `number`, `floor`, `type`, `areaSqFt`, `status`, `pets`, `membersCount`, `societyId`, `ownerId`, `tenantId`, `leaseStartDate`, `leaseEndDate`, `rentAmount`, `securityDeposit`, `maintenanceCharges`, `parkingSlot`, `vehicleNumber`, `notes`, `emergencyContact`, `createdAt`, `updatedAt`) VALUES
(1, 'A', '101', 1, '3BHK', 1500, 'OCCUPIED', 0, 0, 1, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-17 13:30:41.841', '2026-04-20 12:18:24.711'),
(2, 'A', '101', 1, '2BHK', 1200, 'OCCUPIED', 0, 0, 2, 11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 08:44:16.499', '2026-04-18 08:44:16.499'),
(3, 'B', '201', 2, '3BHK', 1800, 'VACANT', 0, 0, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 08:44:16.499', '2026-04-18 08:44:16.499'),
(4, 'A', '102', 1, '2BHK', 1200, 'OCCUPIED', 0, 0, 2, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 08:44:16.499', '2026-04-18 08:44:16.499'),
(5, 'A', '101, 201, 301, 401', 4, 'APARTMENT', 1000, 'OCCUPIED', 0, 0, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 11:33:39.337', '2026-04-18 11:33:39.337'),
(6, 'A', '102', 1, 'APARTMENT', 1000, 'OCCUPIED', 0, 0, 3, 19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 11:52:47.031', '2026-04-18 11:55:53.909'),
(7, 'A', '201', 2, 'APARTMENT', 1000, 'OCCUPIED', 0, 0, 3, 20, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 11:52:58.953', '2026-04-18 11:58:22.168'),
(8, 'A', '301', 3, 'APARTMENT', 1000, 'OCCUPIED', 0, 0, 3, NULL, 21, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 11:53:09.501', '2026-04-18 11:58:56.484'),
(9, 'A', '401', 4, 'APARTMENT', 1000, 'OCCUPIED', 0, 0, 3, 22, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 11:53:25.626', '2026-04-18 11:59:45.211'),
(10, 'A', '501', 501, 'APARTMENT', 1000, 'OCCUPIED', 0, 0, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 12:02:27.381', '2026-04-18 12:02:27.381'),
(11, 'B', '1001', 1, 'APARTMENT', 1000, 'OCCUPIED', 0, 0, 4, 23, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 12:10:44.862', '2026-04-18 12:11:33.327'),
(12, 'B', '2001', 2, 'APARTMENT', 1000, 'OCCUPIED', 0, 0, 4, 24, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 12:12:11.684', '2026-04-18 12:12:47.837'),
(13, 'A', '101', 1, 'APARTMENT', 1000, 'OCCUPIED', 0, 0, 10, 30, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-20 16:53:28.172', '2026-04-20 17:04:45.228'),
(14, 'A', '201', 2, 'APARTMENT', 1000, 'OCCUPIED', 0, 0, 10, 31, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-20 16:53:41.343', '2026-04-20 17:05:49.597'),
(15, 'A', '301', 3, 'APARTMENT', 1000, 'OCCUPIED', 0, 0, 10, 32, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-20 16:53:55.204', '2026-04-20 17:06:28.816'),
(16, 'A', '401', 4, 'APARTMENT', 1000, 'OCCUPIED', 0, 0, 10, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-20 16:54:16.028', '2026-04-20 16:54:16.028');

-- --------------------------------------------------------

--
-- Table structure for table `unitmember`
--

CREATE TABLE `unitmember` (
  `id` int NOT NULL,
  `unitId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profileImg` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `unitpet`
--

CREATE TABLE `unitpet` (
  `id` int NOT NULL,
  `unitId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `breed` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vaccinationStatus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UP_TO_DATE',
  `lastVaccinationDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `unitvehicle`
--

CREATE TABLE `unitvehicle` (
  `id` int NOT NULL,
  `societyId` int NOT NULL,
  `unitId` int NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `make` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ownerName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parkingSlot` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('SUPER_ADMIN','ADMIN','RESIDENT','GUARD','VENDOR','ACCOUNTANT','INDIVIDUAL','COMMUNITY_MANAGER','COMMITTEE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'RESIDENT',
  `status` enum('ACTIVE','SUSPENDED','PENDING') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `profileImg` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `societyId` int DEFAULT NULL,
  `pinCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assignedVendorId` int DEFAULT NULL,
  `addedByUserId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `phone`, `role`, `status`, `profileImg`, `roleId`, `societyId`, `pinCode`, `assignedVendorId`, `addedByUserId`, `createdAt`, `updatedAt`) VALUES
(1, 'admin@society.com', '$2b$10$mTPC8kYXL3tLakblfvugaOq7kEWBeb8UcCCsD9PK5YOWsOum6vhNW', 'Sanjay Admin', '', 'ADMIN', 'ACTIVE', NULL, NULL, 1, NULL, NULL, NULL, '2026-04-17 13:27:52.440', '2026-04-20 12:03:30.876'),
(2, 'resident@society.com', '$2b$10$KtpeUPxPsLeRtf8Wxl8qTuD/WNp3vaq0myNtpJQAwuu8EmEu2BREW', 'John Resident', NULL, 'RESIDENT', 'ACTIVE', NULL, NULL, 1, NULL, NULL, NULL, '2026-04-17 13:27:54.421', '2026-04-17 13:27:54.421'),
(3, 'superadmin@society.com', '$2b$10$GQ16xr2LKuoXRQLSxYBb0.uDqDLaHTuu9m71hUWTQpif/WQJI3802', 'Main Super Admin', NULL, 'SUPER_ADMIN', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-17 13:30:24.210', '2026-04-17 13:30:24.210'),
(4, 'resident1@society.com', '$2b$10$C6vLYQR5SpW6NhYm0SNPCu5ZZ.u.k/J1OJo0jlJAVmB0CN9jqTwxi', 'Rahul Resident', NULL, 'RESIDENT', 'ACTIVE', NULL, NULL, 1, NULL, NULL, NULL, '2026-04-17 13:30:30.225', '2026-04-17 13:30:30.225'),
(5, 'guard@society.com', '$2b$10$E7Vz14k9LF0HMl44lwTGGezUfWHi92ykC/lRjln2tMiFo2sAJAaaK', 'Bahadur Guard', NULL, 'GUARD', 'ACTIVE', NULL, NULL, 1, NULL, NULL, NULL, '2026-04-17 13:30:32.373', '2026-04-17 13:30:32.373'),
(6, 'test4@gmail.com', '$2b$10$eWsn1clxr7mAn5XK6To.TugP7mNqQ13VB0trjC0l.jE18kyiMWsbu', 'Expert Services', NULL, 'VENDOR', 'ACTIVE', NULL, NULL, 1, NULL, NULL, NULL, '2026-04-17 13:30:34.522', '2026-04-17 13:30:34.522'),
(7, 'individual@example.com', '$2b$10$3whxSq7tht6uIBAfXHmeFOPgwk7VvxD9AcTBtMIl42ec8YbBjKLK6', 'Amit Individual', NULL, 'INDIVIDUAL', 'ACTIVE', NULL, NULL, 1, NULL, NULL, NULL, '2026-04-17 13:30:36.673', '2026-04-17 13:30:36.673'),
(8, 'test@gmail.com', '$2b$10$K6SLLb39FqLuO9OuhvUScepIQyT2IY5Lav.A5MbKKd6DrzK789sCW', 'test', '5454343423234', 'VENDOR', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 07:19:40.618', '2026-04-18 07:19:40.618'),
(9, 'super@socity.com', '$2b$10$eal97.Ilf6Mu8wrRcYZZq.6zY68MAvGhfS5BLdeDt0WY211tFtEo6', 'Platform Admin', NULL, 'SUPER_ADMIN', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 08:44:03.300', '2026-04-18 08:44:03.300'),
(10, 'admin@live99.com', '$2b$10$eal97.Ilf6Mu8wrRcYZZq.6zY68MAvGhfS5BLdeDt0WY211tFtEo6', 'Sanjay Admin', '9000000001', 'ADMIN', 'ACTIVE', NULL, NULL, 2, NULL, NULL, NULL, '2026-04-18 08:44:06.817', '2026-04-18 08:44:06.817'),
(11, 'john@live99.com', '$2b$10$eal97.Ilf6Mu8wrRcYZZq.6zY68MAvGhfS5BLdeDt0WY211tFtEo6', 'John Doe', '9000000002', 'RESIDENT', 'ACTIVE', NULL, NULL, 2, NULL, NULL, NULL, '2026-04-18 08:44:09.457', '2026-04-18 08:44:09.457'),
(12, 'jane@live99.com', '$2b$10$eal97.Ilf6Mu8wrRcYZZq.6zY68MAvGhfS5BLdeDt0WY211tFtEo6', 'Jane Smith', '9000000003', 'RESIDENT', 'ACTIVE', NULL, NULL, 2, NULL, NULL, NULL, '2026-04-18 08:44:11.658', '2026-04-18 08:44:11.658'),
(13, 'guard1@live99.com', '$2b$10$eal97.Ilf6Mu8wrRcYZZq.6zY68MAvGhfS5BLdeDt0WY211tFtEo6', 'Bahadur Singh', '9000000004', 'GUARD', 'ACTIVE', NULL, NULL, 2, NULL, NULL, NULL, '2026-04-18 08:44:14.297', '2026-04-18 08:44:14.297'),
(14, 'premmathurganeshachs@gmail.com', '$2b$10$P6d1Rj8jbXMtFG6o/QQK0u8C6C0awglhGFXIkfkPsAeDr5JvZr0Tq', 'Prem Mathur', '9220002333', 'ADMIN', 'ACTIVE', NULL, NULL, 3, NULL, NULL, 3, '2026-04-18 10:48:34.104', '2026-04-18 19:32:20.326'),
(15, 'nishakotiansaraswatichs@gmail.com', '$2b$10$HToRoxcAtH8LOD4xdGOcZeGnu.CG4kyLomNQ5gL2sMuaPUU9CIE9W', 'Nisha Kotian', '9222226345', 'ADMIN', 'ACTIVE', NULL, NULL, 4, NULL, NULL, 3, '2026-04-18 10:50:29.232', '2026-04-18 10:50:29.232'),
(16, 'pestwala@gmail.com', '$2b$10$jwceVwfpS4/FsQJJMsAQw.ZtlxSrOUhggUhGBTAFns3GcJS8WIjXS', 'pestwala ', '9222226345', 'VENDOR', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 11:18:50.658', '2026-04-18 11:18:50.658'),
(17, 'pestwala02@gmail.com', '$2b$10$zO3j1x5Ae2bnmKzlMqyc9.CpbhhF0C.ZS48.1Ul5P.jQHy/9NarWa', 'pestwala02', '8519090890', 'VENDOR', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 11:19:35.566', '2026-04-18 11:19:35.566'),
(18, 'cleaning@gmail.com', '$2b$10$Aizhjzvu96yF6pNYm75zLudEBNdABSyVbAE0IHFn5q39ZyWBZ7H3C', 'cleaning solution', '9876543210', 'VENDOR', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 11:20:40.867', '2026-04-18 11:20:40.867'),
(19, 'A101GANESHACHS@GMAIL.COM', '$2b$10$0dqRaHUkcS5fCu7i.uuRueTpGgTubKE5qOHtgSHiJnm7oXeGMOspm', 'A101', '8519090890', 'RESIDENT', 'ACTIVE', NULL, NULL, 3, NULL, NULL, 14, '2026-04-18 11:55:53.891', '2026-04-18 11:55:53.891'),
(20, 'A201GANESHACHS@GMAIL.COM', '$2b$10$IQgALTpJhcHAFmhlCQaQSeqedoxnXBQFKzCh2hNmZMyGyC3oIn63e', 'A201', '9220002333', 'RESIDENT', 'ACTIVE', NULL, NULL, 3, NULL, NULL, 14, '2026-04-18 11:58:22.151', '2026-04-18 11:58:22.151'),
(21, 'A301GANESHACHS@GMAIL.COM', '$2b$10$WOsUpLbuYLOyLwatxIFHku.FtQS3e6Lqkt3P0Msuhwo52I4fUiS.O', 'A301', '9876543210', 'RESIDENT', 'ACTIVE', NULL, NULL, 3, NULL, NULL, 14, '2026-04-18 11:58:56.465', '2026-04-18 11:58:56.465'),
(22, 'A401GANESHACHS@GMAIL.COM', '$2b$10$3EtsgLzzCY6bZinKip4Q4ebrFXB6VcuYXlLGAC5wSbUMilWQ.Rf22', 'A401', '9876543210', 'RESIDENT', 'ACTIVE', NULL, NULL, 3, NULL, NULL, 14, '2026-04-18 11:59:45.192', '2026-04-18 11:59:45.192'),
(23, 'B1001SARASWATICHS@GMAIL.COM', '$2b$10$u6l/W5rxT2/gD9iIwcp.dOMDdakH4ekcjGJ8ShNoDpCmJdqwgwIru', 'B1001', '0987654321', 'RESIDENT', 'ACTIVE', NULL, NULL, 4, NULL, NULL, 15, '2026-04-18 12:11:33.308', '2026-04-18 12:11:33.308'),
(24, 'B2001SARASWATICHS@GMAIL.COM', '$2b$10$5mbRbjFRh8pLXJJPfxjiYep0STPPtWXLwM74vp2CSXsB5ftoaSZPi', 'B2001', '0987654321', 'RESIDENT', 'ACTIVE', NULL, NULL, 4, NULL, NULL, 15, '2026-04-18 12:12:47.820', '2026-04-18 12:12:47.820'),
(25, 'PESTWALAGANESHACHS@GMAIL.COM', '$2b$10$CgCb0sqLJK/OWwPk18EUjuoiOQTBTyAJv1UD2168uO1FNiwTSABP.', 'PESTWALA GANESHA ', '9220002333', 'VENDOR', 'ACTIVE', NULL, NULL, 3, NULL, NULL, NULL, '2026-04-18 13:01:49.293', '2026-04-18 13:01:49.293'),
(26, 'johnd@gmail.com', '$2b$10$0ddkC/G6Z2tfDpbou3bPCehOnjcmx1NbUVAVftyoQ/TVXl1Jm14Tq', 'John Dsouza', '9876543210', 'ADMIN', 'ACTIVE', NULL, NULL, 5, NULL, NULL, 3, '2026-04-18 19:30:21.633', '2026-04-18 19:30:21.633'),
(29, 'manglesingh@gmail.com', '$2b$10$jMv0/2tFR/MEeMPQjjHhQeUoomQ.cHH86i5T5/ANW6RT3cCCuJ7EO', 'Mangle Singh', '09876543210', 'ADMIN', 'ACTIVE', NULL, NULL, 10, NULL, NULL, 3, '2026-04-20 16:26:28.470', '2026-04-20 16:26:28.470'),
(30, 'A101Paradise@gmail.com', '$2b$10$1wRUi.hX3qhaBXnChfYdDe4vyhG9c6v44Dm/pIxkU1/vqzpJpgCpi', 'A101 Paradise', '09876543210', 'RESIDENT', 'ACTIVE', NULL, NULL, 10, NULL, NULL, 29, '2026-04-20 17:04:45.204', '2026-04-20 17:04:45.204'),
(31, 'A201Paradise@gmail.com', '$2b$10$2f7oeXAF5gNMPZPVd3mcieJUfAfKLUpdMXFmu9jp4oTMYym2GIi7q', 'A201 Paradise', '09220002333', 'RESIDENT', 'ACTIVE', NULL, NULL, 10, NULL, NULL, 29, '2026-04-20 17:05:49.586', '2026-04-20 17:05:49.586'),
(32, 'A301paradise@gmail.com', '$2b$10$VNTDeVhs5kKdPGJ6OTU6N.lA.kk7myl/XsttwhaZgbayiZ48NG5pu', '301 Paradise', '8519090890', 'RESIDENT', 'ACTIVE', NULL, NULL, 10, NULL, NULL, 29, '2026-04-20 17:06:28.786', '2026-04-20 17:06:28.786'),
(33, 'INTERNETWALA@GMAIL.COM', '$2b$10$LOr9sE0OcnZY1T/XXQjureKgSeOhRLUB8NP.vxvq8DbUTRowYO63G', 'Internet Wala', '9220002333', 'VENDOR', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-20 18:03:46.938', '2026-04-20 18:03:46.938'),
(34, 'guardparadise@gmail.com', '$2b$10$EnhzMVxCR0XLvMvR.6dk0OhZyb2jeYK.1PdaXQUhz.nSm/MmBEjnu', 'guardbaba', '123456789', 'GUARD', 'ACTIVE', NULL, NULL, 10, NULL, NULL, 29, '2026-04-20 18:24:57.150', '2026-04-20 18:24:57.150'),
(35, 'radhe@gmail.com', '$2b$10$dhfvCSoShYvrIF5Q5I4Dv.UIxVsWOC68kEjAizT8IQakyuUyqYwDy', 'Radhe Mohan', '9220002333', 'INDIVIDUAL', 'ACTIVE', NULL, NULL, NULL, '400615', 5, 3, '2026-04-20 18:30:29.423', '2026-04-20 18:30:29.423'),
(36, 'ju@gmail.com', '$2b$10$QH3DYSJblFdPpcFh4Wdk7eqME8RChRjOjLQqkkPokiYyoVKMVlMDC', 'ju', '09876543211', 'VENDOR', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-22 06:47:19.403', '2026-04-22 06:47:19.403');

-- --------------------------------------------------------

--
-- Table structure for table `usersession`
--

CREATE TABLE `usersession` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `device` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ipAddress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastActive` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `token` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usersession`
--

INSERT INTO `usersession` (`id`, `userId`, `device`, `ipAddress`, `lastActive`, `token`, `createdAt`) VALUES
(1, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-17 13:31:03.928', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDMyNjYzLCJleHAiOjE3NzY1MTkwNjN9.6Sah2NJv7TpqDPiGtsoyFk3s7O25a70nj7labIozXKo', '2026-04-17 13:31:03.928'),
(2, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-17 13:32:41.719', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQzMjc2MSwiZXhwIjoxNzc2NTE5MTYxfQ.wo8WxQKGqeZ9XUMgQmkC50_rfjqkpB9AsWheuZIX_es', '2026-04-17 13:32:41.719'),
(3, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-17 13:33:07.857', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDMyNzg3LCJleHAiOjE3NzY1MTkxODd9.8cbYF4x1HoygP-8N1ERRMXmP1nuDicqV7w-7aWrB-vs', '2026-04-17 13:33:07.857'),
(4, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-17 13:38:38.628', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQzMzExOCwiZXhwIjoxNzc2NTE5NTE4fQ.kV_G_S3mQ5zbCCmX6XnIhbOKMRwt0o39hZ6dpRtqv1A', '2026-04-17 13:38:38.628'),
(5, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-17 13:43:23.966', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDMzNDAzLCJleHAiOjE3NzY1MTk4MDN9._2aRKtlarWlKaQ9aXcFVvcUo3OmTyEC_TLUqRuQPhyU', '2026-04-17 13:43:23.966'),
(6, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-17 13:52:23.528', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQzMzk0MywiZXhwIjoxNzc2NTIwMzQzfQ.596Qstlo3Rdj64VDNdJT43dQejPcH4kntMoQ1DScKr4', '2026-04-17 13:52:23.528'),
(7, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-17 13:56:32.448', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQzNDE5MiwiZXhwIjoxNzc2NTIwNTkyfQ.og8s-fmjL2QEW5eSnPdMitlpy2l85OEzMCB0mHQuZgE', '2026-04-17 13:56:32.448'),
(8, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:30:46.897', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkwMjQ2LCJleHAiOjE3NzY1NzY2NDZ9.DyqiZj9QF9NiFAkxvahtaWEpV_n5Q5Qw8X1VIlx8RZM', '2026-04-18 05:30:46.897'),
(9, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:40:04.162', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5MDgwNCwiZXhwIjoxNzc2NTc3MjA0fQ.nJI8n5u0mn7qGefJZT428OEodVU30JlOjITHGGi4qAU', '2026-04-18 05:40:04.162'),
(10, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:40:29.216', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkwODI5LCJleHAiOjE3NzY1NzcyMjl9.yLF7Y9OJD8FTp3Qu7ccYfHGHBIsrxR-xScafJYD6J1M', '2026-04-18 05:40:29.216'),
(11, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:41:10.548', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkwODcwLCJleHAiOjE3NzY1NzcyNzB9.FVGhcku6O2jo56uoeKjBWpoFz1HtkrHu-SXty-6KRr4', '2026-04-18 05:41:10.548'),
(12, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:44:22.318', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5MTA2MiwiZXhwIjoxNzc2NTc3NDYyfQ.noDyEzYvYOT4o6js2VU__S2JZ4Hmez1vE159j_poqm0', '2026-04-18 05:44:22.318'),
(13, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:44:46.937', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkxMDg2LCJleHAiOjE3NzY1Nzc0ODZ9.tJQFREZkrHEfIx1EhpC1Pwt6MEBT_OmcFZj9GXmCjd0', '2026-04-18 05:44:46.937'),
(14, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:49:14.260', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5MTM1NCwiZXhwIjoxNzc2NTc3NzU0fQ._FlCgwc4qvqGtRUFqmIA0_VcSgXHvLnKC1jTb_AxyI8', '2026-04-18 05:49:14.260'),
(15, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:49:32.410', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkxMzcyLCJleHAiOjE3NzY1Nzc3NzJ9.DXJO36AnQIJejlXelULgVjU6-6a3-0vfz3RAcfrckgY', '2026-04-18 05:49:32.410'),
(16, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:49:50.823', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkxMzkwLCJleHAiOjE3NzY1Nzc3OTB9.ccJ18zRUoBtv-8XkwLY2UCU_LaNquxn5_eP4KP0R-OU', '2026-04-18 05:49:50.823'),
(17, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:52:41.918', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkxNTYxLCJleHAiOjE3NzY1Nzc5NjF9.oj-71s4-aE05WcNveYyejsZF1dKaber88O12X4uOrT8', '2026-04-18 05:52:41.918'),
(18, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:53:59.249', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkxNjM5LCJleHAiOjE3NzY1NzgwMzl9.MxGb9WB659ZBi5Qdpb-7zxBVIn9k7QPmerhWdFw8utw', '2026-04-18 05:53:59.249'),
(19, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:54:30.226', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkxNjcwLCJleHAiOjE3NzY1NzgwNzB9.uM_x2dxwZzeYXR-vfCcqIdwC6KW1pEW7yYl_kL-kgpQ', '2026-04-18 05:54:30.226'),
(20, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:56:46.229', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkxODA2LCJleHAiOjE3NzY1NzgyMDZ9.rkTyJv4glzJvQXURDx3YP3uOPzt3inCalPpb_eNMYAQ', '2026-04-18 05:56:46.229'),
(21, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 05:57:32.607', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5MTg1MiwiZXhwIjoxNzc2NTc4MjUyfQ.SvtKRK39mN5ab1dnUe8e4Ft2H3GSaj77KOnEF96SMuk', '2026-04-18 05:57:32.607'),
(22, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:00:08.898', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkyMDA4LCJleHAiOjE3NzY1Nzg0MDh9.-YfYvWS_r2RiicO5VvRIesw61Gfmh8XeajyKfjeUiOM', '2026-04-18 06:00:08.898'),
(23, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:01:41.143', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkyMTAxLCJleHAiOjE3NzY1Nzg1MDF9.G5UwSK-bGCLbDlrpGwdivomqTwwlU5TRcLmc2sIuFS0', '2026-04-18 06:01:41.143'),
(24, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:127.0.0.1', '2026-04-18 06:02:05.126', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5MjEyNSwiZXhwIjoxNzc2NTc4NTI1fQ.hvjNINGgod75_JgIhwmFMbRHwh_xffQsKXmnu6Mrvas', '2026-04-18 06:02:05.126'),
(25, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:02:36.525', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkyMTU2LCJleHAiOjE3NzY1Nzg1NTZ9.YfhR9OXw3aLuaQkIeRwrdHJV4EMMpguT-m_Cn2PU6i8', '2026-04-18 06:02:36.525'),
(26, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:03:09.067', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5MjE4OSwiZXhwIjoxNzc2NTc4NTg5fQ.MidzcWjElqrMDxdo1iJwGBEBysuSP1n3bTkzO1HEuyE', '2026-04-18 06:03:09.067'),
(27, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:03:21.547', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkyMjAxLCJleHAiOjE3NzY1Nzg2MDF9.K4dIk6MbADptGYkzSiZ0ZAcik-agS8a5B1sXPAG5bcY', '2026-04-18 06:03:21.547'),
(28, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:03:52.470', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5MjIzMiwiZXhwIjoxNzc2NTc4NjMyfQ.R5WuYY-4nmJnSIrLHNnWbF0EigrdPg9310L3to9m5VM', '2026-04-18 06:03:52.470'),
(29, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:04:43.394', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkyMjgzLCJleHAiOjE3NzY1Nzg2ODN9.VJm525GJKu_h8nLYsmD_OagmX4mKUroD7T8sqKxhEDo', '2026-04-18 06:04:43.394'),
(30, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:05:14.916', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5MjMxNCwiZXhwIjoxNzc2NTc4NzE0fQ.Cfgz4hmPtDypYW2aZFbimSMjuefRbFTD8YtZtwIRemQ', '2026-04-18 06:05:14.916'),
(31, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:07:17.711', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkyNDM3LCJleHAiOjE3NzY1Nzg4Mzd9._DKGn_3DGwSZFQWOA0OnU-UQ7Ij3VcAXfajcLaTajHw', '2026-04-18 06:07:17.711'),
(32, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:07:52.106', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5MjQ3MiwiZXhwIjoxNzc2NTc4ODcyfQ.gxKN_t4Wo16FOS2lmoKfB1ObZ6wYfZv7PNr7e36Yv5g', '2026-04-18 06:07:52.106'),
(33, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:08:19.236', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkyNDk5LCJleHAiOjE3NzY1Nzg4OTl9.-4LgT2pJ7tYLSwxI8deUCCzjon8bmN3y3z4YyaFFGqs', '2026-04-18 06:08:19.236'),
(34, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:08:57.462', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkyNTM3LCJleHAiOjE3NzY1Nzg5Mzd9.Zu9aC-4Wo3RQeRTe994UCdXYO4M4VmCCMZCEmMTkw78', '2026-04-18 06:08:57.462'),
(35, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:12:17.744', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5MjczNywiZXhwIjoxNzc2NTc5MTM3fQ.epN9lBEVoGn9xmciW_XjilKZrQVBwcWhjd9NEpzG-h0', '2026-04-18 06:12:17.744'),
(36, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:12:37.764', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5Mjc1NywiZXhwIjoxNzc2NTc5MTU3fQ.t67eKTToCqOJj_hZit4RI19xwpXwWKVNKHPk5fyVkoI', '2026-04-18 06:12:37.764'),
(37, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:12:58.585', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkyNzc4LCJleHAiOjE3NzY1NzkxNzh9.XCSoXRuefo-kfNRtOJ3CGnz7i-z1bxZnWb2k2gJHAOw', '2026-04-18 06:12:58.585'),
(38, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:13:17.982', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkyNzk3LCJleHAiOjE3NzY1NzkxOTd9.kBBjt02XwK6QVM_QsoTstDVLOGqqosZHvLndxCpsLv8', '2026-04-18 06:13:17.982'),
(39, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:13:57.763', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5MjgzNywiZXhwIjoxNzc2NTc5MjM3fQ.mbxqbZrVlp4zxcre3iI5aPdDge-0nZAYAfGvAwe41m8', '2026-04-18 06:13:57.763'),
(40, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:14:14.383', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDkyODU0LCJleHAiOjE3NzY1NzkyNTR9.o3h16tHNN3sLtqHSeOyJmCXHKkjYVVNl_SkruIZsMUA', '2026-04-18 06:14:14.383'),
(41, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-18 06:46:23.414', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDk0NzgzLCJleHAiOjE3NzY1ODExODN9.A6qG6he7azq1d457G6MvFYclEG2fregZhjrNsxhd9ZY', '2026-04-18 06:46:23.414'),
(42, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.4', '2026-04-18 07:06:09.049', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDk1OTY5LCJleHAiOjE3NzY1ODIzNjl9.BeDfs4MB1qKf0cK8lpn9q7EZLeDKmS_gCft4XDqOGyo', '2026-04-18 07:06:09.049'),
(43, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.8', '2026-04-18 07:14:59.910', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDk2NDk5LCJleHAiOjE3NzY1ODI4OTl9._fQdXa6Qk0XHno8mgbF34eF8mo6afvo4e-t9oKZ9MJI', '2026-04-18 07:14:59.910'),
(44, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.2', '2026-04-18 07:15:21.357', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5NjUyMSwiZXhwIjoxNzc2NTgyOTIxfQ.6D1ySpWU_EtxuHPRJDjjE3x_88hVG-JpDZ8bFuV0Bfo', '2026-04-18 07:15:21.357'),
(45, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.7', '2026-04-18 07:15:33.366', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDk2NTMzLCJleHAiOjE3NzY1ODI5MzN9.nJCv3zSdpP771umlf1TpxPe9hRz1gGexKPXNF_ZSFR0', '2026-04-18 07:15:33.366'),
(46, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.2', '2026-04-18 07:15:46.464', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5NjU0NiwiZXhwIjoxNzc2NTgyOTQ2fQ.znUVwtESpkzKDfoOGDle4NOz4WiXwITyMAmdKRj2nqQ', '2026-04-18 07:15:46.464'),
(47, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.9', '2026-04-18 07:16:05.987', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY0OTY1NjUsImV4cCI6MTc3NjU4Mjk2NX0.eak8vedhw4radbAyWR00YftxJFvLVPHr_FLCiGKmc30', '2026-04-18 07:16:05.987'),
(48, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.12', '2026-04-18 07:18:44.157', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY0OTY3MjQsImV4cCI6MTc3NjU4MzEyNH0.vjjy9-zCGlohuBH0BeWDd-djwNnwxqfOqalx_hEvHHA', '2026-04-18 07:18:44.157'),
(49, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.13', '2026-04-18 07:20:01.578', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjQ5NjgwMSwiZXhwIjoxNzc2NTgzMjAxfQ.7HlnzCHsYzxyySUy_CaoVdtNWfXSTKVAnh8XKSGfmOw', '2026-04-18 07:20:01.578'),
(50, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.12', '2026-04-18 07:21:01.872', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDk2ODYxLCJleHAiOjE3NzY1ODMyNjF9.odzvRUgOYVo6TXGEVPBFr4IyRgP1DWW89FU3Nu2i6JQ', '2026-04-18 07:21:01.872'),
(51, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.2', '2026-04-18 07:21:27.015', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY0OTY4ODcsImV4cCI6MTc3NjU4MzI4N30.v8C-uZebb7PYyagESduhFyU1S2TE0stWpuvZ9zFPGcM', '2026-04-18 07:21:27.015'),
(52, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.9', '2026-04-18 07:35:23.478', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NDk3NzIzLCJleHAiOjE3NzY1ODQxMjN9.ydsKpbHBjbkkZNAOtrMCHVSmlZGEdVzN9FtG0BDflZw', '2026-04-18 07:35:23.478'),
(53, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.11', '2026-04-18 07:42:06.079', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY0OTgxMjYsImV4cCI6MTc3NjU4NDUyNn0.2toWxd91Na0pyot0ovWfjACEhH4iPeFllAtJzEIf58I', '2026-04-18 07:42:06.079'),
(54, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.13', '2026-04-18 08:37:12.366', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NTAxNDMyLCJleHAiOjE3NzY1ODc4MzJ9.t0V07t4W536PjsKqu-bMMgH-RgLbtzrQ21Oz8Dsd7ec', '2026-04-18 08:37:12.366'),
(55, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.2', '2026-04-18 08:38:38.349', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NTAxNTE4LCJleHAiOjE3NzY1ODc5MTh9.u2l6e8jfWf4NUoScyydUSxryrB-HLdYeILZIV6ParZ4', '2026-04-18 08:38:38.349'),
(56, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.10', '2026-04-18 08:39:07.983', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjUwMTU0NywiZXhwIjoxNzc2NTg3OTQ3fQ.5KBr2uOdxiAnNrjU0QTCHKEcp0qPlYQbo5F1xgBIQIc', '2026-04-18 08:39:07.983'),
(57, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.10', '2026-04-18 08:39:24.382', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NTAxNTY0LCJleHAiOjE3NzY1ODc5NjR9.MNIuDDcPq4B7ntSymMerJNMtUNnYh6wOzB3wUd2L-JQ', '2026-04-18 08:39:24.382'),
(58, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.8', '2026-04-18 08:39:36.464', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY1MDE1NzYsImV4cCI6MTc3NjU4Nzk3Nn0.0RMUueHxJ4DdFfae4-KOWMYOq6oaAdBtlGes76K9kYA', '2026-04-18 08:39:36.464'),
(59, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.6', '2026-04-18 08:40:45.020', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjUwMTY0NSwiZXhwIjoxNzc2NTg4MDQ1fQ.mOxzl9Z5p6HZ6GliwRVfc9l7EZcEjsO1By5nQkmtwrY', '2026-04-18 08:40:45.020'),
(60, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-18 08:41:10.744', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY1MDE2NzAsImV4cCI6MTc3NjU4ODA3MH0.ShhR77xywFzJTagvd1-q5LqdknVhiqIUTa6Bl3ZwQhk', '2026-04-18 08:41:10.744'),
(61, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.9', '2026-04-18 08:46:20.335', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NTAxOTgwLCJleHAiOjE3NzY1ODgzODB9.z_5woV94VIJ03apGAVENGMS9o7IZreAiESn4tY4PQ6s', '2026-04-18 08:46:20.335'),
(62, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.5', '2026-04-18 08:47:10.584', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjUwMjAzMCwiZXhwIjoxNzc2NTg4NDMwfQ.RqMdBTUiV5K00M7ruWXaaEJ-VUo4McArVA6dJ9nPa2E', '2026-04-18 08:47:10.584'),
(63, 3, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.6', '2026-04-18 10:10:21.698', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY1MDcwMjEsImV4cCI6MTc3NjU5MzQyMX0.YPeX-Fel_ta0U8dF3fmeXZs2Oke-i14_hgCGF4-Dv_k', '2026-04-18 10:10:21.698'),
(64, 1, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.5', '2026-04-18 10:11:16.022', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NTA3MDc2LCJleHAiOjE3NzY1OTM0NzZ9._g9_P1JdH0d2pqJymhVnzJULK1yd8poB616mqpfW_JU', '2026-04-18 10:11:16.022'),
(65, 4, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.12', '2026-04-18 10:13:16.771', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjUwNzE5NiwiZXhwIjoxNzc2NTkzNTk2fQ.ycUjp6vBuHWEWBidqteQ4y9Dzge2WI5iD8FcYq08RGc', '2026-04-18 10:13:16.771'),
(66, 5, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.5', '2026-04-18 10:15:29.476', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NTA3MzI5LCJleHAiOjE3NzY1OTM3Mjl9.7FAmVMZUxfICVMCiOf4gknq4T8etv-bp8cHMQSQQG9M', '2026-04-18 10:15:29.476'),
(67, 6, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.12', '2026-04-18 10:17:01.526', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY1MDc0MjEsImV4cCI6MTc3NjU5MzgyMX0.EPQpALY953JwuDRZYV7-8A2vSjjVu8w-qC6laRDHTiM', '2026-04-18 10:17:01.526'),
(68, 6, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.8', '2026-04-18 10:17:59.120', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY1MDc0NzksImV4cCI6MTc3NjU5Mzg3OX0.ER4_DDoQaBZdLTIam8to0EhlgaJA7InSII_mGSNM4Y0', '2026-04-18 10:17:59.120'),
(69, 6, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.8', '2026-04-18 10:18:18.951', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY1MDc0OTgsImV4cCI6MTc3NjU5Mzg5OH0.U4SSAk7FmAdddCxbcCeOpczvbXOro51f7Fe0Y2YHR9w', '2026-04-18 10:18:18.951'),
(70, 7, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.9', '2026-04-18 10:18:41.155', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJpbmRpdmlkdWFsQGV4YW1wbGUuY29tIiwicm9sZSI6IklORElWSURVQUwiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjUwNzUyMSwiZXhwIjoxNzc2NTkzOTIxfQ.DbabjbNJcjD79Zeko76al-bCjZdmxcX5m1zgJsdvpSU', '2026-04-18 10:18:41.155'),
(71, 3, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.5', '2026-04-18 10:27:34.134', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY1MDgwNTQsImV4cCI6MTc3NjU5NDQ1NH0.S72_zrwugcnEyEBOuNCiXmiA8iG3qVVequbgR7N93HQ', '2026-04-18 10:27:34.134'),
(72, 15, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.6', '2026-04-18 10:59:58.597', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoibmlzaGFrb3RpYW5zYXJhc3dhdGljaHNAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwic29jaWV0eUlkIjo0LCJpYXQiOjE3NzY1MDk5OTgsImV4cCI6MTc3NjU5NjM5OH0.tQ94vuEMDiiy24X28sGGTJ6S9MrVsJ2JzwLCQ5wVeEM', '2026-04-18 10:59:58.597'),
(73, 14, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.9', '2026-04-18 11:01:47.721', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoicHJlbW1hdGh1cmdhbmVzaGFjaHNAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwic29jaWV0eUlkIjozLCJpYXQiOjE3NzY1MTAxMDcsImV4cCI6MTc3NjU5NjUwN30.nuIiJ44Fpck6ABUkvEW9FJCoLlID0yHwWMX5bUlrHOc', '2026-04-18 11:01:47.721'),
(74, 14, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-18 11:22:31.069', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoicHJlbW1hdGh1cmdhbmVzaGFjaHNAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwic29jaWV0eUlkIjozLCJpYXQiOjE3NzY1MTEzNTEsImV4cCI6MTc3NjU5Nzc1MX0.KsCfjdVG-1xfPIMNJJQGDp6hLkprVRnd6m_3CbY4KTk', '2026-04-18 11:22:31.069'),
(75, 15, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.6', '2026-04-18 11:31:28.979', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoibmlzaGFrb3RpYW5zYXJhc3dhdGljaHNAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwic29jaWV0eUlkIjo0LCJpYXQiOjE3NzY1MTE4ODgsImV4cCI6MTc3NjU5ODI4OH0.DuPLGszQtjwuDCHdYZ2GezGIjgoX5-Q8DBJJtNVVeec', '2026-04-18 11:31:28.979'),
(76, 14, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.7', '2026-04-18 11:52:08.944', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoicHJlbW1hdGh1cmdhbmVzaGFjaHNAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwic29jaWV0eUlkIjozLCJpYXQiOjE3NzY1MTMxMjgsImV4cCI6MTc3NjU5OTUyOH0.EYXQK2WhiZD9vsX6P3gPWbEdLSjSobv1OVCXN6rbeX4', '2026-04-18 11:52:08.944'),
(77, 15, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.4', '2026-04-18 12:05:11.416', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoibmlzaGFrb3RpYW5zYXJhc3dhdGljaHNAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwic29jaWV0eUlkIjo0LCJpYXQiOjE3NzY1MTM5MTEsImV4cCI6MTc3NjYwMDMxMX0.7gO79-1rTKxen8bukfvrGDdrf5MD3hyNzm4QPVqAmu4', '2026-04-18 12:05:11.416'),
(78, 19, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.12', '2026-04-18 12:06:22.513', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksImVtYWlsIjoiQTEwMUdBTkVTSEFDSFNAR01BSUwuQ09NIiwicm9sZSI6IlJFU0lERU5UIiwic29jaWV0eUlkIjozLCJpYXQiOjE3NzY1MTM5ODIsImV4cCI6MTc3NjYwMDM4Mn0.OW02Wuk5AFqrETVy_DoGXT1CqOGbHJan1q5n4JcXGck', '2026-04-18 12:06:22.513'),
(79, 21, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.8', '2026-04-18 12:07:06.058', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImVtYWlsIjoiQTMwMUdBTkVTSEFDSFNAR01BSUwuQ09NIiwicm9sZSI6IlJFU0lERU5UIiwic29jaWV0eUlkIjozLCJpYXQiOjE3NzY1MTQwMjYsImV4cCI6MTc3NjYwMDQyNn0.X3k8CzhezPUyFKY3kk7ILF8NG2PS52S3ZL9uBH4u--U', '2026-04-18 12:07:06.058'),
(80, 23, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-18 12:13:47.039', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImVtYWlsIjoiQjEwMDFTQVJBU1dBVElDSFNAR01BSUwuQ09NIiwicm9sZSI6IlJFU0lERU5UIiwic29jaWV0eUlkIjo0LCJpYXQiOjE3NzY1MTQ0MjcsImV4cCI6MTc3NjYwMDgyN30.yB_fYmZCchqjnUJ8Jn7z-T5a9zVZakSIiYlhGmNNlLQ', '2026-04-18 12:13:47.039'),
(81, 3, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-18 12:22:42.664', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY1MTQ5NjIsImV4cCI6MTc3NjYwMTM2Mn0.eOQHRz3e6T5FA8iapooOk7xJdD8N_Yit30pxQDFlZv0', '2026-04-18 12:22:42.664'),
(82, 17, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.13', '2026-04-18 12:41:12.930', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImVtYWlsIjoicGVzdHdhbGEwMkBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY1MTYwNzIsImV4cCI6MTc3NjYwMjQ3Mn0.3C819yUGhWqPjbTowGlYee9bbNtC0im1tifK4bAk3xI', '2026-04-18 12:41:12.930'),
(83, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.6', '2026-04-18 19:16:00.011', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY1Mzk3NjAsImV4cCI6MTc3NjYyNjE2MH0.F0CkaD2RS7nvYZi_qGhHsNh_5XeLDatsYwoadqaKAk0', '2026-04-18 19:16:00.011'),
(84, 26, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.2', '2026-04-18 19:31:31.267', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsImVtYWlsIjoiam9obmRAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwic29jaWV0eUlkIjo1LCJpYXQiOjE3NzY1NDA2OTEsImV4cCI6MTc3NjYyNzA5MX0.9oAwSHamkjv-zq471RAZL59Tyc8qaB7EPMVdhUZn0Yo', '2026-04-18 19:31:31.267'),
(85, 14, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.3', '2026-04-18 19:35:06.715', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoicHJlbW1hdGh1cmdhbmVzaGFjaHNAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwic29jaWV0eUlkIjozLCJpYXQiOjE3NzY1NDA5MDYsImV4cCI6MTc3NjYyNzMwNn0.deISB0a8muGfNTSBZMbNGQkZVVZ8x2lt4_TiFIhQY3k', '2026-04-18 19:35:06.715'),
(86, 19, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.10', '2026-04-18 19:43:16.806', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksImVtYWlsIjoiQTEwMUdBTkVTSEFDSFNAR01BSUwuQ09NIiwicm9sZSI6IlJFU0lERU5UIiwic29jaWV0eUlkIjozLCJpYXQiOjE3NzY1NDEzOTYsImV4cCI6MTc3NjYyNzc5Nn0.mrE_1F6mzUqhrk5yOuZzctmGX9hGNPCb4pum3c9AYVA', '2026-04-18 19:43:16.806'),
(87, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-20 03:57:25.316', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY1NzQ0NSwiZXhwIjoxNzc2NzQzODQ1fQ.77sXBNJR-w91l90DBy09PU2CPOc-HzRCLEXpOqQBmDc', '2026-04-20 03:57:25.316'),
(88, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.2', '2026-04-20 04:02:56.972', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY2NTc3NzYsImV4cCI6MTc3Njc0NDE3Nn0.vRRfgKVUq19NVkpjluxneT4C1FNR0VXdKiaXZl2WVmM', '2026-04-20 04:02:56.972'),
(89, 7, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.2', '2026-04-20 04:03:52.125', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJpbmRpdmlkdWFsQGV4YW1wbGUuY29tIiwicm9sZSI6IklORElWSURVQUwiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY1NzgzMiwiZXhwIjoxNzc2NzQ0MjMyfQ.hzoRUtsSwr3ntFr9RBSA-sstM2LwagS6NvBuALLxaFo', '2026-04-20 04:03:52.125'),
(90, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.11', '2026-04-20 04:04:51.762', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjU3ODkxLCJleHAiOjE3NzY3NDQyOTF9.q_ANSBZrhwBdy3uixHbddxMlddhG8Zll2yEsEZZf8t0', '2026-04-20 04:04:51.762'),
(91, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.11', '2026-04-20 04:12:33.382', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjU4MzUzLCJleHAiOjE3NzY3NDQ3NTN9.d4s7i4JhQ1Qi3gDSAGWbx84orLAMhuayxWlmU-0hw8E', '2026-04-20 04:12:33.382'),
(92, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 05:34:19.889', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjYzMjU5LCJleHAiOjE3NzY3NDk2NTl9.dAHEXViMOMowKbka4j72-4ru6o4w3T-iPp5NtyMLkXE', '2026-04-20 05:34:19.889'),
(93, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 05:49:51.946', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY2NDE5MSwiZXhwIjoxNzc2NzUwNTkxfQ.kLnx9oJpII3rgmae2bqOZaNqlWqlAu2mGlCTT9U0O9Y', '2026-04-20 05:49:51.946'),
(94, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 05:50:40.476', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjY0MjQwLCJleHAiOjE3NzY3NTA2NDB9.wzUau2vNXr4GpRc-2wnUAKrn7KT5g-KaApVVkwkDG-k', '2026-04-20 05:50:40.476'),
(95, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 05:51:53.258', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY2NjQzMTMsImV4cCI6MTc3Njc1MDcxM30.8PioT48srHIPv7gnzKxerZU-sAXQpwP6c8EtMMnjLXU', '2026-04-20 05:51:53.258'),
(96, 7, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 05:52:19.688', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJpbmRpdmlkdWFsQGV4YW1wbGUuY29tIiwicm9sZSI6IklORElWSURVQUwiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY2NDMzOSwiZXhwIjoxNzc2NzUwNzM5fQ.opTlLAXOUQlw_JteTqdBmpeSBnfGGgTSjaT5hoFxhTI', '2026-04-20 05:52:19.688'),
(97, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 05:57:44.354', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY2NDY2NCwiZXhwIjoxNzc2NzUxMDY0fQ.LBT7eAzOuhHRyWjWYxSRrbEv0Mpf9yEsTDww7l5XFto', '2026-04-20 05:57:44.354'),
(98, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 05:58:19.746', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjY0Njk5LCJleHAiOjE3NzY3NTEwOTl9.cObFNGvdEi1u2h6s-skMktzyya1IQQxrJQtTGmq9QRw', '2026-04-20 05:58:19.746'),
(99, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 05:59:09.196', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY2NjQ3NDksImV4cCI6MTc3Njc1MTE0OX0.g2JnXhhPjmbZwm9aC1kUVqePpahw97sc-efkHwko8Sw', '2026-04-20 05:59:09.196'),
(100, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 05:59:24.269', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjY0NzY0LCJleHAiOjE3NzY3NTExNjR9.dqIduRUlcQcTRlNRDX_ZrTMtOrwIHsNMxtUHhQCh9-0', '2026-04-20 05:59:24.269'),
(101, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:00:00.523', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY2NDgwMCwiZXhwIjoxNzc2NzUxMjAwfQ.Jnzc8kb2lVSfLAu9qnvGAhTI82keAHTmzqCXtRFHq3k', '2026-04-20 06:00:00.523'),
(102, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:00:28.425', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjY0ODI4LCJleHAiOjE3NzY3NTEyMjh9.lT5HJrvw3hft2ZtrN04sD6qyDnSdOUz62csIEtCgsYA', '2026-04-20 06:00:28.425'),
(103, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:01:00.028', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY2NDg2MCwiZXhwIjoxNzc2NzUxMjYwfQ.EJgwkbu_-MVTtxN7cmViVXkrZhGpTXAE49rouKcuJqo', '2026-04-20 06:01:00.028'),
(104, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:01:23.784', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjY0ODgzLCJleHAiOjE3NzY3NTEyODN9.tYhFAuerANj0-hW-_caN3OKwvE-vHj0T383Wuu1hz5Q', '2026-04-20 06:01:23.784'),
(105, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:01:56.780', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjY0OTE2LCJleHAiOjE3NzY3NTEzMTZ9.15xB80OSzY25qqG9IEBqxP-XLXvsnxmsqB9TZHUIgPM', '2026-04-20 06:01:56.780'),
(106, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:02:14.820', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY2NDkzNCwiZXhwIjoxNzc2NzUxMzM0fQ.765BQigYSVp4wob8Ev6FzzbbbpOmoii3w_IDcG452XA', '2026-04-20 06:02:14.820'),
(107, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:02:33.754', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjY0OTUzLCJleHAiOjE3NzY3NTEzNTN9.gXWh-BgLolG8ZuqqorvP-TADolQ0doGpWc9Zf7PLo7g', '2026-04-20 06:02:33.754'),
(108, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:03:17.756', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY2NjQ5OTcsImV4cCI6MTc3Njc1MTM5N30.Ydc0YxbeM28sLIVGdLZSW2WwxdHToFGvaJJ_Ko8N_9M', '2026-04-20 06:03:17.756'),
(109, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:03:39.991', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjY1MDE5LCJleHAiOjE3NzY3NTE0MTl9.RHXeovF3_Vphx7HMejCt6_VRSEH6bfYQ7YEK4mBCUVE', '2026-04-20 06:03:39.991'),
(110, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:04:18.920', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY2NjUwNTgsImV4cCI6MTc3Njc1MTQ1OH0.FXhjrQvViTc5mPsF8WTqxVf1VJUfms77jYYXHAgAjKQ', '2026-04-20 06:04:18.920'),
(111, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:04:52.333', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjY1MDkyLCJleHAiOjE3NzY3NTE0OTJ9.t-z5767p0C_O-8G6dlDwX_iXPI5McTFFIadFtHJN85Q', '2026-04-20 06:04:52.333'),
(112, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:08:51.749', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY2NjUzMzEsImV4cCI6MTc3Njc1MTczMX0.gGp7mOL76cxNZGPsvlMZizRSPCfUmxuMtXb0A_-wwnI', '2026-04-20 06:08:51.749'),
(113, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:11:45.696', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjY1NTA1LCJleHAiOjE3NzY3NTE5MDV9.ZrUI647jvkZgSkORCfDZUKIjB5VxKtwwXFZnXxauvN4', '2026-04-20 06:11:45.696'),
(114, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:13:52.456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY2NTYzMiwiZXhwIjoxNzc2NzUyMDMyfQ.-B_iHMvX0uRyAEgmC9DkYknygHZuk33cp560cdGPfVY', '2026-04-20 06:13:52.456'),
(115, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:15:01.815', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjY1NzAxLCJleHAiOjE3NzY3NTIxMDF9.JDQoHwEnhfupVKIBdfHebzR83qPMCHT2vRsBG6E_PIE', '2026-04-20 06:15:01.815'),
(116, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:15:18.251', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY2NjU3MTgsImV4cCI6MTc3Njc1MjExOH0.M9WW-ZXpIers_r-4ecmp4QuaDE0Rsrl0UwWlUlf4t6s', '2026-04-20 06:15:18.251'),
(117, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 06:34:31.376', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY2NjY4NzEsImV4cCI6MTc3Njc1MzI3MX0.lVqEKGydboAu8EE_XLWWAJLpSSZSmsfHdFN1eHtmReI', '2026-04-20 06:34:31.376'),
(118, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 07:30:09.063', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NjcwMjA5LCJleHAiOjE3NzY3NTY2MDl9.feoKcPtAzSRFFnC_SlYc_tXpjM8ya23wNvsYKOqhsbU', '2026-04-20 07:30:09.063'),
(119, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 07:30:24.449', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY3MDIyNCwiZXhwIjoxNzc2NzU2NjI0fQ.KrO1rZnDadbi4oeQYjQJ74RXsR0VBQLtP1VZ0-8Khsg', '2026-04-20 07:30:24.449'),
(120, 7, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.11', '2026-04-20 08:33:10.436', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJpbmRpdmlkdWFsQGV4YW1wbGUuY29tIiwicm9sZSI6IklORElWSURVQUwiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY3Mzk5MCwiZXhwIjoxNzc2NzYwMzkwfQ.Wo5hXrvVzKolBleJFz1JqvYlpK7-zo7rIrzNvNQ2PNI', '2026-04-20 08:33:10.436');
INSERT INTO `usersession` (`id`, `userId`, `device`, `ipAddress`, `lastActive`, `token`, `createdAt`) VALUES
(121, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-20 08:33:34.911', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY3NDAxNCwiZXhwIjoxNzc2NzYwNDE0fQ.sfw_ThNO1-uuAHPgLRQRk4tEpLgpf88gPDe_Ut98-DU', '2026-04-20 08:33:34.911'),
(122, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 08:36:27.074', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2Njc0MTg3LCJleHAiOjE3NzY3NjA1ODd9.pZDgf9iX3qGmWmAExQs_02T2mJC1BpqOJUv_ja6KnvI', '2026-04-20 08:36:27.074'),
(123, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.10', '2026-04-20 08:40:45.136', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2Njc0NDQ1LCJleHAiOjE3NzY3NjA4NDV9.dF25fE6QCbESPVtMT19f-dwCszY82c4-__uX1fZcqkc', '2026-04-20 08:40:45.136'),
(124, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.11', '2026-04-20 09:07:27.950', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY2NzYwNDcsImV4cCI6MTc3Njc2MjQ0N30.HjiEAIwC2mk5dAdYoRV4xIOwV7UF75CFUnxivwwNhfI', '2026-04-20 09:07:27.950'),
(125, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.5', '2026-04-20 09:09:14.164', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2Njc2MTU0LCJleHAiOjE3NzY3NjI1NTR9.Cc-Ho8J4WE9OsXZ0c8zfUBB-PSyM2k0xCjnbSUEMXug', '2026-04-20 09:09:14.164'),
(126, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.13', '2026-04-20 09:22:40.701', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2Njc2OTYwLCJleHAiOjE3NzY3NjMzNjB9.vm0CM1ErTHAUYH52-6SrpHIE5TEzN6G6UxasglxRVRo', '2026-04-20 09:22:40.701'),
(127, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.4', '2026-04-20 09:23:01.564', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY2NzY5ODEsImV4cCI6MTc3Njc2MzM4MX0.IkT7nakvL-w_wPkjHCx3hvAd7IF2CvvzYX0Stcmlucg', '2026-04-20 09:23:01.564'),
(128, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.6', '2026-04-20 09:36:28.905', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY2Nzc3ODgsImV4cCI6MTc3Njc2NDE4OH0.eOs_L_ut-ieQ1DNYpwklSMXpBS_EDwUBUVPGlyNYC7U', '2026-04-20 09:36:28.905'),
(129, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.9', '2026-04-20 10:31:07.122', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY2ODEwNjcsImV4cCI6MTc3Njc2NzQ2N30.x_PzYwsxRAQReWQz5Lc0wx8bgeZUx21AgPo1FEkSRZw', '2026-04-20 10:31:07.122'),
(134, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.12', '2026-04-20 10:45:22.969', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY2ODE5MjIsImV4cCI6MTc3Njc2ODMyMn0.rKITmP-FlxvplPud2rCgh2NIDzOwHlPn7nKGWvx3HPs', '2026-04-20 10:45:22.969'),
(135, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 10:59:39.229', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY2ODI3NzksImV4cCI6MTc3Njc2OTE3OX0.4pTHsGDAxwhzJk9kZjU8jTN9BDIitm9nP1V61QuhU4A', '2026-04-20 10:59:39.229'),
(136, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 10:59:45.489', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY2ODI3ODUsImV4cCI6MTc3Njc2OTE4NX0.Swq3wNfiTANbmfcAfKyjPaZyGZ_4HTMD5y7iztypMTA', '2026-04-20 10:59:45.489'),
(137, 3, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.5', '2026-04-20 11:10:24.332', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY2ODM0MjQsImV4cCI6MTc3Njc2OTgyNH0.LTBx0tAJzqqzOkaqOJH2mlmZ2OE9LxD7C3I0gZ20If0', '2026-04-20 11:10:24.332'),
(138, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.4', '2026-04-20 12:02:28.468', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2Njg2NTQ4LCJleHAiOjE3NzY3NzI5NDh9.JJR0EFN0TErpG01Vr1KTbGN5nT4P8HAJcrLPHw0s2V0', '2026-04-20 12:02:28.468'),
(139, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.8', '2026-04-20 12:03:18.368', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2Njg2NTk4LCJleHAiOjE3NzY3NzI5OTh9.N-ofNP8HNTM4p7IXynZgrOcYmiasYtOZTcsDYaHb_Us', '2026-04-20 12:03:18.368'),
(140, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.5', '2026-04-20 12:03:38.304', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2Njg2NjE4LCJleHAiOjE3NzY3NzMwMTh9.knJUax4UQrvIYLA6nXXJ0PsxAcy_gJsfESFO2TvWktI', '2026-04-20 12:03:38.304'),
(141, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.10', '2026-04-20 12:07:51.706', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY4Njg3MSwiZXhwIjoxNzc2NzczMjcxfQ.bghjN6IynTB25qCiQBcFbjOvqKGrot_pFYc22EPwJYM', '2026-04-20 12:07:51.706'),
(142, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-20 12:10:56.815', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY4NzA1NiwiZXhwIjoxNzc2NzczNDU2fQ.8mQT4lfRY_8gU_o57ZkTv_U1N1oCZxPwx16qEENeUdg', '2026-04-20 12:10:56.815'),
(143, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::1', '2026-04-20 12:14:49.709', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY4NzI4OSwiZXhwIjoxNzc2NzczNjg5fQ.HCOM1ewkpWPzL8qqm5_fYKdVdLx9qcCOqaQHhb8DmrM', '2026-04-20 12:14:49.709'),
(144, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.4', '2026-04-20 12:21:22.575', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjY4NzY4MiwiZXhwIjoxNzc2Nzc0MDgyfQ.OGHTkB7LiazKLqeKDx17eRrL5fL-5vE0GOo6Km0bKSQ', '2026-04-20 12:21:22.575'),
(145, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.9', '2026-04-20 12:23:14.260', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2Njg3Nzk0LCJleHAiOjE3NzY3NzQxOTR9.DgKfPmhYawdlywPRgcCDbZx18kGiylsZ_sPb4Gby4V0', '2026-04-20 12:23:14.260'),
(146, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '::ffff:100.64.0.7', '2026-04-20 16:15:29.167', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY3MDE3MjksImV4cCI6MTc3Njc4ODEyOX0.1kqa_l5qL5qK8K4XR4JHCf4xm_UaKoMjzPohds_eh8o', '2026-04-20 16:15:29.167'),
(147, 29, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '::ffff:100.64.0.7', '2026-04-20 16:34:25.145', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjksImVtYWlsIjoibWFuZ2xlc2luZ2hAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwic29jaWV0eUlkIjoxMCwiaWF0IjoxNzc2NzAyODY1LCJleHAiOjE3NzY3ODkyNjV9.ql_4hK16nFmIzb8bRNu0s7yj6X07x3NVMMdHp57bMCI', '2026-04-20 16:34:25.145'),
(148, 29, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.4', '2026-04-20 16:51:46.599', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjksImVtYWlsIjoibWFuZ2xlc2luZ2hAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwic29jaWV0eUlkIjoxMCwiaWF0IjoxNzc2NzAzOTA2LCJleHAiOjE3NzY3OTAzMDZ9.raf8USIwIMWL3-4Br0dISt1ZSOAoiCxOIY-P35pHvmo', '2026-04-20 16:51:46.599'),
(149, 19, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.12', '2026-04-20 16:59:29.628', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksImVtYWlsIjoiQTEwMUdBTkVTSEFDSFNAR01BSUwuQ09NIiwicm9sZSI6IlJFU0lERU5UIiwic29jaWV0eUlkIjozLCJpYXQiOjE3NzY3MDQzNjksImV4cCI6MTc3Njc5MDc2OX0.psup4B-PbOYtz7Gu3wctkCFtHLQoEUTXzlR1EjseCJw', '2026-04-20 16:59:29.628'),
(150, 29, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.3', '2026-04-20 17:03:19.063', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjksImVtYWlsIjoibWFuZ2xlc2luZ2hAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwic29jaWV0eUlkIjoxMCwiaWF0IjoxNzc2NzA0NTk5LCJleHAiOjE3NzY3OTA5OTl9.5KsKvCLrFOSPkTkdjMffV_mvUQdrcFfSVhexj2kXHP4', '2026-04-20 17:03:19.063'),
(151, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.4', '2026-04-20 17:08:20.724', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY3MDQ5MDAsImV4cCI6MTc3Njc5MTMwMH0.4psLbWG0dA5lLEozAcIiMDtaTYZUI3QrNVmzQr2ix1E', '2026-04-20 17:08:20.724'),
(152, 30, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.6', '2026-04-20 17:09:01.772', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsImVtYWlsIjoiQTEwMVBhcmFkaXNlQGdtYWlsLmNvbSIsInJvbGUiOiJSRVNJREVOVCIsInNvY2lldHlJZCI6MTAsImlhdCI6MTc3NjcwNDk0MSwiZXhwIjoxNzc2NzkxMzQxfQ.QgBK12IcLf39Ew9_dbuLLqomuEI9uvhMH05W6qa3nNA', '2026-04-20 17:09:01.772'),
(153, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.7', '2026-04-20 17:51:09.923', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY3MDc0NjksImV4cCI6MTc3Njc5Mzg2OX0.psOPzFTRcEvAcEpaTEn0VlOvu7B9uWDfwd30syx0gj4', '2026-04-20 17:51:09.923'),
(154, 29, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.2', '2026-04-20 17:52:20.377', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjksImVtYWlsIjoibWFuZ2xlc2luZ2hAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwic29jaWV0eUlkIjoxMCwiaWF0IjoxNzc2NzA3NTQwLCJleHAiOjE3NzY3OTM5NDB9._Bms1F5w1afN9myQboZf4UAzalj21QwHkwLRNPEMa7I', '2026-04-20 17:52:20.377'),
(155, 33, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.5', '2026-04-20 18:07:47.741', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzMsImVtYWlsIjoiSU5URVJORVRXQUxBQEdNQUlMLkNPTSIsInJvbGUiOiJWRU5ET1IiLCJzb2NpZXR5SWQiOm51bGwsImlhdCI6MTc3NjcwODQ2NywiZXhwIjoxNzc2Nzk0ODY3fQ.1ryJqUcdBNN5oNKPegv9gNBrpP0uFC9KZNuNlXQJ3Mo', '2026-04-20 18:07:47.741'),
(156, 16, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.4', '2026-04-20 18:13:04.943', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsImVtYWlsIjoicGVzdHdhbGFAZ21haWwuY29tIiwicm9sZSI6IlZFTkRPUiIsInNvY2lldHlJZCI6bnVsbCwiaWF0IjoxNzc2NzA4Nzg0LCJleHAiOjE3NzY3OTUxODR9.Fa5g03W1ttgFDCWf4QX1JrE0XRiFLcj6yv8DUzaQoao', '2026-04-20 18:13:04.943'),
(157, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.12', '2026-04-20 18:23:29.801', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NzA5NDA5LCJleHAiOjE3NzY3OTU4MDl9.PeCrwpK45uNNrrLrHb8asnpK-SJ_Wtj8lUXUwspWjSw', '2026-04-20 18:23:29.801'),
(158, 5, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.11', '2026-04-20 18:25:07.152', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJndWFyZEBzb2NpZXR5LmNvbSIsInJvbGUiOiJHVUFSRCIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NzA5NTA3LCJleHAiOjE3NzY3OTU5MDd9.82mlDaZ3GYHfcrzxP4UCERsPDindy0f63RrauyLnVuE', '2026-04-20 18:25:07.152'),
(159, 34, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.5', '2026-04-20 18:25:33.636', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQsImVtYWlsIjoiZ3VhcmRwYXJhZGlzZUBnbWFpbC5jb20iLCJyb2xlIjoiR1VBUkQiLCJzb2NpZXR5SWQiOjEwLCJpYXQiOjE3NzY3MDk1MzMsImV4cCI6MTc3Njc5NTkzM30.EVZofxqxUL7nPMBJ9Xqwh0T-0g3p94AAfGQqMANAfuA', '2026-04-20 18:25:33.636'),
(160, 35, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', '::ffff:100.64.0.7', '2026-04-20 18:31:00.806', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoicmFkaGVAZ21haWwuY29tIiwicm9sZSI6IklORElWSURVQUwiLCJzb2NpZXR5SWQiOm51bGwsImlhdCI6MTc3NjcwOTg2MCwiZXhwIjoxNzc2Nzk2MjYwfQ.R-HBApaffbMcjSmzj6hvBH-ouSP49Uo4avlTy-1x7ro', '2026-04-20 18:31:00.806'),
(161, 30, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.7', '2026-04-20 20:18:11.382', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsImVtYWlsIjoiQTEwMVBhcmFkaXNlQGdtYWlsLmNvbSIsInJvbGUiOiJSRVNJREVOVCIsInNvY2lldHlJZCI6MTAsImlhdCI6MTc3NjcxNjI5MSwiZXhwIjoxNzc2ODAyNjkxfQ.ZrcjKN8DpNjPTcX45kjUfS3UvVvUdmdoVupMffVH_6o', '2026-04-20 20:18:11.382'),
(162, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.7', '2026-04-21 11:26:17.510', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2NzcwNzc3LCJleHAiOjE3NzY4NTcxNzd9.419iNG4OXmANLMkl2VgRycHzW_drHrjOe46xwoj7Ws8', '2026-04-21 11:26:17.510'),
(163, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-22 06:39:04.090', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY4Mzk5NDQsImV4cCI6MTc3NjkyNjM0NH0.wDN143x7LCbadk8b9-H-97b-MqQGqreIiLquElqb46c', '2026-04-22 06:39:04.090'),
(164, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.2', '2026-04-22 06:39:50.989', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3NjgzOTk5MCwiZXhwIjoxNzc2OTI2MzkwfQ.19eQyDUlx77brHApuJ13LX1Bf3ivliy9t_kBV2rFH8U', '2026-04-22 06:39:50.989'),
(165, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.10', '2026-04-22 06:40:48.362', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY4NDAwNDgsImV4cCI6MTc3NjkyNjQ0OH0.I2Ce-wCu21NBk-DFs7-w6U2XPo8dkFv2HMUKrGcaP_c', '2026-04-22 06:40:48.362'),
(166, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.6', '2026-04-22 06:41:28.431', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3Njg0MDA4OCwiZXhwIjoxNzc2OTI2NDg4fQ.fxsFYViSK6BlsaprI1x2ETOTWwr0_5ku3Ei9Jem7gsI', '2026-04-22 06:41:28.431'),
(167, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.9', '2026-04-22 06:42:09.852', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY4NDAxMjksImV4cCI6MTc3NjkyNjUyOX0.hw9mzC0rNqX-7rdALZ0MDVKZQpFyx4v2C7ZvH41iimk', '2026-04-22 06:42:09.852'),
(168, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.6', '2026-04-22 06:42:37.902', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY4NDAxNTcsImV4cCI6MTc3NjkyNjU1N30.YlrhlRXGxw5Oz50OQZsxezksprvR7OaKxVTfYw4XydQ', '2026-04-22 06:42:37.902'),
(169, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.5', '2026-04-22 06:43:22.655', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY4NDAyMDIsImV4cCI6MTc3NjkyNjYwMn0.mOrQwtKK-T9Hx9UFQuVOORhWlzEsiwgxCs7OHsQpjTw', '2026-04-22 06:43:22.655'),
(170, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.10', '2026-04-22 06:43:41.126', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY4NDAyMjEsImV4cCI6MTc3NjkyNjYyMX0.TD6kgdWS2rzmLrac4kXUwyqs-rAwIWoQQma2A9k4JAo', '2026-04-22 06:43:41.126'),
(171, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.11', '2026-04-22 06:44:28.227', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3Njg0MDI2OCwiZXhwIjoxNzc2OTI2NjY4fQ.j6v_E7DM1C_pkL1sHkuv3oiAZUY3vFWJLw_gb4x8t9s', '2026-04-22 06:44:28.227'),
(172, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.11', '2026-04-22 06:44:54.544', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2ODQwMjk0LCJleHAiOjE3NzY5MjY2OTR9.-5N-Qb5--xYRqT0scAjxqL01918uMj0TUKTRRkEwTiQ', '2026-04-22 06:44:54.544'),
(173, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.4', '2026-04-22 06:45:10.963', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY4NDAzMTAsImV4cCI6MTc3NjkyNjcxMH0.5XcTcE5yN-4jxxOiGffrSA1WWzRjpGar7sBJk8Cc__s', '2026-04-22 06:45:10.963'),
(174, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.13', '2026-04-22 06:45:53.376', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY4NDAzNTMsImV4cCI6MTc3NjkyNjc1M30.FXFr9EpY14rOLMYyR57NzGRJ_YD478v77UFi7xjCre0', '2026-04-22 06:45:53.376'),
(175, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.5', '2026-04-22 06:46:03.042', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY4NDAzNjMsImV4cCI6MTc3NjkyNjc2M30.-XL7CT-_jKITn-TwHFXIq9hm3bvxIJ0gbLoPuKOrTb4', '2026-04-22 06:46:03.042'),
(176, 36, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.6', '2026-04-22 06:47:51.295', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoianVAZ21haWwuY29tIiwicm9sZSI6IlZFTkRPUiIsInNvY2lldHlJZCI6bnVsbCwiaWF0IjoxNzc2ODQwNDcxLCJleHAiOjE3NzY5MjY4NzF9.ZG7E2Dw9JVW7ZU3y35m125HyfUmo8-AtQJG-7U9r-wc', '2026-04-22 06:47:51.295'),
(177, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-22 06:48:38.967', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3Njg0MDUxOCwiZXhwIjoxNzc2OTI2OTE4fQ.yXTy9qKU1nB3U93PaBfgCcaO6lJ8CWLpqxepTFg9lyc', '2026-04-22 06:48:38.967'),
(178, 36, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.11', '2026-04-22 06:49:05.009', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoianVAZ21haWwuY29tIiwicm9sZSI6IlZFTkRPUiIsInNvY2lldHlJZCI6bnVsbCwiaWF0IjoxNzc2ODQwNTQ1LCJleHAiOjE3NzY5MjY5NDV9.7TUSJnR8FyT3lMGmnWxLx9Cog_OlII2TOoztsyVU0bg', '2026-04-22 06:49:05.009'),
(179, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.9', '2026-04-22 06:49:42.538', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3Njg0MDU4MiwiZXhwIjoxNzc2OTI2OTgyfQ.3l8eMxMcQCrUPWDlSRp2oM3BaBD82aQP3pMVGcoxv80', '2026-04-22 06:49:42.538'),
(180, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.6', '2026-04-22 06:49:59.134', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY4NDA1OTksImV4cCI6MTc3NjkyNjk5OX0.NXw7EZLM8G_qxZinZ6V7lq2xbB4uEq2Qm7_7zDAyCmI', '2026-04-22 06:49:59.134'),
(181, 3, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.10', '2026-04-22 06:51:23.132', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY4NDA2ODMsImV4cCI6MTc3NjkyNzA4M30.WuAQFF1or3Cy3383sEq62OuKR6kvOqfrRuO7hInWf9c', '2026-04-22 06:51:23.132'),
(182, 36, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.5', '2026-04-22 06:55:53.473', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoianVAZ21haWwuY29tIiwicm9sZSI6IlZFTkRPUiIsInNvY2lldHlJZCI6bnVsbCwiaWF0IjoxNzc2ODQwOTUzLCJleHAiOjE3NzY5MjczNTN9.XyQblCK5rwl-ETpzftyIOTw9hWDrpCJv2esrujMGa2s', '2026-04-22 06:55:53.473'),
(183, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.5', '2026-04-22 06:57:27.916', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY4NDEwNDcsImV4cCI6MTc3NjkyNzQ0N30.XXIFvZNjDiWuv2OSyC3XTExyXSVvlDD3QgnODBfRrxo', '2026-04-22 06:57:27.916'),
(184, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.7', '2026-04-22 06:57:59.005', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY4NDEwNzksImV4cCI6MTc3NjkyNzQ3OX0.27tVLuOnE4hLUTb8Fn4DB2NRmGX4v4eAPSMq8J1CC3Q', '2026-04-22 06:57:59.005'),
(185, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.12', '2026-04-22 08:53:42.661', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY4NDgwMjIsImV4cCI6MTc3NjkzNDQyMn0.Ltrq07dBCohlktgGdCDmwkqxk5-2FsDluO4TnaPUUzU', '2026-04-22 08:53:42.661'),
(186, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-22 09:08:10.629', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY4NDg4OTAsImV4cCI6MTc3NjkzNTI5MH0.uzWPxCZZbbDcaxlEx6TG_9K5I0K1q--0FqbC60nHnKs', '2026-04-22 09:08:10.629'),
(187, 36, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-22 09:08:40.013', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoianVAZ21haWwuY29tIiwicm9sZSI6IlZFTkRPUiIsInNvY2lldHlJZCI6bnVsbCwiaWF0IjoxNzc2ODQ4OTIwLCJleHAiOjE3NzY5MzUzMjB9.J1iaLg5L67Vehf_tCQlHEv1CWptLxjEvXxXSIliD3ys', '2026-04-22 09:08:40.013'),
(188, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.3', '2026-04-22 09:09:03.082', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY4NDg5NDMsImV4cCI6MTc3NjkzNTM0M30.sU0pKi91LaQazt5DOlzXuQ0tm4f02bt-s3XPm_kTW94', '2026-04-22 09:09:03.082'),
(189, 36, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.8', '2026-04-22 09:09:42.405', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoianVAZ21haWwuY29tIiwicm9sZSI6IlZFTkRPUiIsInNvY2lldHlJZCI6bnVsbCwiaWF0IjoxNzc2ODQ4OTgyLCJleHAiOjE3NzY5MzUzODJ9.iNEwQYlI4V_WKE6UnDZHl_750L2RcoyHl-RP-QRvzrQ', '2026-04-22 09:09:42.405'),
(190, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.13', '2026-04-23 13:05:21.945', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY5NDk1MjEsImV4cCI6MTc3NzAzNTkyMX0.7xF_DF8iSlujv9JbNAtlfJnEx-UqIqY8OdcgQGKbmlM', '2026-04-23 13:05:21.945'),
(191, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.8', '2026-04-23 13:05:37.125', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2OTQ5NTM3LCJleHAiOjE3NzcwMzU5Mzd9.zOGLoDmTG2wBMM9N6EX9PT6H9mqcpFF1uwLI5uPhYz8', '2026-04-23 13:05:37.125'),
(192, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.4', '2026-04-23 13:05:50.477', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzY5NDk1NTAsImV4cCI6MTc3NzAzNTk1MH0.xqYO6lq_9SfCaCZzn3ZUAxSwT6mPZt7v1KJSU0IUJtY', '2026-04-23 13:05:50.477'),
(193, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.4', '2026-04-23 13:07:48.355', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3Njk0OTY2OCwiZXhwIjoxNzc3MDM2MDY4fQ.4xUYYS3M8gqFhY2vfgEqifhXL1eeIzvn4wggdYuna8k', '2026-04-23 13:07:48.355'),
(194, 7, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.4', '2026-04-23 13:08:13.899', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJpbmRpdmlkdWFsQGV4YW1wbGUuY29tIiwicm9sZSI6IklORElWSURVQUwiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3Njk0OTY5MywiZXhwIjoxNzc3MDM2MDkzfQ.tI9ohoCNtEhFpmaqMpof7Xw9DHQprhgQSrEoXaPmpwI', '2026-04-23 13:08:13.899'),
(195, 6, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.6', '2026-04-23 13:11:54.064', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ0ZXN0NEBnbWFpbC5jb20iLCJyb2xlIjoiVkVORE9SIiwic29jaWV0eUlkIjoxLCJpYXQiOjE3NzY5NDk5MTQsImV4cCI6MTc3NzAzNjMxNH0.XsIsvc0q-8eziPiDD2YjNOxzEsRjLjHe0wEr4K7XDP8', '2026-04-23 13:11:54.064'),
(196, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.4', '2026-04-23 13:12:02.425', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc2OTQ5OTIyLCJleHAiOjE3NzcwMzYzMjJ9.1IX9v4qR7UA5ggtdfxJ3RryA8x_9JRaL5a49MuSWdq8', '2026-04-23 13:12:02.425'),
(197, 4, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.6', '2026-04-23 13:13:15.288', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3Njk0OTk5NSwiZXhwIjoxNzc3MDM2Mzk1fQ.ISTQguznPEd9Z_5PCaIpSeoRf7b1yq0c7wf_3EXgk24', '2026-04-23 13:13:15.288'),
(198, 3, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36', '::ffff:100.64.0.20', '2026-05-04 15:14:39.498', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3Nzc5MDc2NzksImV4cCI6MTc3Nzk5NDA3OX0.4Fit2I7-lKA2rmYKTdPk49vBQHlU1T-BVpZ_h4dzlFs', '2026-05-04 15:14:39.498'),
(199, 3, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.2', '2026-05-06 09:09:29.853', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzgwNTg1NjksImV4cCI6MTc3ODE0NDk2OX0.bg4jQ1NNEMeT7HvmvUBY6J2aUr2gLyO-shX49UP7NIw', '2026-05-06 09:09:29.853'),
(200, 1, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.2', '2026-05-06 09:11:25.884', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc4MDU4Njg1LCJleHAiOjE3NzgxNDUwODV9.9Epj_8yANkyAvDpLr9OSF5V1O-KXQQsS_6KPCVIizw4', '2026-05-06 09:11:25.884'),
(201, 3, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.10', '2026-05-07 05:06:47.797', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQHNvY2lldHkuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic29jaWV0eUlkIjpudWxsLCJpYXQiOjE3NzgxMzA0MDcsImV4cCI6MTc3ODIxNjgwN30.seGJ-SgYxS-xcv1UU-lVqtzTfd6bks-jhL-JpjUkwjY', '2026-05-07 05:06:47.797'),
(202, 1, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.10', '2026-05-07 05:09:34.741', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzb2NpZXR5LmNvbSIsInJvbGUiOiJBRE1JTiIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzc4MTMwNTc0LCJleHAiOjE3NzgyMTY5NzR9.l2DXq0g9BAtP8jj87gX1AOGq12M4-7imkT3A5Gkxk7k', '2026-05-07 05:09:34.741'),
(203, 4, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '::ffff:100.64.0.10', '2026-05-07 05:12:20.866', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZXNpZGVudDFAc29jaWV0eS5jb20iLCJyb2xlIjoiUkVTSURFTlQiLCJzb2NpZXR5SWQiOjEsImlhdCI6MTc3ODEzMDc0MCwiZXhwIjoxNzc4MjE3MTQwfQ.qqqV0SZepJBuvdOivavLp8eyGqK9xjXk2pTQPC71HNU', '2026-05-07 05:12:20.866');

-- --------------------------------------------------------

--
-- Table structure for table `vendor`
--

CREATE TABLE `vendor` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serviceType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contactPerson` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gst` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pan` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contractStart` datetime(3) DEFAULT NULL,
  `contractEnd` datetime(3) DEFAULT NULL,
  `contractValue` double DEFAULT NULL,
  `paymentTerms` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ACTIVE','SUSPENDED','PENDING') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `rating` double NOT NULL DEFAULT '0',
  `totalJobs` int NOT NULL DEFAULT '0',
  `completedJobs` int NOT NULL DEFAULT '0',
  `societyId` int DEFAULT NULL,
  `servicePincodes` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vendor`
--

INSERT INTO `vendor` (`id`, `name`, `company`, `serviceType`, `contactPerson`, `contact`, `email`, `address`, `gst`, `pan`, `contractStart`, `contractEnd`, `contractValue`, `paymentTerms`, `status`, `rating`, `totalJobs`, `completedJobs`, `societyId`, `servicePincodes`, `createdAt`) VALUES
(1, 'test', NULL, 'plumber', NULL, '5454343423234', 'test@gmail.com', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'ACTIVE', 0, 0, 0, NULL, '1100011', '2026-04-18 07:19:40.515'),
(2, 'pestwala ', NULL, 'other', NULL, '9222226345', 'pestwala@gmail.com', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'ACTIVE', 0, 0, 0, NULL, '400605', '2026-04-18 11:18:50.546'),
(3, 'pestwala02', NULL, 'other', NULL, '8519090890', 'pestwala02@gmail.com', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'ACTIVE', 0, 0, 0, NULL, '400602', '2026-04-18 11:19:35.461'),
(4, 'cleaning solution', NULL, 'cleaner', NULL, '9876543210', 'cleaning@gmail.com', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'ACTIVE', 0, 0, 0, NULL, '400605, 400602', '2026-04-18 11:20:40.776'),
(5, 'PESTWALA GANESHA ', 'PESTWALA GANESHACHS', 'Pest Control', 'PRAMOD PUJARI', '9220002333', 'PESTWALAGANESHACHS@GMAIL.COM', 'THANE', '27ASQPP4759D2Z6', 'ASQPP4759D', NULL, NULL, 0, '', 'ACTIVE', 0, 0, 0, 3, '400615', '2026-04-18 13:01:49.196'),
(6, 'Internet Wala', NULL, 'other', NULL, '9220002333', 'INTERNETWALA@GMAIL.COM', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'ACTIVE', 0, 0, 0, NULL, '400615, 400080', '2026-04-20 18:03:46.807'),
(7, 'ju', NULL, 'cleaner', NULL, '09876543211', 'ju@gmail.com', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'ACTIVE', 0, 0, 0, NULL, '111222', '2026-04-22 06:47:19.292');

-- --------------------------------------------------------

--
-- Table structure for table `vendorinvoice`
--

CREATE TABLE `vendorinvoice` (
  `id` int NOT NULL,
  `invoiceNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vendorId` int NOT NULL,
  `societyId` int NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `gstAmount` double NOT NULL DEFAULT '0',
  `totalAmount` double NOT NULL,
  `invoiceDate` datetime(3) NOT NULL,
  `dueDate` datetime(3) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `paymentDate` datetime(3) DEFAULT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transactionRef` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankAccountId` int DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vendorinvoice`
--

INSERT INTO `vendorinvoice` (`id`, `invoiceNumber`, `vendorId`, `societyId`, `description`, `category`, `amount`, `gstAmount`, `totalAmount`, `invoiceDate`, `dueDate`, `status`, `paymentDate`, `paymentMethod`, `transactionRef`, `bankAccountId`, `remarks`, `createdAt`, `updatedAt`) VALUES
(1, 'INV-3-020724', 3, 3, 'Service Payout for Inquiry #3 (Ganesha CHS)', 'SERVICE_PAYOUT', 180, 0, 180, '2026-04-20 18:17:00.725', '2026-04-20 18:17:00.725', 'PAID', '2026-04-20 18:17:00.725', 'PLATFORM_TRANSFER', NULL, NULL, 'Auto-generated from Vendor Payout #1', '2026-04-20 18:17:00.726', '2026-04-20 18:17:00.726'),
(2, 'INV-2-067407', 2, 10, 'Service Payout for Inquiry #10 (Paradise CHS)', 'SERVICE_PAYOUT', 1500, 0, 1500, '2026-04-20 18:17:47.407', '2026-04-20 18:17:47.407', 'PAID', '2026-04-20 18:17:47.407', 'PLATFORM_TRANSFER', NULL, NULL, 'Auto-generated from Vendor Payout #3', '2026-04-20 18:17:47.408', '2026-04-20 18:17:47.408');

-- --------------------------------------------------------

--
-- Table structure for table `vendorpayout`
--

CREATE TABLE `vendorpayout` (
  `id` int NOT NULL,
  `vendorId` int NOT NULL,
  `vendorName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `societyId` int DEFAULT NULL,
  `societyName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dealValue` double NOT NULL,
  `commissionPercent` double NOT NULL,
  `payableAmount` double NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vendorpayout`
--

INSERT INTO `vendorpayout` (`id`, `vendorId`, `vendorName`, `societyId`, `societyName`, `dealValue`, `commissionPercent`, `payableAmount`, `status`, `remarks`, `date`, `createdAt`, `updatedAt`) VALUES
(1, 3, 'pestwala02', 3, 'Ganesha CHS', 200, 10, 180, 'PAID', 'Auto-generated for Service ID #3: service (Commission Based)', '2026-04-20 18:17:00.626', '2026-04-18 12:41:55.292', '2026-04-20 18:17:00.627'),
(2, 2, 'pestwala ', 10, 'Paradise CHS', 500, 40, 300, 'PENDING', 'Auto-generated for Service ID #9: Pest Services  (Agreed Quote)', '2026-04-20 18:13:40.303', '2026-04-20 18:13:40.304', '2026-04-20 18:13:40.304'),
(3, 2, 'pestwala ', 10, 'Paradise CHS', 2000, 25, 1500, 'PAID', 'Auto-generated for Service ID #10: Pest Services  (Agreed Quote)', '2026-04-20 18:17:47.347', '2026-04-20 18:16:12.585', '2026-04-20 18:17:47.348'),
(4, 2, 'pestwala ', 3, 'Ganesha CHS', 2000, 10, 1500, 'PENDING', 'PAYMENT WILL CLEAR ONCE SERVICES WILL BE DONE ', '2026-04-20 00:00:00.000', '2026-04-20 18:20:13.868', '2026-04-20 18:20:13.868'),
(5, 2, 'pestwala ', NULL, 'Individual/Direct', 200, 0, 500, 'PENDING', 'Auto-generated for Service ID #11: Cleaning Services  (Agreed Quote)', '2026-04-20 18:33:23.155', '2026-04-20 18:33:23.156', '2026-04-20 18:33:23.156'),
(6, 7, 'ju', 1, 'Trinity CHS', 500, 10, 450, 'PENDING', 'Auto-generated for Service ID #12: Cleaning Services  (Commission Based)', '2026-04-22 06:48:19.034', '2026-04-22 06:48:19.035', '2026-04-22 06:48:19.035'),
(7, 7, 'ju', 1, 'Trinity CHS', 500, 76, 120, 'PENDING', 'Auto-generated for Service ID #12: Cleaning Services  (Agreed Quote)', '2026-04-22 06:56:03.261', '2026-04-22 06:56:03.262', '2026-04-22 06:56:03.262');

-- --------------------------------------------------------

--
-- Table structure for table `visitor`
--

CREATE TABLE `visitor` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vehicleNo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purpose` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whomToMeet` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fromLocation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `entryTime` datetime(3) DEFAULT NULL,
  `exitTime` datetime(3) DEFAULT NULL,
  `societyId` int NOT NULL,
  `visitingUnitId` int NOT NULL,
  `residentId` int DEFAULT NULL,
  `checkedInById` int DEFAULT NULL,
  `idType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gateId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `visitor`
--

INSERT INTO `visitor` (`id`, `name`, `phone`, `vehicleNo`, `purpose`, `photo`, `whomToMeet`, `fromLocation`, `status`, `entryTime`, `exitTime`, `societyId`, `visitingUnitId`, `residentId`, `checkedInById`, `idType`, `idNumber`, `gateId`, `createdAt`, `updatedAt`) VALUES
(1, 'Zomato Delivery', '9876543210', NULL, 'Delivery', NULL, NULL, NULL, 'CHECKED_OUT', '2026-04-18 07:44:30.872', '2026-04-18 08:44:30.872', 2, 2, 11, 13, NULL, NULL, NULL, '2026-04-18 08:44:30.875', '2026-04-18 08:44:30.875'),
(2, 'Prem chopda visitor', '9220002333', 'Mh04lm3921', 'Maintenance', NULL, NULL, NULL, 'EXITED', '2026-04-20 18:27:21.406', '2026-04-20 18:27:25.984', 10, 16, NULL, 34, NULL, NULL, NULL, '2026-04-20 16:55:52.693', '2026-04-20 18:27:25.985');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `advertisement`
--
ALTER TABLE `advertisement`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `amenity`
--
ALTER TABLE `amenity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `amenity_societyId_fkey` (`societyId`);

--
-- Indexes for table `amenitybooking`
--
ALTER TABLE `amenitybooking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `amenitybooking_amenityId_fkey` (`amenityId`),
  ADD KEY `amenitybooking_userId_fkey` (`userId`);

--
-- Indexes for table `asset`
--
ALTER TABLE `asset`
  ADD PRIMARY KEY (`id`),
  ADD KEY `asset_societyId_fkey` (`societyId`);

--
-- Indexes for table `billingplan`
--
ALTER TABLE `billingplan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buzzlike`
--
ALTER TABLE `buzzlike`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `buzzlike_buzzId_userId_key` (`buzzId`,`userId`),
  ADD KEY `buzzlike_userId_fkey` (`userId`);

--
-- Indexes for table `chargemaster`
--
ALTER TABLE `chargemaster`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chargemaster_societyId_fkey` (`societyId`);

--
-- Indexes for table `chatgroup`
--
ALTER TABLE `chatgroup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chatgroup_societyId_idx` (`societyId`),
  ADD KEY `chatgroup_createdById_fkey` (`createdById`);

--
-- Indexes for table `chatmessage`
--
ALTER TABLE `chatmessage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chatmessage_conversationId_fkey` (`conversationId`),
  ADD KEY `chatmessage_senderId_fkey` (`senderId`);

--
-- Indexes for table `communitybuzz`
--
ALTER TABLE `communitybuzz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `communitybuzz_authorId_fkey` (`authorId`),
  ADD KEY `communitybuzz_societyId_fkey` (`societyId`);

--
-- Indexes for table `communitychat`
--
ALTER TABLE `communitychat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `communitychat_societyId_createdAt_idx` (`societyId`,`createdAt`),
  ADD KEY `communitychat_userId_fkey` (`userId`);

--
-- Indexes for table `communitycomment`
--
ALTER TABLE `communitycomment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `communitycomment_buzzId_fkey` (`buzzId`),
  ADD KEY `communitycomment_authorId_fkey` (`authorId`);

--
-- Indexes for table `communityguideline`
--
ALTER TABLE `communityguideline`
  ADD PRIMARY KEY (`id`),
  ADD KEY `communityguideline_societyId_fkey` (`societyId`);

--
-- Indexes for table `complaint`
--
ALTER TABLE `complaint`
  ADD PRIMARY KEY (`id`),
  ADD KEY `complaint_societyId_fkey` (`societyId`),
  ADD KEY `complaint_reportedById_fkey` (`reportedById`),
  ADD KEY `complaint_assignedToId_fkey` (`assignedToId`),
  ADD KEY `complaint_vendorId_fkey` (`vendorId`);

--
-- Indexes for table `complaintcomment`
--
ALTER TABLE `complaintcomment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `complaintcomment_complaintId_fkey` (`complaintId`),
  ADD KEY `complaintcomment_userId_fkey` (`userId`);

--
-- Indexes for table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conversation_societyId_type_participantId_directParticipantI_key` (`societyId`,`type`,`participantId`,`directParticipantId`),
  ADD KEY `conversation_participantId_fkey` (`participantId`),
  ADD KEY `conversation_directParticipantId_fkey` (`directParticipantId`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id`),
  ADD KEY `document_societyId_fkey` (`societyId`);

--
-- Indexes for table `emergencyalert`
--
ALTER TABLE `emergencyalert`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emergencyalert_societyId_fkey` (`societyId`),
  ADD KEY `emergencyalert_userId_fkey` (`userId`);

--
-- Indexes for table `emergencybarcode`
--
ALTER TABLE `emergencybarcode`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emergencycontact_societyId_fkey` (`societyId`),
  ADD KEY `emergencycontact_residentId_fkey` (`residentId`);

--
-- Indexes for table `emergencylog`
--
ALTER TABLE `emergencylog`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_societyId_fkey` (`societyId`);

--
-- Indexes for table `eventrsvp`
--
ALTER TABLE `eventrsvp`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `eventrsvp_eventId_userId_key` (`eventId`,`userId`),
  ADD KEY `eventrsvp_userId_fkey` (`userId`);

--
-- Indexes for table `facilityrequest`
--
ALTER TABLE `facilityrequest`
  ADD PRIMARY KEY (`id`),
  ADD KEY `facilityrequest_societyId_fkey` (`societyId`),
  ADD KEY `facilityrequest_userId_fkey` (`userId`);

--
-- Indexes for table `gate`
--
ALTER TABLE `gate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gate_societyId_fkey` (`societyId`);

--
-- Indexes for table `goodsreceipt`
--
ALTER TABLE `goodsreceipt`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `goodsreceipt_societyId_grNumber_key` (`societyId`,`grNumber`),
  ADD KEY `goodsreceipt_vendorId_fkey` (`vendorId`),
  ADD KEY `goodsreceipt_poId_fkey` (`poId`);

--
-- Indexes for table `groupmember`
--
ALTER TABLE `groupmember`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `groupmember_groupId_userId_key` (`groupId`,`userId`),
  ADD KEY `groupmember_userId_idx` (`userId`);

--
-- Indexes for table `groupmessage`
--
ALTER TABLE `groupmessage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `groupmessage_groupId_createdAt_idx` (`groupId`,`createdAt`),
  ADD KEY `groupmessage_userId_fkey` (`userId`);

--
-- Indexes for table `incident`
--
ALTER TABLE `incident`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incident_societyId_fkey` (`societyId`),
  ADD KEY `incident_reportedById_fkey` (`reportedById`),
  ADD KEY `incident_assignedToId_fkey` (`assignedToId`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_invoiceNo_key` (`invoiceNo`),
  ADD KEY `invoice_societyId_fkey` (`societyId`),
  ADD KEY `invoice_unitId_fkey` (`unitId`),
  ADD KEY `invoice_residentId_fkey` (`residentId`);

--
-- Indexes for table `invoiceitem`
--
ALTER TABLE `invoiceitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoiceitem_invoiceId_fkey` (`invoiceId`);

--
-- Indexes for table `journalentry`
--
ALTER TABLE `journalentry`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `journalentry_societyId_voucherNo_key` (`societyId`,`voucherNo`);

--
-- Indexes for table `journalline`
--
ALTER TABLE `journalline`
  ADD PRIMARY KEY (`id`),
  ADD KEY `journalline_journalEntryId_fkey` (`journalEntryId`),
  ADD KEY `journalline_accountId_fkey` (`accountId`);

--
-- Indexes for table `latefeeconfigmodel`
--
ALTER TABLE `latefeeconfigmodel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `latefeeconfigmodel_societyId_key` (`societyId`);

--
-- Indexes for table `ledgeraccount`
--
ALTER TABLE `ledgeraccount`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ledgeraccount_societyId_code_key` (`societyId`,`code`);

--
-- Indexes for table `maintenancerule`
--
ALTER TABLE `maintenancerule`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `maintenancerule_societyId_unitType_key` (`societyId`,`unitType`);

--
-- Indexes for table `marketplaceitem`
--
ALTER TABLE `marketplaceitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `marketplaceitem_ownerId_fkey` (`ownerId`),
  ADD KEY `marketplaceitem_societyId_fkey` (`societyId`);

--
-- Indexes for table `meeting`
--
ALTER TABLE `meeting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `meeting_societyId_fkey` (`societyId`);

--
-- Indexes for table `moverequest`
--
ALTER TABLE `moverequest`
  ADD PRIMARY KEY (`id`),
  ADD KEY `moverequest_unitId_fkey` (`unitId`),
  ADD KEY `moverequest_societyId_fkey` (`societyId`);

--
-- Indexes for table `notice`
--
ALTER TABLE `notice`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notice_societyId_fkey` (`societyId`);

--
-- Indexes for table `notice_view`
--
ALTER TABLE `notice_view`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `notice_view_noticeId_userId_key` (`noticeId`,`userId`),
  ADD KEY `notice_view_userId_fkey` (`userId`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_userId_idx` (`userId`),
  ADD KEY `notification_userId_read_idx` (`userId`,`read`);

--
-- Indexes for table `parcel`
--
ALTER TABLE `parcel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parcel_unitId_fkey` (`unitId`),
  ADD KEY `parcel_societyId_fkey` (`societyId`),
  ADD KEY `parcel_loggedByGuardId_fkey` (`loggedByGuardId`);

--
-- Indexes for table `parkingpayment`
--
ALTER TABLE `parkingpayment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `parkingpayment_paymentId_key` (`paymentId`),
  ADD UNIQUE KEY `parkingpayment_slotId_month_societyId_key` (`slotId`,`month`,`societyId`),
  ADD KEY `parkingpayment_residentId_fkey` (`residentId`),
  ADD KEY `parkingpayment_societyId_fkey` (`societyId`);

--
-- Indexes for table `parkingslot`
--
ALTER TABLE `parkingslot`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parkingslot_societyId_fkey` (`societyId`),
  ADD KEY `parkingslot_allocatedToUnitId_fkey` (`allocatedToUnitId`);

--
-- Indexes for table `patrollog`
--
ALTER TABLE `patrollog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patrollog_societyId_fkey` (`societyId`),
  ADD KEY `patrollog_guardId_fkey` (`guardId`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `platforminvoice`
--
ALTER TABLE `platforminvoice`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `platforminvoice_invoiceNo_key` (`invoiceNo`),
  ADD KEY `platforminvoice_societyId_fkey` (`societyId`);

--
-- Indexes for table `purchaseorder`
--
ALTER TABLE `purchaseorder`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchaseorder_societyId_poNumber_key` (`societyId`,`poNumber`),
  ADD UNIQUE KEY `purchaseorder_prId_key` (`prId`),
  ADD KEY `purchaseorder_vendorId_fkey` (`vendorId`);

--
-- Indexes for table `purchaserequest`
--
ALTER TABLE `purchaserequest`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchaserequest_societyId_prNumber_key` (`societyId`,`prNumber`),
  ADD KEY `purchaserequest_requestedById_fkey` (`requestedById`);

--
-- Indexes for table `rolemodel`
--
ALTER TABLE `rolemodel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rolemodel_name_key` (`name`);

--
-- Indexes for table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD PRIMARY KEY (`roleId`,`permissionId`),
  ADD KEY `rolepermission_permissionId_fkey` (`permissionId`);

--
-- Indexes for table `servicecategory`
--
ALTER TABLE `servicecategory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `serviceinquiry`
--
ALTER TABLE `serviceinquiry`
  ADD PRIMARY KEY (`id`),
  ADD KEY `serviceinquiry_residentId_fkey` (`residentId`),
  ADD KEY `serviceinquiry_societyId_fkey` (`societyId`),
  ADD KEY `serviceinquiry_serviceId_fkey` (`serviceId`),
  ADD KEY `serviceinquiry_vendorId_fkey` (`vendorId`);

--
-- Indexes for table `servicevariant`
--
ALTER TABLE `servicevariant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `servicevariant_categoryId_fkey` (`categoryId`);

--
-- Indexes for table `society`
--
ALTER TABLE `society`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `society_code_key` (`code`),
  ADD KEY `society_billingPlanId_fkey` (`billingPlanId`),
  ADD KEY `society_createdByUserId_fkey` (`createdByUserId`);

--
-- Indexes for table `sosalert`
--
ALTER TABLE `sosalert`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sosalert_residentId_fkey` (`residentId`),
  ADD KEY `sosalert_societyId_fkey` (`societyId`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_societyId_fkey` (`societyId`),
  ADD KEY `staff_createdByGuardId_fkey` (`createdByGuardId`);

--
-- Indexes for table `systemsetting`
--
ALTER TABLE `systemsetting`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `systemsetting_key_key` (`key`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_societyId_fkey` (`societyId`),
  ADD KEY `transaction_bankAccountId_fkey` (`bankAccountId`);

--
-- Indexes for table `unit`
--
ALTER TABLE `unit`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unit_societyId_block_number_key` (`societyId`,`block`,`number`),
  ADD KEY `unit_ownerId_fkey` (`ownerId`),
  ADD KEY `unit_tenantId_fkey` (`tenantId`);

--
-- Indexes for table `unitmember`
--
ALTER TABLE `unitmember`
  ADD PRIMARY KEY (`id`),
  ADD KEY `unitmember_unitId_fkey` (`unitId`);

--
-- Indexes for table `unitpet`
--
ALTER TABLE `unitpet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `unitpet_unitId_fkey` (`unitId`);

--
-- Indexes for table `unitvehicle`
--
ALTER TABLE `unitvehicle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `unitvehicle_societyId_fkey` (`societyId`),
  ADD KEY `unitvehicle_unitId_fkey` (`unitId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_email_key` (`email`),
  ADD KEY `user_roleId_fkey` (`roleId`),
  ADD KEY `user_societyId_fkey` (`societyId`),
  ADD KEY `user_assignedVendorId_fkey` (`assignedVendorId`),
  ADD KEY `user_addedByUserId_fkey` (`addedByUserId`);

--
-- Indexes for table `usersession`
--
ALTER TABLE `usersession`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usersession_token_key` (`token`),
  ADD KEY `usersession_userId_fkey` (`userId`);

--
-- Indexes for table `vendor`
--
ALTER TABLE `vendor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vendor_societyId_fkey` (`societyId`);

--
-- Indexes for table `vendorinvoice`
--
ALTER TABLE `vendorinvoice`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vendorinvoice_societyId_invoiceNumber_vendorId_key` (`societyId`,`invoiceNumber`,`vendorId`),
  ADD KEY `vendorinvoice_vendorId_fkey` (`vendorId`);

--
-- Indexes for table `vendorpayout`
--
ALTER TABLE `vendorpayout`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vendorpayout_vendorId_fkey` (`vendorId`);

--
-- Indexes for table `visitor`
--
ALTER TABLE `visitor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `visitor_societyId_fkey` (`societyId`),
  ADD KEY `visitor_visitingUnitId_fkey` (`visitingUnitId`),
  ADD KEY `visitor_residentId_fkey` (`residentId`),
  ADD KEY `visitor_checkedInById_fkey` (`checkedInById`),
  ADD KEY `visitor_gateId_fkey` (`gateId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `advertisement`
--
ALTER TABLE `advertisement`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `amenity`
--
ALTER TABLE `amenity`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `amenitybooking`
--
ALTER TABLE `amenitybooking`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `asset`
--
ALTER TABLE `asset`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `billingplan`
--
ALTER TABLE `billingplan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `buzzlike`
--
ALTER TABLE `buzzlike`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chargemaster`
--
ALTER TABLE `chargemaster`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chatgroup`
--
ALTER TABLE `chatgroup`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chatmessage`
--
ALTER TABLE `chatmessage`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `communitybuzz`
--
ALTER TABLE `communitybuzz`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `communitychat`
--
ALTER TABLE `communitychat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `communitycomment`
--
ALTER TABLE `communitycomment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `communityguideline`
--
ALTER TABLE `communityguideline`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `complaint`
--
ALTER TABLE `complaint`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `complaintcomment`
--
ALTER TABLE `complaintcomment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergencyalert`
--
ALTER TABLE `emergencyalert`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `eventrsvp`
--
ALTER TABLE `eventrsvp`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `facilityrequest`
--
ALTER TABLE `facilityrequest`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gate`
--
ALTER TABLE `gate`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `goodsreceipt`
--
ALTER TABLE `goodsreceipt`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groupmember`
--
ALTER TABLE `groupmember`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groupmessage`
--
ALTER TABLE `groupmessage`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `incident`
--
ALTER TABLE `incident`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `invoiceitem`
--
ALTER TABLE `invoiceitem`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `journalentry`
--
ALTER TABLE `journalentry`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `journalline`
--
ALTER TABLE `journalline`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `latefeeconfigmodel`
--
ALTER TABLE `latefeeconfigmodel`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ledgeraccount`
--
ALTER TABLE `ledgeraccount`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `maintenancerule`
--
ALTER TABLE `maintenancerule`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marketplaceitem`
--
ALTER TABLE `marketplaceitem`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meeting`
--
ALTER TABLE `meeting`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `moverequest`
--
ALTER TABLE `moverequest`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notice`
--
ALTER TABLE `notice`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `notice_view`
--
ALTER TABLE `notice_view`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `parcel`
--
ALTER TABLE `parcel`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parkingpayment`
--
ALTER TABLE `parkingpayment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parkingslot`
--
ALTER TABLE `parkingslot`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `patrollog`
--
ALTER TABLE `patrollog`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `platforminvoice`
--
ALTER TABLE `platforminvoice`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `purchaseorder`
--
ALTER TABLE `purchaseorder`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchaserequest`
--
ALTER TABLE `purchaserequest`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rolemodel`
--
ALTER TABLE `rolemodel`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `serviceinquiry`
--
ALTER TABLE `serviceinquiry`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `servicevariant`
--
ALTER TABLE `servicevariant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `society`
--
ALTER TABLE `society`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `sosalert`
--
ALTER TABLE `sosalert`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `systemsetting`
--
ALTER TABLE `systemsetting`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `unit`
--
ALTER TABLE `unit`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `unitmember`
--
ALTER TABLE `unitmember`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `unitpet`
--
ALTER TABLE `unitpet`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `unitvehicle`
--
ALTER TABLE `unitvehicle`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `usersession`
--
ALTER TABLE `usersession`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `vendor`
--
ALTER TABLE `vendor`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vendorinvoice`
--
ALTER TABLE `vendorinvoice`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `vendorpayout`
--
ALTER TABLE `vendorpayout`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `visitor`
--
ALTER TABLE `visitor`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `amenity`
--
ALTER TABLE `amenity`
  ADD CONSTRAINT `amenity_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `amenitybooking`
--
ALTER TABLE `amenitybooking`
  ADD CONSTRAINT `amenitybooking_amenityId_fkey` FOREIGN KEY (`amenityId`) REFERENCES `amenity` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `amenitybooking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `asset`
--
ALTER TABLE `asset`
  ADD CONSTRAINT `asset_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `buzzlike`
--
ALTER TABLE `buzzlike`
  ADD CONSTRAINT `buzzlike_buzzId_fkey` FOREIGN KEY (`buzzId`) REFERENCES `communitybuzz` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `buzzlike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `chargemaster`
--
ALTER TABLE `chargemaster`
  ADD CONSTRAINT `chargemaster_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `chatgroup`
--
ALTER TABLE `chatgroup`
  ADD CONSTRAINT `chatgroup_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `chatgroup_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `chatmessage`
--
ALTER TABLE `chatmessage`
  ADD CONSTRAINT `chatmessage_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `chatmessage_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `communitybuzz`
--
ALTER TABLE `communitybuzz`
  ADD CONSTRAINT `communitybuzz_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `communitybuzz_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `communitychat`
--
ALTER TABLE `communitychat`
  ADD CONSTRAINT `communitychat_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `communitychat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `communitycomment`
--
ALTER TABLE `communitycomment`
  ADD CONSTRAINT `communitycomment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `communitycomment_buzzId_fkey` FOREIGN KEY (`buzzId`) REFERENCES `communitybuzz` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `communityguideline`
--
ALTER TABLE `communityguideline`
  ADD CONSTRAINT `communityguideline_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `complaint`
--
ALTER TABLE `complaint`
  ADD CONSTRAINT `complaint_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `complaint_reportedById_fkey` FOREIGN KEY (`reportedById`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `complaint_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `complaint_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `complaintcomment`
--
ALTER TABLE `complaintcomment`
  ADD CONSTRAINT `complaintcomment_complaintId_fkey` FOREIGN KEY (`complaintId`) REFERENCES `complaint` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `complaintcomment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `conversation`
--
ALTER TABLE `conversation`
  ADD CONSTRAINT `conversation_directParticipantId_fkey` FOREIGN KEY (`directParticipantId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `conversation_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `conversation_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `document_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `emergencyalert`
--
ALTER TABLE `emergencyalert`
  ADD CONSTRAINT `emergencyalert_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `emergencyalert_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  ADD CONSTRAINT `emergencycontact_residentId_fkey` FOREIGN KEY (`residentId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `emergencycontact_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `event_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `eventrsvp`
--
ALTER TABLE `eventrsvp`
  ADD CONSTRAINT `eventrsvp_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventrsvp_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `facilityrequest`
--
ALTER TABLE `facilityrequest`
  ADD CONSTRAINT `facilityrequest_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `facilityrequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `gate`
--
ALTER TABLE `gate`
  ADD CONSTRAINT `gate_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `goodsreceipt`
--
ALTER TABLE `goodsreceipt`
  ADD CONSTRAINT `goodsreceipt_poId_fkey` FOREIGN KEY (`poId`) REFERENCES `purchaseorder` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `goodsreceipt_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `goodsreceipt_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `groupmember`
--
ALTER TABLE `groupmember`
  ADD CONSTRAINT `groupmember_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `chatgroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `groupmember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `groupmessage`
--
ALTER TABLE `groupmessage`
  ADD CONSTRAINT `groupmessage_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `chatgroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `groupmessage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `incident`
--
ALTER TABLE `incident`
  ADD CONSTRAINT `incident_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `incident_reportedById_fkey` FOREIGN KEY (`reportedById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `incident_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_residentId_fkey` FOREIGN KEY (`residentId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `invoiceitem`
--
ALTER TABLE `invoiceitem`
  ADD CONSTRAINT `invoiceitem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `journalentry`
--
ALTER TABLE `journalentry`
  ADD CONSTRAINT `journalentry_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `journalline`
--
ALTER TABLE `journalline`
  ADD CONSTRAINT `journalline_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `ledgeraccount` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `journalline_journalEntryId_fkey` FOREIGN KEY (`journalEntryId`) REFERENCES `journalentry` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `latefeeconfigmodel`
--
ALTER TABLE `latefeeconfigmodel`
  ADD CONSTRAINT `latefeeconfigmodel_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `ledgeraccount`
--
ALTER TABLE `ledgeraccount`
  ADD CONSTRAINT `ledgeraccount_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `maintenancerule`
--
ALTER TABLE `maintenancerule`
  ADD CONSTRAINT `maintenancerule_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `marketplaceitem`
--
ALTER TABLE `marketplaceitem`
  ADD CONSTRAINT `marketplaceitem_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `marketplaceitem_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `meeting`
--
ALTER TABLE `meeting`
  ADD CONSTRAINT `meeting_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `moverequest`
--
ALTER TABLE `moverequest`
  ADD CONSTRAINT `moverequest_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `moverequest_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notice`
--
ALTER TABLE `notice`
  ADD CONSTRAINT `notice_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `notice_view`
--
ALTER TABLE `notice_view`
  ADD CONSTRAINT `notice_view_noticeId_fkey` FOREIGN KEY (`noticeId`) REFERENCES `notice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notice_view_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `parcel`
--
ALTER TABLE `parcel`
  ADD CONSTRAINT `parcel_loggedByGuardId_fkey` FOREIGN KEY (`loggedByGuardId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `parcel_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `parcel_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `parkingpayment`
--
ALTER TABLE `parkingpayment`
  ADD CONSTRAINT `parkingpayment_residentId_fkey` FOREIGN KEY (`residentId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `parkingpayment_slotId_fkey` FOREIGN KEY (`slotId`) REFERENCES `parkingslot` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `parkingpayment_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `parkingslot`
--
ALTER TABLE `parkingslot`
  ADD CONSTRAINT `parkingslot_allocatedToUnitId_fkey` FOREIGN KEY (`allocatedToUnitId`) REFERENCES `unit` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `parkingslot_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `patrollog`
--
ALTER TABLE `patrollog`
  ADD CONSTRAINT `patrollog_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `patrollog_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `platforminvoice`
--
ALTER TABLE `platforminvoice`
  ADD CONSTRAINT `platforminvoice_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `purchaseorder`
--
ALTER TABLE `purchaseorder`
  ADD CONSTRAINT `purchaseorder_prId_fkey` FOREIGN KEY (`prId`) REFERENCES `purchaserequest` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorder_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseorder_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `purchaserequest`
--
ALTER TABLE `purchaserequest`
  ADD CONSTRAINT `purchaserequest_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaserequest_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD CONSTRAINT `rolepermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `rolepermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `rolemodel` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `serviceinquiry`
--
ALTER TABLE `serviceinquiry`
  ADD CONSTRAINT `serviceinquiry_residentId_fkey` FOREIGN KEY (`residentId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `serviceinquiry_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `servicecategory` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `serviceinquiry_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `serviceinquiry_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `servicevariant`
--
ALTER TABLE `servicevariant`
  ADD CONSTRAINT `servicevariant_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `servicecategory` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `society`
--
ALTER TABLE `society`
  ADD CONSTRAINT `society_billingPlanId_fkey` FOREIGN KEY (`billingPlanId`) REFERENCES `billingplan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `society_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `sosalert`
--
ALTER TABLE `sosalert`
  ADD CONSTRAINT `sosalert_residentId_fkey` FOREIGN KEY (`residentId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `sosalert_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `staff_createdByGuardId_fkey` FOREIGN KEY (`createdByGuardId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `staff_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_bankAccountId_fkey` FOREIGN KEY (`bankAccountId`) REFERENCES `ledgeraccount` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transaction_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `unit`
--
ALTER TABLE `unit`
  ADD CONSTRAINT `unit_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `unit_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `unit_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `unitmember`
--
ALTER TABLE `unitmember`
  ADD CONSTRAINT `unitmember_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `unitpet`
--
ALTER TABLE `unitpet`
  ADD CONSTRAINT `unitpet_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `unitvehicle`
--
ALTER TABLE `unitvehicle`
  ADD CONSTRAINT `unitvehicle_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `unitvehicle_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `unit` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_addedByUserId_fkey` FOREIGN KEY (`addedByUserId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_assignedVendorId_fkey` FOREIGN KEY (`assignedVendorId`) REFERENCES `vendor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `rolemodel` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `usersession`
--
ALTER TABLE `usersession`
  ADD CONSTRAINT `usersession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `vendor`
--
ALTER TABLE `vendor`
  ADD CONSTRAINT `vendor_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `vendorinvoice`
--
ALTER TABLE `vendorinvoice`
  ADD CONSTRAINT `vendorinvoice_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `vendorinvoice_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `vendorpayout`
--
ALTER TABLE `vendorpayout`
  ADD CONSTRAINT `vendorpayout_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `visitor`
--
ALTER TABLE `visitor`
  ADD CONSTRAINT `visitor_checkedInById_fkey` FOREIGN KEY (`checkedInById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `visitor_gateId_fkey` FOREIGN KEY (`gateId`) REFERENCES `gate` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `visitor_residentId_fkey` FOREIGN KEY (`residentId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `visitor_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `society` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `visitor_visitingUnitId_fkey` FOREIGN KEY (`visitingUnitId`) REFERENCES `unit` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
