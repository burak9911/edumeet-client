import { useAppSelector } from '../../store/hooks';
import MicButton from '../../components/controlbuttons/MicButton';
import WebcamButton from '../../components/controlbuttons/WebcamButton';
import ScreenshareButton from '../../components/controlbuttons/ScreenshareButton';
import { isMobileSelector } from '../../store/selectors';
import ParticipantsButton from '../controlbuttons/ParticipantsButton';
import ChatButton from '../controlbuttons/ChatButton';
import FloatingMenu from '../floatingmenu/FloatingMenu';
import { useState } from 'react';
import ParticipantList from '../participantlist/ParticipantList';
import Chat from '../chat/Chat';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import ExtraVideo from '../menuitems/ExtraVideo';
import Transcription from '../menuitems/Transcription';
import Filesharing from '../menuitems/Filesharing';
import Recording from '../menuitems/Recording';
import MoreButton from '../controlbuttons/MoreButton';

const StyledControlBar = styled(Box)(() => ({
	position: 'fixed',
	bottom: '15px', // Sayfanın altına biraz daha yaklaştı
	left: '50%',
	transform: 'translateX(-50%)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-around', // Butonları eşit aralıklarla dizer
	backgroundColor: '#f2f2f2', // Arka plan rengi
	borderRadius: '40px', // Köşeleri yuvarlak yapar
	padding: '6px 16px', // İç boşluklar biraz azaldı
	boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.2)', // Hafif gölge
	zIndex: 1000,
	width: '320px', // Kapsayıcıyı küçülttük (önceki 400px idi)
	height: '50px', // Kapsayıcı yüksekliği küçüldü (önceki 60px idi)
}));

const SmallButtonWrapper = styled(Box)({
	transform: 'scale(0.8)', // **Butonları %80 küçülttük**
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const ControlButtonsBar = (): JSX.Element => {
	const isMobile = useAppSelector(isMobileSelector);
	const chatEnabled = useAppSelector((state) => state.room.chatEnabled);
	const filesharingEnabled = useAppSelector((state) => state.room.filesharingEnabled);
	const localRecordingEnabled = useAppSelector((state) => state.room.localRecordingEnabled);
	const canRecord = useAppSelector((state) => state.me.canRecord);
	const canTranscribe = useAppSelector((state) => state.me.canTranscribe);

	const [ participantListAnchorEl, setParticipantAnchorEl ] = useState<HTMLElement | null>();
	const isParticipantListOpen = Boolean(participantListAnchorEl);
	const handleParticipantListClose = () => setParticipantAnchorEl(null);

	const [ chatAnchorEl, setChatAnchorEl ] = useState<HTMLElement | null>();
	const isChatOpen = Boolean(chatAnchorEl);
	const handleChatClose = () => setChatAnchorEl(null);

	const [ moreAnchorEl, setMoreAnchorEl ] = useState<HTMLElement | null>();
	const handleMoreClose = () => {
		setMoreAnchorEl(null);
	};
	const isMoreOpen = Boolean(moreAnchorEl);

	return (
		<>
			{/* 📌 Küçültülmüş butonları içeren kapsayıcı */}
			<StyledControlBar>
				<SmallButtonWrapper>
					<MicButton offColor="error" toolTipLocation="bottom" />
				</SmallButtonWrapper>
				<SmallButtonWrapper>
					<WebcamButton offColor="error" toolTipLocation="bottom" />
				</SmallButtonWrapper>
				{!isMobile && (
					<SmallButtonWrapper>
						<ScreenshareButton toolTipLocation="bottom" />
					</SmallButtonWrapper>
				)}
				{!isMobile && (
					<SmallButtonWrapper>
						<ParticipantsButton toolTipLocation="bottom" onColor="primary" />
					</SmallButtonWrapper>
				)}
				{isMobile && (
					<SmallButtonWrapper>
						<ParticipantsButton onClick={(event) => setParticipantAnchorEl(event.currentTarget)} toolTipLocation="bottom" />
					</SmallButtonWrapper>
				)}
				{!isMobile && chatEnabled && (
					<SmallButtonWrapper>
						<ChatButton toolTipLocation="bottom" onColor="primary" />
					</SmallButtonWrapper>
				)}
				{isMobile && chatEnabled && (
					<SmallButtonWrapper>
						<ChatButton onClick={(event) => setChatAnchorEl(event.currentTarget)} toolTipLocation="bottom" />
					</SmallButtonWrapper>
				)}
				<SmallButtonWrapper>
					<MoreButton onClick={(event) => setMoreAnchorEl(event.currentTarget)} toolTipLocation="bottom" />
				</SmallButtonWrapper>
			</StyledControlBar>

			{isMobile && (
				<FloatingMenu
					anchorEl={participantListAnchorEl}
					open={isParticipantListOpen}
					onClose={handleParticipantListClose}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				>
					<Box height="80vh" width="90vw">
						<ParticipantList />
					</Box>
				</FloatingMenu>
			)}
			{chatEnabled && isMobile && (
				<FloatingMenu
					anchorEl={chatAnchorEl}
					open={isChatOpen}
					onClose={handleChatClose}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				>
					<Box height="80vh" width="90vw">
						<Chat />
					</Box>
				</FloatingMenu>
			)}
			<FloatingMenu
				anchorEl={moreAnchorEl}
				open={isMoreOpen}
				onClose={handleMoreClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
			>
				<ExtraVideo onClick={handleMoreClose} />
				{filesharingEnabled && <Filesharing onClick={handleMoreClose} />}
				{canTranscribe && <Transcription onClick={handleMoreClose} />}
				{localRecordingEnabled && canRecord && <Recording onClick={handleMoreClose} />}
			</FloatingMenu>
		</>
	);
};

export default ControlButtonsBar;