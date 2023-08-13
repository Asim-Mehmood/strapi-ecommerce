import {IImage} from './image';
import {ICategory} from './category';

export interface IProduct {
  id: number;
  attributes: {
    Description: string;
    Price: number;
    Images: IImage;
    category: {data:ICategory};
    Quantity: number;
    Slug: string;
    Title: string;
    createdAt: string;
    publishedAt: string;
    updatedAt: string;
  };
}
