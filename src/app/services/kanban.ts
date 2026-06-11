import { Injectable, computed, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Column, Task } from '../../models/kanban';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  private readonly STORAGE_KEY = 'kanban-board-data';

  // boardId -> columns[]
  private readonly _boards = signal<Record<string, Column[]>>(this.loadAll());

  readonly boards = computed(() => this._boards());

  private loadAll(): Record<string, Column[]> {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  }

  private saveAll(data: Record<string, Column[]>) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  getColumns(boardId: string): Column[] {
    return this._boards()[boardId] ?? [];
  }

  initBoard(boardId: string): void {
    const state = this._boards();

    if (state[boardId]) return;

    const updated = {
      ...state,
      [boardId]: [
        { id: 'todo', name: 'To Do', tasks: [] },
        { id: 'progress', name: 'In Progress', tasks: [] },
        { id: 'done', name: 'Done', tasks: [] },
      ],
    };

    this._boards.set(updated);
    this.saveAll(updated);
  }

  setColumns(boardId: string, columns: Column[]): void {
    const updated = {
      ...this._boards(),
      [boardId]: columns,
    };

    this._boards.set(updated);
    this.saveAll(updated);
  }

  addColumn(boardId: string, name: string): void {
    const columns = this.getColumns(boardId);

    const updated = [
      ...columns,
      {
        id: uuid(),
        name,
        tasks: [],
      },
    ];

    this.setColumns(boardId, updated);
  }

  renameColumn(boardId: string, columnId: string, name: string): void {
    const columns = this.getColumns(boardId);

    const updated = columns.map((col) => (col.id === columnId ? { ...col, name } : col));

    this.setColumns(boardId, updated);
  }

  deleteColumn(boardId: string, columnId: string): void {
    const columns = this.getColumns(boardId);

    if (columns.length <= 1) return;

    const updated = columns.filter((col) => col.id !== columnId);

    this.setColumns(boardId, updated);
  }

  addTask(boardId: string, columnId: string, task: Omit<Task, 'id'>): void {
    const columns = this.getColumns(boardId);

    const updated = columns.map((col) => {
      if (col.id !== columnId) return col;

      return {
        ...col,
        tasks: [
          ...col.tasks,
          {
            id: uuid(),
            ...task,
          },
        ],
      };
    });

    this.setColumns(boardId, updated);
  }

  updateTask(boardId: string, columnId: string, taskId: string, taskData: Partial<Task>): void {
    const columns = this.getColumns(boardId);

    const updated = columns.map((col) => {
      if (col.id !== columnId) return col;

      return {
        ...col,
        tasks: col.tasks.map((task) => (task.id === taskId ? { ...task, ...taskData } : task)),
      };
    });

    this.setColumns(boardId, updated);
  }

  deleteTask(boardId: string, columnId: string, taskId: string): void {
    const columns = this.getColumns(boardId);

    const updated = columns.map((col) => {
      if (col.id !== columnId) return col;

      return {
        ...col,
        tasks: col.tasks.filter((task) => task.id !== taskId),
      };
    });

    this.setColumns(boardId, updated);
  }
}
