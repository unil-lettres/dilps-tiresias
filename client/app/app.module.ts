import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule, MatListModule, MatPaginatorModule, MatProgressSpinnerModule,
    MatSidenavModule, MatSnackBarModule, MatTableModule, MatToolbarModule,
} from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgProgressModule } from 'ngx-progressbar';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './shared/services/auth.guard';
import { ThemeService } from './shared/services/theme.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworkActivityService } from './shared/services/network-activity.service';
import { UserService } from './users/services/user.service';

import { AppComponent } from './app.component';
import { UserComponent } from './users/user/user.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { BootLoaderComponent } from './shared/components/boot-loader/boot-loader.component';
import { ListComponent } from './list/list.component';
import { ImageComponent } from './image/image.component';
import { NaturalGalleryModule } from 'angular-natural-gallery';
import { UsersComponent } from './users/users/users.component';
import { TableButtonComponent } from './shared/components/table-button/table-button.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        UserComponent,
        HomeComponent,
        BootLoaderComponent,
        ListComponent,
        ImageComponent,
        UsersComponent,
        TableButtonComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        ApolloModule,
        HttpLinkModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        NgProgressModule,
        PerfectScrollbarModule,
        MatInputModule,
        MatSnackBarModule,
        FlexLayoutModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        NaturalGalleryModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatPaginatorModule
    ],
    providers: [
        AuthGuard,
        ThemeService,
        NetworkActivityService,
        UserService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(apollo: Apollo, httpLink: HttpLink) {
        apollo.create({
            link: httpLink.create({uri: '/graphql'}),
            cache: new InMemoryCache(),
        });
    }

}
