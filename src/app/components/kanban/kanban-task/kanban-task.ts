import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../../models/kanban';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-kanban-task',
  imports: [MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './kanban-task.html',
  styleUrl: './kanban-task.scss',
})
export class KanbanTask {
  @Input({ required: true }) task!: Task;

  @Output()
  edit = new EventEmitter<void>();

  @Output()
  delete = new EventEmitter<void>();
}
