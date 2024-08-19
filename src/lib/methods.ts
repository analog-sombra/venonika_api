export function toMysqlDateTime(date: Date): string {
  const padZero = (num: number): string => (num < 10 ? '0' : '') + num;

  const year = date.getUTCFullYear();
  const month = padZero(date.getUTCMonth() + 1); // Months are zero-based
  const day = padZero(date.getUTCDate());
  const hours = padZero(date.getUTCHours());
  const minutes = padZero(date.getUTCMinutes());
  const seconds = padZero(date.getUTCSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const errorToString = (e: unknown): string => {
  if (typeof e === 'string') {
    return e.toUpperCase();
  } else if (e instanceof Error) {
    // Handle Axios errors specifically
    const axiosError = (e as any).response?.data;

    // Check if error.response.data.error.message is an array
    if (Array.isArray(axiosError?.error?.message)) {
      return axiosError.error.message.join(', '); // Join array elements into a single string
    }

    if (typeof axiosError?.error?.message === 'string') {
      return axiosError?.error?.message;
    }

    // Check if error.response.data.message is a string
    if (typeof axiosError?.message === 'string') {
      return axiosError.message;
    }

    // Return general error message if available
    return e.message;
  } else if (typeof e === 'object' && e !== null) {
    // Handle generic objects with message properties
    const errorMessage = (e as any)?.message;
    if (errorMessage && typeof errorMessage === 'string') {
      return errorMessage;
    }
  }
  return 'An unknown error occurred';
};
