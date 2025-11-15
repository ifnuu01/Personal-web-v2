import { useCrudResource } from "./useCrud";
import { type Blog } from "../types/type";

export const useBlog = () => {
    return useCrudResource<Blog>("blogs");
};