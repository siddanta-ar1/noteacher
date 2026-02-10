import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.bosc.noteacher',
    appName: 'NOTEacher',
    webDir: 'out',
    server: {
        androidScheme: 'https',
        // Live reload during development
        url: 'http://192.168.1.121:3000',
        cleartext: true,
    },
    android: {
        allowMixedContent: true,
    },
};

export default config;
