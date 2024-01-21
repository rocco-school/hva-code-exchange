import {comparePasswords, hashPassword} from "./components/hashPassword";
import "./config";
import {api, types, utils} from "@hboictcloud/api";
import {USER_QUERY} from "./query/user.query";
import {JWTPayload} from "jose";
import {security} from "./components/security";
import {User} from "./models/user";
import {initializeTagSelect} from "./components/initializeSelect";
import {handleButtonClick, updateSelectedOptions} from "./components/customSelect";
import {showSuccessMessage} from "./components/successMessage";
import {CodingTag} from "./models/codingTag";
import {createNewUserInstance} from "./components/handleModelInstances";

// Asynchronous setup function
async function setup(): Promise<void> {

    // Check the user login status by calling the 'security' function.
    const loginStatus: JWTPayload | boolean | any = await security();

    // Initialize the tag select component
    await initializeTagSelect();

    // Extract user ID from loginStatus
    const currentUserId: number = loginStatus["userId"];
    console.log(currentUserId);

    await initializeUserSettings(currentUserId);

    // DOM element selections
    const editProfileSection: HTMLElement | null = document.querySelector(".editProfileSection");
    const passwordSection: HTMLElement | null = document.querySelector(".passwordSection");
    const errorPasswordMessageBox: HTMLDivElement | null = document.querySelector("#errorPasswordMessageBox");
    const usernameUser: HTMLDivElement | null = document.querySelector("#usernameUser");
    const memberSince: HTMLDivElement | null = document.querySelector(".memberUser");
    const yearsOfExperienceUser: HTMLDivElement | null = document.querySelector(".yearsOfExperienceUser");
    const profileExpertise: HTMLUListElement | null = document.querySelector(".profileExpertise");

    // Input elements for user details
    const usernameInput: HTMLInputElement | null = document.querySelector("#usernameInput");
    const oldpasswordInput: HTMLInputElement | null = document.querySelector("#oldPasswordInput");
    const newPasswordInput: HTMLInputElement | null = document.querySelector("#newPasswordInput");
    const confirmPasswordInput: HTMLInputElement | null = document.querySelector("#confirmPasswordInput");
    const emailInput: HTMLInputElement | null = document.querySelector("#emailInput");
    const firstnameInput: HTMLInputElement | null = document.querySelector("#firstnameInput");
    const lastnameInput: HTMLInputElement | null = document.querySelector("#lastnameInput");
    const birthdayInput: HTMLInputElement | null = document.querySelector("#birthdayInput");
    const programmingExperienceInput: HTMLInputElement | null = document.querySelector("#programmingExperienceInput");

    // Buttons for user interactions
    const editPasswordBtn: HTMLButtonElement | null = document.querySelector(".editPasswordBtn");
    const changePasswordBtn: HTMLButtonElement | null = document.querySelector(".changePasswordBtn");
    const passwordCloseBtn: HTMLButtonElement | null = document.querySelector(".passwordCloseBtn");
    const saveBtn: HTMLButtonElement | null = document.querySelector("#saveBtn");


    const file: HTMLInputElement = document.querySelector("#file") as HTMLInputElement;
    const profilePicture: HTMLImageElement = document.querySelector(".profile-picture") as HTMLImageElement;

    document.querySelectorAll(".icon-eye").forEach(togglePasswordVisibility);

    document.querySelectorAll(".profile-tab").forEach(item => {
        item.addEventListener("click", handleHeroTab);
    });

    // Regular Expression for firstname and lastname
    // only letters are allowed and numbers are not allowed
    const nameRegEx: RegExp = /^[a-zA-Z\s]+$/;

    const retrievedUser: User = await User.retrieveUser(loginStatus.userId) as User;
    const retrievedUserTags: any = await User.getUserTags(loginStatus.userId);

    const user: User = createNewUserInstance(retrievedUser);

    file.addEventListener("input", async function (): Promise<void> {
        const url: string = "https://quumuuteexaa68-pb2b2324.hbo-ict.cloud/uploads/";

        const fileName: string = user.profilePicture?.split(url)[0];

        if (fileName) {
            await api.deleteFile(fileName);
        }

        const filename: string = file.files![0].name;
        const imageData: types.DataURL = await utils.getDataUrl(file) as types.DataURL;
        user.profilePicture = await api.uploadFile(filename, imageData.url);

        await user.updateUser();

        await showSuccessMessage("Successfully added profile picture!", 2000, "success", null, null);
        location.reload();
    });


    if (profilePicture) {
        profilePicture.src = user.profilePicture ? user.profilePicture : `https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=random`;
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
            let noErrors: boolean = true;

            // Gather password inputs for validation
            const passwordInputs: (HTMLInputElement | null)[] = [oldpasswordInput, newPasswordInput, confirmPasswordInput];

            if (!oldpasswordInput) return;
            const checkPassword: boolean = await comparePasswords(oldpasswordInput?.value, user.password);
            const emptyPasswordInputs: any = await checkPasswordValue(passwordInputs);
            const verifiedNewPassword: boolean = await verifyNewPassword(newPasswordInput, errorPasswordMessageBox!);
            const verifiedConfirmPassword: boolean = await verifyConfirmPassword(confirmPasswordInput, newPasswordInput, errorPasswordMessageBox!);

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
            const verifiedFirstname: boolean = await verifyFirstname(firstnameInput, nameRegEx);
            if (!verifiedFirstname) return;
            const verifiedLastname: boolean = await verifyLastname(lastnameInput, nameRegEx);
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

}

await setup();


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

// Updates user data in the database
async function updateUserData(username: string, dateOfBirth: any, programmingExperience: any, email: string | undefined, tagIds: any[], firstname: string | undefined, lastname: string | undefined, userId: number): Promise<void> {
    const arrayUserData: any[] = [firstname, lastname, dateOfBirth, username, programmingExperience, email, userId];
    console.log(arrayUserData);

    // Update user data in the database
    const userDatabase: Promise<any> = api.queryDatabase(USER_QUERY.UPDATE_USER, ...arrayUserData);

    // Update user tags in the database
    tagIds.forEach(tagId => {
        const params: any[] = [userId, tagId];
        const userTagDatabase: Promise<any> = api.queryDatabase(USER_QUERY.CREATE_USER_TAG, ...params);
        console.log(userTagDatabase);
    });

    console.log(userDatabase);
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
            birthdayInput.value = user.dateOfBirth.toString();
        }

        if (emailInput && user.email) {
            emailInput.value = user.email;
        }

        if (firstnameInput && user.firstname) {
            firstnameInput.value = user.firstname;
        }

        if (lastnameInput && user.lastname) {
            lastnameInput.value = user.lastname;
        }

    } catch (error) {
        // Handle errors, e.g., log or display an error message
        console.error("Error initializing user settings:", error);
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