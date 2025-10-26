// Configuration for email and cloud storage services
export const config = {
  // Email Configuration
  email: {
    from: process.env.COMPANY_EMAIL || 'noreply@wabicare.com',
    fromName: process.env.COMPANY_NAME || 'WabiCare',
    replyTo: process.env.REPLY_TO_EMAIL || 'support@wabicare.com',
    // Email service configuration (to be set up later)
    service: {
      provider: process.env.EMAIL_PROVIDER || 'sendgrid', // 'sendgrid', 'ses', 'mailgun', etc.
      apiKey: process.env.EMAIL_API_KEY || '',
      region: process.env.EMAIL_REGION || 'us-east-1',
    }
  },
  
  // Cloud Storage Configuration
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'aws-s3', // 'aws-s3', 'google-cloud', 'azure', etc.
    bucket: process.env.STORAGE_BUCKET || 'wabicare-documents',
    region: process.env.STORAGE_REGION || 'us-east-1',
    accessKeyId: process.env.STORAGE_ACCESS_KEY || '',
    secretAccessKey: process.env.STORAGE_SECRET_KEY || '',
    // CDN URL for public access
    cdnUrl: process.env.STORAGE_CDN_URL || 'https://d1234567890.cloudfront.net',
  },
  
  // Application Settings
  app: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001',
    companyName: process.env.COMPANY_NAME || 'WabiCare',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@wabicare.com',
    supportPhone: process.env.SUPPORT_PHONE || '+1 (555) 123-4567',
  }
}
