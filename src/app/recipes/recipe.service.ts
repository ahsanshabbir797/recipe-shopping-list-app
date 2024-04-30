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
    
  ];

  constructor(private slService:ShoppingListService) {}

  getRecipes() {
    console.log("core recipes:::",this.recipes.slice())
    return this.recipes.slice();
  }

  getRecipeById(index:number) {
    return this.getRecipes()[index];
  }

  addRecipe(recipe:Recipe) {
    const {name,description,imagePath,ingredients} = recipe;
    const recipeIngredients = ingredients.map((ingredient)=>{
      return new Ingredient(ingredient.name,ingredient.amount)
    })
    this.recipes.push(new Recipe(name,description,imagePath,recipeIngredients));
    this.recipesChanged.next(this.recipes.slice());
  }

  setRecipes(fetchedRecipes:Recipe[]) {
    this.recipes = fetchedRecipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients:Ingredient[]) {
    this.slService.addRecipeIngredients(ingredients);
  }

  updateRecipeById(id:number,updatedRecipe:Recipe) {
    this.recipes[id] = updatedRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipeById(index:number) {
    this.recipes.splice(index,1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
