import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-settings-company-nav',
  standalone: true,
  imports: [],
  templateUrl: './settings-company-nav.component.html',
  styleUrl: './settings-company-nav.component.scss'
})
export class SettingsCompanyNavComponent implements OnInit{

  constructor( 
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkUrl()
  }

  idParam?: number

  checkUrl() {
    this.route.paramMap.subscribe(params => {
      this.idParam = Number(params.get('id')!)

      console.log(this.idParam)
    });
  }

  navigateSettings(url: string){
    this.router.navigate([`/app/company/${this.idParam}/settings/${url}`])
  }
}
