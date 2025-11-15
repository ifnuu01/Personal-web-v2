import { useCrudResource } from "./useCrud";
import { type Project } from "../types/type";

export const useProject = () => {
    return useCrudResource<Project>("projects");
};