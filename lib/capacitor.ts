'use client';

import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Check if running on a native platform
 */
export const isNative = () => Capacitor.isNativePlatform();

/**
 * Haptic feedback utilities
 */
export const haptics = {
    /** Light impact - for subtle UI feedback */
    light: async () => {
        if (isNative()) {
            await Haptics.impact({ style: ImpactStyle.Light });
        }
    },

    /** Medium impact - for button presses */
    medium: async () => {
        if (isNative()) {
            await Haptics.impact({ style: ImpactStyle.Medium });
        }
    },

    /** Heavy impact - for significant actions */
    heavy: async () => {
        if (isNative()) {
            await Haptics.impact({ style: ImpactStyle.Heavy });
        }
    },

    /** Success notification */
    success: async () => {
        if (isNative()) {
            await Haptics.notification({ type: NotificationType.Success });
        }
    },

    /** Warning notification */
    warning: async () => {
        if (isNative()) {
            await Haptics.notification({ type: NotificationType.Warning });
        }
    },

    /** Error notification */
    error: async () => {
        if (isNative()) {
            await Haptics.notification({ type: NotificationType.Error });
        }
    },
};

/**
 * Status bar utilities
 */
export const statusBar = {
    /** Set dark style (light content on dark background) */
    setDark: async () => {
        if (isNative()) {
            await StatusBar.setStyle({ style: Style.Dark });
        }
    },

    /** Set light style (dark content on light background) */
    setLight: async () => {
        if (isNative()) {
            await StatusBar.setStyle({ style: Style.Light });
        }
    },

    /** Hide status bar */
    hide: async () => {
        if (isNative()) {
            await StatusBar.hide();
        }
    },

    /** Show status bar */
    show: async () => {
        if (isNative()) {
            await StatusBar.show();
        }
    },
};
