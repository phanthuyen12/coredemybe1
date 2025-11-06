-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th10 01, 2025 lúc 05:08 PM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `corekhoahoc`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `courseId` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `active` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `title`, `description`, `courseId`, `createdAt`, `updatedAt`, `active`) VALUES
(1, 'Phương Pháp Và Bí Mật Đằng Sau', 'Phương Pháp Và Bí Mật Đằng Sau ', 1, '2025-09-26 17:37:57.809999', '2025-10-02 23:46:55.000000', 1),
(2, 'Giới Thiệu Khóa Học Toeic của online.toeicmoingay.com', 'Giới Thiệu Khóa Học Toeic của online.toeicmoingay.com\r\nGiới Thiệu Khóa Học Toeic của online.toeicmoingay.com\r\n', 2, '2025-09-28 00:53:38.095164', '2025-10-02 23:46:55.000000', 1),
(3, 'PHƯƠNG PHÁP HAY NHẤT ĐỂ LÀM NỘI DUNG BÁN HÀNG & VIDEO VIRAL', 'PHƯƠNG PHÁP HAY NHẤT ĐỂ LÀM NỘI DUNG BÁN HÀNG & VIDEO VIRAL', 3, '2025-10-01 11:02:14.763422', '2025-10-02 23:46:56.000000', 1),
(4, 'XÂY DỰNG CHIẾN LƯỢC QUẢNG CÁO HIỆU QUẢ', 'XÂY DỰNG CHIẾN LƯỢC QUẢNG CÁO HIỆU QUẢ', 3, '2025-10-01 11:02:32.098994', '2025-10-02 23:46:56.000000', 1),
(5, 'TARGET QUẢNG CÁO HIỆU QUẢ (AUDIENCE & TARGETING)', 'TARGET QUẢNG CÁO HIỆU QUẢ (AUDIENCE & TARGETING)', 3, '2025-10-01 11:02:55.310497', '2025-10-02 23:46:57.000000', 1),
(6, 'QUẢNG CÁO CHUYỂN ĐỔI (WEB ADS, LEAD ADS)', 'QUẢNG CÁO CHUYỂN ĐỔI (WEB ADS, LEAD ADS)\r\n\r\n', 3, '2025-10-01 11:03:09.235238', '2025-10-05 02:04:40.000000', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` varchar(255) NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `active` int(11) NOT NULL DEFAULT 1,
  `code` varchar(255) NOT NULL,
  `isHeadOfice` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `thumbnail`, `active`, `code`, `isHeadOfice`) VALUES
(1, 'Combo 14 Khóa Học Lập Trình Toàn Diện Từ Cơ Bản Đến Chuyên Sâu Cùng 28tech', 'Combo 14 Khóa Học Lập Trình Toàn Diện Từ Cơ Bản Đến Chuyên Sâu Cùng 28tech\r\n', 'thumbnail-1758882107768-424544102.png', 0, 'COMBO14K', 1),
(2, 'Combo 4 Khóa Học Toeic online.toeicmoingay.com', 'Combo 4 Khóa Học Toeic online.toeicmoingay.com\r\n', 'thumbnail-1758995592871-143597343.webp', 1, 'COMBO4KH', 1),
(3, 'TƯ DUY ĐÚNG ĐỂ BÁN HÀNG & QUẢNG CÁO TIKTOK HIỆU QUẢ', 'TƯ DUY ĐÚNG ĐỂ BÁN HÀNG & QUẢNG CÁO TIKTOK HIỆU QUẢ', 'thumbnail-1759291304335-808282968.jpg', 1, 'TDUYNGBN', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `start_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_at` timestamp NULL DEFAULT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'unpaid',
  `voucher_code` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `enrollments`
--

INSERT INTO `enrollments` (`id`, `userId`, `courseId`, `status`, `start_at`, `end_at`, `payment_status`, `voucher_code`, `createdAt`, `updatedAt`, `note`) VALUES
(9, 10, 1, 'active', '2025-10-02 17:29:00', '2025-11-04 17:29:00', 'ngan_hang', '', '2025-10-30 21:29:55.305947', '2025-10-31 08:39:49.848443', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `stock` int(11) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Open',
  `userId` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `issueType` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tickets`
--

INSERT INTO `tickets` (`id`, `title`, `status`, `userId`, `createdAt`, `updatedAt`, `issueType`) VALUES
(2, 'Tôi gặp lỗi thanh toán', 'Open', 1, '2025-10-04 23:01:42.885414', '2025-10-04 23:01:42.885414', ''),
(3, 'Tôi gặp lỗi thanh toán', 'Open', 2, '2025-10-04 23:13:08.373733', '2025-10-04 23:13:08.373733', ''),
(4, 'Tôi gặp lỗi thanh toán', 'Open', 2, '2025-10-04 23:31:47.014118', '2025-10-04 23:31:47.014118', ''),
(5, 'Lỗi đăng nhập', 'Open', 2, '2025-10-04 23:34:43.877637', '2025-10-04 23:34:43.877637', ''),
(6, 'sdfsdfsdf', 'Open', 2, '2025-10-04 23:45:39.445435', '2025-10-04 23:45:39.445435', 'payment'),
(7, 'phan gia thuyên', 'Open', 1, '2025-10-05 01:19:44.549165', '2025-10-05 01:19:44.549165', 'technical'),
(8, 'thuyendevv', 'Open', 1, '2025-10-05 01:24:24.940279', '2025-10-05 01:24:24.940279', 'account'),
(9, 'thueyndevv', 'Open', 1, '2025-10-05 02:05:25.244430', '2025-10-05 02:05:25.244430', 'technical'),
(10, 'xin chào đội ngũ', 'Open', 8, '2025-10-29 17:15:15.100619', '2025-10-29 17:15:15.100619', 'account'),
(11, 'xin chào mình là thuyên dev', 'Open', 10, '2025-10-30 23:34:00.838232', '2025-10-30 23:34:00.838232', 'account'),
(12, 'xin vhff', 'Open', 10, '2025-10-30 23:38:01.323309', '2025-10-30 23:38:01.323309', 'account');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ticket_messages`
--

CREATE TABLE `ticket_messages` (
  `id` int(11) NOT NULL,
  `ticketId` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `message` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ticket_messages`
--

INSERT INTO `ticket_messages` (`id`, `ticketId`, `senderId`, `message`, `image`, `createdAt`) VALUES
(8, 2, 1, 'Khi tôi thanh toán, hệ thống báo lỗi 500', NULL, '2025-10-04 23:01:42.899272'),
(9, 3, 2, 'Hệ thống báo lỗi 500', NULL, '2025-10-04 23:13:08.378428'),
(10, 4, 2, 'Hệ thống báo lỗi 500', NULL, '2025-10-04 23:31:47.019590'),
(11, 5, 2, 'Không đăng nhập được tài khoản', NULL, '2025-10-04 23:34:43.883180'),
(12, 6, 2, 'sdfsdfsdf', 'image-1759596339432-541254839.jpg', '2025-10-04 23:45:39.451758'),
(13, 2, 2, 'thuyendev', NULL, '2025-10-04 23:57:35.607053'),
(14, 6, 2, 'xin chào thuyên nhewa\n', NULL, '2025-10-05 00:04:31.915703'),
(15, 2, 2, 'test nội dung ', NULL, '2025-10-05 01:18:00.879287'),
(16, 7, 1, 'lỗi code bugg', 'image-1759601984536-760248216.jpg', '2025-10-05 01:19:44.555140'),
(17, 8, 1, 'thuyendevv', 'image-1759602264935-491750371.jpg', '2025-10-05 01:24:24.943088'),
(18, 9, 1, 'sdfsdfsfd', 'image-1759604725225-756656826.jpg', '2025-10-05 02:05:25.252158'),
(19, 9, 2, 'thuyendevvv', 'image-1759605529650-558212144.jpg', '2025-10-05 02:18:49.662798'),
(20, 9, 1, 'huyendev\r\n', 'image-1759606296144-973609.jpg', '2025-10-05 02:31:36.154555'),
(21, 10, 8, 'xin chào đội ngũ', NULL, '2025-10-29 17:15:15.115566'),
(22, 8, 2, 'xin chào bạn ', NULL, '2025-10-30 21:35:31.173940'),
(23, 9, 1, 'xin chào nè\r\n', NULL, '2025-10-30 21:52:14.700629'),
(24, 9, 1, 'xin chào nè', NULL, '2025-10-30 21:52:24.299639'),
(25, 11, 10, 'xin chào mình là thuyên devxin chào mình là thuyên devxin chào mình là thuyên dev', 'image-1761842040826-332026119.jpg', '2025-10-30 23:34:00.848735'),
(26, 11, 2, 'nói ít thôi nhé bạn', NULL, '2025-10-30 23:34:26.573185'),
(27, 11, 10, 'oki bạn ', NULL, '2025-10-30 23:34:47.202688'),
(28, 11, 10, 'xin chào thuyên', NULL, '2025-10-30 23:37:49.804686'),
(29, 12, 10, 'htuyen20005', NULL, '2025-10-30 23:38:01.333501');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `balance` decimal(18,2) NOT NULL DEFAULT 0.00,
  `totalTopup` decimal(18,2) NOT NULL DEFAULT 0.00,
  `discount` varchar(255) NOT NULL DEFAULT '0%',
  `admin` tinyint(4) NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `activity` varchar(255) NOT NULL DEFAULT 'Offline',
  `utm_source` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `username`, `role`, `balance`, `totalTopup`, `discount`, `admin`, `status`, `activity`, `utm_source`, `createdAt`, `updatedAt`) VALUES
(1, 'thuyendev@gmail.com', '$2b$10$Nb0JhbMmwrq8S3ZcypIhEesXNrb9BwFNblKhXPBp26EhXCfY8jVh2', 'phan gia thuyên', 'user', 0.00, 0.00, '0%', 0, 'Active', 'Offline', NULL, '2025-10-02 15:57:48.287343', '2025-10-04 20:20:47.000000'),
(2, 'phangiathuyendev3', '$2b$10$fTJZmReoe9NcuvM1Kxo75eYbeKh3PW2ZsctqOwRG.EM7oSDYfNWAa', 'phangiathuyende12v@gmail.com', 'admin', 0.00, 0.00, '0%', 0, 'Active', 'Offline', NULL, '2025-10-02 16:13:34.623549', '2025-10-04 09:02:06.019251'),
(4, 'thanthuyendev@gmail.com', '$2b$10$P59cgnRdaaTON5KB/pTH2OZsBtaovWANIUtsILt.3gMcNfYBdhVFO', 'thuyen2004', 'user', 0.00, 0.00, '0%', 0, 'inactive', 'Offline', NULL, '2025-10-04 17:48:53.501834', '2025-10-29 08:40:30.000000'),
(5, 'thuyendev12@gmail.com', '$2b$10$5cxCrW0zxC4iCUe46l4Z0Ot9SrYoLYo1/pd/TvIn0GKJBYgDkHfry', 'phan thị phụng', 'user', 0.00, 0.00, '0%', 0, 'inactive', 'Offline', NULL, '2025-10-05 07:58:48.157615', '2025-10-29 08:40:27.000000'),
(6, 'tranthitrien2004@powerscrews.com', '$2b$10$tO5Zmq10U12T4mvXMiuIVOqtk2fw1Gg/tylIMZy98TuVlqOJ7Q11C', 'phan thị ly', 'user', 0.00, 0.00, '0%', 0, 'inactive', 'Offline', NULL, '2025-10-06 16:04:13.381887', '2025-10-29 08:40:23.000000'),
(7, 'phangiathuyendev12342@gmail.com', '$2b$10$suDa94xKxHOEJgmFnOhaTueTcrHsdBI15DqXT/V4HHuwUrwu1hu7m', 'lkee hoàng', 'user', 0.00, 0.00, '0%', 0, 'inactive', 'Offline', NULL, '2025-10-26 06:48:36.517214', '2025-10-29 08:40:20.000000'),
(8, '', '$2b$10$12yy0Ao5Vsqc/.2oIeQvyevgn0yug5VQtBNPCFJS7Rteu8/o2EXpa', '', 'user', 0.00, 0.00, '0%', 0, 'inactive', 'Offline', NULL, '2025-10-29 02:35:14.763355', '2025-10-30 15:36:20.000000'),
(9, 'nhixinh@gmail.com', '$2b$10$7eao/goY5mQFbohtMq6Z/.rk5EuHcZUBnYlYpxLoiLOg6gf7LArEu', 'nhi xinh', 'user', 0.00, 0.00, '0%', 0, 'Active', 'Offline', NULL, '2025-10-30 15:43:33.575114', '2025-10-30 15:43:33.575114'),
(10, 'thaicong@gmail.com', '$2b$10$HYOdKXm5Z2vzj5U9alnTz.P3JjlF1ALd6D0pvw4fHXfoojWvrT4GK', 'thaicong666', 'admin', 0.00, 0.00, '0%', 0, 'inactive', 'Offline', NULL, '2025-10-30 15:49:46.064471', '2025-10-31 03:45:59.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `duration` int(11) NOT NULL DEFAULT 0,
  `order` int(11) NOT NULL DEFAULT 0,
  `access` enum('Free','Premium') NOT NULL DEFAULT 'Free',
  `description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `categoryId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `videos`
--

INSERT INTO `videos` (`id`, `title`, `url`, `fileName`, `duration`, `order`, `access`, `description`, `status`, `categoryId`, `courseId`, `createdAt`, `updatedAt`) VALUES
(1, 'thuyen cô giao thảo ', NULL, NULL, 899999, 3, 'Free', 'FreeFreeFree ', '1', 1, 1, '2025-09-26 18:46:04.320265', '2025-09-28 03:51:57.360392'),
(2, 'thuyen cô giao thảo  THUYÊN', 'url-1759008675030-135788784.mp4', NULL, 899999, 3, 'Free', 'FreeFreeFree ', 'Inactive', 2, 2, '2025-09-26 18:46:37.991446', '2025-09-28 04:31:15.000000'),
(3, 'thuyen cô giao thảo ', 'url-1758995879934-607256225.mp4', NULL, 899999, 3, 'Free', 'FreeFreeFree ', '1', 1, 1, '2025-09-28 00:57:59.950168', '2025-09-28 03:51:53.712175'),
(4, 'sdfsdfsdf', 'url-1758996690447-791711070.mp4', NULL, 332, 4, 'Free', 'dsgfsdfsdfsd', '1', 1, 1, '2025-09-28 01:11:30.579522', '2025-09-28 01:11:30.579522'),
(5, 'Lập trình viên c#', 'url-1758997005363-227551678.mp4', NULL, 4500, 2, 'Free', '4500450045004500', '1', 2, 2, '2025-09-28 01:16:45.572538', '2025-09-28 01:16:45.572538'),
(6, 'gdfsgsdfgs', 'url-1758997028667-524951156.mp4', NULL, 532, 1, 'Free', 'etrweertwertwert', '1', 1, 1, '2025-09-28 01:17:08.795761', '2025-09-28 01:17:08.795761'),
(7, '432', 'url-1758997090515-679440612.mp4', NULL, 444, 4, 'Premium', 'sdfsdfsdfsdfsdf', '1', 1, 1, '2025-09-28 01:18:10.664781', '2025-09-28 01:18:10.664781'),
(8, '4444', 'url-1758997161933-405959035.mp4', NULL, 4500, 4, 'Premium', 'sdfsdfsdfsdf', '1', 1, 1, '2025-09-28 01:19:22.062846', '2025-09-28 01:19:22.062846'),
(9, '435345', 'url-1758997185914-912703640.mp4', NULL, 4500, 4, 'Premium', '345345345345345', '1', 1, 1, '2025-09-28 01:19:46.058678', '2025-09-28 01:19:46.058678'),
(10, 'Cẩm Nang Làm Content Bán Hàng Chuẩn TikTok', NULL, NULL, 870, 1, 'Free', 'Cẩm Nang Làm Content Bán Hàng Chuẩn TikTok', '1', 3, 3, '2025-10-01 11:09:10.100315', '2025-10-01 11:09:10.100315'),
(11, 'Quảng Cáo LIVESTREAM GMV Max hiệu quả', 'video-1759292353801-65032234.mp4', NULL, 532, 2, 'Free', 'Quảng Cáo LIVESTREAM GMV Max hiệu quả', '1', 4, 3, '2025-10-01 11:19:13.861686', '2025-10-01 11:19:13.861686'),
(12, 'Xác Định Target Chuẩn Tệp Khi Chạy Ads', 'video-1759292456832-620210011.mp4', NULL, 899, 1, 'Free', 'Xác Định Target Chuẩn Tệp Khi Chạy Ads\r\n', '1', 5, 3, '2025-10-01 11:20:56.949961', '2025-10-01 11:20:56.949961'),
(13, 'Quảng Cáo Thu Lead Từ Trang Tức Thì (Instant Page)', 'video-1759293825528-508030420.mp4', NULL, 899, 6, 'Premium', 'Quảng Cáo Thu Lead Từ Trang Tức Thì (Instant Page)\r\n', '1', 6, 3, '2025-10-01 11:43:45.578648', '2025-10-01 11:43:45.578648');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `video_watches`
--

CREATE TABLE `video_watches` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `videoId` int(11) NOT NULL,
  `watchTime` int(11) NOT NULL DEFAULT 0,
  `duration` int(11) NOT NULL DEFAULT 0,
  `completionPercentage` decimal(5,2) NOT NULL DEFAULT 0.00,
  `isCompleted` tinyint(4) NOT NULL DEFAULT 0,
  `lastWatchedAt` timestamp NULL DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `website_meta`
--

CREATE TABLE `website_meta` (
  `id` int(11) NOT NULL,
  `url` varchar(500) DEFAULT NULL,
  `domain` varchar(255) NOT NULL,
  `title` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `cover_image` varchar(500) DEFAULT NULL,
  `favicon` varchar(500) DEFAULT NULL,
  `hashtags` text DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `site_name` varchar(255) DEFAULT NULL,
  `published_time` datetime DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `createDate` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updateDate` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_8427f09b695382ad61341d61cdb` (`courseId`);

--
-- Chỉ mục cho bảng `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_de33d443c8ae36800c37c58c929` (`userId`),
  ADD KEY `FK_60dd0ae4e21002e63a5fdefeec8` (`courseId`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_4bb45e096f521845765f657f5c8` (`userId`);

--
-- Chỉ mục cho bảng `ticket_messages`
--
ALTER TABLE `ticket_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_b01e2a35417efbe04c10828266f` (`ticketId`),
  ADD KEY `FK_ddea80824c24d270ef2cb4cb0ba` (`senderId`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  ADD UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`);

--
-- Chỉ mục cho bảng `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_7ceffb040a9f42475d30237f511` (`categoryId`),
  ADD KEY `FK_78dfdd8d19fba0a879390340b54` (`courseId`);

--
-- Chỉ mục cho bảng `video_watches`
--
ALTER TABLE `video_watches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_72ea44592fbc0ded9325a0a5c92` (`userId`),
  ADD KEY `FK_a908cb74815f3fc78750910a9fe` (`videoId`);

--
-- Chỉ mục cho bảng `website_meta`
--
ALTER TABLE `website_meta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_8126dbba8ba3607b9f977f2e00` (`domain`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `ticket_messages`
--
ALTER TABLE `ticket_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `video_watches`
--
ALTER TABLE `video_watches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `website_meta`
--
ALTER TABLE `website_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `FK_8427f09b695382ad61341d61cdb` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `FK_60dd0ae4e21002e63a5fdefeec8` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_de33d443c8ae36800c37c58c929` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `FK_4bb45e096f521845765f657f5c8` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `ticket_messages`
--
ALTER TABLE `ticket_messages`
  ADD CONSTRAINT `FK_b01e2a35417efbe04c10828266f` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ddea80824c24d270ef2cb4cb0ba` FOREIGN KEY (`senderId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `FK_78dfdd8d19fba0a879390340b54` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_7ceffb040a9f42475d30237f511` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `video_watches`
--
ALTER TABLE `video_watches`
  ADD CONSTRAINT `FK_72ea44592fbc0ded9325a0a5c92` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_a908cb74815f3fc78750910a9fe` FOREIGN KEY (`videoId`) REFERENCES `videos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
