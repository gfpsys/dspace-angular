/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../config/app-config.interface';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import {
  getEndUserAgreementPath,
  getFeedbackPath,
  getPrivacyPath,
} from '../../../info/info-routing-paths';
import { ExternalLinkMenuItemModel } from '../menu-item/models/external-link.model';
import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { TextMenuItemModel } from '../menu-item/models/text.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { AbstractExpandableMenuProvider } from './helper-providers/expandable-menu-provider';

/**
 * Menu provider that creates the "About" ("Acerca de") drop-down section in the public navbar.
 *
 * The top section is a plain text item (it only opens the drop-down). The sub sections are the
 * links shown inside the drop-down. Edit {@link getSubSections} to add, remove or reorder them.
 *
 * Two kinds of links are available:
 *  - MenuItemType.LINK      -> internal Angular route, e.g. '/info/privacy'   (uses `link`)
 *  - MenuItemType.EXTERNAL  -> any absolute URL, e.g. 'https://example.org' (uses `href`)
 *
 * Every `text` value is an i18n key that must exist in src/assets/i18n/*.json5
 */
@Injectable()
export class AboutMenuProvider extends AbstractExpandableMenuProvider {

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected authorizationService: AuthorizationDataService,
  ) {
    super();
  }

  /**
   * The "Acerca de" entry that is shown in the navbar and opens the drop-down.
   */
  getTopSection(): Observable<PartialMenuSection> {
    return of({
      model: {
        type: MenuItemType.TEXT,
        text: 'menu.section.about',
      } as TextMenuItemModel,
      icon: 'circle-info',
      visible: true,
    });
  }

  /**
   * The entries inside the drop-down, in the order they will be displayed.
   */
  getSubSections(): Observable<PartialMenuSection[]> {
    return this.authorizationService.isAuthorized(FeatureID.CanSendFeedback).pipe(
      map((canSendFeedback: boolean) => [
        // 1. External page describing the repository.
        //    TODO: replace the href with your real URL.
        {
          visible: true,
          model: {
            type: MenuItemType.EXTERNAL,
            text: 'menu.section.about_repository',
            href: 'https://www.example.org/acerca-del-repositorio',
          } as ExternalLinkMenuItemModel,
        },
        // 2. Repository policies (external page).
        //    TODO: replace the href with your real URL, or delete this block.
        {
          visible: true,
          model: {
            type: MenuItemType.EXTERNAL,
            text: 'menu.section.about_policies',
            href: 'https://www.example.org/politicas-del-repositorio',
          } as ExternalLinkMenuItemModel,
        },
        // 3. Built-in DSpace End User Agreement page (/info/end-user-agreement).
        //    Only shown when info.enableEndUserAgreement is true in config.yml.
        {
          visible: this.appConfig.info?.enableEndUserAgreement ?? false,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.about_end_user_agreement',
            link: getEndUserAgreementPath(),
          } as LinkMenuItemModel,
        },
        // 4. Built-in DSpace Privacy Statement page (/info/privacy).
        //    Only shown when info.enablePrivacyStatement is true in config.yml.
        {
          visible: this.appConfig.info?.enablePrivacyStatement ?? false,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.about_privacy',
            link: getPrivacyPath(),
          } as LinkMenuItemModel,
        },
        // 5. Built-in DSpace Feedback / contact form (/info/feedback).
        //    Only shown when the backend allows sending feedback (feedback.recipient in dspace.cfg/local.cfg).
        {
          visible: canSendFeedback,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.about_contact',
            link: getFeedbackPath(),
          } as LinkMenuItemModel,
        },
      ] as PartialMenuSection[]),
    );
  }
}
