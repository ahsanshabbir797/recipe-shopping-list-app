import { EventEmitter, Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";

@Injectable({
    providedIn:'root'
})
export class RecipeService {

    recipes:Recipe[]=[
        new Recipe('A First Recipe','This is simply a First','https://live.staticflickr.com/8719/28332021793_883a1c6c0a_b.jpg'),
        new Recipe('A Second Recipe','This is simply a Second','https://live.staticflickr.com/8719/28332021793_883a1c6c0a_b.jpg')
      ];

    recipeSelected = new EventEmitter<Recipe>();

}