import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { IUserResponse } from 'src/app/models/user-info/user-response';
import { SettingsComponent } from './settings/settings.component';

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

      this.activatedRoute.params.subscribe(params => {
        switch(params["section"]) {
          case 'payment-info':
            this.selectSubPage(1)
            break;
          default:
            this.selectSubPage(0);
            break;
        }
      });
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

  getProfilePicture(): string {
    return this.user.basicInfo.profilePictureUrl ?? '../../../../assets/img/avatars/noavatar.png';
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
        title: 'Payment Info',
        component: PaymentInfoComponent,
        inputs: {
          'user': this.user
        }
      },
      {
        title: 'Settings',
        component: SettingsComponent,
        inputs: {
          'user': this.user
        }
      }
    ];
  }
}
