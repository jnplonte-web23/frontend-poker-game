import { ReactNode } from 'react';

import { HashConnectTypes } from 'hashconnect';
import { HashConnectConnectionState } from 'hashconnect/dist/types';

export type IHashConnectProps = {
	availableExtension: HashConnectTypes.WalletMetadata;
	state: HashConnectConnectionState;
	topic: string;
	pairingString: string;
	pairingData: HashConnectTypes.SavedPairingData | null;
	hashconnect: any;
};

export type IProviderProps = {
	children: ReactNode;
	network: 'testnet' | 'mainnet' | 'previewnet';
	metaData?: HashConnectTypes.AppMetadata;
};
