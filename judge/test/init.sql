CREATE SCHEMA IF NOT EXISTS `codadb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `codadb`;

#SET PASSWORD FOR 'coda'@'localhost' = PASSWORD('coda');

CREATE TABLE IF NOT EXISTS `codadb`.`problems` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100),
  `inout_path` VARCHAR(100) NOT NULL,
  `test_num` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`));
  
CREATE TABLE IF NOT EXISTS `codadb`.`submissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED,
  `problem_id` INT UNSIGNED NOT NULL,
  `language` INT UNSIGNED NOT NULL DEFAULT 0,
  `src_path` VARCHAR(100) NOT NULL,
  `status` INT NOT NULL DEFAULT 0,
  `last_test_num` INT UNSIGNED NOT NULL DEFAULT 0,
  `verdict` INT NULL DEFAULT -1,
  `time` INT NULL,
  `time_total` INT NULL,
  `memory` INT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `codadb`.`judge_queue` (
  `id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT
    FOREIGN KEY (`id`)
    REFERENCES `codadb`.`submissions` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS `codadb`.`test_results` (
  `id` INT UNSIGNED NOT NULL,
  `test_num` INT UNSIGNED NOT NULL,
  `time` INT UNSIGNED,
  `memory` INT UNSIGNED,
  `sub_output` VARCHAR(512),
  `checker_output` VARCHAR(512), 
  PRIMARY KEY (`id`, `test_num`),
  CONSTRAINT
    FOREIGN KEY (`id`)
    REFERENCES `codadb`.`submissions` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    

DELETE FROM `problems`;
DELETE FROM `submissions`;
DELETE FROM `judge_queue`;
INSERT INTO `problems` (name, inout_path, test_num)
  VALUES
    ('A Test Problem', '/data/coda/inout/1/', 3);
INSERT INTO `submissions` (user_id, problem_id, src_path)
  VALUES
    ('yubowenok', 1, '/data/coda/src/ac.cpp'),
    ('yubowenok', 1, '/data/coda/src/wa.cpp'),
    ('yubowenok', 1, '/data/coda/src/tle.cpp'),
    ('yubowenok', 1, '/data/coda/src/re.cpp'),
    ('yubowenok', 1, '/data/coda/src/ce.cpp');
  
INSERT INTO `judge_queue` (id)
  VALUES
    (1), (2), (3), (4), (5);