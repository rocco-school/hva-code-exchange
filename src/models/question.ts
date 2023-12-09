export class Question {
    // private fields
    private _questionId: number;
    private _userId: number;
    private _questionTitle: string;
    private _questionBody: string;
    private _isClosed: boolean;
    private _createdAt: Date;
    private _updatedAt: Date;

    // De constructor wordt eenmalig aangeroepen als de class wordt geïnstantieerd.
    // Deze constructor vult de fields bij het aanmaken van een object.
    public constructor(questionId: number, userId: number, questionTitle: string, questionBody: string, isClosed: boolean, createdAt: Date, updatedAt: Date) {
        this._questionId = questionId;
        this._userId = userId;
        this._questionTitle = questionTitle;
        this._questionBody = questionBody;
        this._isClosed = isClosed;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // Getters en setters
    public get questionId(): number {
        return this._questionId;
    }

    public get userId(): number {
        return this._userId;
    }

    public get questionTitle(): string {
        return this._questionTitle;
    }

    public get questionBody(): string {
        return this._questionBody;
    }

    public get isClosed(): boolean {
        return this._isClosed;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get updatedAt(): Date {
        return this._updatedAt;
    }

    public set questionId(value: number) {
        this._questionId = value;
    }

    public set userId(value: number) {
        this._userId = value;
    }

    public set questionTitle(value: string) {
        this._questionTitle = value;
    }

    public set questionBody(value: string) {
        this._questionBody = value;
    }

    public set isClosed(value: boolean) {
        this._isClosed = value;
    }

    public set createdAt(value: Date) {
        this._createdAt = value;
    }

    public set updatedAt(value: Date) {
        this._updatedAt = value;
    }

    public toString(): string {
        return `User: ${this._questionId} ${this._userId} ${this._questionTitle} ${this._questionBody} ${this._isClosed} ${this._createdAt} ${this._updatedAt}`;
    }
}
