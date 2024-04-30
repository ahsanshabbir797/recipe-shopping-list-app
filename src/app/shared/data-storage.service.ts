import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";
import { Ingredient } from "./ingredient.model";

@Injectable({
    providedIn:'root'
})
export class DataStorageService {
    constructor(private http:HttpClient,private recipesService:RecipeService) {
        this.fetchRecipes();
    };

    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        this.http.put<Array<Recipe>>('https://ng-course-recipe-book-51acc-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
        recipes).subscribe(
            response => {
                console.log("storeRecipes response:::",response);
                if (response !== null||undefined) {
                    this.recipesService.setRecipes(response)
                }
            }
        )
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>('https://ng-course-recipe-book-51acc-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json').
        pipe(
            map((recipes)=>{
                return recipes.map((recipe)=>{
                    return {...recipe,ingredients: recipe.ingredients ? recipe.ingredients:[] }
                })
            }),tap((recipes)=>{
                if (recipes !== null||undefined) {
                    this.recipesService.setRecipes(recipes)
                }
            }
            )
        )
    }
}

//both <Array<Recipe>> and <Recipe[]> mean the same thing: an array of type Recipe object