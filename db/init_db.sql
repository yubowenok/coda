-- MySQL Script generated by MySQL Workbench
-- 04/20/15 22:28:55
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
  `email` VARCHAR(256) NOT NULL,
  `password_hash` CHAR(32) NOT NULL,
  `password_salt` CHAR(32) NOT NULL,
  `shell` INT UNSIGNED NOT NULL DEFAULT 0,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` INT UNSIGNED NOT NULL DEFAULT 1,
  `rating` INT NULL,
  `language_default` INT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uid_UNIQUE` (`id` ASC),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  INDEX `language_idx` (`language_default` ASC),
  CONSTRAINT `usersFK0`
    FOREIGN KEY (`language_default`)
    REFERENCES `codadb`.`languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`checkers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`checkers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` CHAR(16) NULL,
  `language` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `checkersFK0`
    FOREIGN KEY (`id`)
    REFERENCES `codadb`.`languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`problems`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`problems` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `version` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `code` CHAR(16) NOT NULL,
  `time_limit` INT UNSIGNED NOT NULL DEFAULT 1000,
  `memory_limit` INT UNSIGNED NOT NULL,
  `description` VARCHAR(256) NOT NULL,
  `input_description` VARCHAR(256) NOT NULL,
  `output_description` VARCHAR(256) NOT NULL,
  `note` VARCHAR(256) NULL,
  `checker_id` INT UNSIGNED NOT NULL DEFAULT 0,
  `test_num` INT UNSIGNED NOT NULL,
  `sample_test_num` INT UNSIGNED NOT NULL,
  `quality_test_num` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `version` (`version` ASC),
  UNIQUE INDEX `problem_code_UNIQUE` (`code` ASC),
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
  `create_time` TIMESTAMP NULL,
  `start_time` TIMESTAMP NULL,
  `end_time` TIMESTAMP NULL,
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
-- Table `codadb`.`submissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`submissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `problem_id` INT UNSIGNED NOT NULL,
  `problem_version` INT UNSIGNED NOT NULL,
  `session_id` INT UNSIGNED NOT NULL,
  `submission_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `language` INT UNSIGNED NOT NULL,
  `status` INT NOT NULL,
  `time_max` INT UNSIGNED NULL,
  `time_total` INT UNSIGNED NULL,
  `memory` INT UNSIGNED NULL,
  `last_test_num` INT UNSIGNED NULL,
  `verdict` INT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `submissionsFK0_idx` (`language` ASC),
  CONSTRAINT `submissionsFK0`
    FOREIGN KEY (`language`)
    REFERENCES `codadb`.`languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`judge_queue`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`judge_queue` (
  `submission_id` INT UNSIGNED NOT NULL,
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
-- Table `codadb`.`session_problem`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`session_problem` (
  `session_id` INT UNSIGNED NOT NULL,
  `problem_order` INT UNSIGNED NOT NULL,
  `problem_id` INT UNSIGNED NOT NULL,
  `points` INT UNSIGNED NOT NULL,
  `quality_test_enabled` TINYINT(1) NULL,
  `test_id_enabled` TINYINT(1) NULL,
  PRIMARY KEY (`session_id`, `problem_id`),
  INDEX `problem_id_idx` (`problem_id` ASC),
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
-- Table `codadb`.`user_session`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`user_session` (
  `user_id` INT UNSIGNED NOT NULL,
  `session_id` INT UNSIGNED NOT NULL,
  `rating_before` INT NULL,
  `rating_after` INT NULL,
  `rank` INT UNSIGNED NULL,
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
  `quality_test_enabled` TINYINT(1) NOT NULL DEFAULT 0,
  `judge_mode` INT NOT NULL,
  PRIMARY KEY (`user_id`, `session_id`, `problem_id`),
  INDEX `session_id_idx` (`session_id` ASC, `problem_id` ASC),
  CONSTRAINT `user_session_problemFK0`
    FOREIGN KEY (`user_id`)
    REFERENCES `codadb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_session_problemFK1`
    FOREIGN KEY (`session_id` , `problem_id`)
    REFERENCES `codadb`.`session_problem` (`session_id` , `problem_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`judge_results`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`judge_results` (
  `submission_id` INT UNSIGNED NOT NULL,
  `test_id` INT UNSIGNED NOT NULL,
  `time` INT NOT NULL,
  `memory` INT NOT NULL,
  `output_snapshot` VARCHAR(512) NULL,
  `checker_output` VARCHAR(512) NULL,
  PRIMARY KEY (`submission_id`, `test_id`),
  CONSTRAINT `judge_resultsFK0`
    FOREIGN KEY (`submission_id`)
    REFERENCES `codadb`.`submissions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`inout_snapshots`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`inout_snapshots` (
  `problem_id` INT UNSIGNED NOT NULL,
  `problem_version` INT UNSIGNED NOT NULL,
  `test_id` INT UNSIGNED NOT NULL,
  `in_snapshot` VARCHAR(512) NULL,
  `out_snapshot` VARCHAR(512) NULL,
  PRIMARY KEY (`problem_id`, `problem_version`),
  CONSTRAINT `test_inout_snapshotsFK0`
    FOREIGN KEY (`problem_id`)
    REFERENCES `codadb`.`problems` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `codadb`.`quality_test_purchased`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codadb`.`quality_test_purchased` (
  `user_id` INT UNSIGNED NOT NULL,
  `session_id` INT UNSIGNED NOT NULL,
  `problem_id` INT UNSIGNED NOT NULL,
  `cost` INT NULL,
  INDEX `quality_test_purchasedFK0_idx` (`user_id` ASC),
  INDEX `quality_test_purchasedFK1_idx` (`session_id` ASC, `problem_id` ASC),
  PRIMARY KEY (`session_id`, `problem_id`, `user_id`),
  CONSTRAINT `quality_test_purchasedFK0`
    FOREIGN KEY (`user_id`)
    REFERENCES `codadb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `quality_test_purchasedFK1`
    FOREIGN KEY (`session_id` , `problem_id`)
    REFERENCES `codadb`.`session_problem` (`session_id` , `problem_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;