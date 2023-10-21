export const errorHandler = (error?: string) => {
    if (process.env.NODE_ENV) {
        console.error(error);
    }
};