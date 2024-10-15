import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PostNewComponent } from './components/post-new/post-new.component';
import { UserComponent } from './components/user/user.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostActiveComponent } from './components/post-active/post-active.component';
import { CommentNewComponent } from './components/comment-new/comment-new.component';
import { CommentEditComponent } from './components/comment-edit/comment-edit.component';
import { ContactComponent } from './components/contact/contact.component';
import { WebmasterComponent } from './components/webmaster/webmaster.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ContentEditComponent } from './components/content-edit/content-edit.component';





const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "post", component: PostListComponent },
  { path: "add", component: PostNewComponent },
  { path: "active", component: PostActiveComponent },
  { path: "edit/:id", component: PostEditComponent },
  { path: "post/:id", component: CommentNewComponent },
  { path: "action/:id", component: CommentEditComponent },
  { path: "auth/signup-newuser-now", component: SignUpComponent },
  { path: "auth/signin", component: SignInComponent },
  { path: "profile/:id", component: UserComponent },
  { path: "profile/edit/:id", component: UserEditComponent },
  { path: "search", component: UserSearchComponent },
  { path: "contact", component: ContactComponent },
  { path: "webmaster", component: WebmasterComponent},
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "content-edit", component: ContentEditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled', enableTracing: false})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
