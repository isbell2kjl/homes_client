import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PostNewComponent } from './components/post-new/post-new.component';
import { UserComponent } from './components/user/user.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { PostListComponent } from './components/post-list/post-list.component';




const routes: Routes = [
  { path: "", redirectTo: "post", pathMatch: "full" },
  { path: "post", component: PostListComponent },
  { path: "add", component: PostNewComponent },
  { path: "edit/:id", component: PostEditComponent },
  { path: "auth/signup", component: SignUpComponent },
  { path: "auth/signin", component: SignInComponent },
  { path: "profile/:id", component: UserComponent },
  { path: "profile/edit/:id", component: UserEditComponent },
  { path: "search", component: UserSearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
