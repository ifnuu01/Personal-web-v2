import { useCrudResource } from "./useCrud";
import { type Certificate } from "../types/type";

export const useCertificate = () => {
    return useCrudResource<Certificate>("certificates");
};