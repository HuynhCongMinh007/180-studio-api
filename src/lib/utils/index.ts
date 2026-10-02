export function isPresent<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

export function isBlank(value: string): boolean {
    return value.trim().length === 0;
}

export function isHttpsUrl(value: string): boolean {
    try {
        return new URL(value).protocol === 'https:';
    } catch {
        return false;
    }
}
