import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';

import { Container, Card, Text, Grid, Input, Spacer, Button, Loading, Col } from '@nextui-org/react';
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

import styles from '../../../styles/game-room.module.css';

const $$client = Client.forTestnet();
const GameRoom: NextPage = () => {
	const $router = useRouter();
	const { id } = $router.query;

	const $helper: Helper = useMemo(() => new Helper(), []);
	const { pairingData } = GetHashPackInformation();

	const [$loading, $setLoading] = useState(true);
	const [$contractLoading, $setContractLoading] = useState(true);
	const [$numberOfHbar, $setNumberOfHbar] = useState<number>(1);

	const [$address, $setAddress] = useState<string>('');

	const handleChangeNumberOfHbar = (_event: any) => {
		$setNumberOfHbar(Number(_event.target.value));
	};

	const getInitData = async () => {
		console.log('init');
	};

	const betGame = async () => {
		$setContractLoading(true);

		toast('BET SUCCESS');

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
				<title>{`POKER GAME | GAME ROOM ${id}`}</title>
				<meta name="description" content={`game room ${id}`} />
			</Head>

			<main className={styles.main}>
				{$loading ? (
					'loading...'
				) : (
					<Container className="container">
						<Grid.Container gap={2}>
							<Grid xs={12} lg={6}>
								<Card>
									<Card.Body>
										<Text b h3>
											CARDS: A, B, C, D, E
										</Text>
										<Spacer y={3} />
									</Card.Body>
								</Card>
							</Grid>
							<Grid xs={12} lg={6}>
								<Col>
									<Text h1 color="white">
										POKER GAME {id}
									</Text>
									<Text h4 color="white">
										PLAYERS JOIN: 3 / 8
									</Text>
									<Card>
										<Card.Body>
											<Text b h3>
												AVAILABLE: 100 HBAR
											</Text>
											<Spacer y={3} />
											<Grid.Container gap={2}>
												<Grid xs={6} lg={3}>
													<Input
														aria-label="numberOfHbar"
														min="100"
														width="100%"
														bordered
														labelPlaceholder="number of hbar"
														type="number"
														value={$numberOfHbar}
														onChange={handleChangeNumberOfHbar}
													/>
												</Grid>
												<Grid xs={12} lg={9}>
													{$contractLoading ? (
														<div className="full_width text_center">
															<Loading type="points" size="xl" />
														</div>
													) : (
														<Button className="full_width" size="lg" auto onPress={betGame} disabled={!pairingData}>
															BET
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
							<Grid xs={12} lg={12}>
								<Card>
									<Card.Header>
										<Text b>POKER TABLE</Text>
									</Card.Header>
									<Card.Divider />
									<Card.Body>
										<div className={styles.table}>
											<div className={styles.board}>
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
												<div className={styles.cardsmall}>
													<p className={`${styles.cardtext} ${styles.red}`}>1</p>
													<p className={`${styles.cardimg} ${styles.red}`}>&diams;</p>
												</div>
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