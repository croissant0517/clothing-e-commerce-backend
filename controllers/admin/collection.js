const { FieldValue } = require('firebase-admin/firestore')
const { convertCollectionsSnapshotToMap } = require('../../utils/utils');

const handleGetAllCollection = async (req, res, db) => {
    const collectionsRef = db.collection('collections');
    try {
        const snapshot = await collectionsRef.get();
        const collectionsArray = convertCollectionsSnapshotToMap(snapshot);
        res.send(collectionsArray)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleAddCollection = async (req, res, db) => {
    const { title, collectionImageUrl } = req.body;
    const collectionsRef = db.collection('collections')
    try {
        await collectionsRef.add({
            title: title,
            imageUrl: collectionImageUrl,
            items: []
        });
        res.send("update success!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleUpdateCollection = async (req, res, db) => {
    const { id, title, imageUrl } = req.body;
    const collectionsRef = db.collection('collections').doc(id);
    try {
        await collectionsRef.update({
            title: title,
            imageUrl: imageUrl,
        });
        res.send("update success!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleDeleteCollection = async (req, res, db) => {
    const { uid } = req.body;
    const collectionsRef = db.collection('collections').doc(uid);
    try {
        await collectionsRef.delete()
        res.send("update success!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleAddItem = async (req, res, db) => {
    const { uid, item } = req.body;
    const collectionsRef = db.collection('collections').doc(uid);
    try {
        await collectionsRef.update({
            items: FieldValue.arrayUnion(item)
        });
        res.send("update success!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleUpdateItem = async (req, res, db) => {
    const { uid, key, name, price, imageUrl } = req.body;
    const collectionsRef = db.collection('collections').doc(uid);
    try {
        const doc = await collectionsRef.get()
        newItems = doc.data().items;
        newItems[key] = {
            name: name,
            price: price,
            imageUrl: imageUrl
        }
        console.log(newItems);
        await collectionsRef.update({
            items: newItems,
        })
        res.send("update success!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleDeleteItem = async (req, res, db) => {
    const { uid, id, name, price, imageUrl } = req.body;
    const collectionsRef = db.collection('collections').doc(uid);
    try {
        await collectionsRef.update({
            items: FieldValue.arrayRemove({
                imageUrl: imageUrl,
                name: name,
                price: price,
            })
        });
        res.send("update success!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

module.exports = {
    handleGetAllCollection: handleGetAllCollection,
    handleAddCollection: handleAddCollection,
    handleUpdateCollection: handleUpdateCollection,
    handleDeleteCollection: handleDeleteCollection,
    handleAddItem: handleAddItem,
    handleUpdateItem: handleUpdateItem,
    handleDeleteItem: handleDeleteItem,
}