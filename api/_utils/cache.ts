const cache = new Map<string, { value: any; expires: number }>();

export const get = (key: string) => {
    const data = cache.get(key);
    if (!data) return null;
    if (Date.now() > data.expires) {
        cache.delete(key);
        return null;
    }
    return data.value;
};

export const set = (key: string, value: any, ttlSeconds = 600) => {
    cache.set(key, {
        value,
        expires: Date.now() + ttlSeconds * 1000,
    });
};
