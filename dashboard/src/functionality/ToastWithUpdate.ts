import { toast } from "sonner";

type ToastMessages<T = any> = {
    loading?: string;
    success?: string | ((result: T) => string);
    error?: string | ((error: unknown) => string);
};

type ResponseLike = {
    ok: boolean;
    message?: string;
    [key: string]: any;
};

/**
 * Displays a loading toast and updates it based on promise result.
 *
 * @param promiseFn - A function that returns a promise.
 * @param messages - Toast messages.
 * @returns The result of the promise.
 */
export async function toastWithUpdate<T extends ResponseLike>(
    promiseFn: () => Promise<T>,
    messages: ToastMessages<T>
): Promise<T> {
    const toastId = toast.loading(messages.loading || "Loading...");

    try {
        const result = await promiseFn();

        const successMsg =
            typeof messages.success === "function"
                ? messages.success(result)
                : messages.success || "Success";

        if (result.ok) {
            toast.success(successMsg, { id: toastId });
            return result;
        } else {
            throw new Error(result.message || "Unknown error");
        }
    } catch (err) {
        const errorMsg =
            typeof messages.error === "function"
                ? messages.error(err)
                : messages.error || "Something went wrong";

        toast.error(errorMsg, { id: toastId });
        throw err;
    }
}
