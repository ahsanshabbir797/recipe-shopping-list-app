import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'A First Recipe',
      'This is simply a First',
      'https://live.staticflickr.com/8719/28332021793_883a1c6c0a_b.jpg',
      [
        new Ingredient('Turnips', 3), 
        new Ingredient('Peas', 10)
      ]),
    new Recipe(
      'A Second Recipe',
      'This is simply a Second',
      'https://live.staticflickr.com/8719/28332021793_883a1c6c0a_b.jpg',
      [
        new Ingredient('Potatoes', 5), 
        new Ingredient('Tomatoes', 3)
      ]),
  ];

  constructor(private slService:ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients:Ingredient[]) {
    this.slService.addRecipeIngredients(ingredients)
  }
}
