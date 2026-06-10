import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { KanbanColumn } from './kanban-column/kanban-column';
import { Column } from '../../../models/kanban';
import { KanbanService } from '../../services/kanban';
import { MatDialog } from '@angular/material/dialog';
import { ColumnDialogComponent } from '../../shared/column-dialog/column-dialog';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [KanbanColumn],
  templateUrl: './kanban.html',
  styleUrls: ['./kanban.scss'],
})
export class KanbanComponent {
  private readonly kanbanService = inject(KanbanService);

  private readonly dialog = inject(MatDialog);

  readonly columns = this.kanbanService.columns;

  get connectedLists(): string[] {
    return this.columns().map((column) => column.id);
  }

  drop(event: CdkDragDrop<any>): void {
    const columns = structuredClone(this.columns());

    const sourceColumn = columns.find((column) => column.id === event.previousContainer.id);

    const targetColumn = columns.find((column) => column.id === event.container.id);

    if (!sourceColumn || !targetColumn) {
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(targetColumn.tasks, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        sourceColumn.tasks,
        targetColumn.tasks,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.kanbanService.updateColumns(columns);
  }

  openAddColumnDialog(): void {
    const ref = this.dialog.open(ColumnDialogComponent, {
      width: '400px',
    });

    ref.afterClosed().subscribe((name) => {
      if (!name) return;

      this.kanbanService.addColumn(name);
    });
  }
}
// console.log('Moved Task:', movedTask);
// console.log('From:', event.previousContainer.id);
// console.log('To:', event.container.id);

// 1. divide the kanban component into sub
// 2. add five columns at max 5 (with plus sign on right side in column)
// 3. crud in columns (change name, delete)
// 4. crud in tasks
// 5. proper styling
// 6. add router(login and home page) target for now.
// 7. create multiple kanban boards (later)
