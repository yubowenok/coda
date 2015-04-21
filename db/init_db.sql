-- MySQL Script generated by MySQL Workbench
-- 04/20/15 19:43:30
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema codadb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `codadb` ;

-- -----------------------------------------------------
-- Schema codadb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `codadb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `codadb` ;

-- -----------------------------------------------------
-- Table `codadb`.`languages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`languages` (
  `id` INT UNSIGNED NOT NULL,
  `language` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` CHAR(32) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` CHAR(32) NOT NULL,
  `password_salt` CHAR(32) NOT NULL,
  `gold` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` INT UNSIGNED NOT NULL DEFAULT 1,
  `rating` INT NULL,
  `language` INT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uid_UNIQUE` (`id` ASC),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  INDEX `language_idx` (`language` ASC),
  CONSTRAINT `usersFK0`
    FOREIGN KEY (`language`)
    REFERENCES `codadb`.`languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`checkers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`checkers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `path` VARCHAR(100) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`problems`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`problems` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `version` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `problem_code` CHAR(10) NOT NULL,
  `time_limit` INT UNSIGNED NOT NULL DEFAULT 1000,
  `mem_limit` INT UNSIGNED NOT NULL,
  `description` VARCHAR(100) NOT NULL,
  `in_format` VARCHAR(100) NOT NULL,
  `out_format` VARCHAR(100) NOT NULL,
  `note` VARCHAR(100) NULL,
  `inout_path` VARCHAR(100) NOT NULL,
  `testcase_num` INT UNSIGNED NOT NULL,
  `checker_id` INT UNSIGNED NOT NULL DEFAULT 0,
  `sample_num` INT UNSIGNED NOT NULL,
  `quality_test_num` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `version` (`version` ASC),
  UNIQUE INDEX `problem_code_UNIQUE` (`problem_code` ASC),
  INDEX `checker_id_idx` (`checker_id` ASC),
  CONSTRAINT `problemsFK0`
    FOREIGN KEY (`checker_id`)
    REFERENCES `codadb`.`checkers` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`sessions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `manager` INT UNSIGNED NULL,
  `status` INT NOT NULL,
  `create_time` DATETIME NULL,
  `start_time` DATETIME NOT NULL,
  `length` INT NOT NULL COMMENT 'in minutes\n',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `contestmanager_idx` (`manager` ASC),
  CONSTRAINT `sessionsFK0`
    FOREIGN KEY (`manager`)
    REFERENCES `codadb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`session_X_problem`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`session_X_problem` (
  `session_id` INT UNSIGNED NOT NULL,
  `problem_order` INT UNSIGNED NOT NULL,
  `problem_id` INT UNSIGNED NOT NULL,
  `points` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`session_id`, `problem_id`),
  INDEX `prob_id_idx` (`problem_id` ASC),
  CONSTRAINT `session_X_problemFK0`
    FOREIGN KEY (`problem_id`)
    REFERENCES `codadb`.`problems` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `session_X_problemFK1`
    FOREIGN KEY (`session_id`)
    REFERENCES `codadb`.`sessions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`submissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`submissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `problem_id` INT UNSIGNED NOT NULL,
  `problem_version` INT UNSIGNED NOT NULL,
  `session_id` INT UNSIGNED NOT NULL,
  `sub_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `language` INT UNSIGNED NOT NULL,
  `src_path` VARCHAR(100) NOT NULL,
  `status` INT NOT NULL COMMENT 'Pending	0	NA\nJudging	1	1 .. test #\nComplete	2	see verdict table',
  `time_max` INT UNSIGNED NULL,
  `time_sum` INT UNSIGNED NULL,
  `memory` INT UNSIGNED NULL,
  `last_test_num` INT UNSIGNED NULL,
  `verdict` INT UNSIGNED NULL COMMENT 'Verdict			Code\nAccepted			0\nWrong Answer		1\nRuntime Error		2\nTime Limit Exceeded		3\nMemory Limit Exceeded	4\nOutput Limit Exceeded	5\nCompilation Error		6\nSystem Error		10',
  PRIMARY KEY (`id`),
  INDEX `session_prblem_idx` (`problem_id` ASC, `session_id` ASC),
  INDEX `user_id_idx` (`user_id` ASC),
  INDEX `problem_version_idx` (`problem_version` ASC),
  INDEX `language_idx` (`language` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  CONSTRAINT `submissionsFK0`
    FOREIGN KEY (`user_id`)
    REFERENCES `codadb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `submissionsFK1`
    FOREIGN KEY (`problem_id` , `session_id`)
    REFERENCES `codadb`.`session_X_problem` (`problem_id` , `session_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `submissionsFK2`
    FOREIGN KEY (`language`)
    REFERENCES `codadb`.`languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `submissionsFK3`
    FOREIGN KEY (`problem_version`)
    REFERENCES `codadb`.`problems` (`version`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`judge_queue`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`judge_queue` (
  `submission_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `problem_id` INT UNSIGNED NOT NULL,
  `problem_version` INT UNSIGNED NOT NULL,
  `session_id` INT UNSIGNED NOT NULL,
  `sub_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `language` INT UNSIGNED NOT NULL,
  `src_path` VARCHAR(100) NOT NULL,
  `status` INT NOT NULL COMMENT 'Pending	0	NA\nJudging	1	1 .. test #\nComplete	2	see verdict table',
  `time_max` INT UNSIGNED NULL,
  `time_sum` INT UNSIGNED NULL,
  `memory` INT UNSIGNED NULL,
  `last_test_num` INT UNSIGNED NULL,
  `verdict` INT UNSIGNED NULL COMMENT 'Verdict			Code\nAccepted			0\nWrong Answer		1\nRuntime Error		2\nTime Limit Exceeded		3\nMemory Limit Exceeded	4\nOutput Limit Exceeded	5\nCompilation Error		6\nSystem Error		10',
  INDEX `submission_id_idx` (`submission_id` ASC),
  PRIMARY KEY (`submission_id`),
  UNIQUE INDEX `submission_id_UNIQUE` (`submission_id` ASC),
  CONSTRAINT `judge_queueFK0`
    FOREIGN KEY (`submission_id`)
    REFERENCES `codadb`.`submissions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`user_X_session`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`user_X_session` (
  `user_id` INT UNSIGNED NOT NULL,
  `session_id` INT UNSIGNED NOT NULL,
  `rating_before` INT NULL,
  `rating_after` INT NULL,
  `ranking` INT UNSIGNED NULL,
  PRIMARY KEY (`user_id`, `session_id`),
  INDEX `contest_id_idx` (`session_id` ASC),
  CONSTRAINT `user_X_sessionFK0`
    FOREIGN KEY (`user_id`)
    REFERENCES `codadb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_X_sessionFK1`
    FOREIGN KEY (`session_id`)
    REFERENCES `codadb`.`sessions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`user_session_problem`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`user_session_problem` (
  `user_id` INT UNSIGNED NOT NULL,
  `session_id` INT UNSIGNED NOT NULL,
  `problem_id` INT UNSIGNED NOT NULL,
  `score` INT NOT NULL,
  `quality_test` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`, `session_id`, `problem_id`),
  INDEX `session_id_idx` (`session_id` ASC, `problem_id` ASC),
  CONSTRAINT `user_session_problemFK0`
    FOREIGN KEY (`user_id`)
    REFERENCES `codadb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_session_problemFK1`
    FOREIGN KEY (`session_id` , `problem_id`)
    REFERENCES `codadb`.`session_X_problem` (`session_id` , `problem_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`judge_results`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`judge_results` (
  `submission_id` INT UNSIGNED NOT NULL,
  `test_case_num` INT UNSIGNED NOT NULL,
  `time` INT NOT NULL,
  `memory` INT NOT NULL,
  `output_snapshot` VARCHAR(512) NULL,
  `checker_snapshot` VARCHAR(64) NULL,
  PRIMARY KEY (`submission_id`, `test_case_num`),
  CONSTRAINT `judge_resultsFK0`
    FOREIGN KEY (`submission_id`)
    REFERENCES `codadb`.`submissions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`test_inout_snapshots`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`test_inout_snapshots` (
  `problem_id` INT UNSIGNED NOT NULL,
  `problem_version` INT UNSIGNED NOT NULL,
  `test_case_num` INT UNSIGNED NOT NULL,
  `in_snapshot` VARCHAR(512) NULL,
  `out_snapshot` VARCHAR(512) NULL,
  PRIMARY KEY (`problem_id`, `problem_version`),
  CONSTRAINT `test_inout_snapshotsFK0`
    FOREIGN KEY (`problem_id`)
    REFERENCES `codadb`.`problems` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
