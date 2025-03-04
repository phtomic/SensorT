import { getAccessOrigin, getOriginalUrl } from '../../src/Domain/App';
import {
  SessionStorage,
  setStorage,
  getStorage,
} from '../../src/Domain/Routing/Plugins/SessionStorage';

export const Session = {
    storage: SessionStorage,
    getStorage,
    setStorage,
    getAccessOrigin,
    getOriginalUrl
}