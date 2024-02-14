import { ComponentCategory } from "./component-category";

export interface IListing {
    id: string;
    userId: string;
    title: string;
    description: string;
    creationDate: Date;
    price: number;
    imageUrls: string[];
    componentCategory: ComponentCategory;
}