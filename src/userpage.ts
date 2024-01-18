import {hashPassword} from "./components/hashPassword";
import "./config";
import {api} from "@hboictcloud/api";
import {USER_QUERY} from "./query/user.query";
import {JWTPayload} from "jose";
import {security} from "./components/security";
import {User} from "./models/user";
import {initializeTagSelect} from "./components/initializeSelect";
import {handleButtonClick} from "./components/customSelect";
import {binaryDataToImage, imageToBinaryData} from "./components/handleProfilePicture";

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


    const file: HTMLInputElement = document.querySelector("#file") as HTMLInputElement;
    const profilePicture: HTMLImageElement = document.querySelector(".profile-picture") as HTMLImageElement;

    file.addEventListener("input", function (evt) {
        const uploadedImage: HTMLInputElement = this as HTMLInputElement;

        const selectedFile: any = uploadedImage.files![0];

        console.log(selectedFile);

        const fileReader: FileReader = new FileReader();

        fileReader.onload = async function (): Promise<void> {
            const dataUrl: any = fileReader.result;

            // Create an image element
            const image: HTMLImageElement = new Image();

            image.onload = async function (): Promise<void> {
                try {
                    const binaryData: Uint8Array = await imageToBinaryData(image);
                    console.log("Binary Data:", binaryData);

                    // Create an image element from binary data
                    const imageElementFromBinary: HTMLImageElement = await binaryDataToImage(binaryData, selectedFile.type);

                    console.log("Binary data converted to image:", imageElementFromBinary);


                    // Set the image as the source for profilePicture
                    profilePicture.src = URL.createObjectURL(
                        new Blob([binaryData.buffer], { type: selectedFile.type } /* (1) */)
                    );

                } catch (error) {
                    console.error("Error fetching or displaying image:", error);
                }

            };

            // Set the source of the image directly from the data URL
            image.src = dataUrl;
        };

        // Read the file as a data URL
        fileReader.readAsDataURL(selectedFile);
    });

// Function to read the image file and convert it to a Buffer
    function convertImageToBuffer(imagePath) {
        try {
            return fs.readFileSync(imagePath);
        } catch (error) {
            console.error('Error reading the image file:', error);
            return null;
        }
    }

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
    const nameRegEx: RegExp = /^[a-zA-Z\s]+$/;

    const retrievedUser: any = await User.retrieveUser(loginStatus.userId);
    const retrievedUserTags: any = await User.getUserTags(loginStatus.userId);
    const retrievedAllUserTags: any = await api.queryDatabase(USER_QUERY.GET_TAGS);

    // Display user information in the UI
    if (usernameUser) {
        usernameUser.innerHTML = retrievedUser.username;
    }

    if (birthdayUser) {
        birthdayUser.innerHTML = retrievedUser.dateOfBirth.replace("T", "  ").replace("00:00", "").slice(0, -8);
    }

    if (yearsOfExperienceUser) {
        yearsOfExperienceUser.innerHTML = retrievedUser.experienceYears + " years of programming experience";
    }

    // Display user tags in the UI
    if (profileExpertise) {
        retrievedUserTags.forEach((userTag: any) => {
            const liContent: HTMLLIElement = profileExpertise.appendChild(document.createElement("li"));
            liContent.innerHTML = userTag.tagName;
        });
    }

    // Event listeners for UI buttons
    if (editBtn) {
        editBtn.addEventListener("click", (): void => {
            disabled.forEach(element => {
                element?.removeAttribute("disabled");
            });
            editBtn?.classList.add("hidden");
            saveBtn?.classList.remove("hidden");
            discardBtn?.classList.remove("hidden");
        });
    }

    if (discardBtn) {
        discardBtn.addEventListener("click", (): void => {
            disabled.forEach(element => {
                element?.setAttribute("disabled", "");
            });
            editBtn?.classList.remove("hidden");
            saveBtn?.classList.add("hidden");
            discardBtn?.classList.add("hidden");
        });
    }

    if (userProfileBtn) {
        userProfileBtn.addEventListener("click", (): void => {
            publicProfileSection?.classList.remove("hidden");
            if (editProfileSection?.classList.contains("hidden")) {
                return;
            } else {
                editProfileSection?.classList.add("hidden");
            }
        });
    }

    if (userSettingsBtn) {
        userSettingsBtn.addEventListener("click", (): void => {
            editProfileSection?.classList.remove("hidden");
            if (publicProfileSection?.classList.contains("hidden")) {
                return;
            } else {
                publicProfileSection?.classList.add("hidden");
            }
        });
    }

    if (editPasswordBtn) {
        editPasswordBtn.addEventListener("click", (): void => {
            console.log("click");
            passwordSection?.classList.remove("hidden");
            if (editProfileSection?.classList.contains("hidden")) {
                return;
            } else {
                editProfileSection?.classList.add("hidden");
            }
        });
    }

    if (passwordCloseBtn) {
        passwordCloseBtn.addEventListener("click", (): void => {
            passwordSection?.classList.add("hidden");
            editProfileSection?.classList.remove("hidden");
        });
    }

    // editProfileSection
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener("click", async (): Promise<void> => {
            const passwordInputs: (HTMLInputElement | null)[] = [newPasswordInput, confirmPasswordInput];

            // TODO password comparison
            const emptyPasswordInputs: any = await checkPasswordValue(passwordInputs);
            if (!emptyPasswordInputs) return;
            const verifiedNewPassword: boolean = await verifyNewPassword(newPasswordInput);
            if (!verifiedNewPassword) return;
            const verifiedConfirmPassword: boolean = await verifyConfirmPassword(confirmPasswordInput, newPasswordInput);
            if (!verifiedConfirmPassword) return;

            if (emptyPasswordInputs && verifiedNewPassword && verifiedConfirmPassword) {
                try {
                    const updatedPassword: any = await updatePasswordData(loginStatus.userId, confirmPasswordInput!.value);
                    passwordSection?.classList.add("hidden");
                    editProfileSection?.classList.remove("hidden");
                    console.log(updatedPassword);
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener("click", async (): Promise<void> => {
            // const inputs: (HTMLInputElement | HTMLSelectElement | null)[] = [usernameInput, birthdayInput, programmingExperienceInput, emailInput, expertiseOptions, firstnameInput, lastnameInput];
            // const verifiedInputs: any = checkValue(inputs);
            const getTagIdExpertise: number = await retrieveTagId(expertiseOptions?.value);

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

            const verifiedEmail: boolean = await verifyEmail(emailInput);
            if (!verifiedEmail) return;
            const verifiedFirstname: boolean = await verifyFirstname(firstnameInput);
            if (!verifiedFirstname) return;
            const verifiedLastname: boolean = await verifyLastname(lastnameInput);
            if (!verifiedLastname) return;

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
     * @param email
     */
    async function verifyEmail(email: any): Promise<boolean> {
        if (email.value.match(emailRegEx)) {
            console.log(email.name + " format is not correct!");
            // Returns the alertPopUp function and with the assigned data
            return false;
        } else {
            return true;
        }
    }

    async function verifyFirstname(firstname: any): Promise<boolean> {
        if (!firstname.value.match(nameRegEx)) {
            console.log(firstname.name + " format is not correct!");
            return false;
        } else {
            return true;
        }
    }

    async function verifyLastname(lastname: any): Promise<boolean> {
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

    async function verifyNewPassword(password: any): Promise<boolean> {
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
}

await setup();