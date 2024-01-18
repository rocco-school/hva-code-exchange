import {hashPassword} from "./components/hashPassword";
import "./config";
import {api} from "@hboictcloud/api";
import {USER_QUERY} from "./query/user.query";
import {JWTPayload} from "jose";
import {security} from "./components/security";
import {User} from "./models/user";
import {initializeTagSelect} from "./components/initializeSelect";
import {handleButtonClick} from "./components/customSelect";

// Asynchronous setup function
async function setup(): Promise<void> {

    // Check the user login status by calling the 'security' function.
    const loginStatus: JWTPayload | boolean | any = await security();

    // Initialize the tag select component
    await initializeTagSelect();

    // Extract user ID from loginStatus
    const currentUserId: number = loginStatus["userId"];
    console.log(currentUserId);

    // DOM element selections
    const userProfileBtn: HTMLButtonElement | null = document.querySelector("#userProfileBtn");
    const userSettingsBtn: HTMLButtonElement | null = document.querySelector("#userSettingsBtn");
    const publicProfileSection: HTMLElement | null = document.querySelector(".publicProfileSection");
    const editProfileSection: HTMLElement | null = document.querySelector(".editProfileSection");
    const passwordSection: HTMLElement | null = document.querySelector(".passwordSection");
    const errorPasswordMessageBox: HTMLDivElement | null = document.querySelector("#errorPasswordMessageBox");
    const usernameUser: HTMLDivElement | null = document.querySelector("#usernameUser");
    const birthdayUser: HTMLDivElement | null = document.querySelector("#birthdayUser");
    const yearsOfExperienceUser: HTMLDivElement | null = document.querySelector("#yearsOfExperienceUser");
    const profileExpertise: HTMLUListElement | null = document.querySelector(".profileExpertise");

    // Input elements for user details
    const usernameInput: HTMLInputElement | null = document.querySelector("#usernameInput");
    const newPasswordInput: HTMLInputElement | null = document.querySelector("#newPasswordInput");
    const confirmPasswordInput: HTMLInputElement | null = document.querySelector("#confirmPasswordInput");
    const emailInput: HTMLInputElement | null = document.querySelector("#emailInput");
    const firstnameInput: HTMLInputElement | null = document.querySelector("#firstnameInput");
    const lastnameInput: HTMLInputElement | null = document.querySelector("#lastnameInput");
    const birthdayInput: HTMLInputElement | null = document.querySelector("#birthdayInput");
    const programmingExperienceInput: HTMLInputElement | null = document.querySelector("#programmingExperienceInput");
    const expertiseOptions: HTMLSelectElement | null = document.querySelector("#expertiseOptions");

    // Buttons for user interactions
    const editPasswordBtn: HTMLButtonElement | null = document.querySelector("#editPasswordBtn");
    const changePasswordBtn: HTMLButtonElement | null = document.querySelector("#changePasswordBtn");
    const passwordCloseBtn: HTMLButtonElement | null = document.querySelector("#passwordCloseBtn");
    const saveBtn: HTMLButtonElement | null = document.querySelector("#saveBtn");
    const editBtn: HTMLButtonElement | null = document.querySelector("#editBtn");
    const discardBtn: HTMLButtonElement | null = document.querySelector("#discardBtn");

    // Array of elements to be disabled during certain states
    const disabled: (HTMLInputElement | HTMLButtonElement | HTMLSelectElement | null)[] = [
        usernameInput, birthdayInput, programmingExperienceInput,
        editPasswordBtn, emailInput, expertiseOptions,
        firstnameInput, lastnameInput, saveBtn, discardBtn
    ];

    // Regular Expression for email
    // Needs alphanumerics before the @ which follows with a dot and 2-4 letters
    const emailRegEx: RegExp = /^((?![\w-\.]+@([\w-]+\.)+[\w-]{2,4}).)*$/;

    // Regular Expression for password
    // Minimum ofeight and maximum 60 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegEx: RegExp = /^((?!(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,60}$).)*$/;

    // Regular Expression for firstname and lastname
    // only letters are allowed and numbers are not allowed
    const nameRegEx: RegExp = /^[a-zA-Z\s]+$/;

    const retrievedUser: any = await User.retrieveUser(loginStatus.userId);
    const retrievedUserTags: any = await User.getUserTags(loginStatus.userId);
    const retrievedAllUserTags: any = await api.queryDatabase(USER_QUERY.GET_TAGS);

    // Display user information in the UI

    // Display the username in the UI
    if (usernameUser) {
        usernameUser.innerHTML = retrievedUser.username;
    }

    // Display the formatted date of birth in the UI
    if (birthdayUser) {
        birthdayUser.innerHTML = retrievedUser.dateOfBirth.replace("T", "  ").replace("00:00", "").slice(0, -8);
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

    // Event listeners for UI buttons

    // Event listener for the "Edit" button
    if (editBtn) {
        editBtn.addEventListener("click", (): void => {
        // Enable input fields and buttons for editing
            disabled.forEach(element => {
                element?.removeAttribute("disabled");
            });
            // Hide the "Edit" button, show the "Save" and "Discard" buttons
            editBtn?.classList.add("hidden");
            saveBtn?.classList.remove("hidden");
            discardBtn?.classList.remove("hidden");
        });
    }

    // Event listener for the "Discard" button
    if (discardBtn) {
        discardBtn.addEventListener("click", (): void => {
        // Disable input fields and buttons, and reset the UI
            disabled.forEach(element => {
                element?.setAttribute("disabled", "");
            });
            // Show the "Edit" button, hide the "Save" and "Discard" buttons
            editBtn?.classList.remove("hidden");
            saveBtn?.classList.add("hidden");
            discardBtn?.classList.add("hidden");
        });
    }

    // Event listener for the "User Profile" button
    if (userProfileBtn) {
        userProfileBtn.addEventListener("click", (): void => {
        // Show the public profile section and hide the edit profile section if visible
            publicProfileSection?.classList.remove("hidden");
            if (editProfileSection?.classList.contains("hidden")) {
                return;
            } else {
                editProfileSection?.classList.add("hidden");
            }
        });
    }

    // Event listener for the "User Settings" button
    if (userSettingsBtn) {
        userSettingsBtn.addEventListener("click", (): void => {
        // Show the edit profile section and hide the public profile section if visible
            editProfileSection?.classList.remove("hidden");
            if (publicProfileSection?.classList.contains("hidden")) {
                return;
            } else {
                publicProfileSection?.classList.add("hidden");
            }
        });
    }

    // Event listener for the "Edit Password" button
    if (editPasswordBtn) {
        editPasswordBtn.addEventListener("click", (): void => {
            console.log("click");
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
        // Gather password inputs for validation
            const passwordInputs: (HTMLInputElement | null)[] = [newPasswordInput, confirmPasswordInput];

            // TODO: Implement password comparison logic

            // Check if any password inputs are empty
            const emptyPasswordInputs: any = await checkPasswordValue(passwordInputs);
            if (!emptyPasswordInputs) return;

            // Validate the new password format
            const verifiedNewPassword: boolean = await verifyNewPassword(newPasswordInput);
            if (!verifiedNewPassword) return;

            // Validate the confirmation password
            const verifiedConfirmPassword: boolean = await verifyConfirmPassword(confirmPasswordInput, newPasswordInput);
            if (!verifiedConfirmPassword) return;

            // If all validations pass, update the password
            if (emptyPasswordInputs && verifiedNewPassword && verifiedConfirmPassword) {
                try {
                    const updatedPassword: any = await updatePasswordData(loginStatus.userId, confirmPasswordInput!.value);
                    // Hide the password section and show the edit profile section
                    passwordSection?.classList.add("hidden");
                    editProfileSection?.classList.remove("hidden");
                    console.log(updatedPassword);
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }

    // Event listener for the "Save" button in the editProfileSection
    if (saveBtn) {
        saveBtn.addEventListener("click", async (): Promise<void> => {
        // const inputs: (HTMLInputElement | HTMLSelectElement | null)[] = [usernameInput, birthdayInput, programmingExperienceInput, emailInput, expertiseOptions, firstnameInput, lastnameInput];
        // const verifiedInputs: any = checkValue(inputs);

            // Retrieve the tag ID for the selected expertise
            // const getTagIdExpertise: number = await retrieveTagId(expertiseOptions?.value);

            let questionTags: any[] = [];

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

            questionTags.forEach(questionTag => {
                console.log(questionTag);
            });

            // Validate email, firstname, and lastname
            const verifiedEmail: boolean = await verifyEmail(emailInput);
            if (!verifiedEmail) return;
            const verifiedFirstname: boolean = await verifyFirstname(firstnameInput);
            if (!verifiedFirstname) return;
            const verifiedLastname: boolean = await verifyLastname(lastnameInput);
            if (!verifiedLastname) return;

            // If all validations pass, update user data
            if (verifiedEmail && verifiedFirstname && verifiedLastname) {
                try {
                    const updatedUser: any = await updateUserData(
                    usernameInput!.value,
                    birthdayInput?.value,
                    programmingExperienceInput?.value,
                    emailInput?.value,
                    questionTags,
                    firstnameInput?.value,
                    lastnameInput?.value,
                    loginStatus.userId
                    );

                    console.log(updatedUser);

                } catch (error) {
                    console.error(error);
                }
            }
        });
    }

    async function retrieveTagId(tagName: string | undefined): Promise<any> {
        return await api.queryDatabase(USER_QUERY.GET_TAG, tagName);
    }

    /**
 * Validates the email field and sets a custom validation message if needed.
 *
 * @param email - The email input field
 * @returns {boolean} - True if the email is valid, false otherwise
 */
    async function verifyEmail(email: any): Promise<boolean> {
        if (email.value.match(emailRegEx)) {
            console.log("Validation: Email format is not correct!");
            return false;
        } else {
            return true;
        }
    }

    // Validates the firstname field against the nameRegEx pattern
    async function verifyFirstname(firstname: any): Promise<boolean> {
        if (!firstname.value.match(nameRegEx)) {
            console.log("Validation: " + firstname.name + " format is not correct!");
            return false;
        } else {
            return true;
        }
    }

    // Validates the lastname field against the nameRegEx pattern
    async function verifyLastname(lastname: any): Promise<boolean> {
        if (!lastname.value.match(nameRegEx)) {
            console.log("Validation: " + lastname.name + " format is not correct!");
            return false;
        } else {
            return true;
        }
    }

    // Password validation functions

    // Check if any of the password input fields are empty
    async function checkPasswordValue(inputs: (HTMLInputElement | null)[]): Promise<boolean> {
        let valid: boolean = true;

        inputs.forEach(inputPassword => {
            if (inputPassword && inputPassword.value === "") {
                console.log("Validation: " + inputPassword.name + " is empty!");
                valid = false;
            }
        });

        return valid;
    }

    // Validates the new password against the passwordRegEx pattern
    async function verifyNewPassword(password: any): Promise<boolean> {
        if (password.value.match(passwordRegEx)) {
        // Display error message and hide after 5 seconds
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
        async function verifyConfirmPassword(password: any, newPassword: any): Promise<boolean> {
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
                console.log("Validation: Password matches!");
                return true;
            }
        }

        // Updates user data in the database
        async function updateUserData(username: string, dateOfBirth: any, programmingExperience: any, email: string | undefined, tagIds: any[], firstname: string | undefined, lastname: string | undefined, userId: number): Promise<void> {
            const arrayUserData: (string | number | Date | null)[] = [firstname, lastname, dateOfBirth, username, programmingExperience, email, userId];
            console.log("Updating user data with: ", arrayUserData);

            // Update user data in the database
            // const userDatabase: Promise<any> = api.queryDatabase(USER_QUERY.UPDATE_USER, ...arrayUserData);

            // Update user tags in the database
            tagIds.forEach(tagId => {
                const userTagDatabase: Promise<any> = api.queryDatabase(USER_QUERY.CREATE_USER_TAG, userId, tagId);
                console.log("Updating user tags with: ", userTagDatabase);
            });

            console.log("User data updated successfully in the database.");
            return;
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
}

await setup();