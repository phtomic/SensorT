import { getAccessOrigin, getOriginalUrl } from '../../../framework/Domain/App';
import {
  SessionStorage,
  setStorage,
  getStorage,
} from '../../../framework/Domain/Routing/Plugins/SessionStorage';

export const Session = {
    storage: SessionStorage,
    getStorage,
    setStorage,
    getAccessOrigin,
    getOriginalUrl
}