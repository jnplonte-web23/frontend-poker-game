import { MessageTypes } from 'hashconnect';

import { GetHashPackInformation } from '../providers/hashpack.provider';

const useHashpack = () => {
	const { hashconnect, topic, pairingData, network, setState } = GetHashPackInformation();

	const connectToExtension = async () => {
		hashconnect.connectToLocalWallet();
	};

	const disconnect = () => {
		hashconnect.disconnect(pairingData?.topic!);
		setState!((exState) => ({ ...exState, pairingData: null }))!;
	};

	const requestAccountInfo = async () => {
		const request: MessageTypes.AdditionalAccountRequest = {
			topic: topic!,
			network: network!,
			multiAccount: true,
		};

		await hashconnect.requestAdditionalAccounts(topic!, request);
	};

	const clearPairings = () => {
		hashconnect.clearConnectionsAndData();
		setState!((exState) => ({ ...exState, pairingData: null }));
	};

	return { connectToExtension, disconnect, requestAccountInfo, clearPairings };
};

export default useHashpack;
