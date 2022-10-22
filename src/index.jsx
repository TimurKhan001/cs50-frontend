import {render} from 'react-dom';
import App from './components/app/app';

const startApp = () => {
    const scriptElement = document.getElementById('photo-booth-app');
    const appElement = document.getElementById('photo-booth');

    appElement.style.height = '100dvh';

    const {lang, assetsUrl} = scriptElement.dataset;

    render(
        <App
            path="/"
            lang={lang}
            // eslint-disable-next-line no-undef
            assetsUrl={assetsUrl || BASE_URL}
        />,
        appElement
    );
};

startApp();
