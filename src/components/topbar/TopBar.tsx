import {
	AppBar,
	Box,
	Chip,
	Hidden,
	IconButton,
	Popover, TextField,
	Toolbar,
	Tooltip,
	Typography,
	useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useAppSelector, usePermissionSelector } from '../../store/hooks';
import { lobbyPeersLengthSelector, roomSessionCreationTimestampSelector, someoneIsRecordingSelector } from '../../store/selectors';
import edumeetConfig from '../../utils/edumeetConfig';
import { permissions } from '../../utils/roles';
import LobbyButton from '../controlbuttons/LobbyButton';
import LockButton from '../controlbuttons/LockButton';
import FullscreenButton from '../controlbuttons/FullscreenButton';
import { formatDuration } from '../../utils/formatDuration';
import RecordIcon from '../recordicon/RecordIcon';
import CountdownTimerChip from '../countdowntimer/CountdownTimerChip';
import MoreIcon from '@mui/icons-material/MoreVert';
import ControlButton from '../controlbuttons/ControlButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';

interface TopBarProps {
	fullscreenEnabled: boolean;
	fullscreen: boolean;
	onFullscreen: () => void;
}

const StyledChip = styled(Chip)({
	color: 'white',
	backgroundColor: 'rgba(128, 128, 128, 0.5)',
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
	backgroundColor: theme.appBarColor,
	...(theme.appBarFloating && {
		top: 4,
		left: 4,
		width: 'calc(100% - 8px)',
		borderRadius: theme.roundedness,
	}),
	'& .MuiToolbar-root': {
		minHeight: 40,
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
	}
}));
const StyledBox = styled(Box)(() => ({
	color: 'white',
	backgroundColor: 'rgba(0, 0, 0, 0.4)',
}));

const LogoImg = styled('img')(({ theme }) => ({
	display: 'none',
	marginLeft: theme.spacing(1),
	marginRight: theme.spacing(1),
	maxWidth: 200,
	maxHeight: 32,
	[theme.breakpoints.up('sm')]: {
		display: 'block'
	}
}));

interface TopBarDivProps {
	gap?: number;
	grow?: number;
	marginRight?: number;
	marginLeft?: number;
}

const TopBarDiv = styled('div')<TopBarDivProps>(({ theme, gap = 0, grow = 0, marginRight = 0, marginLeft = 0 }) => ({
	display: 'flex',
	marginRight: theme.spacing(marginRight),
	marginLeft: theme.spacing(marginLeft),
	gap: theme.spacing(gap),
	flexGrow: grow,
	alignItems: 'center',
	justifyContent: 'center'
}));

const TopBar = ({ fullscreenEnabled, fullscreen, onFullscreen }: TopBarProps): React.JSX.Element => {
	const logo = useAppSelector((state) => state.room.logo);
	const canLock = usePermissionSelector(permissions.CHANGE_ROOM_LOCK);
	const canPromote = usePermissionSelector(permissions.PROMOTE_PEER);
	// const loginEnabled = useAppSelector((state) => state.permissions.loginEnabled);
	const lobbyPeersLength = useAppSelector(lobbyPeersLengthSelector);
	const roomCreationTimestamp = useAppSelector(roomSessionCreationTimestampSelector);
	const [ meetingDuration, setMeetingDuration ] = useState<number>(0);
	// const loggedIn = useAppSelector((state) => state.permissions.loggedIn);
	const someoneIsRecording = useAppSelector(someoneIsRecordingSelector);

	const [ meetingTitle, setMeetingTitle ] = useState<string>('');
	const [ isEditing, setIsEditing ] = useState<boolean>(false);

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMeetingTitle(event.target.value);
	};

	const handleTitleBlur = () => {
		setIsEditing(false);
	};

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(window.location.href);
	};

	useEffect(() => {
		if (roomCreationTimestamp) {
			const interval = 1000;
			let expected = Date.now() + interval;

			const driftAwareTimer = () => {
				const dt = Date.now() - expected;

				expected += interval;
				setMeetingDuration(Date.now() - roomCreationTimestamp);
				setTimeout(driftAwareTimer, Math.max(0, interval - dt));
			};

			const computeDuration = setTimeout(driftAwareTimer, interval);

			return () => clearTimeout(computeDuration);
		}
	}, []);

	const theme = useTheme();
	const isSm = useMediaQuery(theme.breakpoints.down('sm'));
	const [ anchorEl, setAnchorEl ] = useState<HTMLButtonElement | null>(null);

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	const handleClose = () => {
		setAnchorEl(null);
	};

	// Effect to call onClose when isMobile is false
	useEffect(() => {
		if (!isSm && open) {
			handleClose?.(); // Safely call onClose if it exists
		}
	}, [ isSm, open, handleClose ]);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const menuItems = <>{ fullscreenEnabled && <FullscreenButton type='iconbutton' fullscreen={fullscreen} onClick={onFullscreen} /> }
		{ canLock && <LockButton type='iconbutton' /> }
		{ canPromote && lobbyPeersLength > 0 && <LobbyButton type='iconbutton' /> }
		<Hidden smUp>
			<Tooltip title="Toplantı başlığını düzenle">
				<IconButton onClick={handleEditClick} sx={{ color: 'white' }}>
					<EditIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title="Toplantı bağlantısını kopyala">
				<IconButton onClick={handleCopyLink} sx={{ color: 'white' }}>
					<ContentCopyIcon />
				</IconButton>
			</Tooltip>
		</Hidden> </>;

	/* { loginEnabled && (loggedIn ? <LogoutButton type='iconbutton' /> : <LoginButton type='iconbutton' />) } </>;*/

	const isEnabled = useAppSelector((state) => state.room.countdownTimer.isEnabled);

	return (
		<StyledAppBar position='fixed'>
			<Toolbar variant='dense'>
				<TopBarDiv marginLeft={1}>
					{ logo ?
						<LogoImg alt='Logo' src={ logo }/>
						:
						<Typography variant='h6' noWrap color='inherit'>
							{ edumeetConfig.title }
						</Typography>
					}
				</TopBarDiv>
				{/* **Başlık ve Düzenleme Butonu** */}

				<TopBarDiv grow={1} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					<Hidden smDown>
						{isEditing ? (
							<TextField
								variant="standard"
								autoFocus
								value={meetingTitle}
								onChange={handleTitleChange}
								onBlur={handleTitleBlur}
								inputProps={{
									style: {
										textAlign: 'center',
										fontSize: '15px',
										color: 'white',
										background: 'transparent',
										border: 'none'
									}
								}}
							/>
						) : (
							meetingTitle && (
								<Typography
									variant="h6"
									color="inherit"
									style={{ cursor: 'pointer', fontSize: '15px' }}
								>
									{meetingTitle}
								</Typography>
							)
						)}

						{/* **Düzenleme Butonu** */}
					</Hidden>
				</TopBarDiv>

				<TopBarDiv marginRight={1}>
					{ someoneIsRecording && <RecordIcon color='error' /> }
					<Hidden smUp>
						<ControlButton type='iconbutton' onClick={handleClick} >
							<MoreIcon />
						</ControlButton>
					</Hidden>
					<Hidden smDown>
						<Tooltip title="Toplantı başlığını düzenle">
							<IconButton onClick={handleEditClick} sx={{ color: 'white' }}>
								<EditIcon/>
							</IconButton>
						</Tooltip>
						<Tooltip title="Toplantı bağlantısını kopyala">
							<IconButton size="small" onClick={handleCopyLink} sx={{ color: 'white' }}>
								<ContentCopyIcon/>
							</IconButton>
						</Tooltip>
					</Hidden>
					<Popover
						id={id}
						open={open && isSm}
						anchorEl={anchorEl}
						onClose={handleClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
						slotProps={{
							paper: {
								sx: { backgroundColor: 'transparent', boxShadow: 'none' },
							},
						}}
					>
						<StyledBox sx={{ display: 'flex', gap: 1, padding: 1 }}>
							{menuItems}
						</StyledBox>
					</Popover>

					<Hidden smDown>
						{menuItems}
					</Hidden>
				</TopBarDiv>
				<TopBarDiv marginRight={1}>
					<StyledChip size='small' label={ formatDuration(meetingDuration) } />
				</TopBarDiv>
				{
					(edumeetConfig.countdownTimerEnabled && isEnabled) && <TopBarDiv marginRight={1}>
						<CountdownTimerChip />
					</TopBarDiv>
				}
			</Toolbar>
		</StyledAppBar>
	);
};

export default TopBar;
