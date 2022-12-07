import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const useSocketRoom = (_roomNumber: number) => {
	let socket: any;
	const [$roomNumber, $setRoomNumber] = useState<number>(0);
	const [$currentPlayer, $setCurrentPlayer] = useState<any>(null);
	const [$numberOfPlayers, $setNumberOfPlayers] = useState<number>(0);

	const $connect = async (_walletId: string, _userName: string) => {
		// NOTE: max 8 players
		if (_walletId && $numberOfPlayers + 1 < 8) {
			const roomUrl: string = process.env.NEXT_PUBLIC_SOCKET_ROOM || '';
			const roomKey: string = process.env.NEXT_PUBLIC_SOCKET_KEY || '';
			const roomToken: string = process.env.NEXT_PUBLIC_SOCKET_TOKEN || '';

			socket = io(roomUrl, {
				query: {
					roomId: $roomNumber,
					walletId: _walletId,
					userName: _userName || 'WEB23 NAME',
					playerNumber: $numberOfPlayers + 1,
				},
				extraHeaders: {
					[roomKey]: roomToken,
				},
			});
			socket.on('error', (_error: any) => console.log(_error));
			socket.on('connect_error', (_error: any) => console.log(_error));

			socket.on('connected', (_data: any) => {
				console.log(socket.id, '<-----CONNECTED');

				if (_data['status'] === 'success') {
					$setNumberOfPlayers(_data['data']['userData'].length);

					const currentPlayer: any = _data['data']['userData'].find((uData: any) => uData['userId'] === socket.id);
					$setCurrentPlayer(currentPlayer);
				}
			});
		}
	};

	const $disconnect = async () => {
		if (socket) {
			socket.close();
		}
	};

	useEffect(() => {
		$setRoomNumber(_roomNumber);
		// eslint-disable-next-line
	}, []);

	return { $connect, $disconnect, $numberOfPlayers, $roomNumber, $currentPlayer };
};

export default useSocketRoom;
