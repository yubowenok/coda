CREATE SCHEMA IF NOT EXISTS `codadb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `codadb`;

#SET PASSWORD FOR 'coda'@'localhost' = PASSWORD('coda');

CREATE TABLE IF NOT EXISTS `codadb`.`problems` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100),
  `inout_path` VARCHAR(100) NOT NULL,
  `testcase_num` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`));
  
CREATE TABLE IF NOT EXISTS `codadb`.`submissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED,
  `problem_id` INT UNSIGNED NOT NULL,
  `code_language` INT UNSIGNED NOT NULL DEFAULT 0,
  `code_path` VARCHAR(100) NOT NULL,
  `status` INT NOT NULL DEFAULT 0,
  `last_test_num` INT UNSIGNED NOT NULL DEFAULT 0,
  `verdict` INT NULL DEFAULT -1,
  `test_in_snapshot` VARCHAR(100),
  `test_out_snapshot` VARCHAR(100),
  `sub_out_snapshot` VARCHAR(100),
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `codadb`.`judge_queue` (
  `id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `id`
    FOREIGN KEY (`id`)
    REFERENCES `codadb`.`submissions` (`id`));


DELETE FROM `problems`;
DELETE FROM `submissions`;
DELETE FROM `judge_queue`;
INSERT INTO `problems` (name, inout_path, testcase_num)
  VALUES
    ('A Test Problem', '/data/coda/inout/1000/', 3);
INSERT INTO `submissions` (user_id, problem_id, code_path, test_in_snapshot)
  VALUES
    ('yubowenok', 1, '/data/coda/src/a.cpp', '/data/coda/snapshot/sub/a.snap');
INSERT INTO `judge_queue` (id)
  VALUES
    (1);