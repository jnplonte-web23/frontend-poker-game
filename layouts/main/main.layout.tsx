import * as PropTypes from 'prop-types';
import type { IProps } from '../../interfaces';

import { CustomNavbar, CustomFooter } from './../components';

const MainLayout = (props: IProps) => {
	const { children } = props;
	return (
		<>
			<CustomNavbar className="navbar_container" />
			<div className="main_container">{children}</div>
			<CustomFooter className="footer_container" />
		</>
	);
};

MainLayout.propTypes = {
	children: PropTypes.node,
};

export default MainLayout;
