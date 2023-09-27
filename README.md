# sailthru-bulk-send-api

Repo created for sailthru bulk api email sends.

Sailthru removed the ability for marketing to mass send emails to users that opted out. Solution provided is meant to allow our marketing team the ability to mass send emails out to users when price changes occur.

Ideally we scale this to work with any template, any amount of users, and any publication.

Future Fixes

- Validate CSV files to standardized format (we decide this)
- Error handling for missed emails
- Prepare code to handle all functionality within cloud (aws lambda)
- ingest CSV files from S3 bucket
- Return useful errors to front end
