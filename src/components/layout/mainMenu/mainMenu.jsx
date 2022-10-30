/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import {useRef, useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import {
    Cancel as CloseIcon,
    LogOut as LogOutIcon
} from 'iconoir-react';
import formErrors from '../../../configs/formErrors';
import getLocales from '../../../helpers/language';
import styles from './mainMenu.css';


const MainMenu = ({lang, setStep}) => {
    const dialogRef = useRef(null);
    const [dialogPage, setDialogPage] = useState('login') // 'login' or 'register'
    const [submitError, setSumbitError] = useState(null);
    const [isSuccessfulRegistration, setIsSuccessfulRegistration] = useState(false);
    const [userId, setUserId] = useState(JSON.parse(localStorage.getItem('userId')));
    const { register, handleSubmit, reset, formState: { errors }, clearErrors} = useForm();

    useEffect(() => {
        localStorage.setItem('userId', JSON.stringify(userId));
      }, [userId]);

    useEffect(() => {
        const dialog = dialogRef.current;

        const clickOutside = e => {
            const rect = dialog.getBoundingClientRect();
            
            if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) {
                dialog.close();
                setDialogPage('login')
            }
        };

        dialog.addEventListener('click', clickOutside);

        return () => {
            dialog.removeEventListener('click', clickOutside);
        };
    }, []);

    const onRegisterSubmit = (data) => {
        fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
                setIsSuccessfulRegistration(true);
                setTimeout(() => {
                    setDialogPage('login');
                    setIsSuccessfulRegistration(false);
                }, 1600)
                
            } else {
                setSumbitError(data.status)
            }
        });
    }

    const onLoginSubmit = (data) => {
        fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                username: data.login_username,
                password: data.login_password
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                setUserId(data.id);
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
                {userId ? (
                    <>
                    <button onClick={() => {setStep(2);}}>{getLocales(lang, 'takePhoto')}</button>
                    <button onClick={() => {setStep(3);}}>{getLocales(lang, 'gallery')}</button>
                    <div 
                        onClick={() => {
                            setUserId(null);
                        }} 
                        className={styles.logoutIconWrapper}>
                        <LogOutIcon className={styles.logoutIcon}/><span>{getLocales(lang, 'logOut')}</span> 
                    </div> 
                    </>
                ) : (
                    <>
                    <button onClick={() => {dialogRef.current.showModal();}}>{getLocales(lang, 'signIn')}</button>
                    </>
                )}
            </div>
            <dialog
                ref={dialogRef}
            >
            {dialogPage === 'login' && (
                <div className={styles.dialogContent}>
                    <CloseIcon onClick={() => {dialogRef.current.close(); setDialogPage('login');}} className={styles.closeIcon}/>
                    <h1>{getLocales(lang, 'signIn')}</h1>
                    <form onSubmit={handleSubmit(onLoginSubmit)}>
                        <label htmlFor="username">{getLocales(lang, 'username')}</label>
                        <input
                            name="username"
                            type="text"
                            {...register("login_username", { required: getLocales(lang, 'usernameRequired')})}
                        />
                        <label htmlFor="password">{getLocales(lang, 'password')}</label>
                        <input
                            name="password"
                            type="password"
                            {...register("login_password", { required: getLocales(lang, 'passwordRequired')})}
                        />
                        {errors.login_password && <span>{errors.login_password.message}</span>}
                        {errors.login_username && <span>{errors.login_username.message}</span>}
                        {submitError && <span>{formErrors[submitError]}</span>}
                        <button className={styles.button} onClick={() => {}}>{getLocales(lang, 'signIn')}</button>
                        <span 
                            onClick={() => {
                                setDialogPage('register'); 
                                reset(); 
                                clearErrors(); 
                                setSumbitError(null)
                                }}>
                                    {getLocales(lang, 'newRegistration')}
                        </span>
                    </form>
                </div>
            )}
            {dialogPage === 'register' && (
                <div className={styles.dialogContent}>
                    <CloseIcon onClick={() => {dialogRef.current.close(); setDialogPage('login');}} className={styles.closeIcon}/>
                    <h1>{getLocales(lang, 'registration')}</h1>
                    <form onSubmit={handleSubmit(onRegisterSubmit)}>
                        <label htmlFor="username">{getLocales(lang, 'username')}</label>
                        <input
                            name="username"
                            type="text"
                            {...register("register_username", { required: getLocales(lang, 'usernameRequired')})}
                            required
                        />
                        <label htmlFor="password">{getLocales(lang, 'password')}</label>
                        <input
                            name="password"
                            type="password"
                            {...register("register_password", 
                                { 
                                    required: getLocales(lang, 'passwordRequired'), 
                                    minLength: {
                                        value: 8,
                                        message: getLocales(lang, 'passwordLength')
                                      } 
                                })}
                        />
                        {errors.register_password && <span>{errors.register_password.message}</span>}
                        {errors.register_username && <span>{errors.register_username.message}</span>}
                        {submitError && <span>{formErrors[submitError]}</span>}
                        {isSuccessfulRegistration && <span>{getLocales(lang, 'registrationSuccess')}</span>}
                        <button type='submit' className={styles.button}>{getLocales(lang, 'register')}</button>
                        <span 
                            onClick={() => {
                                setDialogPage('login'); 
                                reset(); 
                                clearErrors(); 
                                setSumbitError(null)
                                }}>
                                    {getLocales(lang, 'backToLogin')}
                        </span>
                    </form>
                </div>
            )}
            </dialog>
        </>
    );
};

MainMenu.propTypes = {
    lang: PropTypes.string,
    setStep: PropTypes.func,
};

export default MainMenu;
