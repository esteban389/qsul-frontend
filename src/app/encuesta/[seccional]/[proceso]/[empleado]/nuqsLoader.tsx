import { parseAsInteger, createLoader } from 'nuqs/server';

export const params = { service: parseAsInteger.withDefault(0) };

export const loadSerachParams = createLoader(params);
