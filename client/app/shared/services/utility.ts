export function shuffleArray(a: any[]): any[] {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function getBase64Url(file: File | null): Promise<null | string> {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(null);
        }

        const reader = new FileReader();
        reader.addEventListener('load', (ev: any) => {
            const base64 = btoa(ev.target.result);
            const url = 'url(data:image;base64,' + base64 + ')';
            resolve(url);
        });
        reader.readAsBinaryString(file);
    });
}

export function formatYearRange(from: number | null, to: number | null): string {
    if (from !== null && to !== null) {
        return ` (entre ${from} et ${to})`;
    }

    if (from !== null) {
        return ` (${from})`;
    }

    if (to !== null) {
        return ` (${to})`;
    }

    return '';
}
