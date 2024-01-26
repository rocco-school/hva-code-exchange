import {Answer} from "../models/answer";
import {AnswerWithUser} from "../models/interface/answerWithUser";
import {Question} from "../models/question";
import {User} from "../models/user";

/**
 * Creates a new instance of the Answer class.
 *
 * @param {AnswerWithUser} answer - The answer to create a new instance for.
 * @returns {Answer} - A new instance of the Answer class.
 */
export function createNewAnswerInstanceFromAnswerWithUser(answer: AnswerWithUser): Answer {
    return new Answer(
        answer.answerId,
        answer.questionId,
        answer.userId,
        answer.answerBody,
        answer.totalUpvotes,
        answer.totalDownvotes,
        answer.isAccepted,
        answer.createdAt,
        answer.updatedAt
    );
}


/**
 * Creates a new instance of the Answer class.
 *
 * @param {Answer} answer - The answer to create a new instance for.
 * @returns {Answer} - A new instance of the Answer class.
 */
export function createNewAnswerInstance(answer: Answer): Answer {
    return new Answer(
        answer.answerId,
        answer.questionId,
        answer.userId,
        answer.answerBody,
        answer.totalUpvotes,
        answer.totalDownvotes,
        answer.isAccepted,
        answer.createdAt,
        answer.updatedAt
    );
}

/**
 * Creates a new instance of the Question class.
 *
 * @param {Question} question - The question to create a new instance for.
 * @returns {Question} - A new instance of the Question class.
 */
export function createNewQuestionInstance(question: Question): Question {
    return new Question(
        question.questionId,
        question.userId,
        question.questionTitle,
        question.questionBody,
        question.isClosed,
        question.totalUpvotes,
        question.totalDownvotes,
        question.createdAt,
        question.updatedAt
    );
}


/**
 * Creates a new instance of the User class.
 *
 * @param {User} user - The user to create a new instance for.
 * @returns {User} - A new instance of the User class.
 */
export function createNewUserInstance(user: User): User {
    return new User(
        user.userId,
        user.firstname,
        user.lastname,
        user.dateOfBirth,
        user.username,
        user.experienceYears,
        user.profilePicture,
        user.password,
        user.email,
        user.createdAt,
        user.updatedAt,
    );
}