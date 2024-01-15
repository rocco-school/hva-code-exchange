import "./config";
import { User } from "./models/user";
import { USER_QUERY } from "./query/user.query";

async function setup(): Promise<void> {
    const userProfileBtn: HTMLButtonElement | null = document.querySelector("#userProfileBtn");
    const userSettingsBtn: HTMLButtonElement | null = document.querySelector("#userSettingsBtn");
    const publicProfileSection: HTMLElement | null = document.querySelector(".publicProfileSection");
    const editProfileSection: HTMLElement | null = document.querySelector(".editProfileSection");

    const usernameInput: HTMLInputElement | null = document.querySelector("#usernameInput");
    const oldPasswordInput: HTMLInputElement | null = document.querySelector("#oldPasswordInput");
    const newPasswordInput: HTMLInputElement | null = document.querySelector("#newPasswordInput");
    const confirmPasswordInput: HTMLInputElement | null = document.querySelector("#confirmPasswordInput");
    const emailInput: HTMLInputElement | null = document.querySelector("#emailInput");
    const firstnameInput: HTMLInputElement | null = document.querySelector("#firstnameInput");
    const lastnameInput: HTMLInputElement | null = document.querySelector("#lastnameInput");

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

    const inputs: (HTMLInputElement | null)[] = [usernameInput, oldPasswordInput, newPasswordInput, confirmPasswordInput, emailInput, firstnameInput, lastnameInput];

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

    // editProfileSection
    if (saveBtn) {
        saveBtn.addEventListener("click", async () => {

            const verifiedInputs: any  = checkValue(inputs);

            // const verifiedPassword: string | null = await checkValue(passwordInput);
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
            // Returns the alertPopUp function and with the assigned data
            return false;
        } else {
            return true;
        }
    }


}

await setup();