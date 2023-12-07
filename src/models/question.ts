export class Question {
    // private fields
    private _question_id: number;
    private _user_id: number;
    private _title: string;
    private _body: string;
    private _is_closed: boolean;
    private _created_at: Date;
    private _updated_at: Date;

    // De constructor wordt eenmalig aangeroepen als de class wordt geïnstantieerd.
    // Deze constructor vult de fields bij het aanmaken van een object.
    public constructor(questionId: number, userId: number, title: string, body: string, isClosed: boolean, createdAt: Date, updatedAt: Date) {
        this._question_id = questionId;
        this._user_id = userId;
        this._title = title;
        this._body = body;
        this._is_closed = isClosed;
        this._created_at = createdAt;
        this._updated_at = updatedAt;
    }

    // Getters en setters
    public get questionId(): number {
        return this._question_id;
    }

    public get userId(): number {
        return this._user_id;
    }

    public get title(): string {
        return this._title;
    }

    public get body(): string {
        return this._body;
    }

    public get isClosed(): boolean {
        return this._is_closed;
    }

    public get createdAt(): Date {
        return this._created_at;
    }

    public get updatedAt(): Date {
        return this._updated_at;
    }

    public set questionId(value: number) {
        this._question_id = value;
    }

    public set userId(value: number) {
        this._user_id = value;
    }

    public set title(value: string) {
        this._title = value;
    }

    public set body(value: string) {
        this._body = value;
    }

    public set isClosed(value: boolean) {
        this._is_closed = value;
    }

    public set createdAt(value: Date) {
        this._created_at = value;
    }

    public set updatedAt(value: Date) {
        this._updated_at = value;
    }

    public toString(): string {
        return `User: ${this._question_id} ${this._user_id} ${this._title} ${this._body} ${this._is_closed} ${this._created_at} ${this._updated_at}`;
    }
}
