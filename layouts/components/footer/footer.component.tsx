import * as PropTypes from 'prop-types';
import type { IProps } from '../../../interfaces';

const CustomFooter = (props: IProps) => {
	const { className } = props;

	return (
		<footer className={className}>
			<div className="footer_box">
				<p>WEB23</p>
				<p>WEB23</p>
				<p>WEB23</p>
			</div>
		</footer>
	);
};

CustomFooter.propTypes = {
	className: PropTypes.string,
};

export default CustomFooter;
