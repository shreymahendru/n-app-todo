
import { TodoViewModel } from "./todo/todo-view-model";
import { ShellViewModel } from "./shell/shell-view-model";
import { MenuItemViewModel } from "./menu-item/menu-item-view-model";


export const components: Array<Function> = [
    ShellViewModel,
    TodoViewModel,
    MenuItemViewModel
];