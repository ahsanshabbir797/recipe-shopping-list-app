import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit{
  // @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes:Recipe[]=[]

  constructor(private recipeService:RecipeService) {};

  ngOnInit(): void {
    // this.recipes = this.recipeService.recipes;
  };

  // recipes:Recipe[]=[
  //   new Recipe('A First Recipe','This is simply a First','https://live.staticflickr.com/8719/28332021793_883a1c6c0a_b.jpg'),
  //   new Recipe('A Second Recipe','This is simply a Second','https://live.staticflickr.com/8719/28332021793_883a1c6c0a_b.jpg')
  // ];

  onRecipeClicked(eventData:Recipe) {
    // this.recipeWasSelected.emit(eventData)
  }
}
