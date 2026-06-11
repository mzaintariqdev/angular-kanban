import { Component, computed, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { BoardService } from '../../services/board';
import { CreateBoardDialogComponent } from '../../shared/create-board-dialog/create-board-dialog';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boards.html',
  styleUrls: ['./boards.scss'],
})
export class BoardsComponent {
  private readonly boardService = inject(BoardService);

  private readonly router = inject(Router);

  readonly boards = this.boardService.boards;

  readonly pageSize = 6;

  readonly page = signal(1);

  readonly search = signal('');

  private readonly dialog = inject(MatDialog);
  readonly filteredBoards = computed(() => {
    const term = this.search().trim().toLowerCase();

    if (!term) {
      return this.boards();
    }

    return this.boards().filter(
      (board) =>
        board.name.toLowerCase().includes(term) || board.description.toLowerCase().includes(term),
    );
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredBoards().length / this.pageSize));

  readonly pagedBoards = computed(() => {
    const start = (this.page() - 1) * this.pageSize;

    return this.filteredBoards().slice(start, start + this.pageSize);
  });

  createBoard(): void {
    const ref = this.dialog.open(CreateBoardDialogComponent, {
      width: '420px',
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      this.boardService.addBoard(result.name, result.description);
    });
  }

  deleteBoard(boardId: string): void {
    const confirmed = confirm('Delete this board?');

    if (!confirmed) return;

    this.boardService.deleteBoard(boardId);
  }

  openBoard(boardId: string): void {
    this.router.navigate(['/boards', boardId]);
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update((page) => page + 1);
    }
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.page.update((page) => page - 1);
    }
  }
}
