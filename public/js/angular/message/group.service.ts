import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Group }           from './group';
import { Observable }     from 'rxjs/Observable';

@Injectable()

export class GroupService {
  private groupUrl = '/getGroups.';  // URL to web API

  constructor (private http: Http) {}

  getGroups (companyCode: string): Observable<Group[]> {
    return this.http.get(this.groupUrl + companyCode)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || [];
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
