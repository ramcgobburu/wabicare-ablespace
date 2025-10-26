# Cloud Services Setup Guide

This guide will help you set up email and cloud storage services for the document upload system.

## Email Service Setup

### Option 1: SendGrid (Recommended)

1. **Sign up for SendGrid account**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Create a free account (100 emails/day)

2. **Get API Key**
   - Go to Settings > API Keys
   - Create a new API key with "Full Access" permissions
   - Copy the API key

3. **Set Environment Variables**
   ```bash
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   COMPANY_EMAIL=noreply@yourdomain.com
   COMPANY_NAME=Your Company Name
   ```

### Option 2: AWS SES

1. **Set up AWS SES**
   - Go to AWS Console > SES
   - Verify your domain or email address
   - Request production access if needed

2. **Create IAM User**
   - Create user with SES permissions
   - Generate access keys

3. **Set Environment Variables**
   ```bash
   EMAIL_PROVIDER=ses
   AWS_ACCESS_KEY_ID=your_aws_access_key_here
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
   AWS_REGION=us-east-1
   ```

### Option 3: Mailgun

1. **Sign up for Mailgun**
   - Go to [mailgun.com](https://mailgun.com)
   - Create account and verify domain

2. **Get API Key**
   - Go to Settings > API Keys
   - Copy your private API key

3. **Set Environment Variables**
   ```bash
   EMAIL_PROVIDER=mailgun
   MAILGUN_API_KEY=your_mailgun_api_key_here
   MAILGUN_DOMAIN=your_domain_here
   ```

## Cloud Storage Setup

### Option 1: AWS S3 (Recommended)

1. **Create S3 Bucket**
   - Go to AWS Console > S3
   - Create bucket with unique name
   - Enable versioning and encryption

2. **Set Bucket Permissions**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowDocumentUploads",
         "Effect": "Allow",
         "Principal": {
           "AWS": "arn:aws:iam::YOUR_ACCOUNT:user/YOUR_USER"
         },
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

3. **Set Environment Variables**
   ```bash
   STORAGE_PROVIDER=aws-s3
   STORAGE_BUCKET=your-bucket-name
   STORAGE_REGION=us-east-1
   STORAGE_ACCESS_KEY=your_s3_access_key_here
   STORAGE_SECRET_KEY=your_s3_secret_key_here
   ```

### Option 2: Google Cloud Storage

1. **Create GCP Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project

2. **Enable Cloud Storage API**
   - Go to APIs & Services > Library
   - Enable Cloud Storage API

3. **Create Service Account**
   - Go to IAM & Admin > Service Accounts
   - Create service account with Storage Admin role
   - Download JSON key file

4. **Set Environment Variables**
   ```bash
   STORAGE_PROVIDER=google-cloud
   GOOGLE_CLOUD_PROJECT_ID=your_project_id_here
   GOOGLE_CLOUD_KEY_FILE=path/to/service-account-key.json
   GOOGLE_CLOUD_BUCKET=your-bucket-name
   ```

### Option 3: Azure Blob Storage

1. **Create Storage Account**
   - Go to Azure Portal > Storage Accounts
   - Create new storage account

2. **Get Connection String**
   - Go to Access Keys
   - Copy connection string

3. **Set Environment Variables**
   ```bash
   STORAGE_PROVIDER=azure
   AZURE_STORAGE_CONNECTION_STRING=your_connection_string_here
   AZURE_STORAGE_CONTAINER=documents
   ```

## Environment Variables File

Create a `.env.local` file in your project root:

```bash
# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3001
COMPANY_NAME=WabiCare
COMPANY_EMAIL=noreply@wabicare.com
REPLY_TO_EMAIL=support@wabicare.com
SUPPORT_EMAIL=support@wabicare.com
SUPPORT_PHONE=+1 (555) 123-4567

# Email Service (choose one)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Cloud Storage (choose one)
STORAGE_PROVIDER=aws-s3
STORAGE_BUCKET=wabicare-documents
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=your_s3_access_key_here
STORAGE_SECRET_KEY=your_s3_secret_key_here
```

## Installation Commands

After setting up your services, install the required packages:

```bash
# For SendGrid
npm install @sendgrid/mail

# For AWS SES
npm install aws-sdk

# For Mailgun
npm install mailgun.js form-data

# For AWS S3
npm install aws-sdk

# For Google Cloud Storage
npm install @google-cloud/storage

# For Azure Blob Storage
npm install @azure/storage-blob
```

## Testing

1. **Test Email Service**
   - Create a student intake form
   - Generate upload link
   - Check console logs for email sending status

2. **Test Cloud Storage**
   - Upload documents through the portal
   - Check console logs for upload status
   - Verify files appear in your cloud storage

## Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use different keys for development/production

2. **File Access**
   - Use signed URLs for private file access
   - Implement proper access controls
   - Enable encryption at rest

3. **Email Security**
   - Verify your domain with SPF/DKIM records
   - Use dedicated IP for production
   - Monitor bounce rates

## Troubleshooting

### Email Issues
- Check API key permissions
- Verify sender email is authenticated
- Check spam folders

### Storage Issues
- Verify bucket permissions
- Check file size limits
- Ensure proper CORS configuration

### General Issues
- Check environment variables are loaded
- Verify service credentials
- Check network connectivity
