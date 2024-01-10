CREATE SCHEMA IF NOT EXISTS `pb2b2324_quumuuteexaa68_live` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `pb2b2324_quumuuteexaa68_live`;

CREATE TABLE IF NOT EXISTS `pb2b2324_quumuuteexaa68_live`.`user`
(
    `userId`  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `firstname` VARCHAR(50) NOT NULL,
    `lastname` VARCHAR(50) NOT NULL,
    `username` VARCHAR(45) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `email`    VARCHAR(255) NOT NULL
)  ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `pb2b2324_quumuuteexaa68_live`.`question`
(
    `questionId` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT NOT NULL,
    `questionTitle` VARCHAR(255) NOT NULL,
    `questionBody` TEXT NOT NULL,
    `isClosed` BOOLEAN DEFAULT FALSE,
    `upVotes` INT DEFAULT 0 NOT NULL,
    `downVotes` INT DEFAULT 0 NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `user_idx` (`userId` ASC),
        CONSTRAINT `fk_question_user`
            FOREIGN KEY (`userId`)
                REFERENCES `pb2b2324_quumuuteexaa68_live`.`user` (`userId`)
                ON DELETE CASCADE
                ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `pb2b2324_quumuuteexaa68_live`.`answer`
(
    `answerId` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `questionId` INT NOT NULL,
    `userId` INT NOT NULL,
    `answerBody` TEXT NOT NULL,
    `upVotes` INT DEFAULT 0 NOT NULL,
    `downVotes` INT DEFAULT 0 NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `question_idx` (`questionId` ASC),
    INDEX `user_idx` (`userId` ASC),
        CONSTRAINT `fk_answer_question`
            FOREIGN KEY (`questionId`)
                REFERENCES `pb2b2324_quumuuteexaa68_live`.`question` (`questionId`)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
        CONSTRAINT `fk_answer_user`
            FOREIGN KEY (`userId`)
                REFERENCES `pb2b2324_quumuuteexaa68_live`.`user` (`userId`)
                ON DELETE CASCADE
                ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `pb2b2324_quumuuteexaa68_live`.`coding_tag`
(
    `tagId` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `tagName` VARCHAR(255) NOT NULL,
    `tagDescription` TEXT NOT NULL,
    INDEX `tag_name_idx` (`tagName` ASC)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `pb2b2324_quumuuteexaa68_live`.`question_tag`
(
    `questionId` INT NOT NULL,
    `tagId` INT NOT NULL,
    PRIMARY KEY (`questionId`, `tagId`),
    INDEX `question_idx` (`questionId` ASC),
    INDEX `tag_idx` (`tagId` ASC),
        FOREIGN KEY (`questionId`)
            REFERENCES `pb2b2324_quumuuteexaa68_live`.`question` (`questionId`)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        FOREIGN KEY (`tagId`)
            REFERENCES `pb2b2324_quumuuteexaa68_live`.`coding_tag` (`tagId`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `pb2b2324_quumuuteexaa68_live`.`user_tag`
(
    `userId` INT NOT NULL,
    `tagId` INT NOT NULL,
    PRIMARY KEY (`userId`, `tagId`),
    INDEX `user_idx` (`userId` ASC),
    INDEX `tag_idx` (`tagId` ASC),
        FOREIGN KEY (`userId`)
            REFERENCES `pb2b2324_quumuuteexaa68_live`.`user` (`userId`)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        FOREIGN KEY (`tagId`)
            REFERENCES `pb2b2324_quumuuteexaa68_live`.`coding_tag` (`tagId`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `pb2b2324_quumuuteexaa68_live`.`votes`
(
    `voteId` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT NOT NULL,
    `questionId` INT NULL,
    `answerId` INT NULL,
    `voteType` ENUM('upvote', 'downvote') NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `user_idx` (`userId` ASC),
    INDEX `question_idx` (`questionId` ASC),
    INDEX `answer_idx` (`answerId` ASC),
        FOREIGN KEY (`userId`)
            REFERENCES `pb2b2324_quumuuteexaa68_live`.`user` (`userId`)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
        FOREIGN KEY (`questionId`)
            REFERENCES `pb2b2324_quumuuteexaa68_live`.`question` (`questionId`)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
        FOREIGN KEY (`answerId`)
            REFERENCES `pb2b2324_quumuuteexaa68_live`.`answer` (`answerId`)
                ON DELETE CASCADE
                ON UPDATE CASCADE
) ENGINE = InnoDB;
