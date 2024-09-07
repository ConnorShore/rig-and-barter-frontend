import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { IPCBuild } from "src/app/models/pc-builder/pc-build";
import { PCBuilderService } from "src/app/services/pc-builder.service";


export const pcBuildResolver: ResolveFn<IPCBuild> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    pcBuilderService: PCBuilderService = inject(PCBuilderService)
) => {
    return pcBuilderService.getPCBuild();
}