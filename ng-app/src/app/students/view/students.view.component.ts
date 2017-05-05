import {Component} from '@angular/core';
import {Student} from '../student';
import {ActivatedRoute, Params} from "@angular/router";
import {StudentsDataService} from "../../service/students-data.service";
import 'rxjs/add/operator/switchMap';
@Component({
  selector: 'students-view',
  templateUrl: './students.view.component.html',
  styleUrls: ['./students.view.component.css']
})
export class StudentsViewComponent {
  private router: any;
  constructor(private route: ActivatedRoute, private studentDataService: StudentsDataService) {
  }

  student: Student;
  isNoData: boolean;
  inputCount: number;
  students: Student[];

  ngOnInit() {
    this.isNoData = false;
    this.inputCount = 15;
    this.route.params
      .switchMap((params: Params) => this.studentDataService.getStudent(+params['id']))
      .subscribe((student: Student) => {
          if (student !== null)
            this.student = student;
          else
            this.isNoData = true;
        }
      );
    this.studentDataService.getStudentsData()
      .subscribe(students => this.students = students,
        (error: Error) => {
          if (error.message === 'UnAuthorize') {
            this.router.navigate(['login'],{queryParams:{source:'student'}});
          }
        });
  }
}
