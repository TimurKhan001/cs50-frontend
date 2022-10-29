import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './button.css';

const Button = ({
    text,
    color,
    borderColor,
    handleClick,
    hasATag,
    href,
    disabled,
}) => (
    <button
        onClick={disabled ? () => {} : handleClick}
        style={{'--borderColor': `${borderColor}`, '--color': `${color}`}}
        className={clsx(styles.button, disabled && styles.disabled)}
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
    disabled: PropTypes.bool,
};

export default Button;
