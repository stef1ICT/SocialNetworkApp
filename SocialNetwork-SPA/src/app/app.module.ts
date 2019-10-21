import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxGalleryModule } from 'ngx-gallery';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { AlertifyService } from './_services/alertify.service.ts';
import { BsDropdownModule } from 'ngx-bootstrap';
import { setTheme } from 'ngx-bootstrap/utils';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MessageComponent } from './message/message.component';
import { appRoutes } from './routes';
import { AuthGuard } from './_guards/auth.guard';
import { UserService } from './_services/User.service';
import { MemberComponent } from './member-list/member/member.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MemberDetailsComponent } from './member-list/member-details/member-details.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MemberDetailResolver } from 'src/_resolvers/MemberDetail.resolver';
import { EditMemberComponent } from './member-list/edit-member/edit-member.component';
import { MemberUpdateResolver } from 'src/_resolvers/MemberUpdate.resolver';
import { PreventUnsavedChanges } from './_guards/PreventUnsavedChanges.guard';
import { PhotoEditComponent } from './member-details/photo-edit/photo-edit.component';
import {TimeAgoPipe} from 'time-ago-pipe';
import { MemberResolver } from 'src/_resolvers/Member.resolver';
import { ListResolver } from 'src/_resolvers/list.resolver';

export function tokenGetter() {
   return localStorage.getItem('token');
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      ListsComponent,
      MemberListComponent,
      MessageComponent,
      MemberComponent,
      MemberDetailsComponent,
      EditMemberComponent,
      PhotoEditComponent,
      TimeAgoPipe
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      BsDatepickerModule.forRoot(),
      FileUploadModule,
      PaginationModule.forRoot(),
      ButtonsModule.forRoot(),
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      JwtModule.forRoot({
         config: {
           // tslint:disable-next-line: object-literal-shorthand
           tokenGetter: tokenGetter,
           whitelistedDomains: ['localhost:5000'],
           blacklistedRoutes: ['localhost:5000/api/auth']
         }
       }),
       NgxGalleryModule
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      AlertifyService,
      AuthGuard,
      UserService,
      MemberDetailResolver,
      MemberUpdateResolver,
      ListResolver,
      MemberResolver,
      PreventUnsavedChanges
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {
   constructor() {
      setTheme('bs4');
   }
 }
