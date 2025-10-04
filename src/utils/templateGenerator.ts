import { EMAIL_ASSETS } from "../config/emailAssets";

/**
 * Generate the app update notification template with proper asset URLs
 */
export const generateAppUpdateTemplate = (): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FreeSpeek App Update</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #000;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .header {
            background: linear-gradient(135deg, #000 0%, #02FEFE 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            position: relative;
        }
            .logo {
                width: 80px;
                height: 80px;
                margin: 0 auto 20px;
                background: url('${EMAIL_ASSETS.LOGO}') no-repeat center;
                background-size: contain;
                border-radius: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .main-text {
            font-size: 16px;
            color: #555;
            margin-bottom: 25px;
        }
        .highlight {
            background: linear-gradient(135deg, #02FEFE 0%, #00E6E6 100%);
            color: #000;
            padding: 20px;
            border-radius: 12px;
            margin: 25px 0;
            border-left: 4px solid #02FEFE;
            font-weight: 600;
        }
        .feature-box {
            background-color: #f8f9fa;
            border-left: 4px solid #333;
            padding: 25px;
            margin: 25px 0;
            border-radius: 0 12px 12px 0;
        }
        .feature-box h3 {
            color: #333;
            margin-top: 0;
            font-size: 20px;
            font-weight: bold;
        }
        .feature-list {
            list-style: none;
            padding: 0;
        }
        .feature-list li {
            padding: 8px 0;
            position: relative;
            padding-left: 25px;
        }
        .feature-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #02FEFE;
            font-weight: bold;
            font-size: 16px;
        }
        .update-section {
            margin: 30px 0;
        }
        .update-section h3 {
            color: #333;
            font-size: 20px;
            margin-bottom: 15px;
            font-weight: bold;
        }
        .platform-section {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .platform-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .steps {
            list-style: none;
            padding: 0;
        }
        .steps li {
            padding: 5px 0;
            position: relative;
            padding-left: 20px;
        }
        .steps li:before {
            content: counter(step-counter);
            counter-increment: step-counter;
            position: absolute;
            left: 0;
            background-color: #02FEFE;
            color: #000;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
        }
        .ios-steps, .android-steps {
            counter-reset: step-counter;
        }
        .cta-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px 0;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            border-radius: 12px;
        }
        .cta-buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 40px;
            margin: 30px 0;
            flex-wrap: nowrap;
        }
        .cta-button {
            display: inline-block;
            padding: 0;
            text-decoration: none;
            border-radius: 8px;
            transition: transform 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            flex: 0 0 auto;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .store-button {
            height: 60px;
            width: 180px;
            border-radius: 8px;
            display: block;
            object-fit: contain;
        }
        .footer {
            background: linear-gradient(135deg, #000 0%, #02FEFE 100%);
            color: #fff;
            padding: 30px 20px;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
            font-size: 14px;
        }
        .footer .team-signature {
            color: #02FEFE;
            font-weight: bold;
        }
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            .content {
                padding: 30px 20px;
            }
            .cta-buttons {
                flex-direction: column;
                align-items: center;
                gap: 25px;
                padding: 0 20px;
            }
            .cta-button {
                margin: 10px 0;
                width: 100%;
                max-width: 250px;
                text-align: center;
            }
            .store-button {
                width: 100%;
                max-width: 250px;
                height: auto;
                min-height: 50px;
            }
            .logo {
                width: 70px;
                height: 70px;
            }
            /* Mobile responsive table layout */
            .cta-section table {
                width: 100% !important;
            }
            .cta-section table tr {
                display: block !important;
                width: 100% !important;
            }
            .cta-section table td {
                display: block !important;
                width: 100% !important;
                padding: 15px 0 !important;
                text-align: center !important;
            }
            .cta-section table td img {
                width: 100% !important;
                max-width: 250px !important;
                height: auto !important;
                min-height: 50px !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo"></div>
            <h1>FreeSpeek Update Available!</h1>
            <p>New Features & Improvements in Version 1.1.6</p>
        </div>
        <div class="content">
            <div class="greeting">Hello {{userName}},</div>
            <div class="main-text">
                We're excited to announce that a <strong>new version of FreeSpeek (1.1.6)</strong> is now available with amazing new features and important security improvements!
            </div>
            <div class="highlight">
                <strong>⚠️ Important:</strong> Your current app version is outdated. To continue enjoying the best FreeSpeek experience and ensure your data security, please update to the latest version.
            </div>
            <div class="feature-box">
                <h3>What's New in Version 1.1.6:</h3>
                <ul class="feature-list">
                    <li><strong>Enhanced Security:</strong> Improved authentication and data protection</li>
                    <li><strong>Better Performance:</strong> Faster loading times and smoother experience</li>
                    <li><strong>New UI Features:</strong> Updated interface with better navigation</li>
                    <li><strong>Bug Fixes:</strong> Resolved issues reported by our community</li>
                    <li><strong>Persistent Sessions:</strong> Stay logged in seamlessly</li>
                </ul>
            </div>
            <div class="update-section">
                <h3>📱 How to Update:</h3>
                <div class="platform-section">
                    <div class="platform-title">For iOS Users:</div>
                    <ol class="steps ios-steps">
                        <li>Open the <strong>App Store</strong> on your iPhone/iPad</li>
                        <li>Search for <strong>"FreeSpeek"</strong></li>
                        <li>Tap <strong>"Update"</strong> next to the FreeSpeek app</li>
                    </ol>
                </div>
                <div class="platform-section">
                    <div class="platform-title">For Android Users:</div>
                    <ol class="steps android-steps">
                        <li>Open the <strong>Google Play Store</strong> on your device</li>
                        <li>Search for <strong>"FreeSpeek"</strong></li>
                        <li>Tap <strong>"Update"</strong> next to the FreeSpeek app</li>
                    </ol>
                </div>
            </div>
            <div class="cta-section">
                <h3 style="margin-top: 0; margin-bottom: 20px; color: #333; font-size: 24px;">Download Now</h3>
                <!-- Email client compatible table layout -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                        <td align="center" style="padding: 0 25px;">
                            <a href="https://apps.apple.com/pk/app/freespeek-app/id6741692095" class="cta-button" style="display: inline-block;">
                                <img src="${EMAIL_ASSETS.APP_STORE_BUTTON}" alt="Download on App Store" class="store-button" style="display: block; width: 180px; height: 60px; border-radius: 8px;">
                            </a>
                        </td>
                        <td align="center" style="padding: 0 25px;">
                            <a href="https://play.google.com/store/apps/details?id=com.freespeek_app" class="cta-button" style="display: inline-block;">
                                <img src="${EMAIL_ASSETS.GOOGLE_PLAY_BUTTON}" alt="Get it on Google Play" class="store-button" style="display: block; width: 180px; height: 60px; border-radius: 8px;">
                            </a>
                        </td>
                    </tr>
                </table>
                <!-- Fallback div layout for modern email clients -->
                <div class="cta-buttons" style="display: none;">
                        <a href="https://apps.apple.com/pk/app/freespeek-app/id6741692095" class="cta-button">
                            <img src="${EMAIL_ASSETS.APP_STORE_BUTTON}" alt="Download on App Store" class="store-button">
                        </a>
                    <a href="https://play.google.com/store/apps/details?id=com.freespeek_app" class="cta-button">
                        <img src="${EMAIL_ASSETS.GOOGLE_PLAY_BUTTON}" alt="Get it on Google Play" class="store-button">
                    </a>
                </div>
            </div>
            <p style="text-align: center; font-size: 16px; color: #555; margin-top: 30px;">
                Thank you for being a valued member of the FreeSpeek community!
            </p>
            <p style="text-align: center; font-size: 16px; color: #555;">
                Best regards,<br><span class="team-signature">The FreeSpeek Team</span>
            </p>
        </div>
        <div class="footer">
            <p>© 2025 FreeSpeek. All rights reserved.</p>
            <p>Stay connected, stay safe, stay FreeSpeek!</p>
        </div>
    </div>
</body>
</html>`;
};
