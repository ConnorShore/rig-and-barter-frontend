import { NgClass, NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger80ms } from '@vex/animations/stagger.animation';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { IPCBuild } from 'src/app/models/pc-builder/pc-build';
import { BuildEditorComponent } from "./build-editor/build-editor.component";
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { PCBuilderService } from 'src/app/services/pc-builder.service';

@Component({
  selector: 'rb-pc-builder',
  animations: [fadeInUp400ms, stagger80ms],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    NgClass,
    NgIf,
    VexScrollbarComponent,
    NgFor,
    MatRippleModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    AsyncPipe,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    BuildEditorComponent
],
  templateUrl: './pc-builder.component.html',
  styleUrl: './pc-builder.component.scss'
})
export class PcBuilderComponent implements OnInit{

  builds: IPCBuild[];
  selectedBuild: IPCBuild | undefined;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly ngDetectorRef: ChangeDetectorRef,
    private readonly deleteConfirmationDialog: MatDialog,
    private readonly pcBuilderService: PCBuilderService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({pcBuilds}) => {
      this.builds = pcBuilds;
    });
  }

  addNewBuild() {
    let buildName = 'New Build';

    let index = 1;
    while(this.builds.find(b => b.name === buildName)) {
      buildName += ` (${index++})`;
    }

    let newBuild: IPCBuild = {
      name: buildName,
      cpuComponent: undefined,
      motherboardComponent: undefined,
      memoryComponents: [],
      solidStateDriveComponents: [],
      hardDriveComponents: [],
      gpuComponent: undefined,
      powerSupplyComponent: undefined,
      caseComponent: undefined
    };

    this.builds.push(newBuild);
    this.selectedBuild = newBuild;
    this.ngDetectorRef.detectChanges();
  }

  selectBuild(build: IPCBuild): void {
    this.selectedBuild = build;
  }

  updateBuild(build: IPCBuild): void {
    // TODO: May need to replace the "New Build" with the created build when creating new builds
    let index = this.builds.findIndex(b => b.id === build.id);
    console.log('current index for build: ', index);
    if(index != -1) {
      this.builds[index] = build;
      this.selectedBuild = this.builds[index];
    }
    else {
      this.builds[this.builds.length - 1] = build;
      this.selectedBuild = this.builds[this.builds.length - 1];
    }
  }

  deleteBuild(build: IPCBuild): void {
    this.deleteConfirmationDialog.open(DeleteConfirmationDialogComponent, {
      data: {
        title: 'Delete Build',
        body: 'Are you sure you want to delete this build?',
        confirmButtonText: 'Delete'
      }
    }).afterClosed().subscribe(result => {
      if(result) {
        this.deleteBuildFromList(build);
      }
    });
  }

  deleteBuildFromList(build: IPCBuild): void {
    this.pcBuilderService.deletePCBuild(build.id as string).subscribe(() => {
      let index = this.builds.findIndex(b => b.id === build.id);
      if(index != -1) {
        this.builds.splice(index, 1);
        this.selectedBuild = this.builds.length > 0 ? this.builds[0] : undefined;
        this.ngDetectorRef.detectChanges();
      }
    });
  }
}
