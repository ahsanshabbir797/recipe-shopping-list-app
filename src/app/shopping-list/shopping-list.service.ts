import { Ingredient } from "../shared/ingredient.model";
import { Subject } from "rxjs";

export class ShoppingListService {
    IngredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();
    private ingredients: Ingredient[] = [
        new Ingredient('Apples',5),
        new Ingredient('Tomatoes',10)
      ];

    getIngredientById(index:number) {
        return this.ingredients[index]
    }

    getIngredients() {
        return this.ingredients.slice();
    }

    addIngredient(ingredient:Ingredient) {
        this.ingredients.push(ingredient);
        this.IngredientsChanged.next(this.ingredients.slice());
    }

    addRecipeIngredients(ingredients:Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.IngredientsChanged.next(this.ingredients.slice());
    }

    updateIngredient(index:number,updatedIngredient) {
        this.ingredients[index] = updatedIngredient;
        this.IngredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient(index:number) {
        this.ingredients.splice(index,1);
        this.IngredientsChanged.next(this.ingredients.slice());
    }
}