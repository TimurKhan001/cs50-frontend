import {
    useRef,
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
} from 'react';
import Webcam from 'react-webcam';
import mergeImages from 'merge-images';
import PropTypes from 'prop-types';
import {Swiper, SwiperSlide} from 'swiper/react';
import Resizer from 'react-image-file-resizer';
import clsx from 'clsx';
import {
    Instagram as PhotoIcon,
    RotateCameraRight as RotateCameraRightIcon,
    ArrowLeft as ArrowLeftIcon,
    ArrowRight as ArrowRightIcon,
    Download as DownloadIcon
} from 'iconoir-react';
import ControlsButton from '../core/controlsButton';
import Button from '../core/button';
import overlayArray from '../../assets/base64';
import getLocales from '../../helpers/language';
import styles from './camera.css';

const resizeFile = (file, width, height) => new Promise(resolve => {
    Resizer.imageFileResizer(
        file,
        width,
        height,
        'PNG',
        100,
        0,
        uri => {
            resolve(uri);
        },
        'base64'
    );
});

const CameraWrapper = ({lang, assetsUrl, setStep}) => {
    const [cameraSide, setCameraSide] = useState('user');
    const [overlay, setOverlay] = useState(0);
    const [image, setImage] = useState('');
    const [aspectRatio, setAspectRatio] = useState(null);
    const [hasStream, setHasStream] = useState(false);
    const [isPageTransfer, setIsPageTransfer] = useState(false);
    const [wrapperHeight, setWrapperHeight] = useState('initial');
    const [isResizing, setIsResizing] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [isSavedFile, setIsSavedFile] = useState(false);

    const [webcamRef, setWebcamRef] = useState(null);
    const gliderRef = useRef(null);
    const cameraWrapperRef = useRef(null);
    const buttonsRef = useRef(null);

    const changeCamera = () => {
        setIsloading(true);
        // eslint-disable-next-line no-unused-expressions
        cameraSide === 'user' ? setCameraSide('environment') : setCameraSide('user');
        setTimeout(() => {
            setIsloading(false);
        }, 1500);
    };

    const saveImage = async (img1, img2) => {
        setIsResizing(true);
  
        const sizeImg = new Image();
        
        sizeImg.src = img1;

        const resizedImg = await fetch(`/${img2}`)
            .then(response => response.blob())
            .then(blob => resizeFile(blob, sizeImg.width, sizeImg.height));
        
     

        const imageDimensions = {width: sizeImg.width, height: sizeImg.height};
 
        const b64 = await mergeImages([img1, resizedImg], {...imageDimensions, format: 'image/jpeg'});

        const blob = await (await fetch(b64)).blob();
        const file = new File([blob], 'image.jpg', {type: blob.type});

        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', localStorage.getItem('userId'));

        fetch(`${API_URL}/photos`, {
            method: 'POST',
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                setIsSavedFile(true);
                setIsResizing(false);
            } else {
                console.log('error');
            }
        });
    };

    useEffect(() => {
        if (!webcamRef) {
            return;
        }
        const video = webcamRef;
        // console.log(video);
        if (video.video.videoWidth > video.video.videoHeight) {
            setAspectRatio(3 / 4);
        } else {
            setAspectRatio(4 / 3);
        }

        setWrapperHeight(video.video.offsetHeight);
    }, [webcamRef]);

    useLayoutEffect(() => {
        if (buttonsRef.current && cameraWrapperRef.current) {
            const hasOverflow = buttonsRef.current.clientHeight + cameraWrapperRef.current.clientHeight > window.innerHeight;

            const app = document.querySelector('[data-app]');

            if (hasOverflow) {
                app.style.position = 'initial';
            }
        }
    });

    const capture = useCallback(() => {
        const imageSrc = webcamRef.getScreenshot();
        setImage(imageSrc);
      }, [webcamRef]);

    
    
    return (
        <>
            {(!hasStream || isResizing) && (
                <div className={clsx(styles.loading, isResizing && styles.transparent)}>
                    <div className={clsx(styles.spinner, isResizing && styles.big)}></div>
                </div>
            )}
            {image === '' && (
                <>
                    <div
                        style={{
                            display: isLoading ? 'flex' : 'none',
                            height: wrapperHeight,
                        }}
                        className={styles.changeCamera}
                    >
                        <div className={styles.spinner}></div>
                    </div>
                    <div onClick={() => {setStep(1)}} className={styles.glassMenu}>
                        <ArrowLeftIcon className={styles.backToMenuIcon}/><span>Menu</span>
                    </div>
                    <div
                        ref={cameraWrapperRef}
                        className={styles.cameraWrapper}
                        style={{height: wrapperHeight}}
                    >
                        <Webcam
                            ref={(e) => setWebcamRef(e)}
                            audio={false}
                            controls={false}
                            imageSmoothing={true}
                            screenshotFormat="image/jpeg"
                            mirrored={cameraSide === 'user'}
                            onUserMedia={() => {
                                setTimeout(() => setHasStream(true), 1000);
                            }}
                            style={{
                                width: '100%',
                            }}
                            videoConstraints={{
                                aspectRatio,
                                facingMode: cameraSide,
                            }}
                        />
                    </div>
                    <div className={styles.slider}>
                        <Swiper
                            ref={gliderRef}
                            allowSlideNext={true}
                            allowSlidePrev={true}
                            onSlideChange={event => {
                                setOverlay(event.activeIndex);
                            }}
                            onSwiper={swiper => swiper.slideTo(overlay)}

                        >
                            {overlayArray.map(overlayItem => (
                                <SwiperSlide className={styles.slide} key={overlayItem}>
                                    <img src={assetsUrl + overlayItem} alt={`Slide ${overlayItem}`} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div ref={buttonsRef} className={styles.buttons}>
                        {overlay !== 0 && (
                            <div className={styles.buttonLeft}>
                                <ControlsButton
                                    size={14}
                                    color='#505050'
                                    Icon={ArrowLeftIcon}
                                    handleClick={() => {
                                        gliderRef.current.swiper.slidePrev();
                                        setOverlay(overlay - 1);
                                    }}
                                />
                            </div>
                        )}
                        <div className={styles.photoButtons}>
                            <ControlsButton
                                size={12}
                                color='#505050'
                                Icon={RotateCameraRightIcon}
                                handleClick={changeCamera}
                            />
                            <ControlsButton
                                size={14}
                                color='#505050'
                                Icon={PhotoIcon}
                                handleClick={() => {
                                    setIsPageTransfer(true);

                                    capture();

                                    setTimeout(() => {
                                        setIsPageTransfer(false);
                                    }, 1000);
                                }}
                            />
                        </div>
                        {overlay !== overlayArray.length - 1 && (
                            <div className={styles.buttonRight}>
                                <ControlsButton
                                    size={14}
                                    color='#505050'
                                    Icon={ArrowRightIcon}
                                    handleClick={() => {
                                        gliderRef.current.swiper.slideNext();
                                        setOverlay(overlay + 1);
                                    }}
                                />
                            </div>
                        )
                        }
                    </div>
                </>
            )}
            <div
                style={{display: isPageTransfer ? 'block' : 'none'}}
                className={styles.photoFlash}
            >
            </div>
            {image !== '' && (
                <>
                    <div
                        style={{'--image': `url(${assetsUrl}${overlayArray[overlay]})`}}
                        className={styles.screenshot}
                    >
                        <img
                            src={image}
                            alt='your snapshot'
                        />
                    </div>

                    <div className={styles.finishButtons}>
                            <Button
                            text={isSavedFile ? getLocales(lang, 'savedButton') : getLocales(lang, 'saveButton')}
                            Icon={DownloadIcon}
                            color='transparent'
                            borderColor='#505050'
                            handleClick={() => {
                                if (!isResizing) {
                                    saveImage(image, overlayArray[overlay]);
                                }  
                            }}
                            disabled={isSavedFile || isResizing}
                        />
                        <Button
                            text={getLocales(lang, 'backButton')}
                            color='transparent'
                            borderColor='#505050'
                            handleClick={() => {
                                setImage('');
                                setIsSavedFile(false);
                            }}
                        />
                    </div>
                </>
            )}
        </>
    );
};

CameraWrapper.propTypes = {
    lang: PropTypes.string,
    assetsUrl: PropTypes.string,
    setStep: PropTypes.func,
};

export default CameraWrapper;
