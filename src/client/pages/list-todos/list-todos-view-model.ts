import { PageViewModel, template, route } from "@nivinjoseph/n-app";
import * as Routes from "../routes";
import "./list-todos-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { TodoService } from "../../../sdk/services/todo-service/todo-service";
import { Todo } from "../../../sdk/proxies/todo/todo";


@template(require("./list-todos-view.html")) // path to the template
@route(Routes.listTodos) // route that the page is going to be shown at
@inject("TodoService") // services that is a dependency for this VM, this gets injected in the constructor, these services are installed in client.ts
export class ListTodosViewModel extends PageViewModel
{
    private readonly _todoService: TodoService;
    private _todos: ReadonlyArray<Todo>;


    public get todos(): ReadonlyArray<Todo> { return this._todos?.where(t => !t.isDeleted) ?? []; } // getters used to reveal VM properties to the template


    public constructor(todoService: TodoService) // dependency getting injected
    {
        super();
        given(todoService, "todoService").ensureHasValue().ensureIsObject(); // defensive checks.
        this._todoService = todoService;
        this._todos = [];
    }


    /**
     * Life cycle methods for pages, in order of when they are called.
     */

    protected onCreate()
    {
        super.onCreate();
        console.log("on Create, when the Vm is created, butt the template has not been mounted in the DOM.");
    }

    protected onMount(element: HTMLElement)
    {
        super.onMount(element);
        console.log("onMount, when the page template is mounted on the DOM, you get the HTML element as a parameter here to manipulate it. using Jquery for example.");
    }

    protected onEnter(): void
    {
        super.onEnter();
        console.log("onEnter, when the page is appeared, usually used to fetch data to show on the page. Also the parameters for this function would be any query/path params of the url");
        this._todoService.getTodos()
            .then(t => this._todos = t)
            .catch(e => console.log(e));
    }

    protected onLeave()
    {
        super.onLeave();
        console.log("onLeave, when the user is about to leave the page.");
    }

    protected onDestroy()
    {
        super.onDestroy();
        console.log("onDestroy, when the page is removed from the DOM.");
    }
}