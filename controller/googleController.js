const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
    new GoogleStrategy(
      {
        clientID: '158498331528-dsu4tppi2vp95h0fmihmp668cueu63rc.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: '/auth/google/callback'
      },
      profile => {
        console.log(profile);
      }
    )
  );
  