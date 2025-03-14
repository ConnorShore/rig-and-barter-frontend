import { PCBuilderService } from "src/app/services/pc-builder.service";
import { PcBuilderComponent } from "./pc-builder.component";
import { Routes } from "@angular/router";
import { pcBuildsResolver } from "./resolvers/pc-build.resolver";
import { BuildEditorComponent } from "./build-editor/build-editor.component";


export const PC_BUIlDER_ROUTES: Routes = [
    {
        path: '',
        component: PcBuilderComponent,
        providers: [
            PCBuilderService
        ],
        resolve: {
            pcBuilds: pcBuildsResolver
        },
        children: [
            {
              path: '',
              component: BuildEditorComponent
            }
        ] 
    }
];
