import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TermoComponent } from './termo/termo.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TesteConfetesComponent } from './teste-confetes/teste-confetes.component';
import { HelpModalComponent } from './help-modal/help-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    TermoComponent,
    TesteConfetesComponent,
    HelpModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule, // required animations module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
