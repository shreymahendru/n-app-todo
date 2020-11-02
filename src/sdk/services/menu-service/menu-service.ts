import { MenuItem } from "../../proxies/menu-item/menu-item";

export interface MenuService
{
    getMenu(): Promise<ReadonlyArray<MenuItem>>;
    getMenuItem(id: string): Promise<MenuItem>;
    addMenuItem(name: string, description: string, price: number, imageUrl: string): Promise<MenuItem>;
}
