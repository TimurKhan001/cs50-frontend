/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import {useRef, useEffect} from 'react';
import styles from './mainMenu.css';

const MainMenu = ({setStep}) => {
    console.log('main menu');

    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        const clickOutside = e => {
            const rect = dialog.getBoundingClientRect();

            if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) {
                dialog.close();
            }
        };

        dialog.addEventListener('click', clickOutside);

        return () => {
            dialog.removeEventListener('click', clickOutside);
        };
    }, []);

    return (
        <>
            <div className={styles.mainWrapper}>
                <h1>PHOTO.BOOTH</h1>
                {/* <button onClick={() => {setStep(2);}}>Take a photo</button> */}
                <button onClick={() => {dialogRef.current.showModal();}} >Sign in</button>

                {/* <button>Register</button> */}
            </div>
            <dialog
                ref={dialogRef}
            >
                <div className={styles.dialogContent}>
                    <h1>Sign In</h1>
                    <form>
                        <label htmlFor="username">Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                        />
                        {/* <div className={styles.signIn}> */}
                        <button onClick={() => {setStep(2);}}>Sign In</button>
                        <span>New Registration</span>
                        {/* </div> */}
                    </form>
                </div>
            </dialog>
        </>
    );
};

MainMenu.propTypes = {
    setStep: PropTypes.func,
};

export default MainMenu;
