import { bind, ComponentViewModel, element, NavigationService, template } from "@nivinjoseph/n-app";
import { given } from "@nivinjoseph/n-defensive";
import { inject } from "@nivinjoseph/n-ject";
import { MenuItem } from "../../../sdk/proxies/menu-item/menu-item";
import "./menu-item-view.scss";
import * as Routes from "../../pages/routes";

@template(require("./menu-item-view.html"))
@element("item")
@bind("value")
@inject("NavigationService")
export class MenuItemViewModel extends ComponentViewModel
{
    private readonly _navigationService: NavigationService;
    
    public get menuItem(): MenuItem { return this.getBound<MenuItem>("value"); }
    
    public constructor(navigationService: NavigationService)
    {
        super();

        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        
        this._navigationService = navigationService;
    }
    
    editMenuItem()
    {
        this._navigationService.navigate(Routes.manageMenu, { "id": this.menuItem.id });
    }
    
    public async deleteMenuItem(): Promise<void>
    {
        try
        {
            await this.menuItem.delete();
        } catch (e)
        {
            console.log(e);
        }
    }
}