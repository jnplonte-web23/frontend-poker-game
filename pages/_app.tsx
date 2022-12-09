import type { AppProps } from 'next/app';

import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from 'react-query';

import { HashPackProvider } from '../providers/hashpack.provider';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
	const $darkTheme = createTheme({
		type: 'dark',
	});

	const $queryClient = new QueryClient();

	const $network: any = process.env.NEXT_PUBLIC_NETWORK || 'testnet';

	return (
		<div className="root_container">
			<NextThemesProvider
				defaultTheme="system"
				attribute="class"
				value={{
					dark: $darkTheme.className,
				}}
			>
				<NextUIProvider>
					<HashPackProvider network={$network}>
						<QueryClientProvider client={$queryClient}>
							<ToastContainer
								position="top-right"
								autoClose={5000}
								hideProgressBar={true}
								newestOnTop={false}
								closeOnClick
								rtl={false}
								pauseOnFocusLoss
								draggable
								pauseOnHover
								theme="dark"
							/>
							<Component className="container" {...pageProps} />
						</QueryClientProvider>
					</HashPackProvider>
				</NextUIProvider>
			</NextThemesProvider>
		</div>
	);
}

export default MyApp;
