import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { APP_CONFIG } from '../../../../config/app-config.interface';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { AboutMenuProvider } from './about.menu';

describe('AboutMenuProvider', () => {
  let provider: AboutMenuProvider;
  let authorizationService: AuthorizationDataService;

  const appConfig = {
    info: {
      enableEndUserAgreement: true,
      enablePrivacyStatement: false,
    },
  };

  beforeEach(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });

    TestBed.configureTestingModule({
      providers: [
        AboutMenuProvider,
        { provide: APP_CONFIG, useValue: appConfig },
        { provide: AuthorizationDataService, useValue: authorizationService },
      ],
    });
    provider = TestBed.inject(AboutMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  it('getTopSection should return a visible text section', (done) => {
    provider.getTopSection().subscribe((section: PartialMenuSection) => {
      expect(section.visible).toBeTrue();
      expect(section.model.type).toEqual(MenuItemType.TEXT);
      expect((section.model as any).text).toEqual('menu.section.about');
      done();
    });
  });

  it('getSubSections should respect the info configuration and feedback authorization', (done) => {
    provider.getSubSections().subscribe((sections: PartialMenuSection[]) => {
      expect(sections.length).toEqual(5);
      const byText = (key: string) => sections.find((s) => (s.model as any).text === key);

      expect(byText('menu.section.about_repository').visible).toBeTrue();
      expect(byText('menu.section.about_end_user_agreement').visible).toBeTrue();
      expect(byText('menu.section.about_privacy').visible).toBeFalse();
      expect(byText('menu.section.about_contact').visible).toBeTrue();
      done();
    });
  });
});
