import {Vote} from "../models/vote";
import {Question} from "../models/question";
import {Answer} from "../models/answer";
import {VoteType} from "../enum/voteType";

/**
 * Handles the upvoting of a question by a user.
 *
 * @param {number} questionId - The ID of the question to upvote.
 * @param {number} userId - The ID of the user performing the upvote.
 * @returns {Promise<void>} A Promise indicating the success of the upvote operation.
 * @throws {Error} Throws an error if any part of the upvote process fails.
 *
 * @description
 * This function handles the upvoting of a question by a user. It first checks if the user has already
 * upvoted the question. If not, it creates a new upvote and updates the total upvotes count for the question.
 * If the user has already upvoted, it toggles the vote type, updating the existing vote and adjusting the
 * total upvotes and downvotes accordingly.
 */
export async function handleQuestionUpvote(questionId: number, userId: number): Promise<void> {
    try {
        // Check if the user has already upvoted the question.
        const existingUserVote: Vote = await Vote.getVoteByUserAndQuestionId(userId, questionId) as Vote;

        if (!existingUserVote) {
            // If the user has not upvoted, create a new upvote and update total upvotes.
            const newVote: Vote = new Vote(
                null,
                userId,
                questionId,
                null,
                VoteType.UPVOTE,
                null,
                null,
            );

            const vote: string | Vote = await newVote.saveVote();

            if (vote) {
                await Question.updateTotalUpvotes(questionId, true);
            }
        } else if (existingUserVote.voteType !== VoteType.UPVOTE) {
            // If the user has upvoted with a different vote type, update the existing vote.
            const updatedVote: Vote = new Vote(
                existingUserVote.voteId,
                userId,
                questionId,
                null,
                VoteType.UPVOTE,
                null,
                null,
            );

            const updateVote: string | Vote = await updatedVote.updateVote();

            if (updateVote) {
                // Update total upvotes and downvotes accordingly.
                await Question.updateTotalUpvotes(questionId, true);
                await Question.updateTotalDownvotes(questionId, false);
            }
        }
    } catch (error) {
        // Handle any errors that occur during the upvote process.
        throw new Error(`Failed to handle question upvote: ${error}`);
    }
}


/**
 * Handles the upvoting of an answer by a user.
 *
 * @param {number} answerId - The ID of the answer to upvote.
 * @param {number} userId - The ID of the user performing the upvote.
 * @returns {Promise<void>} A Promise indicating the success of the upvote operation.
 * @throws {Error} Throws an error if any part of the upvote process fails.
 *
 * @description
 * This function handles the upvoting of an answer by a user. It first checks if the user has already
 * upvoted the answer. If not, it creates a new upvote and updates the total upvotes count for the answer.
 * If the user has already upvoted, it toggles the vote type, updating the existing vote and adjusting the
 * total upvotes and downvotes accordingly.
 */
export async function handleAnswerUpvote(answerId: number, userId: number): Promise<void> {
    try {
        // Check if the user has already upvoted the answer.
        const existingUserVote: Vote = await Vote.getVoteByUserAndAnswerId(userId, answerId) as Vote;

        if (!existingUserVote) {
            // If the user has not upvoted, create a new upvote and update total upvotes.
            const newVote: Vote = new Vote(
                null,
                userId,
                null,
                answerId,
                VoteType.UPVOTE,
                null,
                null,
            );

            const vote: string | Vote = await newVote.saveVote();

            if (vote) {
                await Answer.updateTotalUpvotes(answerId, true);
            }
        } else if (existingUserVote.voteType !== VoteType.UPVOTE) {
            // If the user has upvoted with a different vote type, update the existing vote.
            const updatedVote: Vote = new Vote(
                existingUserVote.voteId,
                userId,
                null,
                answerId,
                VoteType.UPVOTE,
                null,
                null,
            );

            const updateVote: string | Vote = await updatedVote.updateVote();

            if (updateVote) {
                // Update total upvotes and downvotes accordingly.
                await Answer.updateTotalUpvotes(answerId, true);
                await Answer.updateTotalDownvotes(answerId, false);
            }
        }
    } catch (error) {
        // Handle any errors that occur during the upvote process.
        throw new Error(`Failed to handle answer upvote: ${error}`);
    }
}