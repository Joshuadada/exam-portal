import { signal } from '@angular/core';

export const sidebarOpen = signal<boolean>(true);

export function toggleSidebar() {
    sidebarOpen.update(v => !v);
}

export function closeSidebar() {
    sidebarOpen.set(false);
}

export function openSidebar() {
    sidebarOpen.set(true);
}
