import { createStore } from 'redux'
import { rootReducer } from './reducer';

export const configureStore = () => {
    let store = createStore(rootReducer)

    return store;
}