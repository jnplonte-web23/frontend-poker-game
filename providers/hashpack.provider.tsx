import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect';
import { HashConnectConnectionState } from 'hashconnect/dist/types';
import React, { useContext } from 'react';

import { IHashConnectProps, IProviderProps } from '../interfaces';

//create the hashconnect instance
const hashconnect = new HashConnect(true);

const appMetadata: HashConnectTypes.AppMetadata = {
	name: 'poker game',
	description: 'poker game',
	icon: 'https://images.squarespace-cdn.com/content/v1/62fe8b1b52012f6be63d3de2/eb2a7df5-9e74-4b2f-a8fb-74a6e79d1958/favicon.ico',
};

const HashconectServiceContext = React.createContext<
	Partial<
		IHashConnectProps & {
			network: 'testnet' | 'mainnet' | 'previewnet';
			setState: React.Dispatch<React.SetStateAction<Partial<IHashConnectProps>>>;
		}
	>
>({});

const GetHashPackInformation = () => useContext(HashconectServiceContext);

const HashPackProvider = ({ children, metaData, network }: IProviderProps) => {
	const [state, setState] = React.useState<Partial<IHashConnectProps>>({});

	const initHashconnect = async () => {
		//initialize and use returned data
		let initData = await hashconnect.init(metaData || appMetadata, network, false);
		const topic = initData.topic;
		const pairingString = initData.pairingString;
		//Saved pairings will return here, generally you will only have one unless you are doing something advanced

		const pairingData = initData.savedPairings[0];

		setState((exState) => ({
			...exState,
			topic,
			pairingData,
			pairingString,
			state: HashConnectConnectionState.Disconnected,
			hashconnect: hashconnect,
		}));
	};

	const onFoundExtension = (data: HashConnectTypes.WalletMetadata) => {
		console.log('Found extension', data);
		setState((exState) => ({ ...exState, availableExtension: data }));
	};

	const onParingEvent = (data: MessageTypes.ApprovePairing) => {
		console.log('Paired with wallet', data);
		setState((exState) => ({ ...exState, pairingData: data.pairingData }));
	};

	const onConnectionChange = (state: HashConnectConnectionState) => {
		console.log('hashconnect state change event', state);
		setState((exState) => ({ ...exState, state }));
	};

	//register events
	React.useEffect(() => {
		hashconnect.foundExtensionEvent.on(onFoundExtension);
		hashconnect.pairingEvent.on(onParingEvent);
		hashconnect.connectionStatusChangeEvent.on(onConnectionChange);
		return () => {
			hashconnect.foundExtensionEvent.off(onFoundExtension);
			hashconnect.pairingEvent.on(onParingEvent);
			hashconnect.connectionStatusChangeEvent.off(onConnectionChange);
		};
	}, []);

	//Call Initialization
	React.useEffect(() => {
		initHashconnect();
		// eslint-disable-next-line
	}, []);

	return (
		<HashconectServiceContext.Provider value={{ ...state, setState, network }}>
			{children}
		</HashconectServiceContext.Provider>
	);
};

export { GetHashPackInformation, HashPackProvider };
