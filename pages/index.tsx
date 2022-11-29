import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import Head from 'next/head';
import { Container } from '@nextui-org/react';

import { MainLayout } from '../layouts';

import styles from '../styles/index.module.css';

const Index: NextPage = () => {
	const [$loading, $setLoading] = useState(true);

	useEffect(() => {
		$setLoading(false);
	}, []);

	return (
		<MainLayout>
			<Head>
				<title>RANDOM GAME | HOME</title>
				<meta name="description" content="home" />
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>{$loading ? 'loading...' : <Container className="container">HOME</Container>}</main>
		</MainLayout>
	);
};

export default Index;
