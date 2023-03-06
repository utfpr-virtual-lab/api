export type Paginated<T, K extends string | number> = { data: T[]; cursor: K | null };
