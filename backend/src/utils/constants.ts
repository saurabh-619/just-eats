export const __dev__ = process.env.NODE_ENV === 'development' ? true : false;
export const __prod__ = process.env.NODE_ENV === 'production' ? true : false;

// Secrets
export const DB_HOST = process.env.DB_HOST;

// DB
export const QUERY_LIMIT_RESTAURANTS = 6;
