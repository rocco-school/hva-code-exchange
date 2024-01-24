import {comparePasswords, hashPassword} from "./components/hashPassword";
import "./config";
import {api, types, url, utils} from "@hboictcloud/api";
import {USER_QUERY} from "./query/user.query";
import {JWTPayload} from "jose";
import {security} from "./components/security";
import {User} from "./models/user";
import {initializeTagSelect} from "./components/initializeSelect";
import {handleButtonClick, updateSelectedOptions} from "./components/customSelect";
import {showSuccessMessage} from "./components/successMessage";
import {CodingTag} from "./models/codingTag";
import {createNewUserInstance} from "./components/handleModelInstances";
import {delay} from "./components/delay";
import {Question} from "./models/question";
import {ANSWER_QUERY} from "./query/answer.query";
import {handleRedirectToQuestionDetail} from "./components/handleRedirects";
import {Answer} from "./models/answer";
import {QUESTION_QUERY} from "./query/question.query";
import DOMPurify from "dompurify";
import {getProfilePicturePath} from "./components/handleProfilePicture";

// Asynchronous setup function
async function setup(): Promise<void> {

    // Check the user login status by calling the 'security' function.
    const loginStatus: JWTPayload | boolean | any = await security();

    if (!loginStatus) {
        url.redirect("homepage.html");
    }

    // Initialize the tag select component
    await initializeTagSelect();

    // Extract user ID from loginStatus
    const currentUserId: number = loginStatus["userId"];

    await initializeUserSettings(currentUserId);

    await initializeUserActivity(currentUserId);

    // DOM element selections
    const updateButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".updateUserButton"));
    const deleteButton: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".deleteUserButton"));
    const updateForm: HTMLFormElement = (<HTMLFormElement>document.querySelector(".edit-user"));

    const editProfileSection: HTMLElement = (<HTMLElement>document.querySelector(".editProfileSection"));
    const passwordSection: HTMLElement = (<HTMLElement>document.querySelector(".passwordSection"));
    const errorPasswordMessageBox: HTMLDivElement = (<HTMLDivElement>document.querySelector("#errorPasswordMessageBox"));
    const usernameUser: HTMLDivElement = (<HTMLDivElement>document.querySelector("#usernameUser"));
    const memberSince: HTMLDivElement = (<HTMLDivElement>document.querySelector(".memberUser"));
    const yearsOfExperienceUser: HTMLDivElement = (<HTMLDivElement>document.querySelector(".yearsOfExperienceUser"));
    const profileExpertise: HTMLUListElement = (<HTMLUListElement>document.querySelector(".profileExpertise"));

    // Input elements for user details
    const usernameInput: HTMLInputElement = (<HTMLInputElement>document.querySelector("#usernameInput"));
    const oldpasswordInput: HTMLInputElement = (<HTMLInputElement>document.querySelector("#oldPasswordInput"));
    const newPasswordInput: HTMLInputElement = (<HTMLInputElement>document.querySelector("#newPasswordInput"));
    const confirmPasswordInput: HTMLInputElement = (<HTMLInputElement>document.querySelector("#confirmPasswordInput"));
    const emailInput: HTMLInputElement = (<HTMLInputElement>document.querySelector("#emailInput"));
    const firstnameInput: HTMLInputElement = (<HTMLInputElement>document.querySelector("#firstnameInput"));
    const lastnameInput: HTMLInputElement = (<HTMLInputElement>document.querySelector("#lastnameInput"));
    const birthdayInput: HTMLInputElement = (<HTMLInputElement>document.querySelector("#birthdayInput"));
    const programmingExperienceInput: HTMLInputElement = (<HTMLInputElement>document.querySelector("#experienceInput"));

    // Buttons for user interactions
    const editPasswordBtn: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".editPasswordBtn"));
    const changePasswordBtn: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".changePasswordBtn"));
    const passwordCloseBtn: HTMLButtonElement = (<HTMLButtonElement>document.querySelector(".passwordCloseBtn"));


    const file: HTMLInputElement = (<HTMLInputElement>document.querySelector("#file-upload"));
    const profilePicture: HTMLImageElement = (<HTMLImageElement>document.querySelector(".profile-picture"));

    document.querySelectorAll(".icon-eye").forEach(togglePasswordVisibility);

    document.querySelectorAll(".profile-tab").forEach(item => {
        item.addEventListener("click", handleHeroTab);
    });

    updateButton.addEventListener("click", async (): Promise<void> => {
        updateButton.classList.add("editButtonFocus");
        await delay(100);
        updateButton.classList.remove("editButtonFocus");
    });

    deleteButton.addEventListener("click", async (): Promise<void> => {
        deleteButton.classList.add("deleteButtonFocus");
        await delay(100);
        deleteButton.classList.remove("deleteButtonFocus");

        await showSuccessMessage("Are you sure you want to delete your account?", null, "delete", user.userId, "user");
    });

    // Regular Expression for firstname and lastname
    // only letters are allowed and numbers are not allowed
    const nameRegEx: RegExp = /^[a-zA-Z\s]+$/;

    const retrievedUser: User = await User.retrieveUser(loginStatus.userId) as User;
    const retrievedUserTags: any = await User.getUserTags(loginStatus.userId);

    const user: User = createNewUserInstance(retrievedUser);

    file.addEventListener("change", (): void => {
        const profileImage: HTMLImageElement = (<HTMLImageElement>document.querySelector(".image"));
        if (file.files) {
            const selectedFile: File = file.files[0];

            if (selectedFile) {
                // Display the selected image
                profileImage.src = URL.createObjectURL(selectedFile);
                profileImage.classList.remove("hidden");
            } else {
                // Clear the image if no file is selected
                profileImage.src = "";
                profileImage.classList.add("hidden");
            }
        }
    });


    if (profilePicture) {
        profilePicture.src = await getProfilePicturePath(user);
    }

    // Display the username in the UI
    if (usernameUser) {
        usernameUser.innerHTML = retrievedUser.username;
    }

    // Display the formatted date of birth in the UI
    if (memberSince) {
        memberSince.innerHTML = "Member since " + retrievedUser.createdAt?.toString().replace("T", "  ").replace("00:00", "").slice(0, -8) ?? "Unknown";
    }

    // Display years of programming experience in the UI
    if (yearsOfExperienceUser) {
        yearsOfExperienceUser.innerHTML = retrievedUser.experienceYears + " years of programming experience";
    }

    // Display user tags in the UI

    // Loop through retrieved user tags and display them as list items
    if (profileExpertise) {
        retrievedUserTags.forEach((userTag: any) => {
            const liContent: HTMLLIElement = profileExpertise.appendChild(document.createElement("li"));
            liContent.innerHTML = userTag.tagName;
        });
    }

    // Event listener for the "Edit Password" button
    if (editPasswordBtn) {
        editPasswordBtn.addEventListener("click", (): void => {
            // Show the password section and hide the edit profile section if visible
            passwordSection?.classList.remove("hidden");
            if (editProfileSection?.classList.contains("hidden")) {
                return;
            } else {
                editProfileSection?.classList.add("hidden");
            }
        });
    }

    // Event listener for the "Password Close" button
    if (passwordCloseBtn) {
        passwordCloseBtn.addEventListener("click", (): void => {
            // Hide the password section and show the edit profile section
            passwordSection?.classList.add("hidden");
            editProfileSection?.classList.remove("hidden");
        });
    }

    // Event listener for the "Change Password" button in the editProfileSection
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener("click", async (): Promise<void> => {
            let noErrors: boolean = true;

            // Gather password inputs for validation
            const passwordInputs: (HTMLInputElement | null)[] = [oldpasswordInput, newPasswordInput, confirmPasswordInput];

            const checkPassword: boolean = await comparePasswords(oldpasswordInput.value, user.password);
            const emptyPasswordInputs: any = await checkPasswordValue(passwordInputs);
            const verifiedNewPassword: boolean = await verifyNewPassword(newPasswordInput, errorPasswordMessageBox);
            const verifiedConfirmPassword: boolean = await verifyConfirmPassword(confirmPasswordInput, newPasswordInput, errorPasswordMessageBox);

            if (!checkPassword || !emptyPasswordInputs || !verifiedNewPassword || !verifiedConfirmPassword) {
                noErrors = false;
            }

            if (!noErrors) {
                errorPasswordMessageBox?.classList.remove("hidden");
                if (errorPasswordMessageBox) {
                    errorPasswordMessageBox.innerHTML = "Something went wrong when changing password!";
                    setTimeout((): void => {
                        errorPasswordMessageBox.classList.add("hidden");
                        errorPasswordMessageBox.innerHTML = "";
                    }, 5000);
                }
            }

            //If all validations pass, update the password
            if (noErrors && emptyPasswordInputs && verifiedNewPassword && verifiedConfirmPassword) {
                try {
                    await updatePasswordData(loginStatus.userId, confirmPasswordInput.value);
                    // Hide the password section and show the edit profile section
                    passwordSection.classList.add("hidden");
                    editProfileSection.classList.remove("hidden");
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }

    // Event listener for the "Save" button in the editProfileSection
    updateForm.addEventListener("submit", async (evt): Promise<void> => {
        evt.preventDefault();

        let questionTags: any[] = [];

        // Array of input elements for validation.
        const inputs: (HTMLInputElement | null)[] = [firstnameInput, lastnameInput, usernameInput, birthdayInput, programmingExperienceInput, emailInput];

        // Validate the user inputs.
        const verifiedInputs: boolean = await validateInputs(inputs);

        if (verifiedInputs) {
            // Use the async function handleButtonClick when the submit button is clicked
            await handleButtonClick().then((result: string | null): void => {
                if (result !== null) {
                    // Handle the valid result
                    const tags: string[] = result.split(", ");

                    for (const tagsKey in tags) {
                        questionTags.push(tags[tagsKey]);
                    }
                } else {
                    // Handle the case where the input is not valid
                    console.log("Input is not valid.");
                }
            });
            let profilePicture: string | null = "";

            // Validate email, firstname, and lastname
            const verifiedEmail: boolean = await verifyEmail(emailInput);
            if (!verifiedEmail) return;
            const verifiedFirstname: boolean = await verifyFirstname(firstnameInput, nameRegEx);
            if (!verifiedFirstname) return;
            const verifiedLastname: boolean = await verifyLastname(lastnameInput, nameRegEx);
            if (!verifiedLastname) return;
            const newProfilePicture: string | unknown = await updateProfilePicture(file, user);
            if (typeof newProfilePicture === "string" && newProfilePicture.includes("https://quumuuteexaa68-pb2b2324.hbo-ict.cloud/")) {
                profilePicture = newProfilePicture;
            } else {
                profilePicture = user.profilePicture;
            }

            //If all validations pass, update user data
            if (verifiedEmail && verifiedFirstname && verifiedLastname) {
                try {
                    const user: User = new User(
                        loginStatus?.userId,
                        firstnameInput?.value,
                        lastnameInput?.value,
                        birthdayInput.value,
                        usernameInput?.value,
                        parseInt(programmingExperienceInput?.value),
                        profilePicture,
                        retrievedUser.password,
                        emailInput?.value,
                        null,
                        null,
                    );

                    const updatedUser: User = await user.updateUser() as User;

                    if (updatedUser) {
                        await CodingTag.removeAllUserTags(user.userId);

                        const createUserTags: boolean = await User.insertUserTag(user.userId, questionTags) as boolean;

                        if (createUserTags) {
                            await showSuccessMessage("Successfully updated User!", 2000, "success", null, null);
                            location.reload();
                        }
                    }

                } catch (error) {
                    console.error(error);
                }
            }
        }
    });
}

await setup();


/**
 * Validates the input field and sets a custom validation message if needed.
 * @param {HTMLInputElement | null} inputs - The input element to validate.
 */
async function validateInputs(inputs: any): Promise<boolean> {
    let noError: boolean = true;
    for (const input of inputs) {
        if (input && input.value === "") {
            input.setCustomValidity(input.name + " is required!");

            noError = false;
            break;
        }
    }

    return noError;
}

/**
 * Validates the email field and sets a custom validation message if needed.
 *
 * @param email
 */
async function verifyEmail(email: any): Promise<boolean> {

    // Regular Expression for email
    // Needs alphanumerics before the @ which follows with a dot and 2-4 letters
    const emailRegEx: RegExp = /^((?![\w-\.]+@([\w-]+\.)+[\w-]{2,4}).)*$/;

    if (email.value.match(emailRegEx)) {
        console.log(email.name + " format is not correct!");
        // Returns the alertPopUp function and with the assigned data
        return false;
    } else {
        return true;
    }
}


/**
 * Updates the uploaded file for the user.
 *
 * @param file
 * @param user
 */
async function updateProfilePicture(file: HTMLInputElement, user: User): Promise<string | unknown> {
    try {
        const url: string = "https://quumuuteexaa68-pb2b2324.hbo-ict.cloud/uploads/";

        const fileName: string | undefined = user.profilePicture?.split(url)[0];

        if (fileName) {
            await api.deleteFile(fileName);
        }

        const filename: string = file.files![0].name.replace(/\s/g, "");

        const imageData: types.DataURL = await utils.getDataUrl(file) as types.DataURL;

        return await api.uploadFile(filename, imageData.url, true);
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function verifyFirstname(firstname: any, nameRegEx: RegExp): Promise<boolean> {
    if (!firstname.value.match(nameRegEx)) {
        console.log(firstname.name + " format is not correct!");
        return false;
    } else {
        return true;
    }
}

async function verifyLastname(lastname: any, nameRegEx: RegExp): Promise<boolean> {
    if (!lastname.value.match(nameRegEx)) {
        console.log(lastname.name + " format is not correct!");
        return false;
    } else {
        return true;
    }
}

// Password validation functions

async function checkPasswordValue(inputs: (HTMLInputElement | null)[]): Promise<boolean> {
    let valid: boolean = true;

    inputs.forEach(inputPassword => {
        if (inputPassword && inputPassword.value === "") {
            console.log(inputPassword.name + " is empty!");
            valid = false;
        }
    });

    return valid;
}

async function verifyNewPassword(password: any, errorPasswordMessageBox: HTMLDivElement): Promise<boolean> {
    // Regular Expression for password
    // Minimum ofeight and maximum 60 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegEx: RegExp = /^((?!(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,60}$).)*$/;

    if (password.value.match(passwordRegEx)) {
        errorPasswordMessageBox?.classList.remove("hidden");
        if (errorPasswordMessageBox) {
            errorPasswordMessageBox.innerHTML = "Your password needs a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character.";
            setTimeout(() => {
                errorPasswordMessageBox.classList.add("hidden");
                errorPasswordMessageBox.innerHTML = "";
            }, 5000);
        }
        return false;
    } else {
        return true;
    }

}

// Validates the confirmation password and displays an error message if not matching
async function verifyConfirmPassword(password: any, newPassword: any, errorPasswordMessageBox: HTMLDivElement): Promise<boolean> {
    if (!password.value.match(newPassword.value)) {
        // Show error message and hide after 5 seconds
        errorPasswordMessageBox?.classList.remove("hidden");
        if (errorPasswordMessageBox) {
            errorPasswordMessageBox.innerHTML = "Password does not match!";
            setTimeout(() => {
                errorPasswordMessageBox.classList.add("hidden");
                errorPasswordMessageBox.innerHTML = "";
            }, 5000);
        }
        return false;
    } else {
        console.log("Password matches!");
        return true;
    }
}

// Updates user password in the database
async function updatePasswordData(userId: number, updatedPassword: string): Promise<any> {
    // Hash the new password
    const hashedPassword: string | null = await hashPassword(updatedPassword);

    // Handle hashing error
    if (!hashedPassword) {
        return new Error("Error hashing the password.");
    }

    // Update password in the database
    const passwordDatabase: Promise<any> = api.queryDatabase(USER_QUERY.UPDATE_PASSWORD, hashedPassword, userId);

    console.log(passwordDatabase);
    console.log("SUCCESS! WOOHOO!");
    return;
}

/**
 * Toggle password visibility on icon click.
 * @param {Element} icon - The icon element to attach the click event to.
 */
function togglePasswordVisibility(icon: Element): void {
    icon.addEventListener("click", (): void => {
        // Find the closest ancestor with class "passwordBox"
        const passwordBox: Element = icon.closest(".passwordBox") as Element;

        // Find the input element within the passwordBox
        const inputElem: HTMLInputElement = passwordBox?.querySelector(".inputBox") as HTMLInputElement;

        // Check if the input element is of type "password"
        if (inputElem && inputElem.type === "password") {
            // If it's a password input, change type to "text"
            inputElem.type = "text";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        } else {
            // If it's not a password input or doesn't exist, change type to "password"
            inputElem.type = "password";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        }
    });
}


/**
 * Initializes user settings based on the provided user ID.
 * @param {number} userId - The ID of the user for whom to initialize settings.
 * @returns {Promise<void>} - A Promise that resolves when the initialization is complete.
 */
async function initializeUserSettings(userId: number): Promise<void> {
    try {
        // Retrieve user information and user expertise asynchronously
        const user: User = await User.retrieveUser(userId) as User;
        const userExpertise: CodingTag[] = await User.getUserExpertises(userId) as CodingTag[];

        // Extract unique tag IDs from user expertise
        const tagIds: number[] = [...new Set(userExpertise.map(item => item.tagId))] as number[];

        // Select input elements
        const usernameInput: HTMLInputElement = document.querySelector(".usernameInput") as HTMLInputElement;
        const experienceInput: HTMLInputElement = document.querySelector(".experienceInput") as HTMLInputElement;
        const birthdayInput: HTMLInputElement = document.querySelector(".birthdayInput") as HTMLInputElement;
        const emailInput: HTMLInputElement = document.querySelector(".emailInput") as HTMLInputElement;
        const firstnameInput: HTMLInputElement = document.querySelector(".firstnameInput") as HTMLInputElement;
        const lastnameInput: HTMLInputElement = document.querySelector(".lastnameInput") as HTMLInputElement;
        const profilePicture: HTMLImageElement = document.querySelector(".image") as HTMLImageElement;

        // Select all custom-select elements
        const customSelects: NodeListOf<Element> = document.querySelectorAll(".custom-select");

        // Iterate over custom-select elements
        customSelects.forEach(function (customSelect: Element) {
            // Select all option elements within the current custom-select
            const selectOptions: NodeListOf<HTMLDivElement> = customSelect.querySelectorAll(".option");

            // Update the display of selected options
            selectOptions.forEach(item => {
                const tagId: string = item.getAttribute("data-value") as string;
                const expertiseId: number = parseInt(tagId);

                if (tagIds.includes(expertiseId)) {
                    item.classList.add("active");
                }
            });

            // Update the display of selected options
            updateSelectedOptions(customSelect);
        });

        // Set values for input elements if they exist and user information is available
        if (usernameInput && user.username) {
            usernameInput.value = user.username;
        }

        if (experienceInput) {
            experienceInput.value = user.experienceYears.toString();
        }

        if (birthdayInput && user.dateOfBirth) {
            const birthdate: Date = new Date(user.dateOfBirth);
            birthdayInput.value = birthdate.toISOString().split("T")[0];
        }

        if (emailInput && user.email) {
            emailInput.value = user.email;
        }

        if (firstnameInput && user.firstname) {
            firstnameInput.value = user.firstname;
        }

        if (profilePicture) {
            profilePicture.src = await getProfilePicturePath(user);

            profilePicture.classList.remove("hidden");
        }

        if (lastnameInput && user.lastname) {
            lastnameInput.value = user.lastname;
        }

    } catch (error) {
        // Handle errors, e.g., log or display an error message
        console.error("Error initializing user settings:", error);
    }
}

// Function to initialize user activity based on user ID
async function initializeUserActivity(userId: number): Promise<void> {
    // Select containers using DOM selectors
    const questionsOfUserContainer: HTMLDivElement = (<HTMLDivElement>document.querySelector("#questionsOfUserContainer"));
    const answersOfUserContainer: HTMLDivElement = (<HTMLDivElement>document.querySelector("#answersOfUserContainer"));

    // Fetch most recent questions by user
    const questions: [Question] = await Question.getMostRecentQuestionsByUser(userId) as [Question];

    // Iterate through fetched questions
    for (const question of questions) {
        // Question Section
        const questionDiv: HTMLDivElement = questionsOfUserContainer.appendChild(document.createElement("div"));
        questionDiv.classList.add("question-box");

        // Add click event to redirect to question detail
        questionDiv.addEventListener("click", (): void => {
            handleRedirectToQuestionDetail(question.questionId);
        });

        // Update question count in the heading
        const questionH1: HTMLHeadingElement = (<HTMLHeadingElement>document.querySelector("#questionCount"));
        const questionLength: string = questions.length.toString();
        questionH1.innerHTML = questionLength + " Questions";

        // Display question title
        const questionTitle: HTMLHeadingElement = questionDiv.appendChild(document.createElement("h3"));
        if (questionTitle) {
            questionTitle.innerHTML = question.questionTitle;
        }

        // Display truncated question body
        const questionBodyExample: HTMLDivElement = questionDiv.appendChild(document.createElement("div"));
        if (questionBodyExample) {

            const questionBody: string = question.questionBody.slice(0, 1000);
            questionBodyExample.innerHTML = DOMPurify.sanitize(questionBody);

            // Truncate long question bodies and add ellipsis
            if (questionBodyExample.innerHTML.length > 2000) {
                questionBodyExample.innerHTML += "...";
            }
        }

        // Display number of answers for the current question
        const questionAnswers: HTMLDivElement = questionDiv.appendChild(document.createElement("div"));
        if (questionAnswers) {
            const answerAmount: any = await api.queryDatabase(ANSWER_QUERY.COUNT_ANSWERS_FROM_QUESTION, question.questionId);
            questionAnswers.innerHTML = "answers: " + answerAmount[0].answerCount;
        }
    }

    // Answer Section
    // Fetch most recent questions by answer
    const allQuestionsByAnswer: [Question] = await Question.getMostRecentQuestionsByAnswer(userId) as [Question];

    // Update answer count in the heading
    const answerTitle: HTMLHeadingElement = (<HTMLHeadingElement>document.querySelector("#answerCount"));
    if (answerTitle) {
        const answerAmount: string = allQuestionsByAnswer.length.toString();
        answerTitle.innerHTML = answerAmount + " Answers";
    }

    // Check if there are any questions answered by the user
    if (allQuestionsByAnswer) {
        // Fetch answer details for each answered question
        const answerBodyArray: [Answer] = await api.queryDatabase(ANSWER_QUERY.GET_ANSWERS_BY_USER, userId) as [Answer];

        // Iterate through fetched answers
        if (answerBodyArray) {
            for (const singleAnswer of answerBodyArray) {
                // Answer Section
                const answerDiv: HTMLDivElement = answersOfUserContainer.appendChild(document.createElement("div"));
                answerDiv.classList.add("answer-box");

                // Add click event to redirect to question detail
                answerDiv.addEventListener("click", (): void => {
                    handleRedirectToQuestionDetail(singleAnswer.questionId);
                });

                // Display the title of the question that was answered
                const answerTitle: HTMLHeadingElement = answerDiv.appendChild(document.createElement("h3"));
                const titleArray: [Question] = await api.queryDatabase(QUESTION_QUERY.SELECT_QUESTION_TITLE, singleAnswer.questionId) as [Question];
                answerTitle.innerHTML = "The question: " + titleArray[0].questionTitle;

                // Display "You replied with" heading
                const answerTextTitle: HTMLHeadingElement = answerDiv.appendChild(document.createElement("h4"));
                answerTextTitle.innerHTML = "You replied with: ";

                // Display truncated answer body
                const answerTextContent: HTMLParagraphElement = answerDiv.appendChild(document.createElement("p"));
                if (answerTextContent) {
                    const answerBody: string = singleAnswer.answerBody.slice(0, 1000);
                    answerTextContent.innerHTML = DOMPurify.sanitize(answerBody);
                    // Truncate long answer bodies and add ellipsis
                    if (answerTextContent.innerHTML.length > 1000) {
                        answerTextContent.innerHTML += "...";
                    }
                }
            }
        }
    }
}


/**
 * Function to handle tab navigation on the single-event detail page.
 *
 * This function is responsible for handling tab navigation on the single-event detail page.
 * It shows and hides content based on the selected tab and updates the tab's visual state.
 */
async function handleHeroTab(this: HTMLElement): Promise<void> {
    const profileSection: HTMLTableSectionElement = (<HTMLTableSectionElement>document.querySelector(".userProfileSection"));
    const editUserSection: HTMLTableSectionElement = (<HTMLTableSectionElement>document.querySelector(".editProfileSection"));
    const activitySection: HTMLTableSectionElement = (<HTMLTableSectionElement>document.querySelector(".userActivitySection"));

    // Remove the "is-active" class from all hero tabs.
    document.querySelectorAll(".profile-tab").forEach(item => {
        item.classList.remove("is-active");
    });

    // Add the "is-active" class to the selected hero tab.
    this.classList.add("is-active");

    // Hide all content sections by adding the "hidden" class.
    document.querySelectorAll(".content").forEach(item => {
        item.classList.add("hidden");
    });

    // Show content sections based on the selected tab.
    if (this.classList.contains("userProfile")) {
        if (editUserSection && !editUserSection.classList.contains("hidden")) editUserSection.classList.add("hidden");
        if (activitySection && !activitySection.classList.contains("hidden")) activitySection.classList.add("hidden");
        if (profileSection && activitySection.classList.contains("hidden")) profileSection.classList.remove("hidden");
    } else if (this.classList.contains("userActivity")) {
        if (profileSection && !profileSection.classList.contains("hidden")) profileSection.classList.add("hidden");
        if (editUserSection && !editUserSection.classList.contains("hidden")) editUserSection.classList.add("hidden");
        if (activitySection && activitySection.classList.contains("hidden")) activitySection.classList.remove("hidden");
    } else if (this.classList.contains("userSettings")) {
        if (profileSection && !profileSection.classList.contains("hidden")) profileSection.classList.add("hidden");
        if (activitySection && !activitySection.classList.contains("hidden")) activitySection.classList.add("hidden");
        if (editUserSection && editUserSection.classList.contains("hidden")) editUserSection.classList.remove("hidden");
    }
}