import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Peer } from '../../store/slices/peersSlice';
import VideoBox from '../videobox/VideoBox';

const PeerInfo = styled(Typography)({
	color: '#fff',
	textAlign: 'center',
});

interface PeersProps {
	peer: Peer;
	style: Record<'width' | 'height', number>;
}

const Peers = ({ peer, style }: PeersProps): JSX.Element => {
	return (
		<VideoBox
			activeSpeaker={false} // 🔥 Eğer aktif konuşan biri varsa, güncelleyebilirsin
			order={10}
			width={style.width}
			height={style.height}
		>
			<PeerInfo variant="body1">{peer.displayName || 'Misafir'}</PeerInfo>
		</VideoBox>
	);
};

export default Peers;