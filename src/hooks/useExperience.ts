import { useCrudResource } from "./useCrud";
import { type Experience } from "../types/type";

export const useExperience = () => {
    return useCrudResource<Experience>("experiences");
};