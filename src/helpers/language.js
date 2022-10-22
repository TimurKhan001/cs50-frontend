import en from '../data/locales/en';

const localesData = {
    en,
};

const getLocales = (lang, key) => {
    if (!localesData[lang]) {
        return localesData.en[key];
    }

    return localesData[lang][key];
};

export default getLocales;
