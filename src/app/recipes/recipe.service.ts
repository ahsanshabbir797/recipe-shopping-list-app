import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();
  recipesChanged = new Subject<Recipe[]>();
  startedEditing = new Subject<number>();

  private recipes: Recipe[] = [
    // new Recipe(
    //   'A First Recipe',
    //   'This is simply a First',
    //   'https://live.staticflickr.com/8719/28332021793_883a1c6c0a_b.jpg',
    //   [
    //     new Ingredient('Turnips', 3), 
    //     new Ingredient('Peas', 10)
    //   ]),
    // new Recipe(
    //   'A Second Recipe',
    //   'This is simply a Second',
    //   'https://live.staticflickr.com/8719/28332021793_883a1c6c0a_b.jpg',
    //   [
    //     new Ingredient('Potatoes', 5), 
    //     new Ingredient('Tomatoes', 3)
    //   ]),
  ];

  tempRecipes : Recipe[] = []

  constructor(private slService:ShoppingListService,private http:HttpClient) {}

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
    const newRecipe = new Recipe(name,description,imagePath,recipeIngredients)
    this.recipes.push(newRecipe);
    this.tempRecipes.push(newRecipe)
    this.recipesChanged.next(this.recipes.slice());
  }

  saveRecipes() {
    this.tempRecipes.forEach((eachRecipe)=>{
      this.http.post('https://ng-course-recipe-book-51acc-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
      eachRecipe,{
      headers:new HttpHeaders({
        'recipesToken':'Ahsan Recipes'
      }),
      responseType:'json',
      observe:'body'
    }).subscribe(
      (response) => console.log(response)
    )

    })
    // this.http.post('https://ng-course-recipe-book-51acc-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
    // this.tempRecipes,{
    //   headers:new HttpHeaders({
    //     'recipesToken':'Ahsan Recipes'
    //   }),
    //   responseType:'json',
    //   observe:'body'
    // }).subscribe(
    //   (response) => console.log(response)
    // )
  }

  fetchRecipes() {
    this.http.get('https://ng-course-recipe-book-51acc-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json')
    .subscribe(
      (fetchedRecipes)=>{
        console.log("Fetch Response:::",fetchedRecipes);
        const recipes:Recipe[] = []
        for (const key in fetchedRecipes) {
          if (Object.prototype.hasOwnProperty.call(fetchedRecipes, key)) {
            const element = fetchedRecipes[key];
            recipes.push(element)
          }
        }
        this.recipes=recipes
        console.log("fetched recipes:::",this.recipes)
        this.recipesChanged.next(this.recipes.slice())
      }
    )
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
    this.http.delete('https://ng-course-recipe-book-51acc-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json')
  }
}
