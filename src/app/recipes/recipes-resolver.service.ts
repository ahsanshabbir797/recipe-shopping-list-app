import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "./recipe.service";

@Injectable({
    providedIn:'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(private dataStorageService:DataStorageService,private recipeService:RecipeService) {};
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        console.log("resolver runs")
        const recipes = this.recipeService.getRecipes();
        if(recipes.length===0) {
            return this.dataStorageService.fetchRecipes()
        }
        else {
            return recipes
        }
    }
}