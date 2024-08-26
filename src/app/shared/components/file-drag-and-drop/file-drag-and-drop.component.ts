import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'file-drag-and-drop',
  standalone: true,
  imports: [
    MatGridListModule,
    MatIconModule
  ],
  templateUrl: './file-drag-and-drop.component.html',
  styleUrl: './file-drag-and-drop.component.scss'
})
export class FileDragAndDropComponent implements OnInit, OnDestroy {

  @Input() maxNumFiles: number;
  @Input() overwriteFilesOnSelect: boolean = false;
  @Input() clearFilesEvent: Observable<void>;

  @Output() selectedFiles = new EventEmitter<File[]>();

  @ViewChild('fileSelector') public fileSelector: ElementRef;

  private clearEventSubscription: Subscription;
  
  isDragging: boolean;
  currentSelectedFiles: File[];

  constructor() { }

  ngOnInit(): void {
    this.isDragging = false;
    this.currentSelectedFiles = [];
    this.clearEventSubscription = this.clearFilesEvent ? this.clearFilesEvent.subscribe(() => {
      this.currentSelectedFiles = [];
    }) : new Subscription();
  }

  ngOnDestroy(): void {
    this.clearEventSubscription.unsubscribe();
  }

  public onDrop(event: any): void {
    // Stop browser opening the file
    event.preventDefault();
    this.isDragging = false;

    if(this.overwriteFilesOnSelect)
      this.currentSelectedFiles = [];

    const files: File[] = [];
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (const item of event.dataTransfer.items) {
        if (item.kind !== 'file')
          return;
        
          this.currentSelectedFiles.push(item.getAsFile());
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (const file of event.dataTransfer.files) {
        this.currentSelectedFiles.push(file);
      }
    }

    this.selectedFiles.emit(this.currentSelectedFiles);
  }

  public onFilesSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files
    if (fileList == null || fileList.length == 0)
      return;

    if(this.overwriteFilesOnSelect)
      this.currentSelectedFiles = [];

    for(let i = 0; i < fileList.length; i++) {
      this.currentSelectedFiles.push(fileList[i]);
    }
    
    this.fileSelector.nativeElement.value = '';
    
    this.selectedFiles.emit(this.currentSelectedFiles);
  }

  public onDragOver(event: any): void {
    // Stop browser opening the file
    event.preventDefault();
    this.isDragging = true;
  }

  public stopDrag(event: any): void {
    this.isDragging = false;
    event.preventDefault();
    event.stopPropagation();
  }
}
