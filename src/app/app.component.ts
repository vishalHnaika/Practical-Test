import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, map, merge, Observable } from 'rxjs';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { AddEditRecordComponent } from './dialogs/add-edit-record/add-edit-record.component';
import { DataService, Issue } from './service/data.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: Issue[] = [];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'practical-test';

  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  displayedColumns: string[] = ['title', 'state', 'url', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(public httpClient: HttpClient,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public dataService: DataService) { }


  ngOnInit() {
    this.loadData();
  }

  /** Search list */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Load REST API Data
   */
  loadData() {
    this.dataService.getAllIssues().subscribe(res => {
      this.dataSource.data = res;
    })
  }

  /**
   * Open dialog for add and edit 
   * @param data 
   */
  addEditRecordDialog(data?: any): void {

    const dialogRef = this.dialog.open(AddEditRecordComponent, {
      data: { issue: data ? data : {} },
      width: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (data) {
          this.dataSource.data.forEach((val, i) => {
            if (val.id === data.id) {
              this.dataSource.data[i] = result;
            }
          })
        } else {
          this.dataSource.data.push(result);
        }
        this.table.renderRows();
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Open Confirmation dialog for delete record from list
   * @param data 
   */
  deleteRecord(data: any): void {

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { issue: data ? data : {} },
      width: '20%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (data) {
          this.dataSource.data.forEach((val, i) => {
            if (val.id === data.id) {
              this.dataSource.data.splice(i, 1);
            }
          });
        }
        this.table.renderRows();
        this.cdr.detectChanges();
      }
    });
  }
}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './dialogs/add-edit-record/confirmation-dialog.html',
  styleUrls: ['./app.component.scss']
})
export class ConfirmationDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
  ) { }

  /**
   * Delete record 
   * @param isDelete 
   */
  deleteRecord(isDelete: boolean) {
    if (isDelete) {
      this.dialogRef.close(isDelete);
    }
  }
}
