import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipePlaceholderComponent } from "./recipes/recipe-placeholder/recipe-placeholder.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipesResolverService } from "./recipes/recipes-resolver.service";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth-guard";

const appRoutes:Routes = [
    {path:'recipes',component:RecipesComponent,canActivate:[AuthGuard],children:[
        {path:'',component:RecipePlaceholderComponent},
        {path:'new',component:RecipeEditComponent},
        {path:':id',component:RecipeDetailComponent,resolve:[RecipesResolverService]},
        {path:':id/edit',component:RecipeEditComponent,resolve:[RecipesResolverService]},
    ]},
    {path:'shopping-list',component:ShoppingListComponent},
    {path:'page-not-found',component:PageNotFoundComponent},
    {path:'auth', component:AuthComponent},
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