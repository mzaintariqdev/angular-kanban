import { Injectable, computed, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Board } from '../../models/kanban';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly STORAGE_KEY = 'smart-task-manager-boards';

  private readonly _boards = signal<Board[]>(this.loadBoards());

  readonly boards = computed(() => this._boards());

  private loadBoards(): Board[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: uuid(),
        name: 'Personal Study',
        description: 'French, German, Angular',

        columns: [
          {
            id: 'todo',
            name: 'To Do',
            tasks: [],
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
        ],

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  private saveBoards(boards: Board[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(boards));
  }

  addBoard(name: string, description: string): void {
    const updated = [
      ...this._boards(),

      {
        id: uuid(),
        name,
        description,

        columns: [
          {
            id: 'todo',
            name: 'To Do',
            tasks: [],
          },
        ],

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    this._boards.set(updated);
    this.saveBoards(updated);
  }

  updateBoard(boardId: string, data: Partial<Board>): void {
    const updated = this._boards().map((board) =>
      board.id === boardId
        ? {
            ...board,
            ...data,
            updatedAt: new Date(),
          }
        : board,
    );

    this._boards.set(updated);
    this.saveBoards(updated);
  }

  deleteBoard(boardId: string): void {
    const updated = this._boards().filter((board) => board.id !== boardId);

    this._boards.set(updated);
    this.saveBoards(updated);
  }

  getBoard(boardId: string): Board | undefined {
    return this._boards().find((board) => board.id === boardId);
  }
}
