import { ComponentCategory } from "../component-category";

export interface IComponent {
    id: string;
    name: string;
    manufacturer: string;
    imageUrl: string;
    category: ComponentCategory;
}