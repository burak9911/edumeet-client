import {
	configureStore,
	combineReducers,
	ThunkDispatch,
	AnyAction
} from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { MediaService } from '../services/mediaService';
import { SignalingService } from '../services/signalingService';
import createMediaMiddleware from './middleware/mediaMiddleware';
import createSignalingMiddleware from './middleware/signalingMiddleware';
import createRoomMiddleware from './middleware/roomMiddleware';
import createFilesharingMiddleware from './middleware/filesharingMiddleware';
import createLobbyMiddleware from './middleware/lobbyMiddleware';
import createPeerMiddleware from './middleware/peerMiddleware';
import createPermissionsMiddleware from './middleware/permissionsMiddleware';
import roomSlice from './slices/roomSlice';
import meSlice from './slices/meSlice';
import consumersSlice from './slices/consumersSlice';
import signalingSlice from './slices/signalingSlice';
import webrtcSlice from './slices/webrtcSlice';
import permissionsSlice from './slices/permissionsSlice';
import lobbyPeersSlice from './slices/lobbyPeersSlice';
import settingsSlice from './slices/settingsSlice';
import drawerSlice from './slices/drawerSlice';
import uiSlice from './slices/uiSlice';
import { EdumeetConfig } from '../utils/types';
import edumeetConfig from '../utils/edumeetConfig';
import peersSlice from './slices/peersSlice';
import producersSlice from './slices/producersSlice';
import { createContext } from 'react';

export interface MiddlewareOptions {
	mediaService: MediaService;
	signalingService: SignalingService;
	config: EdumeetConfig;
}

const persistConfig = {
	key: 'root',
	storage,
	stateReconciler: autoMergeLevel2,
	whitelist: [ 'settings', 'intl', 'config' ],
};

const signalingService = new SignalingService();

export const mediaService = new MediaService({ signalingService });
export const MediaServiceContext = createContext<MediaService>(mediaService);

const reducer = combineReducers({
	consumers: consumersSlice.reducer,
	drawer: drawerSlice.reducer,
	lobbyPeers: lobbyPeersSlice.reducer,
	me: meSlice.reducer,
	peers: peersSlice.reducer,
	permissions: permissionsSlice.reducer,
	producers: producersSlice.reducer,
	room: roomSlice.reducer,
	settings: settingsSlice.reducer,
	signaling: signalingSlice.reducer,
	ui: uiSlice.reducer,
	webrtc: webrtcSlice.reducer,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pReducer = persistReducer<any, any>(persistConfig, reducer);

export const store = configureStore({
	reducer: pReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			thunk: {
				extraArgument: {
					config: edumeetConfig,
					mediaService,
					signalingService,
				}
			}
		}).concat(
			createSignalingMiddleware({
				config: edumeetConfig,
				mediaService,
				signalingService
			}),
			createMediaMiddleware({
				config: edumeetConfig,
				mediaService,
				signalingService
			}),
			createPeerMiddleware({
				config: edumeetConfig,
				mediaService,
				signalingService
			}),
			createLobbyMiddleware({
				config: edumeetConfig,
				mediaService,
				signalingService
			}),
			createFilesharingMiddleware(),
			createPermissionsMiddleware({
				config: edumeetConfig,
				mediaService,
				signalingService
			}),
			createRoomMiddleware({
				config: edumeetConfig,
				mediaService,
				signalingService
			}),
			createLogger({
				duration: true,
				timestamp: false,
				level: 'log',
				logErrors: true,
			})
		)
});

export const persistor = persistStore(store);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
export type RootState = ReturnType<typeof store.getState>;