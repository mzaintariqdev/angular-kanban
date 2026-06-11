import { Routes } from '@angular/router';

import { KanbanComponent } from './components/kanban/kanban';
import { BoardsComponent } from './pages/boards/boards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'boards',
    pathMatch: 'full',
  },

  {
    path: 'boards',
    component: BoardsComponent,
  },

  {
    path: 'boards/:id',
    component: KanbanComponent,
  },
];
