const { convertOrdersSnapshotToMap } = require('../../utils/utils');

const handleGetAllOrders = async (req, res, db) => {
    const ordersRef = db.collection('orders');
    try {
        const snapshot = await ordersRef.get();
        const ordersArray = convertOrdersSnapshotToMap(snapshot)
        res.send(ordersArray)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const handleDeleteOrder = async (req, res, db) => {
    const { uid } = req.body;
    const ordersRef = db.collection('orders').doc(uid);
    try {
        await ordersRef.delete()
        res.send("Success delete order!")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

module.exports = {
    handleGetAllOrders: handleGetAllOrders,
    handleDeleteOrder: handleDeleteOrder,
}