const { getAuth } = require('firebase-admin/auth');

const handleGetAllUsers = (req, res) => {
    getAuth()
        .listUsers()
        .then((listUsersResult) => {
            res.send(listUsersResult)
        })
        .catch((error) => {
            res.status(400).send('Error listing users:')
            console.log('Error listing users:', error);
        });

    // const listAllUsers = (nextPageToken) => {
    //     // List batch of users, 1000 at a time.
    //     getAuth()
    //         .listUsers(3, nextPageToken)
    //         .then((listUsersResult) => {
    //             if (listUsersResult.pageToken) {
    //                 // List next batch of users.
    //                 listAllUsers(listUsersResult.pageToken);
    //                 res.send(listUsersResult)
    //             }
    //             console.log(listUsersResult);
    //         })
    //         .catch((error) => {
    //             res.status(400).send('Error listing users:')
    //             console.log('Error listing users:', error);
    //         });
    // };
    //     // Start listing users from the beginning, 1000 at a time.
    // listAllUsers();
}

const handleDeleteUser = (req, res, db) => {
    const { uid } = req.body;
    const userCollectionsRef = db.collection('users').doc(uid);
    getAuth()
        .deleteUser(uid)
        .then( async () => {
            try {
                await userCollectionsRef.delete()
                res.send("Successfully deleted user");
                console.log('Successfully deleted user');
            } catch (error) {
                console.log(error);
                res.send(error)
            }
        })
        .catch((error) => {
            console.log('Error deleting user:', error);
        }); 
}

module.exports = {
    handleGetAllUsers: handleGetAllUsers,
    handleDeleteUser: handleDeleteUser,
}