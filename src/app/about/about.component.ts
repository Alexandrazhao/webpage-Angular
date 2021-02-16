import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  leaders: Leader[];
  selectedLeader: Leader;
  constructor(private leaderservice: LeaderService) { }

  ngOnInit(){
    //let id = this.route.snapshot.params['id'];
    this.leaders = this.leaderservice.getLeaders();
  }

}
