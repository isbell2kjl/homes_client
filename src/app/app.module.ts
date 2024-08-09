import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { UserComponent } from './components/user/user.component';
import { PostNewComponent } from './components/post-new/post-new.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationPageComponent } from './navigation-page/navigation-page.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { CommentNewComponent } from './components/comment-new/comment-new.component';
import { CommentEditComponent } from './components/comment-edit/comment-edit.component';
import { HomeComponent } from './components/home/home.component';
import { PostActiveComponent } from './components/post-active/post-active.component';
import { ContactComponent } from './components/contact/contact.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RecaptchaModule } from 'ng-recaptcha';


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    UserComponent,
    PostNewComponent,
    PostListComponent,
    PostEditComponent,
    NavigationPageComponent,
    UserEditComponent,
    UserSearchComponent,
    CommentNewComponent,
    CommentEditComponent,
    HomeComponent,
    PostActiveComponent,
    ContactComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [

    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RecaptchaModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
