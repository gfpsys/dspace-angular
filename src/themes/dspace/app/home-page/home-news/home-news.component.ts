import { Component } from '@angular/core';

import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { SharedModule } from 'primeng/api'; // Necesario para pTemplate

@Component({
  selector: 'ds-themed-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html',
  imports: [
    ButtonModule,
    CarouselModule,
    SharedModule
  ]
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent extends BaseComponent {

    background: string[] = ['cmq_carousel_1.jpg', 'cmq_carousel_2.jpg', 'cmq_carousel_3.jpg'];

    get backgrounds(): string[] {
      return this.background;
  }
}
