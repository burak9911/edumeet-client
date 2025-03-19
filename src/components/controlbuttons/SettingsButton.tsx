import { MenuItem } from '@mui/material';
import {
	useAppDispatch,
	useAppSelector
} from '../../store/hooks';
import SettingsIcon from '@mui/icons-material/Settings';
import { uiActions } from '../../store/slices/uiSlice';
import {
	showSettingsLabel,
} from '../translated/translatedComponents';

const SettingsButton = ({
	onClick
}: { onClick: () => void }): JSX.Element => {
	const dispatch = useAppDispatch();
	const settingsOpen = useAppSelector((state) => state.ui.settingsOpen);

	return (
		<MenuItem
			onClick={() => {
				onClick();
				dispatch(uiActions.setUi({ settingsOpen: !settingsOpen }));
			}}
		>
			<SettingsIcon style={{ marginRight: '8px' }} />
			{showSettingsLabel()}
		</MenuItem>
	);
};

export default SettingsButton;