import { given } from "@nivinjoseph/n-defensive";
import { MenuItem } from "../../proxies/menu-item/menu-item";
import { MockMenuItemProxy } from "../../proxies/menu-item/mock-menu-item-proxy";
import { MenuService } from "./menu-service";

export class MockMenuService implements MenuService
{
    private readonly _menu: Array<MockMenuItemProxy>;
    private _counter: number;
    image: string = "https://images.unsplash.com/photo-1490323814405-4aa634235c2b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60";

    public constructor()
    {
        
        const menu = new Array<MockMenuItemProxy>();
        const count = 10;

        for (let i = 0; i < count; i++)
            menu.push(new MockMenuItemProxy("id" + i, "name" + i, "description" + i, i * i - i, this.image));

        this._menu = menu;
        this._counter = count;
    }
    
    public getMenu(): Promise<ReadonlyArray<MenuItem>>
    {
        return Promise.resolve(this._menu);
    }
    
    public getMenuItem(id: string): Promise<MenuItem>
    {
        return Promise.resolve(this._menu.find(t => t.id === id) as MenuItem);
    }
    
    public addMenuItem(name: string, description: string, price: number, imageUrl: string): Promise<MenuItem>
    {
        given(name, "name").ensureHasValue().ensureIsString();
        given(description, "description").ensureHasValue().ensureIsString();
        given(price, "price").ensureHasValue();
        
        if (imageUrl.isEmptyOrWhiteSpace()) imageUrl = this.image;
        
        const menuItem = new MockMenuItemProxy("id" + this._counter++, name.trim(), description.trim(), price, imageUrl);
        this._menu.push(menuItem);
        return Promise.resolve(menuItem);
    }
    
}