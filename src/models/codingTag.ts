export class CodingTag {
    // private fields
    private _tagId: number;
    private _tagName: string;
    private _tagDescription: string;

    // The constructor is called once when the class is instantiated.
    // This constructor fills the fields when creating an object.
    public constructor(tagId: number, tagName: string, tagDescription: string) {
        this._tagId = tagId;
        this._tagName = tagName;
        this._tagDescription = tagDescription;
    }

    // Getters en setters
    public get tagId(): number {
        return this._tagId;
    }

    public get tagName(): string {
        return this._tagName;
    }

    public get tagDescription(): string {
        return this._tagDescription;
    }

    public set tagId(value: number) {
        this._tagId = value;
    }

    public set tagName(value: string) {
        this._tagName = value;
    }

    public set tagDescription(value: string) {
        this._tagDescription = value;
    }

    public toString(): string {
        return `CodingTag: ${this._tagId} ${this._tagName} ${this._tagDescription}`;
    }
}
