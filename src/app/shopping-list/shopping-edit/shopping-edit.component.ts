import { Component } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {

  constructor(private slService: ShoppingListService) {}

  onAddItem(name:string,amount:number) {
    const newIngredient = new Ingredient(name,amount)
    this.slService.addIngredient(newIngredient)
  }
}
