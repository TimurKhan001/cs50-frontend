import PropTypes from 'prop-types';
import useMobileDetect from 'use-mobile-detect-hook';
import {
    useState
} from 'react';
import CameraWrapper from '../layout/camera';
import MainMenu from '../layout/mainMenu/mainMenu';
import getLocales from '../../helpers/language';
import Gallery from '../layout/gallery/gallery';
import styles from './app.css';

const Home = ({lang, assetsUrl}) => {
    const detectMobile = useMobileDetect();
    const [step, setStep] = useState(1);

    return (
        <div
            data-app
            className={styles.app}
        >
            {!detectMobile.isDesktop()
                ? (
                    <>
                        {step === 1 && <MainMenu lang={lang} setStep={setStep}/>}
                        {step === 2 && <CameraWrapper lang={lang} assetsUrl={assetsUrl} setStep={setStep}/>}
                        {step === 3 && <Gallery lang={lang} setStep={setStep}/>}
                    </>
                ) : (
                    <div className={styles.desktop}>
                        <h1>PHOTO.BOOTH</h1>
                        <h2>{getLocales(lang, 'desktopHeading')}</h2>
                        <img
                            src={`${assetsUrl}images/qr/${lang}.png`}
                            alt="qr"
                            className={styles.qr}
                        />
                        <h4>{getLocales(lang, 'desktopDescription')}</h4>
                    </div>
                )}
        </div>
    );
};

Home.propTypes = {
    lang: PropTypes.string,
    assetsUrl: PropTypes.string,
};

export default Home;
