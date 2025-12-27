export const defaultEmailTemplates = {
  'flash-sale': {
    name: 'Flash Sale Template',
    type: 'flash-sale',
    subject: '⚡ FLASH SALE: {{saleTitle}} - {{discount}} OFF!',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flash Sale Alert</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .product-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; }
        .product-image { width: 100%; height: 150px; object-fit: cover; border-radius: 4px; }
        .price { font-size: 18px; font-weight: bold; color: #e74c3c; }
        .original-price { text-decoration: line-through; color: #7f8c8d; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .unique-id { font-size: 10px; color: #95a5a6; text-align: center; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚡ FLASH SALE ⚡</h1>
            <h2>{{saleTitle}}</h2>
            <p style="font-size: 24px; margin: 10px 0;">{{discount}} OFF</p>
            <p>Limited Time Offer - Don't Miss Out!</p>
        </div>
        
        <div class="content">
            <h3>🎯 {{saleDescription}}</h3>
            <p><strong>⏰ Sale Ends:</strong> {{endTime}}</p>
            <p style="color: #e74c3c; font-weight: bold;">Hurry! This offer won't last long!</p>
            
            <div class="product-grid">
                {{#each products}}
                <div class="product-card">
                    <img src="{{image}}" alt="{{name}}" class="product-image">
                    <h4>{{name}}</h4>
                    <p class="price">Rs.{{salePrice}}/_</p>
                    <p class="original-price">Rs.{{originalPrice}}/_</p>
                </div>
                {{/each}}
            </div>
            
            <div style="text-align: center;">
                <a href="{{shopUrl}}" class="cta-button">SHOP NOW - {{discount}} OFF</a>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <p>Follow us for more amazing deals:</p>
                <p><a href="{{facebookUrl}}" style="color: #3b5998;">Facebook</a> | 
                   <a href="{{instagramUrl}}" style="color: #e4405f;">Instagram</a> | 
                   <a href="{{twitterUrl}}" style="color: #1da1f2;">Twitter</a></p>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 Your Store Name. All rights reserved.</p>
            <p>This email was sent to {{subscriberName}} because you subscribed to our flash sale notifications.</p>
            <p><a href="{{unsubscribeLink}}" style="color: #3498db;">Unsubscribe</a> | 
               <a href="{{preferencesLink}}" style="color: #3498db;">Update Preferences</a></p>
            <div class="unique-id">Campaign ID: {{campaignId}} | Sent: {{timestamp}}</div>
        </div>
    </div>
</body>
</html>`,
    textContent: `⚡ FLASH SALE ⚡

{{saleTitle}}
{{saleDescription}}

{{discount}} OFF
Limited Time Offer - Don't Miss Out!

⏰ Sale Ends: {{endTime}}
Hurry! This offer won't last long!

{{#each products}}
{{name}}
Rs.{{salePrice}}/_ (was Rs.{{originalPrice}}/_)
{{/each}}

SHOP NOW - {{discount}} OFF
{{shopUrl}}

Follow us for more amazing deals:
Facebook: {{facebookUrl}}
Instagram: {{instagramUrl}}
Twitter: {{twitterUrl}}

© 2024 Your Store Name. All rights reserved.
This email was sent to {{subscriberName}} because you subscribed to our flash sale notifications.

Unsubscribe: {{unsubscribeLink}}
Update Preferences: {{preferencesLink}}

Campaign ID: {{campaignId}}
Sent: {{timestamp}}`,
    variables: [
      'saleTitle',
      'saleDescription', 
      'discount',
      'endTime',
      'products',
      'subscriberName',
      'unsubscribeLink',
      'preferencesLink',
      'shopUrl',
      'facebookUrl',
      'instagramUrl',
      'twitterUrl',
      'campaignId',
      'timestamp'
    ]
  },
  'deal': {
    name: 'Deal Template',
    type: 'deal',
    subject: '🎉 SPECIAL DEAL: {{dealTitle}} - {{discount}} OFF!',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Special Deal Alert</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .product-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; }
        .product-image { width: 100%; height: 150px; object-fit: cover; border-radius: 4px; }
        .price { font-size: 18px; font-weight: bold; color: #e74c3c; }
        .original-price { text-decoration: line-through; color: #7f8c8d; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .unique-id { font-size: 10px; color: #95a5a6; text-align: center; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 SPECIAL DEAL 🎉</h1>
            <h2>{{dealTitle}}</h2>
            <p style="font-size: 24px; margin: 10px 0;">{{discount}} OFF</p>
            <p>Amazing deals on martial arts gear!</p>
        </div>
        
        <div class="content">
            <h3>🎯 {{dealDescription}}</h3>
            <p><strong>⏰ Valid Until:</strong> {{validUntil}}</p>
            <p style="color: #e74c3c; font-weight: bold;">Don't miss these incredible savings!</p>
            
            <div class="product-grid">
                {{#each products}}
                <div class="product-card">
                    <img src="{{image}}" alt="{{name}}" class="product-image">
                    <h4>{{name}}</h4>
                    <p class="price">Rs.{{salePrice}}/_</p>
                    <p class="original-price">Rs.{{originalPrice}}/_</p>
                </div>
                {{/each}}
            </div>
            
            <div style="text-align: center;">
                <a href="{{shopUrl}}" class="cta-button">SHOP NOW - {{discount}} OFF</a>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <p>Follow us for more amazing deals:</p>
                <p><a href="{{facebookUrl}}" style="color: #3b5998;">Facebook</a> | 
                   <a href="{{instagramUrl}}" style="color: #e4405f;">Instagram</a> | 
                   <a href="{{twitterUrl}}" style="color: #1da1f2;">Twitter</a></p>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 Your Store Name. All rights reserved.</p>
            <p>This email was sent to {{subscriberName}} because you subscribed to our deal notifications.</p>
            <p><a href="{{unsubscribeLink}}" style="color: #3498db;">Unsubscribe</a> | 
               <a href="{{preferencesLink}}" style="color: #3498db;">Update Preferences</a></p>
            <div class="unique-id">Campaign ID: {{campaignId}} | Sent: {{timestamp}}</div>
        </div>
    </div>
</body>
</html>`,
    textContent: `🎉 SPECIAL DEAL 🎉

{{dealTitle}}
{{dealDescription}}

{{discount}} OFF
Amazing deals on martial arts gear!

⏰ Valid Until: {{validUntil}}
Don't miss these incredible savings!

{{#each products}}
{{name}}
Rs.{{salePrice}}/_ (was Rs.{{originalPrice}}/_)
{{/each}}

SHOP NOW - {{discount}} OFF
{{shopUrl}}

Follow us for more amazing deals:
Facebook: {{facebookUrl}}
Instagram: {{instagramUrl}}
Twitter: {{twitterUrl}}

© 2024 Your Store Name. All rights reserved.
This email was sent to {{subscriberName}} because you subscribed to our deal notifications.

Unsubscribe: {{unsubscribeLink}}
Update Preferences: {{preferencesLink}}

Campaign ID: {{campaignId}}
Sent: {{timestamp}}`,
    variables: [
      'dealTitle',
      'dealDescription',
      'discount', 
      'validUntil',
      'products',
      'subscriberName',
      'unsubscribeLink',
      'preferencesLink',
      'shopUrl',
      'facebookUrl',
      'instagramUrl',
      'twitterUrl',
      'campaignId',
      'timestamp'
    ]
  },
  'welcome': {
    name: 'Welcome Email Template',
    type: 'welcome',
    subject: '🎉 Welcome to {{storeName}} - Your First Email!',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{storeName}}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .welcome-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .unique-id { font-size: 10px; color: #95a5a6; text-align: center; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to {{storeName}}!</h1>
            <p>Thank you for subscribing to our newsletter</p>
        </div>
        
        <div class="content">
            <div class="welcome-section">
                <h2>Hello {{subscriberName}}!</h2>
                <p>Welcome to {{storeName}}! We're excited to have you as part of our community.</p>
                <p>You'll be the first to know about:</p>
                <ul>
                    <li>🔥 Flash Sales and Limited Time Offers</li>
                    <li>🎉 Special Deals and Discounts</li>
                    <li>🆕 New Product Launches</li>
                    <li>📧 Exclusive Newsletter Content</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="{{shopUrl}}" class="cta-button">Start Shopping Now</a>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <p>Follow us for more amazing content:</p>
                <p><a href="{{facebookUrl}}" style="color: #3b5998;">Facebook</a> | 
                   <a href="{{instagramUrl}}" style="color: #e4405f;">Instagram</a> | 
                   <a href="{{twitterUrl}}" style="color: #1da1f2;">Twitter</a></p>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 {{storeName}}. All rights reserved.</p>
            <p>This email was sent to {{subscriberName}} as a welcome message.</p>
            <p><a href="{{unsubscribeLink}}" style="color: #3498db;">Unsubscribe</a> | 
               <a href="{{preferencesLink}}" style="color: #3498db;">Update Preferences</a></p>
            <div class="unique-id">Campaign ID: {{campaignId}} | Sent: {{timestamp}}</div>
        </div>
    </div>
</body>
</html>`,
    textContent: `🎉 Welcome to {{storeName}}!

Hello {{subscriberName}}!

Welcome to {{storeName}}! We're excited to have you as part of our community.

You'll be the first to know about:
🔥 Flash Sales and Limited Time Offers
🎉 Special Deals and Discounts
🆕 New Product Launches
📧 Exclusive Newsletter Content

Start Shopping Now: {{shopUrl}}

Follow us for more amazing content:
Facebook: {{facebookUrl}}
Instagram: {{instagramUrl}}
Twitter: {{twitterUrl}}

© 2024 {{storeName}}. All rights reserved.
This email was sent to {{subscriberName}} as a welcome message.

Unsubscribe: {{unsubscribeLink}}
Update Preferences: {{preferencesLink}}

Campaign ID: {{campaignId}}
Sent: {{timestamp}}`,
    variables: [
      'storeName',
      'subscriberName',
      'unsubscribeLink',
      'preferencesLink',
      'shopUrl',
      'facebookUrl',
      'instagramUrl',
      'twitterUrl',
      'campaignId',
      'timestamp'
    ]
  }
}; 