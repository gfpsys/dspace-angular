
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { getResourceTypeValueFor } from '../../../../../core/cache/object-cache.reducer';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import {
  hasValue,
  isEmpty,
} from '../../../../empty.util';

@Component({
  selector: 'ds-base-type-badge',
  templateUrl: './type-badge.component.html',
  imports: [
    TranslateModule,
  ],
})
/**
 * Component rendering the type of an item as a badge
 */
export class TypeBadgeComponent {

  private _object: DSpaceObject;
  private _typeMessage: string;
  private _type: string;

  /**
   * The component used to retrieve the type from
   */
  @Input() set object(object: DSpaceObject) {
    this._object = object;

    const type = this._object.firstMetadataValue('dc.type');
    if (hasValue(type)) {
      this._type = type;
    } else {
      const renderTypes = this._object.getRenderTypes();
      if (!isEmpty(renderTypes.length)) {
        const renderType = renderTypes[0];
        if (renderType instanceof Function) {
          const resourceTypeValue = getResourceTypeValueFor(object.type);
          if (hasValue(resourceTypeValue)) {
            this._typeMessage = `${resourceTypeValue.toLowerCase()}.listelement.badge`;
          } else {
            this._typeMessage = `${renderType.name.toLowerCase()}.listelement.badge`;
          }
        } else {
          this._typeMessage = `${renderType.toLowerCase()}.listelement.badge`;
        }
      }
    }
  }

  get object(): DSpaceObject {
    return this._object;
  }

  get typeMessage(): string {
    return this._typeMessage;
  }

  get type(): string {
    return this._type;
  }
}
