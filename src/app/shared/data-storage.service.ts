import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Injectable, OnInit } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { catchError, exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { throwError } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class DataStorageService implements OnInit{

    constructor(
        private http:HttpClient,
        private recipesService:RecipeService, 
        private authService:AuthService) {};

    ngOnInit(): void {
    }

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
            return this.http.get<Recipe[]>('https://ng-course-recipe-book-51acc-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
            ).pipe(
                map((recipes)=>{
                return recipes.map((recipe)=>{
                    return {...recipe,ingredients: recipe.ingredients ? recipe.ingredients:[] }
                })
            }),tap((recipes)=>{
                if (recipes !== null||undefined) {
                    this.recipesService.setRecipes(recipes)
                }
            }
            ), catchError(error => {
                console.log("Error in fetch:::",error)
                return throwError(error)
            }))  
    }

    // fetchRecipes() {
    //     return this.authService.user.pipe(take(1),exhaustMap(user => {
    //         return this.http.get<Recipe[]>('https://ng-course-recipe-book-51acc-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
    //             {
    //                 params: new HttpParams().set('auth',user.token)
    //             }
    //         )
    //     }), map((recipes)=>{
    //         return recipes.map((recipe)=>{
    //             return {...recipe,ingredients: recipe.ingredients ? recipe.ingredients:[] }
    //         })
    //     }),tap((recipes)=>{
    //         if (recipes !== null||undefined) {
    //             this.recipesService.setRecipes(recipes)
    //         }
    //     }
    //     ), catchError(error => {
    //         console.log("Error in fetch:::",error)
    //         return throwError(error)
    //     }))
    // }

    // fetchRecipes() {
    //     return this.http.get<Recipe[]>('https://ng-course-recipe-book-51acc-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
    //         {
    //             headers: new HttpHeaders({'Authorization':`Bearer ${this.authToken}`})
    //         }
    //     ).
    //     pipe(
    //         map((recipes)=>{
    //             return recipes.map((recipe)=>{
    //                 return {...recipe,ingredients: recipe.ingredients ? recipe.ingredients:[] }
    //             })
    //         }),tap((recipes)=>{
    //             if (recipes !== null||undefined) {
    //                 this.recipesService.setRecipes(recipes)
    //             }
    //         }
    //         ), catchError(error => {
    //             console.log("Error in fetch:::",error)
    //             return throwError(error)
    //         })
    //     )
    // }
}

//both <Array<Recipe>> and <Recipe[]> mean the same thing: an array of type Recipe object