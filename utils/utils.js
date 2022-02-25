const convertCollectionsSnapshotToMap = (collections) => {
    const transformedCollection = collections.docs.map((doc) => {
        const { title, items, imageUrl } = doc.data()
        return ({
            key: doc.id,
            routeName: encodeURI(title.toLowerCase()),
            title,
            imageUrl,
            items: items.map((item, index) => {
                const {id, name, imageUrl, price } = item
                return ({
                    key: id,
                    collectionId: doc.id,
                    name,
                    imageUrl,
                    price,
                })
            })
        })
    })
    return transformedCollection
};

const convertOrdersSnapshotToMap = (orders) => {
    const transformedOrders = orders.docs.map((doc) => {
        const { amount, detail, email, id, orderCreatedTime, state } = doc.data()
        return ({
            key: id,
            amount: (amount/100).toFixed(2),
            email: email,
            orderCreatedTime: orderCreatedTime,
            state: state,
            detail: {
                name: detail.name,
                paymentMethodTypes: detail.paymentMethodTypes,
                shipping: detail.shipping,
                orderItems: detail.orderItems.map((item) => {
                    const { id, imageUrl, name, price, quantity } = item
                    return {
                        key: id,
                        imageUrl,
                        name,
                        price,
                        quantity,
                    }
                })
            },
        })
    })
    return transformedOrders
};

const convertSlidersIdToKey = (sliders) => {
    const transformedSliders = sliders.map((slider) => {
        const {id, title, imageUrl } = slider
        return ({
            key: id,
            title,
            imageUrl
        })
    })
    return transformedSliders
};

const convertActivitySnapshotToMap = (activity) => {
    const transformedActivity = activity.docs.map((doc) => {
        const { title } = doc.data()
        return ({
            key: doc.id,
            title: title,
        })
    })
    return transformedActivity
};


// var perChunk = 2 // items per chunk    

// var inputArray = ['a','b','c','d','e']

const splitArrayIntoChunks = (inputArray, perChunk) => {

    var result = inputArray.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index/perChunk)

        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])

    return result;
}

module.exports = {
    convertCollectionsSnapshotToMap: convertCollectionsSnapshotToMap,
    convertOrdersSnapshotToMap: convertOrdersSnapshotToMap,
    convertSlidersIdToKey: convertSlidersIdToKey,
    convertActivitySnapshotToMap: convertActivitySnapshotToMap,
    splitArrayIntoChunks: splitArrayIntoChunks,
}