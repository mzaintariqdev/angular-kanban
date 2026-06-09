import { Component } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

interface Task {
  id: number;
  title: string;
  status: 'todo' | 'inProgress' | 'done';
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './kanban.html',
  styleUrls: ['./kanban.scss'],
})
export class KanbanComponent {
  todo: Task[] = [
    { id: 1, title: 'Learn Angular Signals', status: 'todo' },
    { id: 2, title: 'Build Login Page', status: 'todo' },
    { id: 3, title: 'Apply for Jobs', status: 'todo' },
  ];

  inProgress: Task[] = [{ id: 4, title: 'Kanban Board', status: 'inProgress' }];

  done: Task[] = [{ id: 5, title: 'Setup Angular Project', status: 'done' }];

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const movedTask = event.container.data[event.currentIndex];

      movedTask.status = event.container.id as 'todo' | 'inProgress' | 'done';

      console.log('Moved Task:', movedTask);
      console.log('From:', event.previousContainer.id);
      console.log('To:', event.container.id);
    }

    console.log('TODO:', this.todo);
    console.log('IN PROGRESS:', this.inProgress);
    console.log('DONE:', this.done);
  }
}
