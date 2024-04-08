import { Component, Input } from '@angular/core';
import { Company } from '../../../services/rest/company.service';
import { Router } from '@angular/router';
import {Dialog, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';
import { DialogCompanyActionCreateOrJoinComponent } from '../../dialogs/companyActionCreateOrJoinMenu/dialog-company-action-create-or-join/dialog-company-action-create-or-join.component';

@Component({
  selector: 'app-company-list-nav-bar',
  standalone: true,
  imports: [
    DialogModule
  ],
  templateUrl: './company-list-nav-bar.component.html',
  styleUrl: './company-list-nav-bar.component.scss'
})
export class CompanyListNavBarComponent {

  @Input() companyList?: Array<Company>

  constructor( 
    private router: Router,
    public dialog: Dialog
  ) { }

  selectCompany(companyId: number){
    this.router.navigate([`/app/company/${companyId}`])
  }

  companyAddOrJoin() {
    this.dialog.open(DialogCompanyActionCreateOrJoinComponent, {
      minWidth: '300px',
      data: {
        animal: 'panda',
      },
    });
  }
}
