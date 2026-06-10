import { Component, inject, Input } from '@angular/core';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { KanbanTask } from '../kanban-task/kanban-task';
import { Column, Task } from '../../../../models/kanban';

import { KanbanService } from '../../../services/kanban';
import { TaskDialogComponent } from '../../../shared/task-dialog/task-dialog';
import { ColumnDialogComponent } from '../../../shared/column-dialog/column-dialog';

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [CdkDrag, CdkDropList, KanbanTask, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './kanban-column.html',
  styleUrl: './kanban-column.scss',
})
export class KanbanColumn {
  @Input({ required: true }) column!: Column;
  @Input({ required: true }) connectedLists!: string[];
  @Input() dropped!: (event: any) => void;

  private readonly dialog = inject(MatDialog);
  private readonly kanbanService = inject(KanbanService);

  // =========================
  // TASK ACTIONS
  // =========================

  addTask(): void {
    const ref = this.dialog.open(TaskDialogComponent, {
      width: '500px',
    });

    ref.afterClosed().subscribe((task) => {
      if (!task) return;
      this.kanbanService.addTask(this.column.id, task);
    });
  }

  editTask(task: Task): void {
    const ref = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task,
    });

    ref.afterClosed().subscribe((updated) => {
      if (!updated) return;
      this.kanbanService.updateTask(this.column.id, task.id, updated);
    });
  }

  deleteTask(taskId: string): void {
    this.kanbanService.deleteTask(this.column.id, taskId);
  }

  // =========================
  // COLUMN ACTIONS
  // =========================

  renameColumn(): void {
    const ref = this.dialog.open(ColumnDialogComponent, {
      width: '400px',
      data: { name: this.column.name },
    });

    ref.afterClosed().subscribe((name) => {
      if (!name) return;
      this.kanbanService.renameColumn(this.column.id, name);
    });
  }

  deleteColumn(): void {
    this.kanbanService.deleteColumn(this.column.id);
  }
}
