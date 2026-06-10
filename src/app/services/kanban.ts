import { Injectable, computed, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Column, Task } from '../../models/kanban';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  readonly MAX_COLUMNS = 5;

  private readonly STORAGE_KEY = 'smart-task-manager-columns';

  private readonly _columns = signal<Column[]>(this.loadColumns());

  readonly columns = computed(() => this._columns());

  private loadColumns(): Column[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: 'todo',
        name: 'To Do',
        tasks: [
          {
            id: '1',
            title: 'Create Login Page',
            description: 'Build login UI',
            priority: 'medium',
          },
        ],
      },
      {
        id: 'progress',
        name: 'In Progress',
        tasks: [],
      },
      {
        id: 'done',
        name: 'Done',
        tasks: [],
      },
    ];
  }

  private saveColumns(columns: Column[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(columns));
  }

  updateColumns(columns: Column[]): void {
    this._columns.set(columns);
    this.saveColumns(columns);
  }

  addColumn(name: string): void {
    if (this._columns().length >= this.MAX_COLUMNS) {
      return;
    }

    const updated = [
      ...this._columns(),
      {
        id: uuid(),
        name,
        tasks: [],
      },
    ];

    this.updateColumns(updated);
  }

  renameColumn(columnId: string, name: string): void {
    const updated = this._columns().map((column) =>
      column.id === columnId
        ? {
            ...column,
            name,
          }
        : column,
    );

    this.updateColumns(updated);
  }

  deleteColumn(columnId: string): void {
    if (this._columns().length <= 1) {
      return;
    }

    const updated = this._columns().filter((column) => column.id !== columnId);

    this.updateColumns(updated);
  }

  addTask(columnId: string, task: Omit<Task, 'id'>): void {
    const updated = this._columns().map((column) => {
      if (column.id !== columnId) {
        return column;
      }

      return {
        ...column,
        tasks: [
          ...column.tasks,
          {
            id: uuid(),
            ...task,
          },
        ],
      };
    });

    this.updateColumns(updated);
  }

  updateTask(columnId: string, taskId: string, taskData: Partial<Task>): void {
    const updated = this._columns().map((column) => {
      if (column.id !== columnId) {
        return column;
      }

      return {
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...taskData,
              }
            : task,
        ),
      };
    });

    this.updateColumns(updated);
  }

  deleteTask(columnId: string, taskId: string): void {
    const updated = this._columns().map((column) => {
      if (column.id !== columnId) {
        return column;
      }

      return {
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      };
    });

    this.updateColumns(updated);
  }
}
