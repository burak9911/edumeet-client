import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Permission, Role } from '../../utils/roles';

export interface PermissionsState {
	roles: number[]; // Role IDs
	loginEnabled?: boolean;
	loggedIn?: boolean;
	locked?: boolean;
	signInRequired?: boolean;
	userRoles?: Record<number, Role>;
	roomPermissions?: Record<string, Role[]>;
	allowWhenRoleMissing?: Permission[];
}

const initialState: PermissionsState = {
	roles: [],
	loginEnabled: true,
	loggedIn: false,
	locked: false,
	signInRequired: false,
};

const permissionsSlice = createSlice({
	name: 'permissions',
	initialState,
	reducers: {
		addRoles: ((state, action: PayloadAction<{ roles: number[] }>) => {
			state.roles = action.payload.roles;
		}),
		addRole: ((state, action: PayloadAction<{ roleId: number }>) => {
			state.roles.push(action.payload.roleId);
		}),
		removeRole: ((state, action: PayloadAction<{ roleId: number }>) => {
			state.roles =
				state.roles.filter((role) => role !== action.payload.roleId);
		}),
		setLoginEnabled: ((state, action: PayloadAction<{ loginEnabled: boolean }>) => {
			state.loginEnabled = action.payload.loginEnabled;
		}),
		setLoggedIn: ((state, action: PayloadAction<{
			loggedIn: boolean,
			local?: boolean
		}>) => {
			state.loggedIn = action.payload.loggedIn;
		}),
		setLocked: ((state, action: PayloadAction<{
			locked: boolean,
			local?: boolean
		}>) => {
			state.locked = action.payload.locked;
		}),
		setSignInRequired: ((state, action: PayloadAction<{ signInRequired: boolean }>) => {
			state.signInRequired = action.payload.signInRequired;
		}),
		setUserRoles: ((
			state,
			action: PayloadAction<{ userRoles: Record<number, Role> }>
		) => {
			state.userRoles = action.payload.userRoles;
		}),
		setRoomPermissions: ((
			state,
			action: PayloadAction<{ roomPermissions: Record<Permission, Role[]> }>
		) => {
			state.roomPermissions = action.payload.roomPermissions;
		}),
		setAllowWhenRoleMissing: ((
			state,
			action: PayloadAction<{ allowWhenRoleMissing: Permission[] }>
		) => {
			state.allowWhenRoleMissing = action.payload.allowWhenRoleMissing;
		}),
	},
});

export const permissionsActions = permissionsSlice.actions;
export default permissionsSlice;