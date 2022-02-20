const { convertActivitySnapshotToMap } = require('../../utils/utils');

const handleGetActivity = async (req, res, db) => {
    const activityRef = db.collection('activity');
    try {
        const snapshot = await activityRef.get();
        const sliderData = convertActivitySnapshotToMap(snapshot);
        res.send(sliderData)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleAddActivity = async (req, res, db) => {
    const { title } = req.body;
    const collectionsRef = db.collection('activity')
    try {
        await collectionsRef.add({
            title: title,
        });
        res.send("update success!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleUpdateActivity = async (req, res, db) => {
    const { id, title } = req.body;
    const collectionsRef = db.collection('activity').doc(id);
    try {
        await collectionsRef.update({
            title: title,
        });
        res.send("update success!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleDeleteActivity = async (req, res, db) => {
    const { uid } = req.body;
    const ActivityRef = db.collection('activity').doc(uid);
    try {
        await ActivityRef.delete()
        res.send("update success!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

module.exports = {
    handleGetActivity: handleGetActivity,
    handleAddActivity: handleAddActivity,
    handleUpdateActivity: handleUpdateActivity,
    handleDeleteActivity: handleDeleteActivity,
}