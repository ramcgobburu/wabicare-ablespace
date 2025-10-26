import { config } from './config'
import { DocumentUploadLink } from '@/types/document-upload'

// Email template for document upload links
export function generateDocumentUploadEmailTemplate(link: DocumentUploadLink) {
  const { companyName, supportEmail, supportPhone } = config.app
  const uploadUrl = `${config.app.baseUrl}/document-upload/${link.uniqueToken}`
  
  return {
    subject: `Document Upload Required - ${link.studentName} | ${companyName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document Upload Required</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { padding: 20px 0; }
          .button { 
            display: inline-block; 
            background: #007bff; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            margin-top: 20px; 
            font-size: 14px; 
            color: #666;
          }
          .info-box { 
            background: #e7f3ff; 
            border: 1px solid #b3d9ff; 
            padding: 15px; 
            border-radius: 6px; 
            margin: 15px 0;
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 15px; 
            border-radius: 6px; 
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Document Upload Required</h1>
            <p>Hello ${link.parentName},</p>
            <p>Thank you for choosing ${companyName} for your child's behavioral health services. We need you to upload some important documents before we can proceed with ${link.studentName}'s assessment.</p>
          </div>
          
          <div class="content">
            <h2>Student Information</h2>
            <ul>
              <li><strong>Student Name:</strong> ${link.studentName}</li>
              <li><strong>Parent/Guardian:</strong> ${link.parentName}</li>
              <li><strong>Email:</strong> ${link.parentEmail}</li>
              <li><strong>Phone:</strong> ${link.parentPhone}</li>
            </ul>
            
            <div class="info-box">
              <h3>📋 Required Documents</h3>
              <p>Please upload the following documents:</p>
              <ul>
                <li>Medical records and history</li>
                <li>Insurance card (front and back)</li>
                <li>Photo ID (parent/guardian)</li>
                <li>Previous assessment reports (if any)</li>
                <li>Any other relevant documentation</li>
              </ul>
            </div>
            
            <div class="warning">
              <h3>⚠️ Important Information</h3>
              <ul>
                <li>This link will expire in <strong>7 days</strong></li>
                <li>Supported file formats: PDF, JPG, PNG, DOC, DOCX</li>
                <li>Maximum file size: 10MB per file</li>
                <li>You can upload multiple files at once</li>
                <li>All documents are securely encrypted and stored</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${uploadUrl}" class="button">Upload Documents Now</a>
            </div>
            
            <p><strong>Direct Link:</strong> <a href="${uploadUrl}">${uploadUrl}</a></p>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact us:</p>
            <ul>
              <li>Email: ${supportEmail}</li>
              <li>Phone: ${supportPhone}</li>
            </ul>
          </div>
          
          <div class="footer">
            <p><strong>${companyName}</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If you did not request this service, please contact us immediately.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Document Upload Required - ${link.studentName} | ${companyName}

Hello ${link.parentName},

Thank you for choosing ${companyName} for your child's behavioral health services. We need you to upload some important documents before we can proceed with ${link.studentName}'s assessment.

Student Information:
- Student Name: ${link.studentName}
- Parent/Guardian: ${link.parentName}
- Email: ${link.parentEmail}
- Phone: ${link.parentPhone}

Required Documents:
- Medical records and history
- Insurance card (front and back)
- Photo ID (parent/guardian)
- Previous assessment reports (if any)
- Any other relevant documentation

Important Information:
- This link will expire in 7 days
- Supported file formats: PDF, JPG, PNG, DOC, DOCX
- Maximum file size: 10MB per file
- You can upload multiple files at once
- All documents are securely encrypted and stored

Upload Link: ${uploadUrl}

If you have any questions or need assistance, please contact us:
- Email: ${supportEmail}
- Phone: ${supportPhone}

${companyName}
This is an automated message. Please do not reply to this email.
    `
  }
}

// Real email service integration (to be implemented)
export async function sendDocumentUploadEmail(link: DocumentUploadLink): Promise<boolean> {
  try {
    const emailTemplate = generateDocumentUploadEmailTemplate(link)
    
    // TODO: Replace with actual email service integration
    // This is where you'll integrate with SendGrid, AWS SES, Mailgun, etc.
    
    if (config.email.service.provider === 'sendgrid') {
      return await sendWithSendGrid(link, emailTemplate)
    } else if (config.email.service.provider === 'ses') {
      return await sendWithSES(link, emailTemplate)
    } else if (config.email.service.provider === 'mailgun') {
      return await sendWithMailgun(link, emailTemplate)
    } else {
      // Fallback to console logging for development
      console.log('📧 EMAIL WOULD BE SENT:')
      console.log('From:', config.email.from)
      console.log('To:', link.parentEmail)
      console.log('Subject:', emailTemplate.subject)
      console.log('Upload URL:', `${config.app.baseUrl}/document-upload/${link.uniqueToken}`)
      return true
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

// SendGrid integration (to be implemented)
async function sendWithSendGrid(link: DocumentUploadLink, template: any): Promise<boolean> {
  // TODO: Implement SendGrid integration
  // const sgMail = require('@sendgrid/mail')
  // sgMail.setApiKey(config.email.service.apiKey)
  // 
  // const msg = {
  //   to: link.parentEmail,
  //   from: config.email.from,
  //   subject: template.subject,
  //   text: template.text,
  //   html: template.html,
  // }
  // 
  // await sgMail.send(msg)
  // return true
  
  console.log('📧 SendGrid integration not yet implemented')
  return false
}

// AWS SES integration (to be implemented)
async function sendWithSES(link: DocumentUploadLink, template: any): Promise<boolean> {
  // TODO: Implement AWS SES integration
  // const AWS = require('aws-sdk')
  // const ses = new AWS.SES({
  //   region: config.email.service.region,
  //   accessKeyId: config.email.service.apiKey,
  //   secretAccessKey: config.email.service.secretKey
  // })
  // 
  // const params = {
  //   Destination: { ToAddresses: [link.parentEmail] },
  //   Message: {
  //     Body: {
  //       Html: { Data: template.html },
  //       Text: { Data: template.text }
  //     },
  //     Subject: { Data: template.subject }
  //   },
  //   Source: config.email.from
  // }
  // 
  // await ses.sendEmail(params).promise()
  // return true
  
  console.log('📧 AWS SES integration not yet implemented')
  return false
}

// Mailgun integration (to be implemented)
async function sendWithMailgun(link: DocumentUploadLink, template: any): Promise<boolean> {
  // TODO: Implement Mailgun integration
  // const formData = require('form-data')
  // const Mailgun = require('mailgun.js')
  // 
  // const mailgun = new Mailgun(formData)
  // const mg = mailgun.client({
  //   username: 'api',
  //   key: config.email.service.apiKey,
  // })
  // 
  // const msg = {
  //   from: config.email.from,
  //   to: [link.parentEmail],
  //   subject: template.subject,
  //   text: template.text,
  //   html: template.html,
  // }
  // 
  // await mg.messages.create(config.email.service.domain, msg)
  // return true
  
  console.log('📧 Mailgun integration not yet implemented')
  return false
}
