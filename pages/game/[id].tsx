import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';

import { Container, Card, Text, Grid, User, Input, Spacer, Button, Loading, Col, Table } from '@nextui-org/react';
import { toast } from 'react-toastify';

import Head from 'next/head';

import {
	Client,
	PrivateKey,
	AccountId,
	ContractExecuteTransaction,
	ContractFunctionParameters,
	ContractId,
	Hbar,
} from '@hashgraph/sdk';

import { MainLayout } from '../../layouts';

import { Helper } from '../../services/helper/helper.service';
import { GetHashPackInformation } from '../../providers/hashpack.provider';

import styles from '../../styles/game.module.css';

const COLUMNS = [
	{ name: '#', id: 'no' },
	{ name: 'WALLET ID', id: 'id' },
	{ name: 'NAME', id: 'name' },
];
const WINNERS = [
	{
		id: 1,
		name: 'Tony Reichert',
		avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
		email: 'tony.reichert@example.com',
	},
	{
		id: 2,
		name: 'Zoey Lang',
		avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
		email: 'zoey.lang@example.com',
	},
	{
		id: 3,
		name: 'Jane Fisher',
		avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
		email: 'jane.fisher@example.com',
	},
	{
		id: 4,
		name: 'William Howard',
		avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
		email: 'william.howard@example.com',
	},
	{
		id: 5,
		name: 'Kristen Copper',
		avatar: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
		email: 'kristen.cooper@example.com',
	},
];

const $$client = Client.forTestnet();
const CONTRACTID: string = ContractId.fromString(process.env.NEXT_PUBLIC_CONTRACT_ID || '').toString();
const GameSelect: NextPage = () => {
	const $router = useRouter();
	const { id } = $router.query;

	const $helper: Helper = useMemo(() => new Helper(), []);
	const { pairingData, network, topic, hashconnect } = GetHashPackInformation();

	const [$loading, $setLoading] = useState(true);
	const [$contractLoading, $setContractLoading] = useState(true);
	const [$gameStart, $setGameStart] = useState(false);
	const [$playerLimit, $setPlayerLimit] = useState<number>(0);
	const [$playerCount, $setPlayerCount] = useState<number>(0);
	const [$price, $setPrice] = useState<number>(0);
	const [$address, $setAddress] = useState<string>('');
	const [$numberOfEntries, $setNumberOfEntries] = useState<number>(1);
	const [$referalAddress, $setReferalAddress] = useState<string>(process.env.NEXT_PUBLIC_TEST_ACCOUNT || '');

	const handleChangeNumberOfEntries = (_event: any) => {
		$setNumberOfEntries(Number(_event.target.value));
	};
	const handleChangeReferalAddress = (_event: any) => {
		$setReferalAddress(_event.target.value);
	};

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

		// const priceTransaction = new ContractExecuteTransaction()
		// 	.setContractId(CONTRACTID)
		// 	.setGas(3000000)
		// 	.setFunction('getPrice');
		// const priceResponse = await priceTransaction.execute($$client);
		// const xpriceResponse = await priceResponse.getRecord($$client);
		// const xxpriceResponse = await xpriceResponse.contractFunctionResult;
		// if (xxpriceResponse) {
		// 	$setPrice(Number(xxpriceResponse.getUint256(0)));
		// }
		// const playerLimitTransaction = new ContractExecuteTransaction()
		// 	.setContractId(CONTRACTID)
		// 	.setGas(3000000)
		// 	.setFunction('getPlayerLimit');
		// const playerLimitResponse = await playerLimitTransaction.execute($$client);
		// const xplayerLimitResponse = await playerLimitResponse.getRecord($$client);
		// const xxplayerLimitResponse = await xplayerLimitResponse.contractFunctionResult;
		// if (xxplayerLimitResponse) {
		// 	$setPlayerLimit(Number(xxplayerLimitResponse.getUint256(0)));
		// }
		// getPlayerCount();
	};

	// const getPlayerCount = async () => {
	// 	const playerCountTransaction = new ContractExecuteTransaction()
	// 		.setContractId(CONTRACTID)
	// 		.setGas(3000000)
	// 		.setFunction('getPlayerCount');
	// 	const playerCountResponse = await playerCountTransaction.execute($$client);
	// 	const xplayerCountResponse = await playerCountResponse.getRecord($$client);
	// 	const xxplayerCountResponse = await xplayerCountResponse.contractFunctionResult;
	// 	if (xxplayerCountResponse) {
	// 		$setPlayerCount(Number(xxplayerCountResponse.getUint256(0)));
	// 	}
	// };

	const joinGame = async () => {
		$setContractLoading(true);

		try {
			const id = pairingData?.accountIds.reduce($helper.conCatAccounts);
			const provider = hashconnect.getProvider(network, topic, id);
			const signer = hashconnect.getSigner(provider);

			const param = new ContractFunctionParameters();
			param.addUint8(Number($numberOfEntries));
			if ($helper.isNotEmpty($referalAddress)) {
				const addr = AccountId.fromString($referalAddress).toString();
				const addrArr = addr.split('.');
				const addrNum = new AccountId(parseInt(addrArr[0]), parseInt(addrArr[1]), parseInt(addrArr[3]));
				param.addAddress(addrNum.toSolidityAddress());
			}

			const playerTransaction = new ContractExecuteTransaction()
				.setContractId(CONTRACTID)
				.setGas(300000)
				.setPayableAmount(new Hbar(100))
				.setFunction('setPlayerData', param)
				.freezeWithSigner(signer);

			const playerResponse = await (await playerTransaction).executeWithSigner(signer);
			if (playerResponse && playerResponse.transactionHash) {
				toast('JOIN SUCCESS');
			} else {
				toast('JOIN FAILED');
			}
		} catch (error) {
			toast(`JOIN FAILED`, $helper.toString(error));
		}

		$setContractLoading(false);
	};

	useEffect(() => {
		if (pairingData) {
			$setAddress(pairingData?.accountIds.reduce($helper.conCatAccounts));
		} else {
			$setAddress('');
		}

		// eslint-disable-next-line
	}, [pairingData]);

	useEffect(() => {
		const myPrivateKey: string = PrivateKey.fromString(process.env.NEXT_PUBLIC_TEST_PRIVATE || '').toString();
		const myAccountId: string = AccountId.fromString(process.env.NEXT_PUBLIC_TEST_ACCOUNT || '').toString();
		if (myAccountId && myPrivateKey) {
			$$client.setOperator(myAccountId, myPrivateKey);
			getInitData();
		}

		$setContractLoading(false);
		$setLoading(false);
		// eslint-disable-next-line
	}, []);

	return (
		<MainLayout>
			<Head>
				<title>{`RANDOM GAME | GAME ${id}`}</title>
				<meta name="description" content={`game ${id}`} />
			</Head>

			<main className={styles.main}>
				{$loading ? (
					'loading...'
				) : (
					<Container className="container">
						<Grid.Container gap={2}>
							<Grid xs={12} lg={4}>
								<Card>
									<Card.Image
										src="https://api.lorem.space/image/car?w=300&h=450&hash=8B7BCDC0"
										objectFit="cover"
										width="100%"
										height={450}
										alt="Card image background"
									/>
								</Card>
							</Grid>
							<Grid xs={12} lg={8}>
								<Col>
									<Text h1 color="white">
										RANDOM GAME {id}
									</Text>
									<Text h4 color="white">
										PLAYERS JOIN: 35 / 100
									</Text>
									<Card>
										<Card.Body>
											<Text b h3>
												GAME ENDS IN November 30, 2022
											</Text>
											<Text>00 : 00 : 00</Text>
											<Spacer y={1} />
											<Card.Divider />
											<Spacer y={1} />
											<Text b h3>
												JOINING FEE: 100 HBAR
											</Text>
											<Spacer y={3} />
											<Grid.Container gap={2}>
												<Grid xs={6} lg={3}>
													<Input
														aria-label="numberOfEntries"
														min="1"
														width="100%"
														bordered
														labelPlaceholder="number of entries"
														type="number"
														value={$numberOfEntries}
														onChange={handleChangeNumberOfEntries}
													/>
												</Grid>
												<Grid xs={6} lg={3}>
													<Input
														aria-label="referalAddress"
														width="100%"
														clearable
														bordered
														labelPlaceholder="referal address"
														value={$referalAddress}
														onChange={handleChangeReferalAddress}
													/>
												</Grid>

												<Grid xs={12} lg={6}>
													{$contractLoading ? (
														<div className="full_width text_center">
															<Loading type="points" size="xl" />
														</div>
													) : (
														<Button
															className="full_width"
															size="lg"
															auto
															onPress={joinGame}
															disabled={!pairingData || !$gameStart}
														>
															JOIN GAME
														</Button>
													)}
												</Grid>
											</Grid.Container>
										</Card.Body>
									</Card>
								</Col>
							</Grid>
						</Grid.Container>
						<Grid.Container gap={2}>
							<Grid xs={12} lg={4}>
								<Card>
									<Card.Header>
										<Text b>GAME DESCRIPTION</Text>
									</Card.Header>
									<Card.Divider />
									<Card.Body>
										<Text>
											lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dolor dui, rutrum eget nibh
											fermentum, cursus convallis odio. Aliquam accumsan elit sit amet tempus ultrices. Morbi nulla
											ipsum, egestas at tempor sed, ultrices ac ex. Mauris consectetur lectus vitae efficitur lobortis.
											Phasellus vel leo sed odio malesuada dapibus. Sed elementum ligula at lectus elementum, sed
											elementum nisl accumsan. Duis posuere pretium placerat. Aliquam lacus diam, accumsan ac sem
											elementum, venenatis rhoncus tellus. Nulla viverra accumsan magna quis imperdiet...
										</Text>
									</Card.Body>
								</Card>
							</Grid>
							<Grid xs={12} lg={8}>
								<Card>
									<Card.Header>
										<Text b>TRANSACTION HISTORY</Text>
									</Card.Header>
									<Card.Divider />
									<Card.Body>
										<Text>1 2 3 ...</Text>
									</Card.Body>
								</Card>
							</Grid>
						</Grid.Container>
						<Grid.Container gap={2}>
							<Grid xs={12} lg={4}></Grid>
							<Grid xs={12} lg={8}>
								<Card>
									<Card.Header>
										<Text b>WINNER HISTORY</Text>
									</Card.Header>
									<Card.Divider />
									<Card.Body>
										<div className={styles.table}>
											<Table fixed aria-label="winnerTable">
												<Table.Header columns={COLUMNS}>
													{(column) => (
														<Table.Column key={column.id} align="start">
															{column.name}
														</Table.Column>
													)}
												</Table.Header>
												<Table.Body items={WINNERS}>
													{(item) => (
														<Table.Row>
															<Table.Cell>
																<Text>{item.id}</Text>
															</Table.Cell>
															<Table.Cell>
																<Text>0.0.30787909</Text>
															</Table.Cell>
															<Table.Cell>
																<User squared src={item.avatar} name={item.name} css={{ p: 0 }}>
																	{item.email}
																</User>
															</Table.Cell>
														</Table.Row>
													)}
												</Table.Body>
											</Table>
										</div>
									</Card.Body>
								</Card>
							</Grid>
						</Grid.Container>
					</Container>
				)}
			</main>
		</MainLayout>
	);
};

export default GameSelect;
