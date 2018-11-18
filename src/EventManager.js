import { Signal } from 'signals';

class EventManager {
    events = {};

    add = (name, callback) => {
        if (!events[name]) {
            events[name] = new Signal();
        }
        events[name].add(callback);
    }

    dispatch = (name, ...params) => {
        events[name] && events[name].dispatch(params);
    }

    remove = (name, callback) => {
        events[name] && events[name].remove(callback);
    }
}

export const events = (() => {
    let instance;

    const createInstance = () => {
        if (!instance) {
            instance = new EventManager();
        }
        return instance;
    }

    return {
        getInstance: createInstance
    }
})();