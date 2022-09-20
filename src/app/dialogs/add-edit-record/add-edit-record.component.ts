import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-add-edit-record',
  templateUrl: './add-edit-record.component.html',
  styleUrls: ['./add-edit-record.component.scss']
})
export class AddEditRecordComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditRecordComponent>,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      id: [{ value: this.modalData ? this.modalData.issue.id : '', disabled: this.modalData.issue.id ? true : false }, [Validators.required]],
      title: [this.modalData ? this.modalData.issue.title : '', [Validators.required]],
      state: [this.modalData ? this.modalData.issue.state : '', [Validators.required]],
      url: [this.modalData ? this.modalData.issue.url : ''],
    });
  }

  /**
   * Submit dialog data.
   */
  submitData(): void {
    if (this.myForm.valid) {
      this.dialogRef.close(this.myForm.value);
    }
  }
}
