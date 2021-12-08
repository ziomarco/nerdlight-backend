export const logError = (error: Error) => {
    console.error(`${new Date().toISOString()} - ${error?.message || error}`);
};