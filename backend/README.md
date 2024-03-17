

AWS -> S3 build bucket
    -> Made all the public access
    -> Bucket policy -> given only s3:GetObject and s3:PutObject
    -> Bucket cors policy -> Allowed Methods are only "PUT", "GET", "HEAD" and allowed origins are from all

    -> download npm aws-sdk package
    -> Given IAM user only access to GetObject and PutObject policy permission
    -> store the accessKey and secretAccessKey of the bucket in env file
    -> set up s3 bucket
    