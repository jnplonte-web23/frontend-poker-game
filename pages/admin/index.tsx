import type { NextPage } from 'next';
import { useEffect, useState, useMemo } from 'react';

import { Container, Grid, Spacer, Button } from '@nextui-org/react';
import { toast } from 'react-toastify';

import Head from 'next/head';

import {
	Client,
	PrivateKey,
	AccountId,
	AccountBalanceQuery,
	ContractExecuteTransaction,
	ContractFunctionParameters,
	ContractId,
	Hbar,
} from '@hashgraph/sdk';

import { MainLayout } from '../../layouts';

import { Helper } from '../../services/helper/helper.service';
import { GetHashPackInformation } from '../../providers/hashpack.provider';

import styles from '../../styles/admin.module.css';

const $$client = Client.forTestnet();
const CONTRACTID: string = ContractId.fromString(process.env.NEXT_PUBLIC_CONTRACT_ID || '').toString();
const Admin: NextPage = () => {
	const $helper: Helper = useMemo(() => new Helper(), []);
	const { pairingData, network, topic, hashconnect } = GetHashPackInformation();

	const [$loading, $setLoading] = useState(true);
	const [$gameStart, $setGameStart] = useState(true);

	const getInitData = async () => {
		const gameTransaction = new ContractExecuteTransaction()
			.setContractId(CONTRACTID)
			.setGas(3000000)
			.setFunction('isGameStart');
		const gameResponse = await gameTransaction.execute($$client);
		const xgameResponse = await gameResponse.getRecord($$client);
		const xxgameResponse = await xgameResponse.contractFunctionResult;
		if (xxgameResponse) {
			$setGameStart(xxgameResponse.getBool(0));
		}
	};

	const startGame = async () => {
		try {
			const param = new ContractFunctionParameters();
			param.addUint256(10);
			const playerTransaction = new ContractExecuteTransaction()
				.setContractId(CONTRACTID)
				.setGas(300000)
				.setFunction('startGame', param);

			const playerResponse = await playerTransaction.execute($$client);
			const receipt = await playerResponse.getReceipt($$client);

			if (Number(receipt.status) === 22) {
				toast('START GAME');
				$setGameStart(true);
			}
		} catch (error) {
			toast(`START FAILED`, $helper.toString(error));
		}
	};

	const winGame = async () => {
		try {
			const param = new ContractFunctionParameters();
			param.addUint8(1);
			const winnerTransaction = new ContractExecuteTransaction()
				.setContractId(CONTRACTID)
				.setGas(300000)
				.setFunction('setWinner', param);

			const winnerResponse = await winnerTransaction.execute($$client);
			const receipt = await winnerResponse.getReceipt($$client);

			if (Number(receipt.status) === 22) {
				toast('WINNER SUCCESS');
			}
		} catch (error) {
			toast(`WINNER FAILED`, $helper.toString(error));
		}
	};

	const getWinner = async (_count: number = 1) => {
		const param = new ContractFunctionParameters();
		param.addUint8(_count);
		const win1Transaction = new ContractExecuteTransaction()
			.setContractId(CONTRACTID)
			.setGas(3000000)
			.setFunction('getWinnerList', param);
		const win1Response = await win1Transaction.execute($$client);
		const xwin1Response = await win1Response.getRecord($$client);
		const xxwin1Response = await xwin1Response.contractFunctionResult;
		if (xxwin1Response) {
			console.log(xwin1Response.transactionId.toString(), '<<<<');
			// const x: any = xxwin1Response.getBytes32(0);
			// console.log(web3.utils.toAscii(x), '<<<');
			// xxwin1Response.logs.forEach((log) => {
			// 	console.log(log, 'LOGLOGLOGLOGLOGLOG');
			// 	let logStringHex = '0x'.concat(Buffer.from(log.data).toString('hex'));
			// 	console.log(logStringHex);
			// });
			// console.log(xwin1Response, _count);

			// const tokenIdSolidityAddr = xxwin1Response.getAddress(0);
			toast('WINER');
		} else {
			toast('WINNER SUCCESS');
		}

		// const receipt = await win1Response.getReceipt($$client);
		// console.log(receipt, _count);
	};

	useEffect(() => {
		const myPrivateKey: string = PrivateKey.fromString(process.env.NEXT_PUBLIC_TEST_PRIVATE || '').toString();
		const myAccountId: string = AccountId.fromString(process.env.NEXT_PUBLIC_TEST_ACCOUNT || '').toString();
		if (myAccountId && myPrivateKey) {
			$$client.setOperator(myAccountId, myPrivateKey);
			getInitData();
		}

		$setLoading(false);
		// eslint-disable-next-line
	}, []);

	return (
		<MainLayout>
			<Head>
				<title>POKER GAME | ADMIN</title>
				<meta name="description" content="admin" />
			</Head>

			<main className={styles.main}>
				{$loading ? (
					'loading...'
				) : (
					<Container className="container">
						<Grid.Container gap={2}>
							<Grid xs={12} lg={2}>
								<Spacer y={1} />
								<Button className="full_width" size="lg" auto onPress={startGame} disabled={$gameStart}>
									START GAME
								</Button>
							</Grid>
							<Grid xs={12} lg={2}>
								<Spacer y={1} />
								<Button className="full_width" size="lg" auto onPress={winGame}>
									GET GAME WINNER
								</Button>
							</Grid>
							<Grid xs={12} lg={2}>
								<Spacer y={1} />
								<Button className="full_width" size="lg" auto onPress={() => getWinner(1)}>
									CHECK WINNERS
								</Button>
							</Grid>
						</Grid.Container>
					</Container>
				)}
			</main>
		</MainLayout>
	);
};

export default Admin;
