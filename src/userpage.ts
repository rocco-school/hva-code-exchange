import { hashPassword } from "./components/hashPassword";
import "./config";
import { api } from "@hboictcloud/api";
import { USER_QUERY } from "./query/user.query";
import {JWTPayload} from "jose";
import {security} from "./components/security";

async function setup(): Promise<void> {

    // Check the user login status by calling the 'security' function.
    const loginStatus: JWTPayload | boolean = await security();
    console.log(loginStatus);

    const userProfileBtn: HTMLButtonElement | null = document.querySelector("#userProfileBtn");
    const userSettingsBtn: HTMLButtonElement | null = document.querySelector("#userSettingsBtn");
    const publicProfileSection: HTMLElement | null = document.querySelector(".publicProfileSection");
    const editProfileSection: HTMLElement | null = document.querySelector(".editProfileSection");
    const passwordSection: HTMLElement | null = document.querySelector(".passwordSection");
    const errorPasswordMessageBox: HTMLDivElement | null = document.querySelector("#errorPasswordMessageBox");

    const usernameInput: HTMLInputElement | null = document.querySelector("#usernameInput");
    // const oldPasswordInput: HTMLInputElement | null = document.querySelector("#oldPasswordInput");
    const newPasswordInput: HTMLInputElement | null = document.querySelector("#newPasswordInput");
    const confirmPasswordInput: HTMLInputElement | null = document.querySelector("#confirmPasswordInput");
    const emailInput: HTMLInputElement | null = document.querySelector("#emailInput");
    const firstnameInput: HTMLInputElement | null = document.querySelector("#firstnameInput");
    const lastnameInput: HTMLInputElement | null = document.querySelector("#lastnameInput");

    const editPasswordBtn: HTMLButtonElement | null = document.querySelector("#editPasswordBtn");
    const changePasswordBtn: HTMLButtonElement | null = document.querySelector("#changePasswordBtn");
    const passwordCloseBtn: HTMLButtonElement | null = document.querySelector("#passwordCloseBtn");
    const saveBtn: HTMLButtonElement | null = document.querySelector("#saveBtn");
    const editBtn: HTMLButtonElement | null = document.querySelector("#editBtn");
    const discardBtn: HTMLButtonElement | null = document.querySelector("#discardBtn");

    // Regular Expression for email
    // Needs alphanumerics before the @ which follows with a dot and 2-4 letters
    const emailRegEx: RegExp = /^((?![\w-\.]+@([\w-]+\.)+[\w-]{2,4}).)*$/;

    // Regular Expression for password
    // Minimum ofeight and maximum 60 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegEx: RegExp = /^((?!(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,60}$).)*$/;

    // Regular Expression for firstname and lastname
    // only letters are allowed and numbers are not allowed
    const nameRegEx: RegExp = /^[a-zA-Z\s]+$/;

    const disabled: (HTMLInputElement | HTMLButtonElement | null)[] = [usernameInput, editPasswordBtn, emailInput, firstnameInput, lastnameInput, saveBtn, discardBtn];

    if (editBtn) {
        editBtn.addEventListener("click", (): void => {;
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
        changePasswordBtn.addEventListener("click", async(): Promise<void> => {
            const passwordInputs: (HTMLInputElement | null)[] = [newPasswordInput, confirmPasswordInput];

            // TODO password comparison
            const emptyPasswordInputs: any = await checkPasswordValue(passwordInputs);
            if(!emptyPasswordInputs) return;
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
            const inputs: (HTMLInputElement | null)[] = [usernameInput, emailInput, firstnameInput, lastnameInput];

            const verifiedInputs: any  = checkValue(inputs);
            // if (!verifiedInputs) {
            //     verifiedInputs.value === "NULL";
            // }

            const verifiedEmail: boolean = await verifyEmail(emailInput);
            if(!verifiedEmail) return;
            const verifiedFirstname: boolean = await verifyFirstname(firstnameInput);
            if(!verifiedFirstname) return;
            const verifiedLastname: boolean = await verifyLastname(lastnameInput);
            if(!verifiedLastname) return;

            if(verifiedEmail && verifiedFirstname && verifiedLastname) {
                try {
                    const updatedUserData: any = await updateUserData(
                        usernameInput!.value,
                        emailInput!.value, 
                        firstnameInput!.value, 
                        lastnameInput!.value, 
                        loginStatus.userId
                    );

                    console.log(updateUserData);    

                } catch (error) {
                    console.error(error);
                }
            }
        });
    }

    async function checkValue(inputs:(HTMLInputElement | null)[]): Promise<void> {
        inputs.forEach(input => {
            if (input && input.value === "") {
                console.log("there is no value at " + input.name);
                return;
            }
        }); 
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

    /**
     * Validates the lastname field and sets a custom validation message if needed.
     *
     * @param lastname
     */
    async function verifyLastname(lastname: any): Promise<boolean> {
        if (!lastname.value.match(nameRegEx)) {
            console.log(lastname.name + " format is not correct!");
            return false;
        } else {
            return true;
        }
    }

    // Password
    async function checkPasswordValue(inputs:(HTMLInputElement | null)[]): Promise<boolean> {
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
                errorPasswordMessageBox.innerHTML="Your password needs a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.";
                setTimeout(() => {
                    errorPasswordMessageBox.classList.add("hidden");
                    errorPasswordMessageBox.innerHTML="";
                }, 5000); 
            }
            return false;
        } else {
            return true;
        }
    }

    async function verifyConfirmPassword(password: any, newPassword: any): Promise<boolean> {
        if (!password.value.match(newPassword.value)) {
            errorPasswordMessageBox?.classList.remove("hidden");
            if (errorPasswordMessageBox) {
                errorPasswordMessageBox.innerHTML="Password does not match!";
                setTimeout(() => {
                    errorPasswordMessageBox.classList.add("hidden");
                    errorPasswordMessageBox.innerHTML="";
                }, 5000); 
            }
            return false;
        } else {
            console.log("Password matches!");
            return true;
        }
    }

    async function updateUserData(username: string, email: string, firstname: string, lastname: string, userId: number): Promise<void> {
        const arrayData: (string | number | null)[] = [firstname, lastname, username, email, userId]; 
        console.log(arrayData); 
        const userDatabase: Promise<any> = api.queryDatabase(USER_QUERY.UPDATE_USER, ...arrayData);
        console.log(userDatabase);
        return;
    }

    async function updatePasswordData(userId: number, updatedPassword: string): Promise<any> {
        const hashedPassword: string | null = await hashPassword(updatedPassword);

        if (!hashedPassword) {
            return new Error("Error hashing the password.");
        }

        const passwordDatabase: Promise<any> = api.queryDatabase(USER_QUERY.UPDATE_PASSWORD,
            hashedPassword,
            userId
        );

        console.log(passwordDatabase);
        console.log("SUCCES! WOOHOO!");
        return;
    }


}

await setup();