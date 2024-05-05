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
                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 10;
                background: transparent;
                height: 300px;
            }

            .block-button {
                border-radius: 50px;
                width: 40px;
                height: 40px;
            }

            .block-input {
                margin: 0 12px 22.5px 12px;
                border-radius: 10px;
                width: 375px;
                height: 56px;
            }

            .block-input-xs {
                margin: 0 20px 15px 20px;
                border-radius: 10px;
                width: 200px;
                height: 15px;
            }

            .block-input-sm {
                margin: 0 auto 40px auto;
                border-radius: 10px;
                width: 330px;
                height: 7px;
            }

            .image {
                display: flex;
                flex-grow: 1;
                justify-content: space-around;
                align-items: center;
            }

            .left-pane {
                overflow: hidden;
            }

            .left-pane > div {
                position: relative;
                padding-top: 20px;
            }

            .skeleton-menu {
                display: flex;
                justify-content: space-between;
                padding: 0 15px 15px;
                height: 50px;
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
