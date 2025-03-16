import { Chip, styled, TextField, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { setDisplayName } from '../../store/actions/meActions';
import { useAppDispatch } from '../../store/hooks';
import StateIndicators from '../stateindicators/StateIndicators';
import { meLabel } from '../translated/translatedComponents';
import MeStateIndicators from '../stateindicators/MeStateIndicators';

const StyledTextField = styled(TextField)(({ theme }) => ({
	position: 'absolute',
	bottom: theme.spacing(1),
	left: theme.spacing(1),
	color: 'white',
	'& .MuiFilledInput-root': {
		color: 'white',
	},
	'& .MuiInputBase-input': {
		marginTop: 0,
		marginBottom: 0,
		paddingTop: 0,
		paddingBottom: 0,
	},
}));

const StyledChip = styled(Chip)(({ theme }) => ({
	position: 'absolute',
	bottom: theme.spacing(1),
	left: theme.spacing(1),
	color: 'white',
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
}));

interface DisplayNameProps {
	displayName?: string;
	disabled?: boolean;
	peerId?: string;
	isMe?: boolean;
}

const DisplayName = ({
	displayName,
	disabled = true,
	peerId,
	isMe,
}: DisplayNameProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const [ value, setValue ] = useState(displayName);
	const [ isEditing, setIsEditing ] = useState(false);
	const [ transcript, setTranscript ] = useState('');

	// Tarayıcı dilini al ve ona göre ayarla
	const browserLanguage = navigator.language;

	browserLanguage.startsWith('tr');

	useEffect(() => setValue(displayName), [ displayName ]);

	useEffect(() => {
		const handleTranscriptUpdate = (event: CustomEvent) => {
			setTranscript(event.detail);
		};

		window.addEventListener('transcriptUpdate', handleTranscriptUpdate as EventListener);

		return () => {
			window.removeEventListener('transcriptUpdate', handleTranscriptUpdate as EventListener);
		};
	}, []);

	const handleFinished = () => {
		if (value && value !== displayName)
			dispatch(setDisplayName(value));

		setIsEditing(false);
	};

	const prefix = isMe && !isEditing ? `(${meLabel()}) ` : '';

	return (
		isEditing ? (
			<StyledTextField
				value={`${prefix}${value}`}
				disabled={disabled}
				margin="dense"
				variant="filled"
				size="small"
				onFocus={(event) => event.target.select()}
				onChange={(event) => setValue(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === 'Enter')
						handleFinished();
				}}
				onBlur={handleFinished}
				color="primary"
				autoFocus
			/>
		) : (
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				{/* Transkript metni (Me) Guest'in üstüne gelecek şekilde */}
				{transcript && (
					<span style={{
						position: 'absolute',
						bottom: '0', // (Me) Guest'in hemen üstüne al
						fontSize: '14px',
						color: '#FFD700',
						fontWeight: 'bold',
						background: 'rgba(0, 0, 0, 0.5)',
						padding: '5px',
						borderRadius: '5px',
						textAlign: 'center'
					}}>
						{transcript}
					</span>
				)}

				{/* (Me) Guest Chip */}
				<StyledChip
					label={`${prefix}${value}`}
					variant="filled"
					size="small"
					onClick={() => !disabled && setIsEditing(true)}
					avatar={peerId ? <StateIndicators peerId={peerId}/> : <MeStateIndicators/>}
				/>
			</Box>
		)
	);
};

export default DisplayName;