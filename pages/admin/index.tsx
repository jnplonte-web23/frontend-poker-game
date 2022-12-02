import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import Head from 'next/head';
import { Container } from '@nextui-org/react';

import { MainLayout } from '../../layouts';

import styles from '../../styles/admin.module.css';

const Index: NextPage = () => {
	const [$loading, $setLoading] = useState(true);

	useEffect(() => {
		$setLoading(false);
	}, []);

	return (
		<MainLayout>
			<Head>
				<title>POKER GAME | ADMIN</title>
				<meta name="description" content="admin" />
			</Head>

			<main className={styles.main}>
				{$loading ? 'loading...' : <Container className="container">ADMIN</Container>}
			</main>
		</MainLayout>
	);
};

export default Index;
