import json
import boto3

sqs = boto3.client("sqs")
ses = boto3.client("ses")

SQS_QUEUE_URL
ADMIN_EMAIL

def lambda_handler(event, context):
    try:
        print(event["Records"])
        for record in event["Records"]:
            message_body = json.loads(record["body"])
            exam_id = message_body["exam_id"]
            student_email = message_body["student"]

            print(f"Processing message: {message_body}")

            # Send email using AWS SES
            response = ses.send_email(
                Source=ADMIN_EMAIL,
                Destination={"ToAddresses": [student_email]},
                Message={
                    "Subject": {"Data": "Your Exam Submission Confirmation"},
                    "Body": {
                        "Text": {
                            "Data": f"Your exam (ID: {exam_id}) has been successfully submitted"
                        }
                    }
                }
            )
            print(f"Processing email: {response}")

        return {"statusCode": 200, "body": "Email Sent"}
    
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}