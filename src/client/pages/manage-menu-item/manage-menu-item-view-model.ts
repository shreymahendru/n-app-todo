import { NavigationService, PageViewModel, route, template } from "@nivinjoseph/n-app";
import { given } from "@nivinjoseph/n-defensive";
import { inject } from "@nivinjoseph/n-ject";
import { Validator } from "@nivinjoseph/n-validate";
import { MenuItem } from "../../../sdk/proxies/menu-item/menu-item";
import { MenuService } from "../../../sdk/services/menu-service/menu-service";
import * as Routes from "../routes";
import "./manage-menu-item-view.scss";

@template(require("./manage-menu-item-view.html"))
@route(Routes.manageMenu)
@inject("MenuService", "NavigationService")
export class ManageMenuItemViewModel extends PageViewModel
{
    private readonly _menuService: MenuService;
    private readonly _navigationService: NavigationService;
    private _isNew: boolean;
    private _menuItem: MenuItem | null;
    private _name: string;
    private _description: string;
    private _price: number;
    private _imageUrl: string;
    private readonly _validator: Validator<this>;
    public fileList = [];
    
    public get isNew(): boolean { return this._isNew; }
    
    public get name(): string { return this._name; }
    public set name(value: string) { this._name = value; }
    
    public get description(): string { return this._description; }
    public set description(value: string) { this._description = value; }
    
    public get price(): number { return this._price as number; }
    public set price(value: number) { this._price = value as number; }
    
    public get hasErrors(): boolean { return !this.validate(); }
    public get errors(): Object { return this._validator.errors; }
   
    private _isNavbarOpen: boolean = false;
    public get isNavbarOpen(): boolean { return this._isNavbarOpen; }
    public set isNavbarOpen(value: boolean) { this._isNavbarOpen = value; }
    
    public get imageUrl(): String { return this._imageUrl; }
   
    public constructor(menuService: MenuService, navigationService: NavigationService)
    {
        super();
        given(menuService, "menuService").ensureHasValue().ensureIsObject();
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        
        this._menuService = menuService;
        this._navigationService = navigationService;
        this._isNew = true;
        this._name = "";
        this._description = "";
        this._price = 0;
        this._imageUrl = "";
        this._menuItem = null;
        this._validator = this.createValidator();
    }
    
    public async save(): Promise<void>
    {
        this._validator.enable();
        if (!this.validate())
            return;

        try
        {
            if (this._isNew)
            {
                await this._menuService.addMenuItem(this._name, this._description, this._price, this._imageUrl);
            }
            else
            {
                await this._menuItem?.update(this._name, this._description, this._price, this._imageUrl);
            }
        } catch (e)
        {
            console.log(e);
            return;
        }
        
        this._navigationService.navigate(Routes.menuItems);
    }
    
    protected async onEnter(id?: string)
    {
        if (id && id.isNotEmptyOrWhiteSpace)
        {
            this._isNew = false;
            
            try
            {
                this._menuItem = await this._menuService.getMenuItem(id);
                this._name = this._menuItem.name;
                this._description = this._menuItem.description;
                this._price = this._menuItem.price;
                this._imageUrl = this._menuItem.image;
            } catch (e)
            {
                console.log(e);
            }
        }
        else
        {
            this._isNew = true;
        }    
    }
    
    // handleAvatarSuccess(res: Response, file: any)
    // {
    //     // console.log(URL.createObjectURL(file));
    //     console.log(res);
    //     this._imageUrl = file.url;
    //     // this._imageUrl = URL.createObjectURL(file);
    //     // console.log(file.url);
    //     // console.log(files[0]);
    //     console.log(this._imageUrl);

    // }
    
    onFileChange(e: any) {
      const file = e.target.files[0];
        this._imageUrl = URL.createObjectURL(file);
        console.log(typeof (file));
        
    }
    
    // handlePictureCardPreview(file: { url: string; }) {
    //     this._imageUrl = file.url;
    //     console.log(file);
    // }
    
    
    private validate(): boolean
    {
        this._validator.validate(this);
        return this._validator.isValid;
    }

    private createValidator(): Validator<this>
    {
        const validator = new Validator<this>(true);
        
        validator
            .prop("name")
            .isRequired().withMessage("Name is required")
            .isString()
            .hasMaxLength(50);
        
        validator
            .prop("description")
            .isRequired().withMessage("Description is required")
            .isString()
            .hasMaxLength(500);
        
        validator
            .prop("price")
            .isRequired().withMessage("Price is required")
            .isNumber()
            .hasMinValue(0).withMessage("Minimum value is zero");
        
        return validator;
            
    }
}