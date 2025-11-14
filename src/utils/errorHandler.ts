import { type ValidationError } from "../types/type";

export const extractErrorMessage = (error: unknown): ValidationError => {
    const errorResp = (error as { response?: { data?: ValidationError } })?.response?.data;
    return errorResp ?? { message: ["Terjadi kesalahan"] };
};