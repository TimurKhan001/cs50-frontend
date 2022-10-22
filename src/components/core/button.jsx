import PropTypes from 'prop-types';
import styles from './button.css';

const Button = ({
    text,
    color,
    borderColor,
    handleClick,
    hasATag,
    href,
}) => (
    <button
        onClick={handleClick}
        style={{'--borderColor': `${borderColor}`, '--color': `${color}`}}
        className={styles.button}
    >
        {
            hasATag
                ? <a download="image.jpeg" href={href}>{text}</a>
                : text
        }
    </button>
);

Button.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    borderColor: PropTypes.string,
    handleClick: PropTypes.func,
    hasATag: PropTypes.bool,
    href: PropTypes.string,
};

export default Button;
