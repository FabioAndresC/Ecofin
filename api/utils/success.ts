export const CreateSuccess = (status: number, message: string, data?: any) => {
    const successObj = {
        status: status,
        message: message,
        data: data,
    };
    return successObj;
};
