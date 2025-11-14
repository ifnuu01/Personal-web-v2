import { useState } from "react";
import apiClient from "./apiClient";
import type { ValidationError, WithId } from "../types/type";
import { extractErrorMessage } from "../utils/errorHandler";

export const useCrudResource = <T>(endpoint: string) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ValidationError | null>(null);

    const create = async (data: Partial<T>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.post(endpoint, data);
            setItems(prev => [...prev, response.data.data]);
            return response.data.message;
        } catch (error: unknown) {
            setError(extractErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const getAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(endpoint);
            setItems(response.data.data);
        } catch (error: unknown) {
            setError(extractErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const getSingle = async (id: number | string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`${endpoint}/${id}`);
            return response.data.data;
        } catch (error: unknown) {
            setError(extractErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: number | string, data: Partial<T>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.put(`${endpoint}/${id}`, data);
            setItems(prev =>
                prev.map(item => (item && (item as WithId).id === id ? response.data.data : item))
            );
            return response.data.message;
        } catch (error: unknown) {
            setError(extractErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: number | string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.delete(`${endpoint}/${id}`);
            setItems(prev => prev.filter(item => (item as WithId).id !== id));
            return response.data.message;
        } catch (error: unknown) {
            setError(extractErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return {
        items,
        loading,
        error,
        create,
        getAll,
        getSingle,
        update,
        remove,
    };
}