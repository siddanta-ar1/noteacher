// Site configuration

export const SITE_CONFIG = {
    name: 'NOTEacher',
    tagline: 'Democratizing Elite Pedagogy',
    description: 'Elite teaching, automated. Master complex concepts through interactive scrollytelling.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

    // Social
    github: 'https://github.com/noteacher',

    // Branding
    logo: {
        text: 'NOTEacher',
        accent: 'Eacher',
    },

    // Footer
    copyright: `© ${new Date().getFullYear()} NOTEacher Labs. Designed for the builders.`,
} as const;
