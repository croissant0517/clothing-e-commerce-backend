const { FieldValue } = require('firebase-admin/firestore')
const { convertSlidersIdToKey } = require('../../utils/utils');

const handleGetAllSliders = async (req, res, db) => {
    const slidersRef = db.collection('sliders');
    try {
        const snapshot = await slidersRef.get();
        const sliderData = convertSlidersIdToKey(snapshot.docs[0].data().sliderData);
        res.send(sliderData)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleAddSlider = async (req, res, db) => {
    const { slider } = req.body;
    const collectionsRef = db.collection('sliders').doc("rxQnScwFj52A7vxI1a9D");
    try {
        await collectionsRef.update({
            sliderData: FieldValue.arrayUnion(slider)
        });
        res.send("update success!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleUpdateSlider = async (req, res, db) => {
    const { id, title, imageUrl } = req.body;
    const slidersRef = db.collection('sliders').doc("rxQnScwFj52A7vxI1a9D");
    try {
        const snapshot = await slidersRef.get()
        const sliderData = snapshot.data().sliderData;
        sliderData[(id)] = {
            title,
            imageUrl,
        }
        console.log(sliderData);
        await slidersRef.update({
            sliderData: sliderData,
        })
        res.send("update success!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleDeleteSlider = async (req, res, db) => {
    const { slider } = req.body;
    const collectionsRef = db.collection('sliders').doc("rxQnScwFj52A7vxI1a9D");
    try {
        await collectionsRef.update({
            sliderData: FieldValue.arrayRemove(slider)
        });
        res.send("update success!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

module.exports = {
    handleGetAllSliders: handleGetAllSliders,
    handleAddSlider: handleAddSlider,
    handleUpdateSlider: handleUpdateSlider,
    handleDeleteSlider: handleDeleteSlider,
}