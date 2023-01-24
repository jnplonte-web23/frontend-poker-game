import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';

import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';

import { Container, Card, Text, Grid, Input, Spacer, Button, Loading, Col, Badge, Avatar } from '@nextui-org/react';
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

import { MainLayout } from '../../../layouts';

import { Helper } from '../../../services/helper/helper.service';
import { GetHashPackInformation } from '../../../providers/hashpack.provider';

import useSocketRoom from '../../../hooks/useSocketRoom.hook';

import styles from '../../../styles/game-room.module.css';

const $$client = Client.forTestnet();
const GameRoom: NextPage = () => {
	const $router = useRouter();

	const { $connect, $disconnect, $callEvents, $numberOfPlayers, $currentPlayer, $timer } = useSocketRoom();

	const { id } = $router.query;

	const $helper: Helper = useMemo(() => new Helper(), []);
	const { pairingData } = GetHashPackInformation();

	const [$loading, $setLoading] = useState(true);
	const [$contractLoading, $setContractLoading] = useState(true);
	const [$numberOfCoins, $setNumberOfCoins] = useState<number>(1);

	const [$eventName, $setEventName] = useState<string | null>(null);
	const [$eventPayload, $setEventPayload] = useState<any>();
	const [$eventData, $setEventData] = useState<any>();

	const [$address, $setAddress] = useState<string>('');

	const { refetch, status, data } = useQuery(
		['roomEvents', $eventName, $eventPayload],
		() => $callEvents($eventName, $eventPayload),
		{
			refetchOnWindowFocus: false,
			enabled: false,
		}
	);

	const handleChangeNumberOfCoins = (_event: any) => {
		$setNumberOfCoins(Number(_event.target.value));
	};

	const getInitData = async () => {
		console.log('init');
	};

	const betGame = async () => {
		$setContractLoading(true);

		$setEventPayload({ test: 111 });
		$setEventName('bet');
	};

	const callGame = async () => {
		$setContractLoading(true);

		$setEventPayload({ test: 222 });
		$setEventName('call');
	};

	const foldGame = async () => {
		$setContractLoading(true);

		$setEventPayload({ test: 333 });
		$setEventName('fold');
	};

	const allInGame = async () => {
		$setContractLoading(true);

		$setEventPayload({ test: 444 });
		$setEventName('allin');
	};

	useEffect(() => {
		if ($eventName) {
			refetch();
		}

		$setContractLoading(false);
		// eslint-disable-next-line
	}, [$eventName]);

	useEffect(() => {
		if (status === 'success' && !$loading) {
			switch ($eventName) {
				case 'bet':
					toast('BET SUCCESS');
					break;
				case 'call':
					toast('CALL SUCCESS');
					break;
				case 'fold':
					toast('FOLD SUCCESS');
					break;
				case 'allin':
					toast('ALL IN SUCCESS');
					break;

				default:
					toast('EVENT SUCCESS');
					break;
			}

			console.log(status, data, '<STATUS');
			$setEventData(data);
		}
		// eslint-disable-next-line
	}, [status, data]);

	// useEffect(() => {
	// 	if ($timer <= 0 && !$loading) {
	// 		$setContractLoading(true);

	// 		$setEventPayload({ test: 333 });
	// 		$setEventName('fold');
	// 	}

	// 	// eslint-disable-next-line
	// }, [$timer]);

	useEffect(() => {
		if (pairingData && !$loading) {
			const address: string = pairingData?.accountIds.reduce($helper.conCatAccounts);
			$setAddress(address);

			console.log(id, address, 'WEB23', '<<<');
			$connect(Number(id), address, 'WEB23');

			// NOTE: add here for testing
			// $connect(Number(id), `111.111.111${$numberOfPlayers}`, 'WEB23');
		} else {
			$setAddress('');
			$disconnect();
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
	}, [id]);

	return (
		<MainLayout>
			<Head>
				<title>{`POKER GAME | GAME ROOM ${id}`}</title>
				<meta name="description" content={`game room ${id}`} />
			</Head>

			<main className={styles.main}>
				{$loading ? (
					'loading...'
				) : (
					<Container className="container">
						<Grid.Container gap={2}>
							<Grid xs={12} lg={4}>
								<Card>
									<Card.Body>
										<Grid.Container gap={2}>
											<Grid>
												<Badge enableShadow size="lg" disableOutline color="default">
													WAITING
												</Badge>
											</Grid>
											{/* <Grid>
												<Badge enableShadow size="lg" disableOutline color="primary">
													YOUR TURN (90 sec left)
												</Badge>
											</Grid>
											<Grid>
												<Badge enableShadow size="lg" disableOutline color="success">
													BET 20
												</Badge>
											</Grid>
											<Grid>
												<Badge enableShadow size="lg" disableOutline color="error">
													FOLDED
												</Badge>
											</Grid> */}
										</Grid.Container>
										<Grid.Container gap={2}>
											<Grid xs={12} lg={8}>
												<Text h4 color="white">
													CARDS:
												</Text>
											</Grid>
											<Grid xs={12} lg={4}>
												<Text h4 color="white">
													TIMER: {$timer}
												</Text>
											</Grid>
											<Grid xs={12} lg={12}>
												<Grid.Container className={styles.cards}>
													<Grid xs={6} lg={3}>
														<div className={styles.cardsmall}>
															<p className={`${styles.cardtext} ${styles.black}`}>A</p>
															<p className={`${styles.cardimg} ${styles.black}`}>&clubs;</p>
														</div>
													</Grid>
													<Grid xs={6} lg={3}>
														<div className={styles.cardsmall}>
															<p className={`${styles.cardtext} ${styles.black}`}>J</p>
															<p className={`${styles.cardimg} ${styles.black}`}>&spades;</p>
														</div>
													</Grid>
												</Grid.Container>
											</Grid>
										</Grid.Container>
									</Card.Body>
								</Card>
							</Grid>
							<Grid xs={12} lg={8}>
								<Col>
									<Text h1 color="white">
										POKER GAME {id} - PLAYER No.{$currentPlayer ? $currentPlayer['playerNumber'] : ''}
									</Text>
									<Text h4 color="white">
										PLAYERS JOIN: {$numberOfPlayers} / 8
									</Text>
									<Card>
										<Card.Body>
											<Text b h3>
												AVAILABLE CHIPS: 100
											</Text>
											<Spacer y={3} />
											<Grid.Container gap={2}>
												<Grid xs={6} lg={3}>
													<Input
														aria-label="numberOfCoins"
														min="100"
														width="100%"
														bordered
														labelPlaceholder="number of coins"
														type="number"
														value={$numberOfCoins}
														onChange={handleChangeNumberOfCoins}
													/>
												</Grid>
												{$contractLoading ? (
													<Grid xs={12} lg={9}>
														<div className="full_width text_center">
															<Loading type="points" size="xl" />
														</div>
													</Grid>
												) : (
													<>
														<Grid xs={12} lg={2}>
															<Button className="full_width" size="md" auto onPress={betGame} disabled={!pairingData}>
																BET
															</Button>
														</Grid>
														<Grid xs={12} lg={2}>
															<Button className="full_width" size="md" auto onPress={callGame} disabled={!pairingData}>
																CALL
															</Button>
														</Grid>
														<Grid xs={12} lg={2}>
															<Button className="full_width" size="md" auto onPress={foldGame} disabled={!pairingData}>
																FOLD
															</Button>
														</Grid>
														<Grid xs={12} lg={2}>
															<Button className="full_width" size="md" auto onPress={allInGame} disabled={!pairingData}>
																ALL IN
															</Button>
														</Grid>
													</>
												)}
											</Grid.Container>
										</Card.Body>
									</Card>
								</Col>
							</Grid>
						</Grid.Container>
						<Grid.Container gap={2}>
							<Grid xs={12} lg={12}>
								<Card>
									<Card.Header>
										<Text b>
											POKER TABLE{' '}
											{$currentPlayer && $currentPlayer['playerNumber'] ? $currentPlayer['playerNumber'] : ''}
										</Text>
									</Card.Header>
									<Card.Divider />
									<Card.Body>
										<div className={styles.table}>
											<div className={styles.dealer}></div>
											<>
												<Avatar
													className={`${styles.player} ${styles.player1}`}
													color={$currentPlayer && $currentPlayer['playerNumber'] === 1 ? 'primary' : 'default'}
													key="p1"
													size="lg"
													pointer
													text={
														$currentPlayer && $currentPlayer['playerNumber'] === 1 ? $currentPlayer['userName'] : 'P1'
													}
												/>
												<div className={`${styles.status} ${styles.player1}`} key="p1status">
													<Badge enableShadow size="sm" disableOutline color="default">
														WAITING
													</Badge>
												</div>
											</>
											<>
												<Avatar
													className={`${styles.player} ${styles.player2}`}
													color={$currentPlayer && $currentPlayer['playerNumber'] === 2 ? 'primary' : 'default'}
													key="p2"
													size="lg"
													pointer
													text={
														$currentPlayer && $currentPlayer['playerNumber'] === 2 ? $currentPlayer['userName'] : 'P2'
													}
												/>
												<div className={`${styles.status} ${styles.player2}`} key="p2status">
													<Badge enableShadow size="sm" disableOutline color="primary">
														BET 100
													</Badge>
												</div>
											</>
											<>
												<Avatar
													className={`${styles.player} ${styles.player3}`}
													color={$currentPlayer && $currentPlayer['playerNumber'] === 3 ? 'primary' : 'default'}
													key="p3"
													size="lg"
													pointer
													text={
														$currentPlayer && $currentPlayer['playerNumber'] === 3 ? $currentPlayer['userName'] : 'P3'
													}
												/>
												<div className={`${styles.status} ${styles.player3}`} key="p3status">
													<Badge enableShadow size="sm" disableOutline color="error">
														FOLDED
													</Badge>
												</div>
											</>
											<>
												<Avatar
													className={`${styles.player} ${styles.player4}`}
													color={$currentPlayer && $currentPlayer['playerNumber'] === 4 ? 'primary' : 'default'}
													key="p4"
													size="lg"
													pointer
													text={
														$currentPlayer && $currentPlayer['playerNumber'] === 4 ? $currentPlayer['userName'] : 'P4'
													}
												/>
												<div className={`${styles.status} ${styles.player4}`} key="p4status">
													<Badge enableShadow size="sm" disableOutline color="default">
														WAITING
													</Badge>
												</div>
											</>
											<>
												<Avatar
													className={`${styles.player} ${styles.player5}`}
													color={$currentPlayer && $currentPlayer['playerNumber'] === 5 ? 'primary' : 'default'}
													key="p5"
													size="lg"
													pointer
													text={
														$currentPlayer && $currentPlayer['playerNumber'] === 5 ? $currentPlayer['userName'] : 'P5'
													}
												/>
												<div className={`${styles.status} ${styles.player5}`} key="p5status">
													<Badge enableShadow size="sm" disableOutline color="default">
														WAITING
													</Badge>
												</div>
											</>
											<>
												<Avatar
													className={`${styles.player} ${styles.player6}`}
													color={$currentPlayer && $currentPlayer['playerNumber'] === 6 ? 'primary' : 'default'}
													key="p6"
													size="lg"
													pointer
													text={
														$currentPlayer && $currentPlayer['playerNumber'] === 6 ? $currentPlayer['userName'] : 'P6'
													}
												/>
												<div className={`${styles.status} ${styles.player6}`} key="p6status">
													<Badge enableShadow size="sm" disableOutline color="default">
														WAITING
													</Badge>
												</div>
											</>
											<>
												<Avatar
													className={`${styles.player} ${styles.player7}`}
													color={$currentPlayer && $currentPlayer['playerNumber'] === 7 ? 'primary' : 'default'}
													key="p7"
													size="lg"
													pointer
													text={
														$currentPlayer && $currentPlayer['playerNumber'] === 7 ? $currentPlayer['userName'] : 'P7'
													}
												/>
												<div className={`${styles.status} ${styles.player7}`} key="p7status">
													<Badge enableShadow size="sm" disableOutline color="default">
														WAITING
													</Badge>
												</div>
											</>
											<>
												<Avatar
													className={`${styles.player} ${styles.player8}`}
													color={$currentPlayer && $currentPlayer['playerNumber'] === 8 ? 'primary' : 'default'}
													key="p8"
													size="lg"
													pointer
													text={
														$currentPlayer && $currentPlayer['playerNumber'] === 8 ? $currentPlayer['userName'] : 'P8'
													}
												/>
												<div className={`${styles.status} ${styles.player8}`} key="p8status">
													<Badge enableShadow size="sm" disableOutline color="default">
														WAITING
													</Badge>
												</div>
											</>
											<div className={styles.board}>
												<div className={styles.potmoney}>POT MONEY: 1000</div>
												<div className={styles.cardsmall}>
													<p className={`${styles.cardtext} ${styles.black}`}>10</p>
													<p className={`${styles.cardimg} ${styles.black}`}>&clubs;</p>
												</div>
												<div className={styles.cardsmall}>
													<p className={`${styles.cardtext} ${styles.black}`}>J</p>
													<p className={`${styles.cardimg} ${styles.black}`}>&spades;</p>
												</div>
												<div className={styles.cardsmall}>
													<p className={`${styles.cardtext} ${styles.red}`}>J</p>
													<p className={`${styles.cardimg} ${styles.red}`}>&hearts;</p>
												</div>
												<div className={styles.cardsmall}>
													<p className={`${styles.cardtext} ${styles.red}`}>Q</p>
													<p className={`${styles.cardimg} ${styles.red}`}>&diams;</p>
												</div>
												<div className={styles.cardback}></div>
											</div>
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

export default GameRoom;
