export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: env('BREVO_SMTP_USER'),
          pass: env('BREVO_SMTP_PASS'),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_DEFAULT_FROM', 'tommy.damonte@gmail.com'),
        defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', 'tommy.damonte@gmail.com'),
      },
    },
  },
});