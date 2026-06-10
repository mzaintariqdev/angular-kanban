import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './task-dialog.html',
})
export class TaskDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TaskDialogComponent>);

  readonly data = inject(MAT_DIALOG_DATA, {
    optional: true,
  });

  task = {
    title: this.data?.title ?? '',
    description: this.data?.description ?? '',
    priority: this.data?.priority ?? 'medium',
  };

  save(): void {
    this.dialogRef.close(this.task);
  }
}
