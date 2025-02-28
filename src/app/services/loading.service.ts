// src/app/loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private isLoading = new BehaviorSubject<boolean>(false);
    loading$ = this.isLoading.asObservable();

    show() {
        this.isLoading.next(true);
    }

    hide() {
        this.isLoading.next(false);
    }
}