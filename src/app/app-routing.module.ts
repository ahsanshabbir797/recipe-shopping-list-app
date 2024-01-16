import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";

const appRoutes:Routes = [
    {path:'recipes',component:RecipesComponent,children:[
        {path:'recipe-detail',component:RecipeDetailComponent}
    ]},
    {path:'shopping-list',component:ShoppingListComponent},
    {path:'page-not-found',component:PageNotFoundComponent},
    {path:'',redirectTo:'/recipes',pathMatch:'full'},
    {path:'**',redirectTo:'page-not-found'}
]

@NgModule({
    imports:[
        RouterModule.forRoot(appRoutes)
    ],
    exports:[
        RouterModule
    ]
})

export class AppRoutingModule {}