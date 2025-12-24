import nodemailer from 'nodemailer';

/**
 * Create email transporter
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // Use TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

/**
 * Send magic link email for authentication
 */
export const sendMagicLink = async (email, token, userName) => {
    try {
        const transporter = createTransporter();
        const loginUrl = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: '🎅 Secret Santa - Login Link',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #c31432 0%, #240b36 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .button { display: inline-block; padding: 15px 30px; background: #c31432; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎅 Secret Santa 2025</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Click the button below to log in to your Secret Santa account:</p>
              <center>
                <a href="${loginUrl}" class="button">Login to Secret Santa</a>
              </center>
              <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>Secret Santa Office Celebration 2025</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Magic link sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending magic link:', error);
        throw error;
    }
};

/**
 * Send pairing notification email
 */
export const sendPairingNotification = async (giverEmail, giverName, receiverName) => {
    try {
        const transporter = createTransporter();
        const appUrl = process.env.FRONTEND_URL;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: giverEmail,
            subject: `🎁 Your Secret Santa Assignment is Ready!`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #165e3d 0%, #0f3a23 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .assignment-box { background: #f0f8ff; border-left: 4px solid #165e3d; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .button { display: inline-block; padding: 15px 30px; background: #165e3d; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎅 Secret Santa Assignment</h1>
            </div>
            <div class="content">
              <h2>Hello ${giverName}!</h2>
              <p>The Secret Santa pairings have been generated! 🎉</p>
              <div class="assignment-box">
                <h3 style="margin-top: 0; color: #165e3d;">Your Secret Santa Assignment:</h3>
                <p style="font-size: 18px; font-weight: bold; color: #333;">${receiverName}</p>
              </div>
              <p>Now it's time to prepare a thoughtful gift for ${receiverName}! 🎁</p>
              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Log in to the Secret Santa portal</li>
                <li>Upload a photo of your gift</li>
                <li>Add a personal message</li>
                <li>Wait for the big reveal day!</li>
              </ol>
              <center>
                <a href="${appUrl}" class="button">Go to Secret Santa Portal</a>
              </center>
              <p style="color: #c31432; font-weight: bold;">⚠️ Remember: This is a secret! Don't tell anyone who you got! 🤫</p>
            </div>
            <div class="footer">
              <p>Secret Santa Office Celebration 2025</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Pairing notification sent to ${giverEmail}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending pairing notification:', error);
        throw error;
    }
};

/**
 * Send reveal reminder email
 */
export const sendRevealReminder = async (email, userName) => {
    try {
        const transporter = createTransporter();
        const appUrl = process.env.FRONTEND_URL;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: '🎉 Secret Santa Reveal Day is Here!',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #333; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #c31432 0%, #FFD700 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 It's Reveal Day! 🎉</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p style="font-size: 18px;">The moment you've been waiting for is here! 🎊</p>
              <p>It's time to discover who your Secret Santa is and see the amazing gift they prepared for you!</p>
              <center>
                <a href="${appUrl}/reveal" class="button">🎁 REVEAL MY SECRET SANTA 🎁</a>
              </center>
              <p style="text-align: center; color: #666; margin-top: 30px;">Get ready for confetti and surprises! 🎉✨</p>
            </div>
            <div class="footer">
              <p>Secret Santa Office Celebration 2025</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Reveal reminder sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending reveal reminder:', error);
        throw error;
    }
};
