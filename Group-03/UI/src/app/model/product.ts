import { FileHandle } from "./file-handle";

export interface Product {
  id?:number;
  title: string;
  description: string;
  quantity: number;
  price: number;
  categoryId: number;
  isActive:boolean;
  productImg:{id:number; url:string}[];
  files?:File[];
}