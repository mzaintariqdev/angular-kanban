import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-board-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './create-board-dialog.html',
  styleUrl: './create-board-dialog.scss',
})
export class CreateBoardDialogComponent {
  private readonly dialogRef = inject(MatDialogRef);

  model = {
    name: '',
    description: '',
  };

  create(): void {
    if (!this.model.name.trim()) return;

    this.dialogRef.close(this.model);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
