import {
    useRef,
    useState,
    useEffect,
    useLayoutEffect
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
    ArrowRight as ArrowRightIcon
} from 'iconoir-react';
import ControlsButton from '../core/controlsButton';
import Button from '../core/button';
import overlayArray from '../../assets/base64';
import getLocales from '../../helpers/language';
import sharePhoto from '../../helpers/sharePhoto';
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

const CameraWrapper = ({lang, assetsUrl}) => {
    const [cameraSide, setCameraSide] = useState('user');
    const [overlay, setOverlay] = useState(0);
    const [image, setImage] = useState('');
    const [aspectRatio, setAspectRatio] = useState(null);
    const [hasStream, setHasStream] = useState(false);
    const [isPageTransfer, setIsPageTransfer] = useState(false);
    const [wrapperHeight, setWrapperHeight] = useState('initial');
    const [isResizing, setIsResizing] = useState(false);
    const [isLoading, setIsloading] = useState(false);

    const webcamRef = useRef(null);
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

        const resizedImg = await fetch(img2)
            .then(response => response.blob())
            .then(blob => resizeFile(blob, sizeImg.width, sizeImg.height));

        const imageDimensions = {width: sizeImg.width, height: sizeImg.height};

        const b64 = await mergeImages([img1, resizedImg], {...imageDimensions, format: 'image/jpeg'});

        await sharePhoto(b64);

        setIsResizing(false);
    };

    useEffect(() => {
        if (!webcamRef.current) {
            return;
        }

        const video = webcamRef.current;

        if (video.video.videoWidth > video.video.videoHeight) {
            setAspectRatio(3 / 4);
        } else {
            setAspectRatio(4 / 3);
        }

        setWrapperHeight(video.video.offsetHeight);
    }, [hasStream]);

    useLayoutEffect(() => {
        if (buttonsRef.current && cameraWrapperRef.current) {
            const hasOverflow = buttonsRef.current.clientHeight + cameraWrapperRef.current.clientHeight > window.innerHeight;

            const app = document.querySelector('[data-app]');

            if (hasOverflow) {
                app.style.position = 'initial';
            }
        }
    });

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
                    <div className={styles.glassMenu}>
                        <span>Menu</span>
                    </div>
                    <div
                        ref={cameraWrapperRef}
                        className={styles.cameraWrapper}
                        style={{height: wrapperHeight}}
                    >
                        <Webcam
                            ref={webcamRef}
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
                                    color='#000000'
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
                                color='#202020'
                                Icon={RotateCameraRightIcon}
                                handleClick={changeCamera}
                            />
                            <ControlsButton
                                size={14}
                                color='#202020'
                                Icon={PhotoIcon}
                                handleClick={() => {
                                    setIsPageTransfer(true);

                                    const imageSrc = webcamRef.current.getScreenshot();

                                    setImage(imageSrc);

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
                                    color='#000000'
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
                            text={getLocales(lang, 'saveButton')}
                            color='transparent'
                            borderColor='#202020'
                            handleClick={() => {
                                saveImage(image, overlayArray[overlay]);
                            }}
                        />
                        <Button
                            text={getLocales(lang, 'backButton')}
                            color='transparent'
                            borderColor='#202020'
                            handleClick={() => {
                                setImage('');
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
};

export default CameraWrapper;
