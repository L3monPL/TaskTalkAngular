import { Component } from '@angular/core';
import { CompanyManagementService } from '../../../services/global/company-management.service';

@Component({
  selector: 'app-users-list-company',
  standalone: true,
  imports: [],
  templateUrl: './users-list-company.component.html',
  styleUrl: './users-list-company.component.scss'
})
export class UsersListCompanyComponent {

  constructor( 
    public companyManagement: CompanyManagementService
  ) { }
}
