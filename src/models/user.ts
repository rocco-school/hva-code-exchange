import {UserService} from "../services/userService";
import {AnswerService} from "../services/answerService";
import {QuestionService} from "../services/questionService";
import {CodingTag} from "./codingTag";

export class User {
    // private fields
    private _userId: number;
    private _firstname: string;
    private _lastname: string;
    private _dateOfBirth: string;
    private _username: string;
    private _experienceYears: number;
    private _profilePicture: string | null;
    private _password: string;
    private _email: string;
    private _createdAt: Date | null;
    private _updatedAt: Date | null;

    // The constructor is called once when the class is instantiated.
    // This constructor fills the fields when creating an object.
    public constructor(userId: number, firstname: string, lastname: string, dateOfBirth: string, username: string, experienceYears: number, profilePicture: string | null, password: string, email: string, createdAt: Date | null, updatedAt: Date | null) {
        this._userId = userId;
        this._firstname = firstname;
        this._lastname = lastname;
        this._dateOfBirth = dateOfBirth;
        this._username = username;
        this._experienceYears = experienceYears;
        this._profilePicture = profilePicture;
        this._password = password;
        this._email = email;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
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

    public get dateOfBirth(): string {
        return this._dateOfBirth;
    }

    public get username(): string {
        return this._username;
    }

    public get experienceYears(): number {
        return this._experienceYears;
    }

    public get profilePicture(): string | null {
        return this._profilePicture;
    }

    public get password(): string {
        return this._password;
    }

    public get email(): string {
        return this._email;
    }

    public get createdAt(): Date | null {
        return this._createdAt;
    }

    public get updatedAt(): Date | null {
        return this._updatedAt;
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

    public set dateOfBirth(value: string) {
        this._dateOfBirth = value;
    }

    public set username(value: string) {
        this._username = value;
    }

    public set experienceYears(value: number) {
        this._experienceYears = value;
    }

    public set profilePicture(value: string | null) {
        this._profilePicture = value;
    }

    public set password(value: string) {
        this._password = value;
    }

    public set email(value: string) {
        this._email = value;
    }

    public set createdAt(value: Date | null) {
        this._createdAt = value;
    }

    public set updatedAt(value: Date | null) {
        this._updatedAt = value;
    }

    public toString(): string {
        return `User: ${this._userId} ${this._username} ${this._experienceYears} ${this._password} ${this._email} ${this._firstname} ${this._lastname} ${this._dateOfBirth} ${this._createdAt} ${this._updatedAt}`;
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


    /**
     * Retrieves user tags for a given user ID using the UserService.
     *
     * @param {number} userId - The ID of the user to retrieve tags for.
     * @returns {Promise<User | string>} A Promise resolving to either the user tags or an error message.
     * @throws {Error} Throws an error if the retrieval operation fails.
     *
     * @description
     * This static method leverages the UserService to retrieve tags for a specific user from the database.
     * It handles the retrieval operation asynchronously and returns a Promise that resolves to either
     * the user tags or an error message if the retrieval fails.
     *
     * @example
     * // Example: Retrieve user tags by user ID
     * try {
     *   const userTags = await User.getUserTags(userId);
     *   console.log('User tags:', userTags);
     * } catch (error) {
     *   console.error('Failed to retrieve user tags:', error.message);
     * }
     */
    public static async getUserTags(userId: number): Promise<any[] | string> {
        try {
            // Calling the retrieveUserTags method from the service.
            return await UserService.retrieveUserTags(userId);
        } catch (error) {
            // Handling any errors that occur during the process.
            return `Error retrieving user tags: ${error}`;
        }
    }


    /**
     * Inserts tags for a given user into the database using the UserService.
     *
     * @param {number} userId - The ID of the user to associate with the tags.
     * @param {number[]} tagIds - An array of tag IDs to associate with the user.
     * @returns {Promise<boolean | string>} A Promise resolving to either the insertion status or an error message.
     * @throws {Error} Throws an error if the insertion operation fails.
     *
     * @description
     * This static method leverages the UserService to insert tags for a specific user into the database.
     * It handles the insertion operation asynchronously and returns a Promise that resolves to either
     * the insertion status (true if successful) or an error message if the insertion fails.
     *
     * @example
     * // Example: Insert tags for a user
     * try {
     *   const userTags: number[] = [1, 2, 3]; // tag IDs.
     *   const insertStatus = await User.insertUserTag(userId, userTags);
     *   if (insertStatus) {
     *     console.log('User tags inserted successfully.');
     *   } else {
     *     console.log('Failed to insert user tags.');
     *   }
     * } catch (error) {
     *   console.error('Error inserting user tags:', error.message);
     * }
     */
    public static async insertUserTag(userId: number, tagIds: number[]): Promise<boolean | string> {
        try {
            // Call the insertUserTag method from the UserService.
            return await UserService.insertUserTag(userId, tagIds);
        } catch (error) {
            // Handle any errors that occur during the process.
            return `Error inserting user tags: ${error}`;
        }
    }
}


