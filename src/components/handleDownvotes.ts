import {Vote} from "../models/vote";
import {Question} from "../models/question";
import {Answer} from "../models/answer";
import {VoteType} from "../enum/voteType";

/**
 * Handles the downvoting of a question by a user.
 *
 * @param {number} questionId - The ID of the question to downvote.
 * @param {number} userId - The ID of the user performing the downvote.
 * @returns {Promise<void>} A Promise indicating the success of the downvote operation.
 * @throws {Error} Throws an error if any part of the downvote process fails.
 *
 * @description
 * This function handles the downvoting of a question by a user. It first checks if the user has already
 * downvoted the question. If not, it creates a new downvote and updates the total downvotes count for the question.
 * If the user has already downvoted, it toggles the vote type, updating the existing vote and adjusting the
 * total upvotes and downvotes accordingly.
 */
export async function handleQuestionDownvote(questionId: number, userId: number): Promise<void> {
    try {
        // Check if the user has already downvoted the question.
        const existingUserVote: Vote = await Vote.getVoteByUserAndQuestionId(userId, questionId) as Vote;

        if (!existingUserVote) {
            // If the user has not downvoted, create a new downvote and update total downvotes.
            const newVote: Vote = new Vote(
                null,
                userId,
                questionId,
                null,
                VoteType.DOWNVOTE,
                null,
                null,
            );

            const vote: string | Vote = await newVote.saveVote();

            if (vote) {
                await Question.updateTotalDownvotes(questionId, true);
            }
        } else if (existingUserVote.voteType !== VoteType.DOWNVOTE) {
            // If the user has downvoted with a different vote type, update the existing vote.
            const updatedVote: Vote = new Vote(
                existingUserVote.voteId,
                userId,
                questionId,
                null,
                VoteType.DOWNVOTE,
                null,
                null,
            );

            const updateVote: string | Vote = await updatedVote.updateVote();

            if (updateVote) {
                // Update total upvotes and downvotes accordingly.
                await Question.updateTotalDownvotes(questionId, true);
                await Question.updateTotalUpvotes(questionId, false);
            }
        }
    } catch (error) {
        // Handle any errors that occur during the downvote process.
        throw new Error(`Failed to handle question downvote: ${error}`);
    }
}


/**
 * Handles the downvoting of an answer by a user.
 *
 * @param {number} answerId - The ID of the answer to downvote.
 * @param {number} userId - The ID of the user performing the downvote.
 * @returns {Promise<void>} A Promise indicating the success of the downvote operation.
 * @throws {Error} Throws an error if any part of the downvote process fails.
 *
 * @description
 * This function handles the downvoting of a answer by a user. It first checks if the user has already
 * downvoted the answer. If not, it creates a new downvote and updates the total downvotes count for the answer.
 * If the user has already downvoted, it toggles the vote type, updating the existing vote and adjusting the
 * total upvotes and downvotes accordingly.
 */
export async function handleAnswerDownvote(answerId: number, userId: number): Promise<void> {
    try {
        // Check if the user has already downvoted the answer.
        const existingUserVote: Vote = await Vote.getVoteByUserAndAnswerId(userId, answerId) as Vote;

        if (!existingUserVote) {
            // If the user has not downvoted, create a new downvote and update total downvotes.
            const newVote: Vote = new Vote(
                null,
                userId,
                null,
                answerId,
                VoteType.DOWNVOTE,
                null,
                null,
            );

            const vote: string | Vote = await newVote.saveVote();

            if (vote) {
                await Answer.updateTotalDownvotes(answerId, true);
            }
        } else if (existingUserVote.voteType !== VoteType.DOWNVOTE) {
            // If the user has downvoted with a different vote type, update the existing vote.
            const updatedVote: Vote = new Vote(
                existingUserVote.voteId,
                userId,
                null,
                answerId,
                VoteType.DOWNVOTE,
                null,
                null,
            );

            const updateVote: string | Vote = await updatedVote.updateVote();

            if (updateVote) {
                // Update total upvotes and downvotes accordingly.
                await Answer.updateTotalDownvotes(answerId, true);
                await Answer.updateTotalUpvotes(answerId, false);
            }
        }
    } catch (error) {
        // Handle any errors that occur during the downvote process.
        throw new Error(`Failed to handle answer downvote: ${error}`);
    }
}