import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { UnitService } from '../services/unit.service'
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  lang = 'en';
  markdown = '';
  updated = [
    [208001505, 208001005, 208000305]
  ];
  formattedUpdate = []
  youtubeId = null;

  constructor(
    private translateService: TranslateService,
    private unitService: UnitService,
    private httpClient: HttpClient
  ) {
    this.getTranslation();
    this.getUnits();

    this.lang = this.translateService.currentLang;

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = this.translateService.currentLang;
      this.getTranslation();
      this.getUnits();
    });
  }

  ngOnInit() {
    this.httpClient
      .get<any>("https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=UCvRB2kQNT7QlrGTigTVXU2w&key=AIzaSyAElnFixLPjzIgo0XOofEzJDPQJ80CXXo4")
      .subscribe(
        data => {
          this.youtubeId = data && data.items && data.items[0] && data.items[0].id ? data.items[0].id.videoId : null;
        },
        error => {
          console.log("Error", error);
        }
    );
  }

  private getTranslation() {
    this.translateService.get('home.markdown').subscribe((res: string) => {
      this.markdown = res;
    });
  }

  private getUnits() {
    this.formattedUpdate = [];
    let i =0;
    this.updated.forEach(update => {
      this.formattedUpdate.push([])
      update.forEach(id => {
        let unit = this.unitService.getUnit(id);
        unit.name = unit.getName(this.translateService);
        this.formattedUpdate[i].push(unit);
      });
      i++;
    })
  }
}
