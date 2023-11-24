CREATE SCHEMA IF NOT EXISTS `pb2b2324_quumuuteexaa68_live` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `pb2b2324_quumuuteexaa68_live`;

CREATE TABLE IF NOT EXISTS `pb2b2324_quumuuteexaa68_live`.`User`
(
    `user_id`  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(45) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `email`    VARCHAR(255) NOT NULL
)  ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `pb2b2324_quumuuteexaa68_live`.`Question`
(
    `question_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id`     INT NOT NULL,
    `title`       VARCHAR(255) NOT NULL,
    `body`        TEXT NOT NULL,
    `is_closed`   BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `user_idx` (`user_id` ASC),
    CONSTRAINT `fk_question_user`
        FOREIGN KEY (`user_id`)
            REFERENCES `pb2b2324_quumuuteexaa68_live`.`User` (`user_id`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
)  ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `pb2b2324_quumuuteexaa68_live`.`Answers`
(
    `answer_id`   INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `question_id` INT NOT NULL,
    `user_id`     INT NOT NULL,
    `body`        TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `question_idx` (`question_id` ASC),
    INDEX `user_idx` (`user_id` ASC),
    CONSTRAINT `fk_answer_question`
        FOREIGN KEY (`question_id`)
            REFERENCES `pb2b2324_quumuuteexaa68_live`.`Question` (`question_id`)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT `fk_answer_user`
        FOREIGN KEY (`user_id`)
            REFERENCES `pb2b2324_quumuuteexaa68_live`.`User` (`user_id`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
)  ENGINE = InnoDB;