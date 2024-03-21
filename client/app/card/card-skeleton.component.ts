import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LogoComponent} from '../shared/components/logo/logo.component';

@Component({
    selector: 'app-card-skeleton',
    imports: [CommonModule, MatProgressSpinnerModule, LogoComponent],
    styles: [
        `
            :host {
                width: 100%;
            }

            .background-fade {
                background: transparent;
                bottom: 0;
                height: 300px;
                left: 0;
                position: absolute;
                right: 0;
                z-index: 10;
            }

            .block-button {
                border-radius: 50px;
                height: 40px;
                width: 40px;
            }

            .block-input {
                border-radius: 10px;
                height: 56px;
                margin: 0 12px 22.5px 12px;
                width: 375px;
            }

            .block-input-xs {
                border-radius: 10px;
                height: 15px;
                margin: 0 20px 15px 20px;
                width: 200px;
            }

            .block-input-sm {
                border-radius: 10px;
                height: 7px;
                margin: 0 auto 40px auto;
                width: 330px;
            }

            .image {
                align-items: center;
                display: flex;
                flex-grow: 1;
                justify-content: space-around;
            }

            .left-pane {
                overflow: hidden;
            }

            .left-pane > div {
                padding-top: 20px;
                position: relative;
            }

            .skeleton-menu {
                display: flex;
                height: 50px;
                justify-content: space-between;
                padding: 0 15px 15px;
            }

            .skeleton-screen {
                display: flex;
                height: 100vh;
            }
        `,
    ],
    template: `
        <div class="skeleton-screen">
            <div class="left-pane">
                <div>
                    <div class="skeleton-menu">
                        <app-logo [data]="{type: 'toolbar', class: 'logo'}" />
                        <div class="block-button"></div>
                        <div class="block-button bg-pulse"></div>
                        <div class="block-button bg-pulse"></div>
                        <div class="block-button bg-pulse"></div>
                        <div class="block-button bg-pulse"></div>
                    </div>
                    <div class="background-fade"></div>

                    <div class="block-input bg-pulse"></div>
                    <div class="block-input block-input-xs bg-pulse"></div>
                    <div class="block-input block-input-sm bg-pulse"></div>
                    <div class="block-input block-input-xl bg-pulse"></div>
                    <div class="block-input block-input-xl bg-pulse"></div>
                    <div class="block-input block-input-xl bg-pulse"></div>
                    <div class="block-input block-input-xl bg-pulse"></div>
                    <div class="block-input block-input-xl bg-pulse"></div>
                </div>
            </div>
            <div class="image">
                <mat-spinner />
            </div>
        </div>
    `,
    standalone: true,
})
export class CardSkeletonComponent {}
