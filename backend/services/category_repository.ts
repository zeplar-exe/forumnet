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

    create(name: string, description: string): Category {
        var category = new Category(name, description)

        this.categories.push(category)

        return category
    }

    getCategoryById(id: string): Category | unknown {
        return this.categories.find(c => c.id == id)
    }
}