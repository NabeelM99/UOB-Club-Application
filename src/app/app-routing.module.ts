import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'chess',
    loadChildren: () => import('./pages/clubs/chess/chess.module').then(m => m.ChessPageModule)
  },
  {
    path: 'environment',
    loadChildren: () => import('./pages/clubs/environment/environment.module').then(m => m.EnvironmentPageModule)
  },
  {
    path: 'fine-arts',
    loadChildren: () => import('./pages/clubs/fine-arts/fine-arts.module').then(m => m.FineArtsPageModule)
  },
  {
    path: 'graduates',
    loadChildren: () => import('./pages/clubs/graduates/graduates.module').then(m => m.GraduatesPageModule)
  },
  {
    path: 'music',
    loadChildren: () => import('./pages/clubs/music/music.module').then(m => m.MusicPageModule)
  },
  {
    path: 'photography',
    loadChildren: () => import('./pages/clubs/photography/photography.module').then(m => m.PhotographyPageModule)
  },
  {
    path: 'sports',
    loadChildren: () => import('./pages/clubs/sports/sports.module').then(m => m.SportsPageModule)
  },
  {
    path: 'theater',
    loadChildren: () => import('./pages/clubs/theater/theater.module').then(m => m.TheaterPageModule)
  },
  {
    path: 'volunteering',
    loadChildren: () => import('./pages/clubs/volunteering/volunteering.module').then(m => m.VolunteeringPageModule)
  },
  {
    path: 'event-details',
    loadChildren: () => import('./pages/event-details/event-details.module').then(m => m.EventDetailsPageModule)
  },
  {
    path: 'my-events',
    loadChildren: () => import('./pages/my-events/my-events.module').then(m => m.MyEventsPageModule)
  },

  {
    path: 'my-event-details',
    loadChildren: () => import('./pages/my-event-details/my-event-details.module').then(m => m.MyEventDetailsPageModule)
  },

  {
    path: 'add-events',
    loadChildren: () => import('./pages/add-events/add-events.module').then(m => m.AddEventsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'edit-event',
    loadChildren: () => import('./pages/edit-event/edit-event.module').then(m => m.EditEventPageModule)
  },

  {
    path: 'student-info',
    loadChildren: () => import('./pages/student-info/student-info.module').then(m => m.StudentInfoPageModule)
  },
  {
    path: 'requests',
    loadChildren: () => import('./pages/requests/requests.module').then(m => m.RequestsPageModule)
  },
  {
    path: 'show-feedbacks',
    loadChildren: () => import('./pages/show-feedbacks/show-feedbacks.module').then(m => m.ShowFeedbacksPageModule)
  },

  {
    path: 'created-events',
    loadChildren: () => import('./pages/created-events/created-events.module').then(m => m.CreatedEventsPageModule)
  },
  {
    path: 'show-members',
    loadChildren: () => import('./pages/show-members/show-members.module').then(m => m.ShowMembersPageModule)
  },
  
  {
    path: 'college-events',
    loadChildren: () => import('./pages/college-events/college-events.module').then(m => m.CollegeEventsPageModule)
  },
  {
    path: 'college-manage',
    loadChildren: () => import('./pages/college-manage/college-manage.module').then(m => m.CollegeManagePageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
