import {UserService} from "../services/userService";
import {AnswerService} from "../services/answerService";
import {QuestionService} from "../services/questionService";
import {CodingTag} from "./codingTag";

export class User {
    // private fields
    private _userId: number;
    private _firstname: string;
    private _lastname: string;
    private _dateOfBirth: Date;
    private _username: string;
    private _experienceYears: number;
    private _profilePicture: Blob;
    private _password: string;
    private _email: string;

    // The constructor is called once when the class is instantiated.
    // This constructor fills the fields when creating an object.
    public constructor(userId: number, firstname: string, lastname: string, dateOfBirth: Date, username: string, experienceYears: number, profilePicture: Blob, password: string, email: string) {
        this._userId = userId;
        this._firstname = firstname;
        this._lastname = lastname;
        this._dateOfBirth = dateOfBirth;
        this._username = username;
        this._experienceYears = experienceYears;
        this._profilePicture = profilePicture;
        this._password = password;
        this._email = email;
    }

    // Getters en setters
    public get userId(): number {
        return this._userId;
    }

    public get firstname(): string {
        return this._firstname;
    }

    public get lastname(): string {
        return this._lastname;
    }

    public get dateOfBirth(): Date {
        return this._dateOfBirth;
    }

    public get username(): string {
        return this._username;
    }

    public get experienceYears(): number {
        return this._experienceYears;
    }

    public get profilePicture(): Blob {
        return this._profilePicture;
    }

    public get password(): string {
        return this._password;
    }

    public get email(): string {
        return this._email;
    }


    public set userId(value: number) {
        this._userId = value;
    }

    public set firstname(value: string) {
        this._firstname = value;
    }

    public set lastname(value: string) {
        this._lastname = value;
    }

    public set dateOfBirth(value: Date) {
        this._dateOfBirth = value;
    }

    public set username(value: string) {
        this._username = value;
    }

    public set experienceYears(value: number) {
        this._experienceYears = value;
    }

    public set profilePicture(value: Blob) {
        this._profilePicture = value;
    }

    public set password(value: string) {
        this._password = value;
    }

    public set email(value: string) {
        this._email = value;
    }


    public toString(): string {
        return `User: ${this._userId} ${this._firstname} ${this._lastname} ${this._dateOfBirth} ${this._username} ${this._experienceYears} ${this._profilePicture} ${this._password} ${this._email} `;
    }


    /**
     * Saves the user to the database using the service.
     *
     * @returns {Promise<User | string>} A Promise resolving to either the saved user or an error message.
     * @throws {Error} Throws an error if the save operation fails.
     *
     * @description
     * This method leverages the UserService to save the current instance of the user to the database.
     * It handles the save operation asynchronously and returns a Promise that resolves to the saved user
     * or an error message if the save fails.
     *
     * @example
     * const newUser: User = new User(
     *   null, // userId is null for a new User(auto_increment in the database)
     *   'firstname',
     *   'lastname',
     *   'username',
     *   'hashedPassword',
     *   'email'
     * );
     *
     * try {
     *   const savedUser = await newUser.saveUser();
     *   console.log('User saved successfully:', savedUser);
     * } catch (error) {
     *   console.error('Failed to save user:', error.message);
     * }
     */
    public async saveUser(): Promise<User | string> {
        try {
            // Calling the saveUser method from the service
            return await UserService.saveUser(this);
        } catch (error) {
            // Handling any errors that occur during the process
            return `Error saving user: ${error}`;
        }
    }

    /**
     * Updates the user in the database using the service.
     *
     * @returns {Promise<User | string>} A Promise resolving to either the updated user or an error message.
     * @throws {Error} Throws an error if the update operation fails.
     *
     * @description
     * This method leverages the UserService to update the current instance of the user in the database.
     * It handles the update operation asynchronously and returns a Promise that resolves to the updated user
     * or an error message if the update fails.
     *
     * @example
     * const UserToUpdate: User = new User(
     *   userId
     *   firstname,
     *   lastname,
     *   username,
     *   hashedPassword,
     *   email,
     * );
     *
     * try {
     *   const updatedUser = await UserToUpdate.updateUser();
     *   console.log('User updated successfully:', updatedUser);
     * } catch (error) {
     *   console.error('Failed to update user:', error.message);
     * }
     */
    public async updateUser(): Promise<User | string> {
        try {
            // Calling the updateUser method from the service.
            return await UserService.updateUser(this);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error updating user: ${error}`;
        }
    }

    /**
     * Retrieves a user from the database using the service.
     *
     * @param {number} userId - The ID of the user to retrieve.
     * @returns {Promise<User | string>} A Promise resolving to either the retrieved user or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     *
     * @description
     * This static method leverages the UserService to retrieve a specific user from the database.
     * It handles the retrieval operation asynchronously and returns a Promise that resolves to either
     * the retrieved user or an error message if the retrieval fails.
     *
     * @example
     * // Example: Retrieve a user by its ID
     * try {
     *   const result = await User.retrieveUser(userId);
     *   console.log('User retrieved successfully:', result);
     * } catch (error) {
     *   console.error('Failed to retrieve user:', error.message);
     * }
     */
    public static async retrieveUser(userId: number): Promise<User | string> {
        try {
            // Calling the retrieveUser method from the service.
            return await UserService.retrieveUser(userId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving user: ${error}`;
        }
    }

    /**
     * Deletes a user from the database using the service.
     *
     * @param {number} userId - The ID of the user to delete.
     * @returns {Promise<boolean | string>} A Promise resolving to either the deletion status or an error message.
     * @throws {Error} Throws an error if the deletion operation fails.
     *
     * @description
     * This static method leverages the UserService to delete a specific user from the database.
     * It handles the deletion operation asynchronously and returns a Promise that resolves to either
     * the deletion status (true if successful, false if the user was not found) or an error message if the deletion fails.
     *
     * @example
     * // Example: Delete a user by its ID
     * try {
     *   const deleteStatus = await User.deleteUser(userId);
     *   if (deleteStatus) {
     *     console.log('User deleted successfully.');
     *   } else {
     *     console.log('User with the specified ID not found.');
     *   }
     * } catch (error) {
     *   console.error('Failed to delete user:', error.message);
     * }
     */
    public static async deleteUser(userId: number): Promise<boolean | string> {
        try {
            // Calling the deleteUser method from the service.
            return await UserService.deleteUser(userId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error deleting user: ${error}`;
        }
    }


    /**
     * Deletes a user from the database using the service.
     *
     * @param {number} userId - The ID of the user to delete.
     * @returns {Promise<boolean | string>} A Promise resolving to either the deletion status or an error message.
     * @throws {Error} Throws an error if the deletion operation fails.
     *
     * @description
     * This static method leverages the UserService to delete a specific user from the database.
     * It handles the deletion operation asynchronously and returns a Promise that resolves to either
     * the deletion status (true if successful, false if the user was not found) or an error message if the deletion fails.
     *
     * @example
     * // Example: Delete a user by its ID
     * try {
     *   const deleteStatus = await User.deleteUser(userId);
     *   if (deleteStatus) {
     *     console.log('User deleted successfully.');
     *   } else {
     *     console.log('User with the specified ID not found.');
     *   }
     * } catch (error) {
     *   console.error('Failed to delete user:', error.message);
     * }
     */
    public static async getTotalAnswers(userId: number): Promise<number | string> {
        try {
            // Calling the deleteUser method from the service.
            return await AnswerService.getAnswersCountByUser(userId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error deleting user: ${error}`;
        }
    }


    /**
     * Deletes a user from the database using the service.
     *
     * @param {number} userId - The ID of the user to delete.
     * @returns {Promise<boolean | string>} A Promise resolving to either the deletion status or an error message.
     * @throws {Error} Throws an error if the deletion operation fails.
     *
     * @description
     * This static method leverages the UserService to delete a specific user from the database.
     * It handles the deletion operation asynchronously and returns a Promise that resolves to either
     * the deletion status (true if successful, false if the user was not found) or an error message if the deletion fails.
     *
     * @example
     * // Example: Delete a user by its ID
     * try {
     *   const deleteStatus = await User.deleteUser(userId);
     *   if (deleteStatus) {
     *     console.log('User deleted successfully.');
     *   } else {
     *     console.log('User with the specified ID not found.');
     *   }
     * } catch (error) {
     *   console.error('Failed to delete user:', error.message);
     * }
     */
    public static async getTotalQuestions(userId: number): Promise<number | string> {
        try {
            // Calling the deleteUser method from the service.
            return await QuestionService.getQuestionsCountByUser(userId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error deleting user: ${error}`;
        }
    }

    /**
     * Retrieves the expertises of a user from the database using the UserService.
     *
     * @param {number} userId - The ID of the user to retrieve expertises for.
     * @returns {Promise<[CodingTag] | string>} A Promise resolving to either the user's expertises or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     *
     * @description
     * This static method leverages the UserService to retrieve the expertises of a specific user from the database.
     * It handles the retrieval operation asynchronously and returns a Promise that resolves to either
     * the user's expertises (an array of CodingTag) or an error message if the retrieval fails.
     *
     * @example
     * // Example: Retrieve user expertises by user ID
     * try {
     *   const userExpertises = await User.getUserExpertises(userId);
     *   if (Array.isArray(userExpertises)) {
     *     console.log('User expertises retrieved successfully:', userExpertises);
     *   } else {
     *     console.error('Failed to retrieve user expertises:', userExpertises);
     *   }
     * } catch (error) {
     *   console.error('Failed to retrieve user expertises:', error.message);
     * }
     */
    public static async getUserExpertises(userId: number): Promise<[CodingTag] | string> {
        try {
            // Calling the getUserExpertises method from the service.
            return await UserService.getUserExpertises(userId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving user expertises: ${error}`;
        }
    }
}


