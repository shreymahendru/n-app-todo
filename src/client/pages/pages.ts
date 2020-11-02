import { ListTodosViewModel } from "./list-todos/list-todos-view-model";
import { ManageMenuItemViewModel } from "./manage-menu-item/manage-menu-item-view-model";
import { ManageTodoViewModel } from "./manage-todo/manage-todo-view-model";
import { MenuItemsListViewModel } from "./menu-items-list/menu-items-list-view-model";


export const pages: Array<Function> = [
    ListTodosViewModel,
    ManageTodoViewModel,
    MenuItemsListViewModel,
    ManageMenuItemViewModel
];