/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import {useRef, useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import styles from './mainMenu.css';

const MainMenu = ({setStep}) => {
    const dialogRef = useRef(null);
    const isLoggedIn = sessionStorage.getItem('userId');
    const [dialogPage, setDialogPage] = useState('login') // 'login' or 'register'
    const [submitError, setSumbitError] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

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

    const onRegisterSubmit = (data) => {
        fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            body: JSON.stringify({
                username: data.register_username,
                password: data.register_password
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                setSumbitError(null);
                reset();
                setDialogPage('login');
            } else {
                setSumbitError(data.status)
            }
        });
    }

    const onLoginSubmit = (data) => {
        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            body: JSON.stringify({
                username: data.login_username,
                password: data.login_password
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                sessionStorage.setItem('userId', data.id);
                setSumbitError(null);
                reset();
                dialogRef.current.close();
            } else {
                setSumbitError(data.status)
            }
        });
    }

    return (
        <>  
            <div className={styles.mainWrapper}>
                <h1>PHOTO.BOOTH</h1>
                {isLoggedIn ? (
                    <>
                    <button onClick={() => {setStep(2);}}>Take a photo</button>
                    <button onClick={() => {setStep(3);}}>Gallery</button>
                    </>
                ) : (
                    <>
                    <button onClick={() => {dialogRef.current.showModal();}} >Sign in</button>
                    <button onClick={() => {setStep(2);}}>Take a photo</button>
                    </>
                )}

            </div>
            <dialog
                ref={dialogRef}
            >
            {dialogPage === 'login' && (
                <div className={styles.dialogContent}>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit(onLoginSubmit)}>
                        <label htmlFor="username">Username</label>
                        <input
                            name="username"
                            type="text"
                            {...register("login_username", { required: true })}
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            name="password"
                            type="password"
                            {...register("login_password", { required: true })}
                        />
                        {submitError && <span>{submitError}</span>}
                        <button className={styles.button} onClick={() => {}}>Sign In</button>
                        <span onClick={() => {setDialogPage('register')}}>New Registration</span>
                    </form>
                </div>
            )}
            {dialogPage === 'register' && (
                <div className={styles.dialogContent}>
                    <h1>Registration</h1>
                    <form onSubmit={handleSubmit(onRegisterSubmit)}>
                        <label htmlFor="username">Username</label>
                        <input
                            name="username"
                            type="text"
                            {...register("register_username", { required: 'Username is required' })}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            name="password"
                            type="password"
                            {...register("register_password", 
                                { 
                                    required: 'Password is reguired', 
                                    minLength: {
                                        value: 10,
                                        message: "Password must be at least 8 characters long."
                                      } 
                                })}
                        />
                        {errors.register_password && <span>{errors.register_password.message}</span>}
                        {errors.register_username && <span>{errors.register_username.message}</span>}
                        {submitError && <span>{submitError}</span>}
                        <button type='submit' className={styles.button}>Register</button>
                    </form>
                </div>
            )}
            </dialog>
        </>
    );
};

MainMenu.propTypes = {
    setStep: PropTypes.func,
};

export default MainMenu;
