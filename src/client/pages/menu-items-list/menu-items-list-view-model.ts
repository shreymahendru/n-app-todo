import { PageViewModel, template, route } from "@nivinjoseph/n-app";
import * as Routes from "../routes";
import { given } from "@nivinjoseph/n-defensive";
import { inject } from "@nivinjoseph/n-ject";
import { MenuItem } from "../../../sdk/proxies/menu-item/menu-item";
import { MenuService } from "../../../sdk/services/menu-service/menu-service";
import "./menu-items-list-view.scss";

@template(require("./menu-items-list-view.html"))
@route(Routes.menuItems)
@inject("MenuService")
export class MenuItemsListViewModel extends PageViewModel
{
    private readonly _menuService: MenuService;
    private _menuItems: ReadonlyArray<MenuItem>;
    
    public get menuItems(): ReadonlyArray<MenuItem> { return this._menuItems?.where(t => !t.isDeleted) ?? []; }
    
    private _isNavbarOpen: boolean = false;
    public get isNavbarOpen(): boolean { return this._isNavbarOpen; }
    public set isNavbarOpen(value: boolean) { this._isNavbarOpen = value; }
    
    public constructor(menuService: MenuService)
    {
        super();
        
        given(menuService, "menuService").ensureHasValue();
        
        this._menuService = menuService;
        this._menuItems = [];
    }
    
    protected async onEnter()
    {
        super.onEnter();
        try
        {
            this._menuItems = await this._menuService.getMenu();
        } catch (e) {
            console.log(e);
        }
    }
}