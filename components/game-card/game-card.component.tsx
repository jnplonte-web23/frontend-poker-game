import * as PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Card, Text, Grid, Col, Link, Button } from '@nextui-org/react';

const GameCard = (props: any) => {
	const { className, id, active, image } = props;

	const [$loading, $setLoading] = useState<boolean>(true);

	useEffect(() => {
		$setLoading(false);
		// eslint-disable-next-line
	}, []);

	return (
		<>
			{$loading ? (
				'loading...'
			) : (
				<Card css={{ w: '100%', h: '400px' }} className={className}>
					<Card.Header css={{ position: 'absolute', zIndex: 1, top: 5 }}>
						<Col>
							<Text h3 color="black">
								{`POKER GAME ${id}`}
							</Text>
						</Col>
					</Card.Header>
					<Card.Body css={{ p: 0 }}>
						<Card.Image src={image} width="100%" height="100%" objectFit="cover" alt={`game ${id}`} />
					</Card.Body>
					<Card.Footer
						isBlurred
						css={{
							position: 'absolute',
							bgBlur: '#ffffff66',
							borderTop: '$borderWeights$light solid rgba(255, 255, 255, 0.2)',
							bottom: 0,
							zIndex: 1,
						}}
					>
						<Grid.Container gap={0}>
							<Grid xs={12} lg={8}>
								<Col>
									<Text color="#333" size={18}>
										PLAYERS: 2/8
									</Text>
									<Text color="#333" size={12} className="hide_xs">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit consectetur adipiscing elit...
									</Text>
								</Col>
							</Grid>
							<Grid xs={12} lg={4} justify="flex-end">
								<Button disabled={!active} auto>
									<Link href={`/game/${id}`}>
										<Text color="#fff" size={12} weight="bold">
											JOIN GAME
										</Text>
									</Link>
								</Button>
							</Grid>
						</Grid.Container>
					</Card.Footer>
				</Card>
			)}
		</>
	);
};

GameCard.propTypes = {
	className: PropTypes.string,
	id: PropTypes.number,
	active: PropTypes.bool,
	image: PropTypes.string,
};

export default GameCard;
