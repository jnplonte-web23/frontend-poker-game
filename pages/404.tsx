import type { NextPage } from 'next';

import Head from 'next/head';

import ErrorPage from 'next/error';
import Link from 'next/link';

const NotFound: NextPage = () => {
	return (
		<>
			<Head>
				<meta name="robots" content="noindex" />
			</Head>
			<div className="not_found">
				<ErrorPage statusCode={404} />
				<Link href="/" className="go_back">
					HOME PAGE
				</Link>
			</div>
		</>
	);
};

export default NotFound;
