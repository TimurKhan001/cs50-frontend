/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import {useRef, useEffect, useState} from 'react';
import {
    DeleteCircledOutline as DeleteIcon,
    DownloadCircledOutline as DownloadIcon,
    ArrowLeft as ArrowLeftIcon,
} from 'iconoir-react';
import Button from '../../core/button';
import {saveAs} from 'file-saver';
import getLocales from '../../../helpers/language';
import styles from './gallery.css';

const getUserPhotos = (userId, setPhotos) => {
    fetch(`${API_URL}/user_photos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify({
            id: userId
        })
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.status === 'success') {
            setPhotos(data.photos);
        } else {
            console.log('error');
        }
    });
}

const Gallery = ({lang, setStep}) => {
    const dialogRef = useRef(null);
    const showImageRef = useRef(null);
    const userId = localStorage.getItem('userId');
    const [photos, setPhotos] = useState(null);
    const [deletePhotoId, setDeletePhotoId] = useState(null);
    const [showPhoto, setShowPhoto] = useState(null);

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

    useEffect(() => {
        getUserPhotos(userId, setPhotos);
    }, [userId]);

    const handleDeleteClick = () => {
        fetch(`${API_URL}/photos`, {
            method: 'Delete',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            body: JSON.stringify({
                id: deletePhotoId
            })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.status === 'success') {
                setDeletePhotoId(null);
                getUserPhotos(userId, setPhotos);
                dialogRef.current.close();
            } else {
                console.log('error');
            }
        });
    }
    
    useEffect(() => {
        if (showPhoto) {
            showImageRef.current.style.backgroundImage = `url(${showPhoto})`;
            showImageRef.current.style.display = 'initial';
        }
    }, [showPhoto])

    return (    
        <>  
            <div className={styles.mainWrapper}>
                <div onClick={() => {setStep(1)}} className={styles.backButton}>
                <ArrowLeftIcon className={styles.backIcon}/> <span>Back to menu</span>
                </div>
                {!photos && (
                    <div className={styles.spinner}></div>
                )}
                {photos && photos.length === 0 && (
                    <h2>Nothing here yet</h2>
                )}
                {photos && photos.length > 0 && (
                    photos.map(({id, url}) => {
                    return <div key={`${id}`} className={styles.imageWrapper}>
                            <DeleteIcon 
                                onClick={() => {
                                    setDeletePhotoId(id);
                                    dialogRef.current.showModal();
                                }} 
                                className={styles.closeIcon}/>
                            <img onClick={() => {setShowPhoto(url)}}  src={url}/>
                        </div>
                    })
                )}
                {photos && (
                    <div
                        ref={showImageRef}
                        onClick={() => {
                            setShowPhoto(null)
                            showImageRef.current.style.backgroundImage = 'none';
                            showImageRef.current.style.display = 'none';
                        }}
                        className={styles.fullscreenImage}>
                        <DownloadIcon onClick={(e) => {e.stopPropagation(); saveAs(showPhoto); console.log('clicked')}} className={styles.downloadIcon}/>
                    </div>
                )}
                <dialog ref={dialogRef}>
                    <div className={styles.dialogContent}>
                    <h1>Do you really want to delete your photo?</h1>
                    <Button text='yes' handleClick={handleDeleteClick}/>
                    <Button text='no' handleClick={() => {dialogRef.current.close()}}/>
                    </div>
                </dialog>
            </div>
        </>
    );
};

Gallery.propTypes = {
    lang: PropTypes.string,
    setStep: PropTypes.func,
};

export default Gallery;
