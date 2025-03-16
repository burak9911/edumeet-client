import { Chip, styled } from '@mui/material';
import { useEffect, useState } from 'react';

const TranscriptChip = styled(Chip)(({ theme }) => ({
	marginLeft: theme.spacing(1), // DisplayName ile araya boşluk koyduk
	color: 'white',
	backgroundColor: 'rgba(0, 0, 0, 0.6)',
	fontSize: '12px',
	padding: '3px 6px',
	borderRadius: '4px',
	maxWidth: '70%',
	overflowWrap: 'break-word',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	display: 'block'
}));

const Transcript = (): JSX.Element => {
	const [ transcript, setTranscript ] = useState('');

	useEffect(() => {
		const handleTranscriptUpdate = (event: CustomEvent) => {
			setTranscript(event.detail);
		};

		window.addEventListener('transcriptUpdate', handleTranscriptUpdate as EventListener);

		return () => {
			window.removeEventListener('transcriptUpdate', handleTranscriptUpdate as EventListener);
		};
	}, []);

	if (!transcript) return <></>; // Eğer transkript boşsa bileşeni hiç render etme

	return <TranscriptChip label={transcript}/>;
};

export default Transcript;