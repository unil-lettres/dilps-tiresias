import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArtistComponent } from '../../../artists/artist/artist.component';

@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss'],
})
export class DownloadComponent implements OnInit {

    public includeLegend = true;
    public size = '';
    public sizes = [
        {
            label: 'maximum',
            value: '',
        },
        {
            label: 'moyen (1600 x 1200)',
            value: 1200,
        },
        {
            label: 'petit (1024 x 768)',
            value: 768,
        },
    ];

    public backgroundColor = '#000000';
    public textColor = '#FFFFFF';
    public denyLegendsDownload = false;

    constructor(private dialogRef: MatDialogRef<ArtistComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        console.log('denyLegends', data.denyLegendsDownload);

        this.denyLegendsDownload = data.denyLegendsDownload;
        this.includeLegend = !this.denyLegendsDownload;
    }

    ngOnInit() {
    }

    public downloadPowerPoint() {
        const url = '/pptx/' + this.getIds() + '/' + this.toRgba(this.backgroundColor) + '/' + this.toRgba(this.textColor);
        (window.document.location as any) = url;
        this.dialogRef.close();
    }

    public downloadZip() {
        const url = '/zip/' + this.getIds() + '/' + (this.includeLegend ? '1' : '0') + (this.size ? '/' + this.size : '');
        (window.document.location as any) = url;
        this.dialogRef.close();
    }

    private getIds(): string {
        if (this.data.collection) {
            return 'collection/' + this.data.collection.id;
        }

        return this.data.images.map(card => card.id).join(',');
    }

    /**
     * Convert "#AABBCC" to "FFAABBCC"
     */
    private toRgba(rgb: string): string {
        let result = rgb.replace('#', '');
        if (result.length === 6) {
            result = 'FF' + result;
        }

        return result;
    }
}
