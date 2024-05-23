import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { BillingInfoComponent } from './billing-info/billing-info.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { IUserResponse } from 'src/app/model/user-info/user-response';

interface ISubPage {
  title: string;
  component: any;
  inputs: any;
}

@Component({
  selector: 'rb-user-profile',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CommonModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  user: IUserResponse;
  selectedSubPageIndex: number = 0;

  SUB_PAGES: ISubPage[] = [];

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    console.log('this.activatedRoute.data: ', this.activatedRoute.data);
    this.activatedRoute.data.subscribe(({user}) => {
      this.user = user;
      this.initSubPages();
    });
  }

  selectSubPage(index: number) {
    this.selectedSubPageIndex = index;
  }

  isSelectedSubPage(index: number) {
    return this.selectedSubPageIndex === index;
  }

  getSelectedSubPage() {
    return this.SUB_PAGES[this.selectedSubPageIndex];
  }

  private initSubPages() {
    this.SUB_PAGES = [
      {
        title: 'Basic Info', 
        component: BasicInfoComponent,
        inputs: {
          'user': this.user
        }
      },
      {
        title: 'Billing Info',
        component: BillingInfoComponent,
        inputs: {
          'user': this.user
        }
    }];
  }
}
