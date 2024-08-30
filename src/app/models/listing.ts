import { ComponentCategory } from "./component-category";
import { IUserBasicInfoPublic } from "./user-info/user-basic-info-public";

export interface IListing {
    id: string;
    userId: string;
    title: string;
    description: string;
    creationDate: Date;
    price: number;
    imageUrls: string[];
    componentCategory: ComponentCategory;
    userInfo: IUserBasicInfoPublic;
    userVerified: boolean;
}