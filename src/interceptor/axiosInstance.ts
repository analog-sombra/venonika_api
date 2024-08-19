import Axios from 'axios';
import { buildMemoryStorage, setupCache } from 'axios-cache-interceptor';

const instance = Axios.create();
export const axiosInstance = setupCache(instance, {
  storage: buildMemoryStorage(false, 1000 * 5, 0),
});
