import { Observable } from 'rxjs/Rx';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { AuthService } from '../../modules/auth/auth.service';
import { ApplicationService } from '../../modules/applications/application.service';

@Component({
    selector:       'masthead',
    templateUrl:    './masthead.html',
    providers:      [ApplicationService],
})

export class MastheadComponent implements OnInit {
  public applications: any;
  public createAppForm: FormGroup;
  public submitted: boolean;
  public modalActions: EventEmitter<string>;
  public user: any;

  constructor(private router: Router, private applicationService: ApplicationService, private _fb: FormBuilder, private auth: AuthService) {
    this.modalActions = new EventEmitter<string>();
  }

  ngOnInit() {
    this.createAppForm = new FormGroup({
        name: new FormControl('', [<any>Validators.required])
    });
    this.user = this.auth.user();
  }

  save() {
    return this.applicationService.createApplication(this.createAppForm.controls['name'].value).subscribe(
      err => console.error('There was an error: ' + err),
      () => (this._complete()),
    )
  }

  logout(event: any) {
    event.preventDefault();
    // @todo move to auth service
    localStorage.removeItem('id_token');
    this.router.navigate(['login'])
  }

  _complete() {
    (<any>$('#create-application-modal')).modal('hide');
  }
}
