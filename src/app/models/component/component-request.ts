import { ComponentCategory } from "../component-category";

export interface IComponentRequest {
    name: string;
    manufacturer: string;
    componentCategory: ComponentCategory;
}