import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageModule } from 'src/app/modules/language/language.module';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  supportedLanguages: LanguageModule[];
  selectedLanguage: String;
  constructor(private languageService:LanguageService, private router: Router) { }
  
  ngOnInit(): void {
    this.supportedLanguages = [
      {code: "en", name: "English"},
      {code: "ch-sim", name: "汉语"},
    ];
    this.selectedLanguage = this.languageService.getSelectedLanguage();
  }

  onselectedLanguageChange(languageCode:string) {
    this.languageService.updateSelectedLanguage(languageCode);
    this.router.navigateByUrl("/"+languageCode+"/")
  }

}
