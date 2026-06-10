import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-column-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './column-dialog.html',
})
export class ColumnDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ColumnDialogComponent>);

  readonly data = inject(MAT_DIALOG_DATA, {
    optional: true,
  });

  name = this.data?.name ?? '';

  save(): void {
    this.dialogRef.close(this.name.trim());
  }
}
