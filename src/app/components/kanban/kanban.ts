import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { KanbanColumn } from './kanban-column/kanban-column';
import { KanbanService } from '../../services/kanban';

import { MatDialog } from '@angular/material/dialog';
import { ColumnDialogComponent } from '../../shared/column-dialog/column-dialog';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [KanbanColumn, MatIconModule],
  templateUrl: './kanban.html',
  styleUrls: ['./kanban.scss'],
})
export class KanbanComponent {
  private readonly kanbanService = inject(KanbanService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);

  readonly boardId = this.route.snapshot.paramMap.get('id')!;

  readonly columns = computed(() => this.kanbanService.getColumns(this.boardId));

  private readonly router = inject(Router);

  goBack(): void {
    this.router.navigate(['/boards']);
  }

  ngOnInit(): void {
    this.kanbanService.initBoard(this.boardId);
  }

  get connectedLists(): string[] {
    return this.columns().map((column) => column.id);
  }

  drop(event: CdkDragDrop<any>): void {
    const columns = structuredClone(this.columns());

    const sourceColumn = columns.find((c) => c.id === event.previousContainer.id);

    const targetColumn = columns.find((c) => c.id === event.container.id);

    if (!sourceColumn || !targetColumn) return;

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

    this.kanbanService.setColumns(this.boardId, columns);
  }

  openAddColumnDialog(): void {
    const ref = this.dialog.open(ColumnDialogComponent, {
      width: '400px',
    });

    ref.afterClosed().subscribe((name) => {
      if (!name) return;
      this.kanbanService.addColumn(this.boardId, name);
    });
  }
}
