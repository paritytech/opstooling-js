export declare type FreeId = {
    id: string;
    release: () => void;
};
export declare const getFreeId: () => FreeId;
export declare function ensureDefined<T>(input: T | undefined | null, message?: string): NonNullable<T>;
