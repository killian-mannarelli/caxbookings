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

/*Insert some mock data into the database*/
INSERT INTO `users` (`admin_level`, `username`) VALUES (1, 'admin');
INSERT INTO `users` (`admin_level`, `username`) VALUES (0, 'user');
INSERT INTO `users` (`admin_level`, `username`) VALUES (0, 'user2');
INSERT INTO `users` (`admin_level`, `username`) VALUES (0, 'user3');
INSERT INTO `users` (`admin_level`, `username`) VALUES (0, 'user4');

INSERT INTO rooms (`name`) VALUES ('Room 1');
INSERT INTO rooms (`name`) VALUES ('Room 2');
INSERT INTO rooms (`name`) VALUES ('Room 3');

INSERT INTO computers (`status`, `name`, `room_id`) VALUES (0, 'Computer 1', 1);
INSERT INTO computers (`status`, `name`, `room_id`) VALUES (0, 'Computer 2', 1);
INSERT INTO computers (`status`, `name`, `room_id`) VALUES (0, 'Computer 3', 1);
INSERT INTO computers (`status`, `name`, `room_id`) VALUES (0, 'Computer 4', 1);
INSERT INTO computers (`status`, `name`, `room_id`) VALUES (0, 'Computer 1', 2);
INSERT INTO computers (`status`, `name`, `room_id`) VALUES (0, 'Computer 2', 2);
INSERT INTO computers (`status`, `name`, `room_id`) VALUES (0, 'Computer 3', 2);
INSERT INTO computers (`status`, `name`, `room_id`) VALUES (0, 'Computer 4', 2);