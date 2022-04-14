CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `admin_level` int(2) DEFAULT 0,
  `username` varchar(255)
);

CREATE TABLE `bookings` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `computer_id` int,
  `start` datetime,
  `end` datetime
);

CREATE TABLE `computers` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `status` int(2),
  `name` varchar(255),
  `room_id` int
);

CREATE TABLE `rooms` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255)
);

ALTER TABLE `bookings` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `bookings` ADD FOREIGN KEY (`computer_id`) REFERENCES `computers` (`id`);

ALTER TABLE `computers` ADD FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);
