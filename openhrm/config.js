module.exports = {
    port: 3001,
    db: 'mongodb://localhost:27017/OpenHRM',
    session: process.env.SESSION_SECRET || 'Your Session Secret goes here',

    user: {
        default: 'user',
        role: ['admin', 'user', 'recruiter']
    },
    token: 'aSMQ7ucA0DwbAOgm399',

    mailer: {
        options: {
            from: '',
            subject: '',
        },
        smtpUrl: '',
    },
};
