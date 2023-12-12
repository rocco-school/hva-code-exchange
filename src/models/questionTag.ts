export class QuestionTag {
    // private fields
    private _questionId: number;
    private _tagId: number;

    // The constructor is called once when the class is instantiated.
    // This constructor fills the fields when creating an object.
    public constructor(questionId: number, tagId: number) {
        this._questionId = questionId;
        this._tagId = tagId;
    }


    // Getters en setters
    public get questionId(): number {
        return this._questionId;
    }

    public get tagId(): number {
        return this._tagId;
    }

    public set questionId(value: number) {
        this._questionId = value;
    }

    public set tagId(value: number) {
        this._tagId = value;
    }

    public toString(): string {
        return `CodingTag: ${this._questionId} ${this._tagId}`;
    }
}
