function initPhotoApp() {
    const scriptElement = document.getElementById('photo-booth-app');

    if (!scriptElement) {
        console.log('There\'s no app script element');

        return;
    }

    const {assetsUrl} = scriptElement.dataset;

    const appScript = document.createElement('script');
    const appCssLink = document.createElement('link');
    // eslint-disable-next-line no-undef
    const baseUrl = typeof assetsUrl === 'string' ? assetsUrl : BASE_URL;

    appCssLink.rel = 'stylesheet';
    appCssLink.href = `${baseUrl}app.css`;
    appScript.src = `${baseUrl}app.js`;
    document.body.appendChild(appScript);
    document.body.appendChild(appCssLink);
}

initPhotoApp();
