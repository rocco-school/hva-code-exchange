/**
 * Creates HTML markup for displaying a question.
 *
 * @param {string} username - The username of the user who posted the question.
 * @param {string} questionTags - The Tags of the question.
 * @param questionPreviewTitle
 * @param questionPreviewContent
 * @param {string} questionId - The id of the question
 * @returns {string} - HTML markup for the question.
 */
export function createQuestionElement(
    username: string,
    questionTags: string,
    questionPreviewTitle: string,
    questionPreviewContent: string,
    questionId: string
): string {

    return `
        <div class="question-body" id="${questionId}">
            <div class="single-question">
                <div class="card-header">
                    <div class="tags-container">
                        <span>Tags</span>
                        <div class="icon-container">
                            <i class="fa-solid fa-slash fa-rotate-by fa-xs tag-icon" style="--fa-rotate-angle: 80deg;"></i>
                        </div>
                       
                        <div class="questionTags">
                            <span>${questionTags}</span>
                        </div>
                        <div class="icon-container">
                            <i class="fa-solid fa-slash fa-rotate-by fa-xs tag-icon" style="--fa-rotate-angle: 80deg;"></i>
                        </div>
                    </div>
                    <div class="by-user">
                        <div class="questionUser">By ${username}</div>
                    </div>
                </div>
                
                <div class="question-box">
                    <div class="question-preview">
                        <div class="question-preview-title">${questionPreviewTitle}</div>
                        <div class="question-preview-content">${questionPreviewContent}<div>
                    </div>
                </div>

            </div>
        </div>`;
}


/**
 * Creates HTML markup for displaying an answer.
 *
 * @param {number} answerId - The unique identifier for the answer.
 * @param {string} answerText - The text content of the answer.
 * @param {string} upvoteCount - The count of upvotes for the answer.
 * @param {string} createdAt - The creation timestamp of the answer.
 * @param {string} updatedAt - The updated timestamp of the answer.
 * @param {string} profilePictureSrc - The source URL for the user's profile picture.
 * @param {string} username - The username of the user who posted the answer.
 * @param {number} answersCount - The total count of answers posted by the user.
 * @param {number} questionsCount - The total count of questions posted by the user.
 * @param {string} userExpertise - The expertise of the user that posted this answer
 * @param {string} extraClass - Additional CSS class to be applied to action buttons.
 * @param {string} certifiedPictureSrc - The source URL for the current certified check mark picture.
 * @param {string} canUserCertify - Additional CSS class to be applied when user can not certify answers.
 * @param {string} tooltipUpvote - The text for the upvote tooltip.
 * @param {string} tooltipDownvote - The text for the downvote tooltip.
 * @returns {string} - HTML markup for the answer.
 */
export function createAnswerElement(
    answerId: number,
    answerText: string,
    upvoteCount: string,
    createdAt: string,
    updatedAt: string,
    profilePictureSrc: string,
    username: string,
    answersCount: number,
    questionsCount: number,
    userExpertise: string,
    extraClass: string,
    certifiedPictureSrc: string,
    canUserCertify: string,
    tooltipUpvote: string,
    tooltipDownvote: string,
): string {
    return `
        <div class="answer">
            <div class="answer-container">
                <div class="answer-sidebar">
                    <div id="${answerId}" class="vote">
                        <!-- Upvote button and count -->
                        <div class="upvote">
                            <img class="arrow answer-upvote" alt="upvote answer" src="assets/img/icons/arrow-up.svg">
                             <div role="tooltip" class="tooltip-upvote tool-tip">${tooltipUpvote}</div>
                        </div>
                        
                        <span class="upvote-count">${upvoteCount}</span>
                        <!-- Downvote button -->
                        <div class="downvote">
                            <img class="arrow arrow-down answer-downvote" alt="upvote answer" src="assets/img/icons/arrow-up.svg">
                            <div role="tooltip" class="tooltip-downvote tool-tip">${tooltipDownvote}</div>
                        </div>
                    </div>
                    <div class="certified-answer-check ${canUserCertify}">
                        <img class="certified-answer" alt="Certified answer" src="${certifiedPictureSrc}">
                    </div>
                </div>
                <div class="answer-body">
                    <!-- Answer text -->
                    <span>${answerText}</span>
                    
                    <div class="answer-info">
                        <div class="action-buttons ${extraClass}">
                            <!-- Delete/edit button with unique ID -->
                            <button class="button edit-button" id="${answerId}">Edit</button>
                            <button class="button delete-button" id="${answerId}">Delete</button>
                        </div>
                        
                        <div class="created-info">
                            <div class="inner-info">
                                <!-- Creation timestamp -->
                                <div class="answer-date">
                                    <span>Created at: ${createdAt}</span>
                                    <span>Last updated: ${updatedAt}</span>
                                </div>
                                <div class="person">
                                    <!-- User profile picture -->
                                    <img class="profile-picture" alt="profile picture" src="${profilePictureSrc}">
                                    <div class="personal-information">
                                        <!-- User details -->
                                        <span>${username}</span>
                                        <span>Answers: ${answersCount}</span>
                                        <span>Questions: ${questionsCount}</span>
                                        <button id="tooltipButton" type="button" class="tool-tip-button">Expertise</button>
                                        <div id="tooltipContent" role="tooltip" class="tool-tip-content">${userExpertise}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


/**
 * Creates HTML markup for displaying an answer.
 *
 * @param {string} createdAt - The creation timestamp of the answer.
 * @param {string} updatedAt - The updated timestamp of the answer.
 * @param {string} profilePictureSrc - The source URL for the user's profile picture.
 * @param {string} username - The username of the user who posted the answer.
 * @param {string} userAnswerCount - The total count of answers posted by the user.
 * @param {string} userQuestionCount - The total count of question posted by the user.
 * @param {string} userExpertise - The expertise of the user that posted this answer
 * @returns {string} - HTML markup for the answer.
 */
export function createQuestionPerson(
    createdAt: string,
    updatedAt: string,
    profilePictureSrc: string,
    username: string,
    userAnswerCount: string,
    userQuestionCount: string,
    userExpertise: string,
): string {
    return `
        <div class="created-info question-person-info">
            <div class="inner-info">
                <!-- Creation timestamp -->
                <div class="answer-date">
                    <span>Created at: ${createdAt}</span>
                    <span>Last updated: ${updatedAt}</span>
                </div>
                <div class="person">
                    <!-- User profile picture -->
                    <img class="profile-picture" alt="profile picture" src="${profilePictureSrc}">
                    <div class="personal-information">
                        <!-- User details -->
                        <span>${username}</span>
                        <span>Answers: ${userAnswerCount}</span>
                        <span>Questions: ${userQuestionCount}</span>
                        <button id="tooltipButton" type="button" class="tool-tip-button">Expertise</button>
                        <div id="tooltipContent" role="tooltip" class="tool-tip-content">${userExpertise}</div>
                    </div>
                </div>
            </div>
        </div>`;
}



/**
 * Creates HTML markup for displaying a question.
 *
 * @param {string} username - The username of the user who posted the question.
 * @param {string} questionTags - The Tags of the question.
 * @param questionPreviewTitle
 * @param questionPreviewContent
 * @param {string} questionId - The id of the question
 * @returns {string} - HTML markup for the question.
 */
export function createQuestionElemForIndex(
    username: string,
    questionTags: string,
    questionPreviewTitle: string,
    questionPreviewContent: string,
    questionId: string
): string {

    return `
        <div class="question-body" id="${questionId}">
            <div class="single-question">
                <div class="card-header">
                    <div class="tags-container">
                        <span>Tags</span>
                        <div class="icon-container">
                            <i class="fa-solid fa-slash fa-rotate-by fa-xs tag-icon" style="--fa-rotate-angle: 80deg;"></i>
                        </div>
                       
                        <div class="questionTags">
                            <span>${questionTags}</span>
                        </div>
                        <div class="icon-container">
                            <i class="fa-solid fa-slash fa-rotate-by fa-xs tag-icon" style="--fa-rotate-angle: 80deg;"></i>
                        </div>
                    </div>
                    <div class="by-user">
                        <div class="questionUser">By ${username}</div>
                    </div>
                </div>
                
                <div class="question-box">
                    <div class="question-preview">
                        <div class="question-preview-title">${questionPreviewTitle}</div>
                        <div class="question-preview-content">${questionPreviewContent}<div>
                    </div>
                </div>

            </div>
        </div>`;
}
