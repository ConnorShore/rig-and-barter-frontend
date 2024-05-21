import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserResponse } from 'src/app/model/user-response';

@Component({
  selector: 'rb-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  user: IUserResponse;

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    console.log('this.activatedRoute.data: ', this.activatedRoute.data);
    this.activatedRoute.data.subscribe(({user}) => {
      console.log('user in profile: ', user);
      this.user = user;
    });
  }
}
