import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KanbanComponent } from './components/kanban/kanban';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, KanbanComponent],
  templateUrl: './app.html',
  // template: 'app-kanban',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('smart-task-manager');
}
