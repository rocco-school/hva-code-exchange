// const string: string = "dit is een string";
// const number: number = 9;
// const boolean: boolean = true;
    

// console.log(string);
// console.log(number);
// console.log(boolean);

// const target: any = (document.querySelector("#targetHeader") as HTMLHeadingElement);
// target.innerHTML = "target eliminated";

// console.log(target?.textContent);

class Cup{
    private _material: string;
    private _lid: string;
    private _content: number;

    //eerste fnuctie die wordt aangeroepen bij maken/invullen van class
    public constructor(material: string, lid: string, content:number) {
        this._material = material;
        this._lid = lid;
        this._content = content;
    }

    public drink(): void {
        this._content -= 100;
        console.log("er is 100 gedronken, er is nog: " + this._content + "ml over");
    }
}

// objecten maken
const cup: Cup = new Cup("stainless Steel", "Twist Lid", 750);
const cup2: Cup = new Cup("Tungsten", "Rubber Lid", 850);
const cup3: Cup = new Cup("Weaponized concrete", "aluminium Lid", 1000);
cup.drink();

console.log(cup);
console.log(cup2);
console.log(cup3);