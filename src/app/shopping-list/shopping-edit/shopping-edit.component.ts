import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy{
  @ViewChild('shoppingForm') shoppingForm:NgForm
  constructor(private slService: ShoppingListService) {};
  subscription:Subscription;
  editMode = false;
  editedItemIndex:number;
  editedItem:Ingredient

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index:number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.slService.getIngredientById(index)
        this.shoppingForm.setValue({
          'name': this.editedItem.name,
          'amount': this.editedItem.amount
        })
      }
    )
  }
  // onAddItem(name:string,amount:number) {
  //   const newIngredient = new Ingredient(name,amount)
  //   this.slService.addIngredient(newIngredient)
  // }

  onSubmit() {
    const { name, amount } = this.shoppingForm.value; 
    const newIngredient = new Ingredient(name,amount);
    if(this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex,newIngredient)
      this.editMode = false;
    }
    else {
      this.slService.addIngredient(newIngredient);
    }
    this.shoppingForm.reset();
  }

  onClear() {
    this.shoppingForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
