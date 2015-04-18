
# ATTENTION: drops all other tables!!
DROP DATABASE codadb;

CREATE SCHEMA IF NOT EXISTS `codadb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `codadb`;

#SET PASSWORD FOR 'coda'@'localhost' = PASSWORD('coda');

CREATE TABLE IF NOT EXISTS `codadb`.`problems` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100),
  `inout_path` VARCHAR(100) NOT NULL,
  `test_num` INT UNSIGNED NOT NULL,
  `time_limit` INT UNSIGNED NOT NULL,
  `memory_limit` INT UNSIGNED NOT NULL,
  `checker_path` VARCHAR(256),
  PRIMARY KEY (`id`));
  
CREATE TABLE IF NOT EXISTS `codadb`.`submissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED,
  `problem_id` INT UNSIGNED NOT NULL,
  `language` INT UNSIGNED NOT NULL DEFAULT 0,
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
    ON DELETE CASCADE);

CREATE TABLE IF NOT EXISTS `codadb`.`judge_results` (
  `sub_id` INT UNSIGNED NOT NULL,
  `test_num` INT UNSIGNED NOT NULL,
  `verdict` INT UNSIGNED,
  `time` INT UNSIGNED,
  `memory` INT UNSIGNED,
  `sub_output` VARCHAR(512),
  `checker_output` VARCHAR(512), 
  PRIMARY KEY (`sub_id`, `test_num`),
  CONSTRAINT
    FOREIGN KEY (`sub_id`)
    REFERENCES `codadb`.`submissions` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    

DELETE FROM `problems`;
DELETE FROM `submissions`;
DELETE FROM `judge_queue`;
INSERT INTO `problems` (name, inout_path, test_num, time_limit, memory_limit, checker_path)
  VALUES
    ('A Test Problem', '/data/coda/inout/1/', 3, 1000, 65536, "/data/coda/checker/default");
INSERT INTO `submissions` (user_id, problem_id)
  VALUES
    ('yubowenok', 1),  # ac
    ('yubowenok', 1),  # wa
    ('yubowenok', 1),  # tle
    ('yubowenok', 1),  # re
    ('yubowenok', 1);  # ce


INSERT INTO `judge_queue` (id)
SELECT id FROM submissions
