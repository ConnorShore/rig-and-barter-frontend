import { Component } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { VexConfigService } from '@vex/config/vex-config.service';
import { VexSidebarComponent } from '@vex/components/vex-sidebar/vex-sidebar.component';

import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { QuickpanelComponent } from '../components/quickpanel/quickpanel.component';
import { ConfigPanelToggleComponent } from '../components/config-panel/config-panel-toggle/config-panel-toggle.component';
import { ConfigPanelComponent } from '../components/config-panel/config-panel.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseLayoutComponent } from '../base-layout/base-layout.component';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { SearchComponent } from '../components/toolbar/search/search.component';
import { VexProgressBarComponent } from '@vex/components/vex-progress-bar/vex-progress-bar.component';
import { VexConfig } from '@vex/config/vex-config.interface';

@Component({
  selector: 'vex-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [
    BaseLayoutComponent,
    NgIf,
    AsyncPipe,
    SidenavComponent,
    ToolbarComponent,
    FooterComponent,
    QuickpanelComponent,
    ConfigPanelToggleComponent,
    VexSidebarComponent,
    ConfigPanelComponent,
    MatDialogModule,
    MatSidenavModule,
    NgTemplateOutlet,
    RouterOutlet,
    SearchComponent,
    VexProgressBarComponent
  ],
  standalone: true
})
export class LayoutComponent {
  config$: Observable<VexConfig> = this.configService.config$;
  sidenavCollapsed$: Observable<boolean> = this.layoutService.sidenavCollapsed$;
  sidenavDisableClose$: Observable<boolean> = this.layoutService.isDesktop$;
  sidenavFixedInViewport$: Observable<boolean> =
    this.layoutService.isDesktop$.pipe(map((isDesktop) => !isDesktop));
  sidenavMode$: Observable<MatDrawerMode> = combineLatest([
    this.layoutService.isDesktop$,
    this.configService.select((config) => config.layout)
  ]).pipe(
    map(([isDesktop, layout]) =>
      !isDesktop || layout === 'vertical' ? 'over' : 'side'
    )
  );
  sidenavOpen$: Observable<boolean> = this.layoutService.sidenavOpen$;
  configPanelOpen$: Observable<boolean> = this.layoutService.configPanelOpen$;
  quickpanelOpen$: Observable<boolean> = this.layoutService.quickpanelOpen$;

  constructor(
    private readonly layoutService: VexLayoutService,
    private readonly configService: VexConfigService
  ) {}

  onSidenavClosed(): void {
    this.layoutService.closeSidenav();
  }

  onQuickpanelClosed(): void {
    this.layoutService.closeQuickpanel();
  }
}
