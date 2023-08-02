import { Category } from "../models/category";

export interface CategoryRepository {
    create(name: any, description: any): Category;
    getCategoryById(id: any): Category | unknown;
}

export class CategoryRepositoryImpl implements CategoryRepository {
    categories: Array<Category>

    constructor() {
        this.categories = new Array<Category>()
    }

    create(name: any, description: any): Category {
        throw new Error("Method not implemented.");
    }

    getCategoryById(id: any): Category | unknown {
        throw new Error("Method not implemented.");
    }
}