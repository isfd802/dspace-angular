
import { mergeMap, filter, map, take } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Bitstream } from '../../core/shared/bitstream.model';

import { Item } from '../../core/shared/item.model';

import { MetadataService } from '../../core/metadata/metadata.service';

import { fadeInOut } from '../../shared/animations/fade';
import { hasValue } from '../../shared/empty.util';
import { ItemViewMode } from '../../shared/items/item-type-decorator';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-item-page',
  styleUrls: ['./item-page.component.scss'],
  templateUrl: './item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
export class ItemPageComponent implements OnInit {

  /**
   * The item's id
   */
  id: number;

  /**
   * The item wrapped in a remote-data object
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The item's thumbnail
   */
  thumbnail$: Observable<Bitstream>;

  /**
   * The view-mode we're currently on
   */
  viewMode = ItemViewMode.Full;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private items: ItemDataService,
    private metadataService: MetadataService,
  ) { }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(map((data) => data.item));
    this.itemRD$.pipe(take(1)).subscribe((itemRD: RemoteData<Item>) => {
      if (itemRD.hasFailed && itemRD.error.statusCode === 404) {
        this.router.navigateByUrl('/404', { skipLocationChange: true });
      }
    });
    this.metadataService.processRemoteData(this.itemRD$);
    this.thumbnail$ = this.itemRD$.pipe(
      map((rd: RemoteData<Item>) => rd.payload),
      filter((item: Item) => hasValue(item)),
      mergeMap((item: Item) => item.getThumbnail()));
  }
}
