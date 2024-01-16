import "./config";
// import { User } from "./models/user";
// import { api } from "@hboictcloud/api";
// import { USER_QUERY } from "./query/user.query";

async function setup(): Promise<void> {
    const userProfileBtn: HTMLButtonElement | null = document.querySelector("#userProfileBtn");
    const userSettingsBtn: HTMLButtonElement | null = document.querySelector("#userSettingsBtn");
    const publicProfileSection: HTMLElement | null = document.querySelector(".publicProfileSection");
    const editProfileSection: HTMLElement | null = document.querySelector(".editProfileSection");
    const passwordSection: HTMLElement | null = document.querySelector(".passwordSection");

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
            const verifiedPasswordInputs: any = checkPasswordValue(passwordInputs);

            const verifiedNewPassword: boolean = await verifyNewPassword(newPasswordInput);
            const verifiedConfirmPassword: boolean = await verifyConfirmPassword(confirmPasswordInput);



        });
    }

    if (saveBtn) {
        saveBtn.addEventListener("click", async (): Promise<void> => {
            const inputs: (HTMLInputElement | null)[] = [usernameInput, emailInput, firstnameInput, lastnameInput];

            const verifiedInputs: any  = checkValue(inputs);

            const verifiedEmail: boolean = await verifyEmail(emailInput);
            const verifiedFirstname: boolean = await verifyFirstname(firstnameInput);
            const verifiedLastname: boolean = await verifyLastname(lastnameInput);

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
    async function verifyEmail(email: any): Promise<boolean | any> {
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
    async function checkPasswordValue(inputs:(HTMLInputElement | null)[]): Promise<void> {
        inputs.forEach(inputPassword => {
            if (inputPassword && inputPassword.value === "") {
                console.log("Data is missing at the field " + inputPassword.name);
                return;
            }
        }); 
    }

    async function verifyNewPassword(password: any): Promise<boolean> {
        if (password.value.match(passwordRegEx)) {
            console.log("Your password needs a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.");
            return false;
        } else {
            return true;
        }
    }

    async function verifyConfirmPassword(password:any): Promise<boolean> {
        if (!password.value.match(newPasswordInput)) {
            console.log("Password does not match!");
            return false;
        } else {
            console.log("Password matches!");
            return true;
        }
    }


}

await setup();