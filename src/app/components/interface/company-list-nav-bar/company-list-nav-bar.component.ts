import { Component, Input } from '@angular/core';
import { Company } from '../../../services/rest/company.service';

@Component({
  selector: 'app-company-list-nav-bar',
  standalone: true,
  imports: [

  ],
  templateUrl: './company-list-nav-bar.component.html',
  styleUrl: './company-list-nav-bar.component.scss'
})
export class CompanyListNavBarComponent {

  @Input() companyList?: Array<Company>
}
