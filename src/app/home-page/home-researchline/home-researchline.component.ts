import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  Params,
  RouterLink,
} from '@angular/router';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';
import { RemoteData } from 'src/app/core/data/remote-data';
import { HALEndpointService } from 'src/app/core/shared/hal-endpoint.service';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { URLCombiner } from 'src/app/core/url-combiner/url-combiner';
import { FacetValue } from 'src/app/shared/search/models/facet-value.model';
import { FacetValues } from 'src/app/shared/search/models/facet-values.model';
import { SearchFilterConfig } from 'src/app/shared/search/models/search-filter-config.model';

/**
 * Mosaico de un Seminario de Investigación en la página de inicio
 */
export interface ResearchLineTile {
  /**
   * Valor EXACTO de la lista controlada de cm.researchline.
   * Se usa como texto accesible del mosaico y como valor del filtro de búsqueda.
   */
  name: string;
  /** Nombre del archivo de imagen, sin sufijo @2x ni extensión */
  image: string;
}

/** Ruta de la página de búsqueda de DSpace */
const SEARCH_ROUTE = '/search';

/** Nombre de la facet definida en discovery.xml (server/api/discover/facets/researchLine) */
const RESEARCH_LINE_FILTER = 'researchLine';

/**
 * Número máximo de valores que se piden a la facet. Debe ser mayor o igual al
 * total de valores distintos de cm.researchline que existan en el repositorio.
 */
const FACET_PAGE_SIZE = 50;

/**
 * Carpeta pública donde se copian las imágenes de los mosaicos.
 * - src/assets/images/seminarios/                 -> 'assets/images/seminarios'
 * - src/themes/<tema>/assets/images/seminarios/   -> 'assets/<tema>/images/seminarios'
 */
const IMAGES_PATH = 'assets/images/seminarios';

@Component({
  selector: 'ds-home-researchline',
  styleUrls: ['./home-researchline.component.scss'],
  templateUrl: './home-researchline.component.html',
  imports: [
    AsyncPipe,
    RouterLink,
  ],
})

/**
 * Component to render the research line section on the home page.
 * Only the research lines that have at least one item are rendered; if none of
 * them has items the whole section is hidden.
 */
export class HomeResearchlineComponent implements OnInit {

  readonly title = 'Seminarios de Investigación';

  readonly searchRoute = SEARCH_ROUTE;

  /**
   * Los 6 seminarios, en el orden en que se muestran (de izquierda a derecha y de arriba a abajo)
   */
  readonly tiles: ResearchLineTile[] = [
    {
      name: 'Estudios Urbanos y Socioespaciales',
      image: 'estudios-urbanos-y-socioespaciales',
    },
    {
      name: 'Estudios Interdisciplinarios sobre el Pasado Indígena',
      image: 'estudios-interdisciplinarios-pasado-indigena',
    },
    {
      name: 'Instituciones, Sociedad Civil y Políticas Públicas',
      image: 'instituciones-sociedad-civil-politicas-publicas',
    },
    {
      name: 'Historia Contemporánea',
      image: 'historia-contemporanea',
    },
    {
      name: 'Historia de las Instituciones Virreinales',
      image: 'historia-instituciones-virreinales',
    },
    {
      name: 'Población, Cultura y Sociedad',
      image: 'poblacion-cultura-y-sociedad',
    },
  ];

  /**
   * Mosaicos que se pintan: los que tienen al menos un ítem en la facet.
   * No emite nada hasta que responde el servidor, así que mientras tanto no se pinta la sección.
   */
  visibleTiles$: Observable<ResearchLineTile[]>;

  constructor(
    protected halService: HALEndpointService,
    protected searchService: SearchService,
  ) {
  }

  ngOnInit(): void {
    this.visibleTiles$ = this.halService.getEndpoint('discover').pipe(
      switchMap((discoverHref: string) => {
        const filterConfig = Object.assign(new SearchFilterConfig(), {
          name: RESEARCH_LINE_FILTER,
          pageSize: FACET_PAGE_SIZE,
          _links: {
            self: { href: new URLCombiner(discoverHref, 'facets', RESEARCH_LINE_FILTER).toString() },
          },
        });
        return this.searchService.getFacetValuesFor(filterConfig, 1);
      }),
      getFirstCompletedRemoteData(),
      map((facetValuesRD: RemoteData<FacetValues>) => {
        if (!facetValuesRD.hasSucceeded) {
          // Si la consulta falla no se sabe qué seminarios tienen ítems: se muestran todos
          return this.tiles;
        }
        const withItems = new Set(
          (facetValuesRD.payload?.page ?? [])
            .filter((facetValue: FacetValue) => facetValue.count > 0)
            .map((facetValue: FacetValue) => facetValue.value.trim()),
        );
        return this.tiles.filter((tile: ResearchLineTile) => withItems.has(tile.name));
      }),
    );
  }

  /**
   * Parámetros de la búsqueda filtrada por seminario:
   * /search?f.researchLine=<valor>,equals&spc.page=1
   */
  getQueryParams(tile: ResearchLineTile): Params {
    return {
      [`f.${RESEARCH_LINE_FILTER}`]: `${tile.name},equals`,
      'spc.page': 1,
    };
  }

  /** Imagen a 380 x 150 px */
  getImage(tile: ResearchLineTile): string {
    return `${IMAGES_PATH}/${tile.image}.png`;
  }

  /** Imagen 1x y 2x; el navegador elige según el ancho real del mosaico y la densidad de pantalla */
  getImageSrcset(tile: ResearchLineTile): string {
    return `${IMAGES_PATH}/${tile.image}.png 380w, ${IMAGES_PATH}/${tile.image}@2x.png 760w`;
  }
}
