import { IComponent } from "./component";

export interface IPagedComponent {
    numItems: number;
    components: IComponent[];
}