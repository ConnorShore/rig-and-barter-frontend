import { ComponentCategory } from "./component-category";


export interface IListingRequest {
    title: string;
    description: string;
    price: number;
    componentCategory: ComponentCategory;
}