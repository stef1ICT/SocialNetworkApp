import {Routes} from '@angular/router';
import { HomeComponent } from 'src/app/home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MessageComponent } from './message/message.component';
import { MemberListComponent } from './member-list/member-list.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailsComponent } from './member-list/member-details/member-details.component';
import { MemberDetailResolver } from 'src/_resolvers/MemberDetail.resolver';
import { EditMemberComponent } from './member-list/edit-member/edit-member.component';
import { MemberUpdateResolver } from 'src/_resolvers/MemberUpdate.resolver';
import { PreventUnsavedChanges } from './_guards/PreventUnsavedChanges.guard';
import { MemberResolver } from 'src/_resolvers/Member.resolver';
import { ListResolver } from 'src/_resolvers/list.resolver';
export const appRoutes: Routes =  [
  {path: '', component: HomeComponent},
  {
      path: '',
      runGuardsAndResolvers: 'always',
      canActivate: [AuthGuard],
      children: [
        {path: 'members', component: MemberListComponent, resolve: {
          users : MemberResolver
        }},
        {path: 'members/edit', component: EditMemberComponent, resolve: {
          user: MemberUpdateResolver
        }, canDeactivate: [PreventUnsavedChanges]},
        {path: 'members/:id', component: MemberDetailsComponent, resolve: {
          user : MemberDetailResolver
        }},
        {path: 'messages', component: MessageComponent},
        {path: 'lists', component: ListsComponent, resolve: {
          users: ListResolver
        }}
      ]
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
