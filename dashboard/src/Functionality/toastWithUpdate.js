import { toast } from "sonner";

/**
 * Displays a loading toast and updates it based on promise result.
 *
 * @param {Promise} promiseFn - A function that returns a promise.
 * @param {Object} messages - Toast messages.
 * @param {string} messages.loading - Shown while request is in progress.
 * @param {string|Function} messages.success - Shown on success. Can be string or function(result).
 * @param {string|Function} messages.error - Shown on error. Can be string or function(error).
 * @returns {Promise<any>} - The result of the promise.
 */
export async function toastWithUpdate(promiseFn, messages) {
  const toastId = toast.loading(messages.loading || "Loading...");

  try {
    const result = await promiseFn();

    const successMsg = typeof messages.success === "function"
      ? messages.success(result)
      : messages.success || "Success";

    if (result.ok) {
      toast.success(successMsg, { id: toastId });
      return result;
    } else {
      throw new Error(result.message)
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
