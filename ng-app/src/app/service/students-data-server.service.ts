import {Injectable} from '@angular/core';
import {Student} from '../students/student';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from "rxjs/Rx";
import {AuthenticationService} from './authentication.service';


@Injectable()
export class StudentsDataServerService {
  constructor(private http: Http, private authenticationService: AuthenticationService) {
  }

  private headers = new Headers({
    'Content-type': 'application/json',
    'Authorization': 'Bearer ' + this.authenticationService.getToken()
  });

  getStudentsData() {
    let studentArray: Student[];
    return this.http.get('http://localhost:8080/student',({headers:this.headers}))
        .map(res => res.json())
        .catch( (error: any) => {
          return Observable.throw(new Error('UnAuthorize'));
       });

  }

  getStudent(id: number) {
    let student: Student;
    return this.http.get('http://localhost:8080/student/' + id,({headers:this.headers}))
      .map((res: Response) => {
        if (res) {
          if (res.status === 200) {
            return res.json()
          }
          if (res.status === 204) {
            return null;
          }
        }
      })
      .catch((error: any) => {
        if (error.status === 500) {
          return Observable.throw(new Error(error.status));
        }
        else if (error.status === 400) {
          return Observable.throw(new Error(error.status));
        }
        else if (error.status === 409) {
          return Observable.throw(new Error(error.status));
        }
        else if (error.status === 406) {
          return Observable.throw(new Error(error.status));
        }
        return error;
      })
      ;


  }

  // addStudent(student: Student) {
  //   let formData = new FormData();
  //
  //   formData.append('file', student.file);
  //   student.file = null;
  //   formData.append('student', JSON.stringify(student));
  //   console.log(JSON.stringify(student));
  //   return this.http
  //     .post('http://localhost:8080/student', formData)
  //     .map(res => res.json);
  //
  // }

  addStudent(student: Student,file:any) {
    let formData = new FormData();
    let fileName: string;

    formData.append('file', file);
    let header = new Headers({'Authorization': 'Bearer ' + this.authenticationService.getToken()});
    let options = new RequestOptions({headers: header});
    return this.http.post('http://localhost:8080/student/image', formData,options)
      .flatMap(filename => {
        student.image = filename.text();
        let headers = new Headers({'Content-Type': 'application/json',});
        let options = new RequestOptions({headers: this.headers});
        let body = JSON.stringify(student);
        return this.http.post('http://localhost:8080/student', body, options)
          .map(res => {
            return res.json()
          })
          .catch((error: any) => {
            return Observable.throw(new Error(error.status))
          })
      })



  }
}
