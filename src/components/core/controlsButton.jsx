import PropTypes from 'prop-types';
import styles from './controlButton.css';

const ControlsButton = ({
    size,
    color,
    Icon,
    handleClick,
}) => (
    <button
        onClick={handleClick}
        style={{'--size': `${size}vw`, '--color': `${color}`}}
        className={styles.button}
    >
        <Icon/>
    </button>

);

ControlsButton.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    Icon: PropTypes.any,
    handleClick: PropTypes.func,
};

export default ControlsButton;
