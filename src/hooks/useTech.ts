import { useCrudResource } from "./useCrud";
import { type Tech } from "../types/type";

export const useTech = () => {
    return useCrudResource<Tech>("techs");
};