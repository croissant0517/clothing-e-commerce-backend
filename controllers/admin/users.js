const { getAuth } = require('firebase-admin/auth');

const handleGetAllUsers = (req, res) => {
    getAuth()
        .listUsers()
        .then((listUsersResult) => {
            res.send(listUsersResult.users)
        })
        .catch((error) => {
            res.status(400).send('Error listing users:')
            console.log('Error listing users:', error);
        });
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