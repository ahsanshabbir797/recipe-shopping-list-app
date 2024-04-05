import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  constructor(private recipeService:RecipeService) {}
  recipes:Recipe[]=[]

  ngOnInit(): void {
    this.recipeService.recipesChanged.subscribe(
      storedRecipes => this.recipes = storedRecipes
    )
  }

  onSaveRecipes() {
    this.recipeService.saveRecipes();  
  }

  onFetchRecipes() {
    this.recipeService.fetchRecipes();
  }
}
