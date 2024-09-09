import { NgClass, NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'rb-pc-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  build: IPCBuild;

  constructor(
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({pcBuild}) => {
      if(pcBuild !== undefined) {
        console.log('build', pcBuild);
        this.build = pcBuild;
      }
    });
  }

  updateBuild(build: IPCBuild): void {
    this.build = build;
  }
}
