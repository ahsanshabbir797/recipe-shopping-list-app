import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit{
  recipe:Recipe;
  id:number;

  constructor(private recipeService:RecipeService,private route:ActivatedRoute,private router:Router) {}
  
  ngOnInit(): void {
    this.route.params
    .subscribe((params:Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipeById(this.id);
    })
  }

  addToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.router.navigate(['/shopping-list'])
  }

  onEditRecipe() {
    this.router.navigate(['../',this.id,'edit'],{relativeTo:this.route})
    this.recipeService.startedEditing.next(this.id)
    // this.router.navigate(['edit'],{relativeTo:this.route})//alternate
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipeById(this.id);
    this.router.navigate(['../'])
  }
}
