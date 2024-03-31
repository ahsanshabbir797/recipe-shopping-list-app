import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();
  recipesChanged = new Subject<Recipe[]>();
  startedEditing = new Subject<number>();

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
    console.log("core recipes:::",this.recipes.slice())
    return this.recipes.slice();
  }

  getRecipeById(index:number) {
    return this.getRecipes()[index];
  }

  addRecipes(recipe:Recipe) {
    const {name,description,imagePath,ingredients} = recipe;
    const recipeIngredients = ingredients.map((ingredient)=>{
      return new Ingredient(ingredient.name,ingredient.amount)
    })
    this.recipes.push(new Recipe(name,description,imagePath,recipeIngredients));
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients:Ingredient[]) {
    this.slService.addRecipeIngredients(ingredients);
  }

  updateRecipeById(id:number,updatedRecipe) {
    this.recipes[id] = updatedRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipeById(index:number) {
    this.recipes.splice(index,1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
