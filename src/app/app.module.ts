import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";

import { EsriLoaderModule } from 'angular-esri-loader';
import { Ng2CompleterModule } from "ng2-completer";

import { AppComponent } from './app.component';
import { LoadingComponent } from './loading/loading.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { SearchToolbarComponent } from './search-toolbar/search-toolbar.component';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { AddressResultPanelComponent } from './address-result-panel/address-result-panel.component';
import { LocationPanelComponent } from './location-panel/location-panel.component';
import { LayersPanelComponent } from './layers-panel/layers-panel.component';

import {AppService} from "./app.service";
import {PanelService} from "./panel.service";
import { RemoveSpacesPipe } from './remove-spaces.pipe';
import { DisclaimerMessageBoxComponent } from './disclaimer-message-box/disclaimer-message-box.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    EsriMapComponent,
    SearchToolbarComponent,
    LeftPanelComponent,
    AddressResultPanelComponent,
    LocationPanelComponent,
    LayersPanelComponent,
    RemoveSpacesPipe,
    DisclaimerMessageBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    EsriLoaderModule,
    Ng2CompleterModule
  ],
  providers: [AppService, PanelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
