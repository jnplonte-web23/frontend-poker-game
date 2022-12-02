import type { NextPage } from 'next';
import { useEffect, useState, useMemo } from 'react';

import Head from 'next/head';
import { Container, Card, Text, Grid, Col, Spacer } from '@nextui-org/react';

import { MainLayout } from '../../layouts';
import { GameCard } from '../../components';

import { Helper } from '../../services/helper/helper.service';
import { GetHashPackInformation } from '../../providers/hashpack.provider';

import styles from '../../styles/game.module.css';

const Game: NextPage = () => {
	const $helper: Helper = useMemo(() => new Helper(), []);
	const { pairingData, network, topic, hashconnect } = GetHashPackInformation();

	const [$loading, $setLoading] = useState<boolean>(true);
	const [$mockData, $setMockData] = useState<number[]>([2, 3, 4, 5]);

	useEffect(() => {
		$setLoading(false);
		// eslint-disable-next-line
	}, []);

	return (
		<MainLayout>
			<Head>
				<title>POKER GAME | GAME</title>
				<meta name="description" content="game" />
			</Head>

			<main className={styles.main}>
				{$loading ? (
					'loading...'
				) : (
					<Container className="container">
						<Grid.Container>
							<Grid xs={12} lg={2}>
								<Col>
									<Spacer y={1} />
									<Card>
										<Card.Header>
											<Text b>FILTER</Text>
										</Card.Header>
										<Card.Divider />
										<Card.Body>
											<Text>1 2 3 ...</Text>
										</Card.Body>
									</Card>
								</Col>
							</Grid>
							<Grid xs={12} lg={10}>
								<Grid.Container gap={4}>
									<Grid xs={12} lg={4}>
										<GameCard
											id={1}
											active={true}
											image="https://api.lorem.space/image/furniture?w=300&h=300&hash=8B7BCDC0"
										/>
									</Grid>
									{$mockData.map((mData) => (
										<Grid xs={12} lg={4} key={mData}>
											<GameCard
												key={mData}
												id={mData}
												active={false}
												image={`https://api.lorem.space/image/furniture?w=300&h=300&hash=8B7BCDC${mData}`}
											/>
										</Grid>
									))}
								</Grid.Container>
							</Grid>
						</Grid.Container>
					</Container>
				)}
			</main>
		</MainLayout>
	);
};

export default Game;
