const  {convertCollectionsSnapshotToMap, splitArrayIntoChunks } = require("../../utils/utils")

const handleUserSearch = async (req, res, db) => {
    const searchField =  req.query.q;
    const currentSendedPage = Number(req.query.page);
    console.log(currentSendedPage);
    
    const collectionsRef = db.collection('collections');
    try {
        const snapshot = await collectionsRef.get();
        const collectionsArray = convertCollectionsSnapshotToMap(snapshot);
        let allItemsArray = [];
        collectionsArray.forEach((collection) => {
            collection.items.forEach((item) => {
                allItemsArray.push(item)
            })
        })
        const filteredItems = allItemsArray.filter(item =>{
            return item.name.toLowerCase().includes(searchField.toLowerCase());
        })
        if (filteredItems.length > 0 && filteredItems.length < 7) {
            res.send(filteredItems)
        } else if (filteredItems.length > 6) {
            const splitedArray =  splitArrayIntoChunks(filteredItems, 6);
            console.log("Array long",splitedArray.length);
            console.log((splitedArray.length - 1) === currentSendedPage);
            if ((splitedArray.length - 1) === currentSendedPage) {
                res.send({
                    splitedArray: splitedArray[currentSendedPage],
                    nextPage: false
                })
            } else {
                res.send({
                    splitedArray: splitedArray[currentSendedPage],
                    nextPage: true
                })
            }



            // if (splitedArray.length > currentSendedPage && splitedArray.length-1 !== currentSendedPage) {
            //     res.send({
            //         splitedArray: splitedArray[currentSendedPage],
            //         nextPage: true
            //     })
            // } else if (splitedArray.length-1 === currentSendedPage) {
            //     res.send({
            //         splitedArray: splitedArray[currentSendedPage],
            //         nextPage: false
            //     })
            // }


            // res.send(splitedArray[currentSendedPage]);
        } else if (filteredItems.length === 0) {
            res.status(204).send("Sorry, we couldn’t find any matching results for this search.")
        }
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

module.exports = {
    handleUserSearch: handleUserSearch,
}