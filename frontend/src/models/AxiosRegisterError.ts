export interface RegisterError {
    username?: string[];
    email?: string[];
    password?: string[];
};

export default interface AxiosRegisterError {
    errors: RegisterError;
    message: string;
}