import { useCrudResource } from "./useCrud";
import { type Category } from "../types/type";

export const useCategory = () => {
    return useCrudResource<Category>("categories");
};