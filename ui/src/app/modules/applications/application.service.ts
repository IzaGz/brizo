import { Observable } from 'rxjs/Rx';
import { Component, Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { AuthService } from '../auth/auth.service';
import { Application } from './application.model'

@Injectable()
export class ApplicationService {

  private applicationsCreateUrl = '/api/v1/applications'
  private applicationsGetUrl    = '/api/v1/applications/'
  private applicationsUpdateUrl = '/api/v1/applications/'
  private applicationsIndexUrl  = '/api/v1/applications'

  constructor(private http: Http, private auth: AuthService) { }

  getApplications(): Observable<Application[]> {
    return this.http.get(this.applicationsIndexUrl, this.auth.jwtRequestOptions())
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getApplication(uuid: string): Observable<Application> {
    return this.http.get(this.applicationsGetUrl + uuid, this.auth.jwtRequestOptions())
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  createApplication(name: string): Observable<Application> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.auth.getToken()
    });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.applicationsCreateUrl, { name }, options)
      .map((res: Response) => res.json() || {})
      .catch(this.handleError);
  }

  editApplication(application: Application): Observable<Application> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.auth.getToken()
    });

    const options = new RequestOptions({ headers: headers });
    const data = { name: application.name }

    return this.http.patch(this.applicationsUpdateUrl + application.uuid, data, options)
      .map((res: Response) => res.json() || {})
      .catch(this.handleError);
  }

  handleError(error: any) {
    return Observable.throw(error || "Server error")
  }
}
