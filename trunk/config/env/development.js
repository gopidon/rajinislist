module.exports = {
    // This is your MYSQL Database configuration
    db: {
        name: "t2spare",
        password: "",
        username: "root"
    },
    app: {
        name: "Tickets2Spare"
    },
    // You will need to get your own client id's before this will work properly
    facebook: {
        clientID: "365354833606797",
        clientSecret: "c1197e75f822c4e68cff8dacc372db58",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
        clientID: "6TbZwsyTfVtoKeszrxTLpAdOF",
        clientSecret: "iQksN3GYZicK4uYgrUAkIcIYpFu5cShMqdx20N7A4Fgu80fC9U",
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    google: {
        realm: "http://localhost:3000/",
        callbackURL: "http://localhost:3000/auth/google/callback"
    }
};
