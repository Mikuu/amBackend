db.createUser({
    user: "amb-user",
    pwd: "amb-password",
    roles: [
        {
            role: "readWrite",
            db: "ambackendb",
        },
    ],
});