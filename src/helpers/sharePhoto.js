import {saveAs} from 'file-saver';

const sharePhoto = async b64 => {
    const blob = await (await fetch(b64)).blob();
    const file = new File([blob], 'image.jpg', {type: blob.type});

    if (navigator.canShare({files: [file]})) {
        try {
            navigator.share({
                title: 'Lego Photo App',
                text: 'Share or save your photo!',
                files: [file],
            });
        } catch (err) {
            saveAs(b64, 'image.jpg');
        }
    } else {
        saveAs(b64, 'image.jpg');
    }
};

export default sharePhoto;
