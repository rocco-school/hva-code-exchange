export class QuestionTag {
    private _questionId: number;
    private _tagId: number;

    public constructor(questionId: number, tagId: number) {
        this._questionId = questionId;
        this._tagId = tagId;
    }

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
        return `QuestionTag: ${this._questionId} ${this._tagId}`;
    }
}