import { io } from 'socket.io-client';
import { useState } from 'react';

const useSocketRoom = () => {
	let socket: any;
	const [$roomNumber, $setRoomNumber] = useState<number>(0);
	const [$currentPlayer, $setCurrentPlayer] = useState<any>(null);
	const [$numberOfPlayers, $setNumberOfPlayers] = useState<number>(0);

	const $connect = async (_roomId: number, _walletId: string, _userName: string | null) => {
		$setRoomNumber(_roomId);

		// NOTE: max 8 players
		if (_walletId && $numberOfPlayers + 1 < 8) {
			const roomUrl: string = process.env.NEXT_PUBLIC_SOCKET_ROOM || '';
			const roomKey: string = process.env.NEXT_PUBLIC_SOCKET_KEY || '';
			const roomToken: string = process.env.NEXT_PUBLIC_SOCKET_TOKEN || '';

			socket = io(roomUrl, {
				query: {
					roomId: _roomId,
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

			socket.on('bet', (_data: any) => {
				console.log(socket.id, _data, '<-----BET');
			});

			socket.on('call', (_data: any) => {
				console.log(socket.id, _data, '<-----CALL');
			});

			socket.on('fold', (_data: any) => {
				console.log(socket.id, _data, '<-----FOLD');
			});

			socket.on('all-in', (_data: any) => {
				console.log(socket.id, _data, '<-----ALLIN');
			});
		}
	};

	const $disconnect = async () => {
		if (socket) {
			socket.close();
		}
	};

	const $callEvents = async (_eventName: string | null, _data: any) => {
		const eventUrl: string = process.env.NEXT_PUBLIC_SOCKET_EVENTS || '';
		const roomKey: string = process.env.NEXT_PUBLIC_SOCKET_KEY || '';
		const roomToken: string = process.env.NEXT_PUBLIC_SOCKET_TOKEN || '';

		if (!_eventName) {
			return null;
		}

		const response = await fetch(`${eventUrl}/${_eventName}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				[roomKey]: roomToken,
			},
			body: JSON.stringify({
				roomId: $roomNumber,
				data: _data,
			}),
		});

		return response.json();
	};

	return { $connect, $disconnect, $callEvents, $numberOfPlayers, $roomNumber, $currentPlayer };
};

export default useSocketRoom;
