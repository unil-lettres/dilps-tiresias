import {environment} from '../../../environments/environment';

export type EnvironmentBadge = {
    /**
     * Short name, as a prefix of the page title and in the menu
     */
    readonly label: string;

    /**
     * Full name, as the tooltip of the menu's label
     */
    readonly name: string;

    /**
     * Colour of the dot added to the favicon, to tell environments apart even in a narrow tab
     */
    readonly color: string;
};

const badges: Readonly<Record<string, EnvironmentBadge>> = {
    development: {label: 'DEV', name: 'Environnement de développement', color: '#2E7D32'},
    staging: {label: 'STAGING', name: 'Environnement de test', color: '#E65100'},
};

/**
 * The badge for the current environment, or null if the environment is not recognized
 */
export const environmentBadge: EnvironmentBadge | null = badges[environment.environment] ?? null;

/**
 * Return the given SVG favicon with the badge's dot in its bottom right corner, as a data URL
 */
export function badgeFavicon(svg: string, badge: EnvironmentBadge): string {
    const dot = `<circle cx="760" cy="760" r="230" fill="${badge.color}" stroke="#FFFFFF" stroke-width="60"/>`;

    return 'data:image/svg+xml,' + encodeURIComponent(svg.replace('</svg>', dot + '</svg>'));
}
