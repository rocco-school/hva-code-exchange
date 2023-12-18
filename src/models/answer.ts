// Class representing an answer to a question
export class Answer {
    // Private properties to store answer details
    private _answerId: number;
    private _questionId: number;
    private _userId: number;
    private _answerBody: string;
    private _createdAt: Date;
    private _updatedAt: Date;

    // Constructor to initialize the answer object with provided values
    public constructor(answerId: number, questionId: number, userId: number, answerBody: string, createdAt: Date, updatedAt: Date) {
        this._answerId = answerId;
        this._questionId = questionId;
        this._userId = userId;
        this._answerBody = answerBody;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // Getters for modifying private fields
    public get answerId(): number {
        return this._answerId;
    }

    public get questionId(): number {
        return this._questionId;
    }
    
    public get userId(): number {
        return this._userId;
    }
    
    public get answerBody(): string {
        return this._answerBody;
    }
    
    public get createdAt(): Date {
        return this._createdAt;
    }
    
    public get updatedAt(): Date {
        return this._updatedAt;
    }

    // Setters for modifying private fields
    public set answerId(value: number) {
        this._answerId = value;
    }

    public set questionId(value: number) {
        this._questionId = value;
    }
    
    public set userId(value: number) {
        this._userId = value;
    }

    public set answerBody(value: string) {
        this._answerBody = value;
    }

    public set createdAt(value: Date) {
        this._createdAt = value;
    }

    public set updatedAt(value: Date) {
        this._updatedAt = value;
    }

    // Method to convert the answer object to a string representation
    public toString(): string {
        return `Answer: ${this._answerId} ${this._questionId} ${this._userId} ${this._answerBody} ${this._createdAt} ${this._updatedAt}`;
    }
}

