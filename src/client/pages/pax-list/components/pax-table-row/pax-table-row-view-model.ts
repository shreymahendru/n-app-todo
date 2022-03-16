import { ComponentViewModel, template, element, bind, events } from "@nivinjoseph/n-app";
import { given } from "@nivinjoseph/n-defensive";
import { Pax } from "../../../../../sdk/models/pax";
import { SelectablePax } from "../../pax-list-view-model";
import "./pax-table-row-view.scss";


@template(require("./pax-table-row-view.html"))
@element("pax-table-row")
@events("managePax", "deletePax")
@bind("selectablePax")
export class PaxTableRowViewModel extends ComponentViewModel
{
    private get _selectablePax(): SelectablePax { return this.getBound("selectablePax"); }


    public get pax(): Pax { return this._selectablePax.pax; }

    public get isSelected(): boolean { return this._selectablePax.isSelected; }
    public set isSelected(value: boolean) { this._selectablePax.isSelected = value; }


    public managePax(): void
    {
        this.emit("managePax", this.pax);
    }

    public deletePax(): void
    {
        this.emit("deletePax", this.pax);
    }


    protected override onCreate(): void
    {
        given(this, "this").ensure(t => t._selectablePax != null, "No pax bound");
    }
}