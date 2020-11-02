import { given } from "@nivinjoseph/n-defensive";
import { MenuItem } from "./menu-item";

export class MockMenuItemProxy implements MenuItem {
    private readonly _id: string;
    private _name: string;
    private _description: string;
    private _price: number;
    private _image: string;
    private _isDeleted: boolean;
    
    public get id(): string { return this._id; }
    public get name(): string { return this._name; }
    public get description(): string { return this._description; }
    public get price(): number { return this._price; }
    public get image(): string { return this._image; }
    public get isDeleted(): boolean { return this._isDeleted; }
    
    public constructor(id: string, name: string, description: string, price: number, image: string)
    {
        given(id, "id").ensureHasValue().ensureIsString();
        given(name, "name").ensureHasValue().ensureIsString();
        given(description, "description").ensureHasValue().ensureIsString();
        given(price, "price").ensureHasValue();

        this._id = id;
        this._name = name;
        this._description = description;
        this._price = price;
        this._image = image;
        this._isDeleted = false;
    }

    public async update(name: string, description: string, price: number, image: string): Promise<void>
    {
        given(name, "name").ensureHasValue().ensureIsString();
        given(description, "description").ensureHasValue().ensureIsString();
        given(price, "price").ensureHasValue();
        
        this._name = name.trim();
        this._description = description.trim();
        this._price = price;
        this._image = image;
    }

    public async delete(): Promise<void>
    {
        given(this, "this").ensure(t => !t._isDeleted, "Menu item already deleted");

        this._isDeleted = true;
    }
    
}