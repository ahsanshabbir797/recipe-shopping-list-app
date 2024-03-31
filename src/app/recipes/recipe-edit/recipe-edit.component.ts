import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit{
  id:number;
  editMode = false;
  recipesForm:FormGroup;
  subscription:Subscription;
  constructor(
      private route:ActivatedRoute,
      private router:Router,
      private recipesService:RecipeService) {}

  ngOnInit(): void {
    this.route.params
    .subscribe((params:Params)=>{
      this.id = params['id'];
      this.editMode = params['id'] !== undefined;
    });
    this.initForm();
  }

  private initForm() {
    let recipeName = '';
    let recipeDescription = '';
    let recipeImagePath = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode) {
      const {name, description,imagePath,ingredients} = this.recipesService.getRecipeById(this.id);
      recipeName = name;
      recipeDescription = description;
      recipeImagePath = imagePath;

      if(ingredients) {
        for (const ingredient of ingredients) {
          recipeIngredients.push(new FormGroup({
            'name':new FormControl(ingredient.name,Validators.required),
            'amount':new FormControl(ingredient.amount,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
          }))
        }
      }
    };

    this.recipesForm = new FormGroup({
      'name':new FormControl(recipeName,Validators.required),
      'description':new FormControl(recipeDescription,Validators.required),
      'imagePath':new FormControl(recipeImagePath,Validators.required),
      'ingredients': recipeIngredients
    });
  };

  onAddIngredient() {
    const ingredientForm = new FormGroup({
      'name':new FormControl(null,Validators.required),
      'amount':new FormControl(null,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
    });
    (<FormArray>this.recipesForm.get('ingredients')).push(ingredientForm);
  }

  onDeleteIngredient(index:number) {
    (<FormArray>this.recipesForm.get('ingredients')).removeAt(index)
  }

  get ingredients() {
    return (<FormArray>this.recipesForm.get('ingredients')).controls
  }

  onDeleteAllIngredients() {
    (<FormArray>this.recipesForm.get('ingredients')).clear()
  }

  onSubmit() {
    const newRecipe = this.recipesForm.value;
    if(this.editMode) {
      this.recipesService.updateRecipeById(this.id,newRecipe);
    }
    else {
      this.recipesService.addRecipes(newRecipe);
    }
    this.recipesForm.reset();
    this.router.navigate(['../'],{relativeTo:this.route})
  }

  onCancel() {
    this.recipesForm.reset();
    this.router.navigate(['../'],{relativeTo:this.route});
  }
}
