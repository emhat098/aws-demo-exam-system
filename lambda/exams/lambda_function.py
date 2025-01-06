import boto3
import uuid
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Exams')
sns = boto3.client('sns')

SNS_TOPIC_ARN

def lambda_handler(event, context):
    body = {}
    statusCode = 200
    headers = {
        "Content-Type": "application/json"
    }
    try:
        if event['routeKey'] == "POST /submit-answer":
            if "body" not in event or not event["body"]:
                return {"statusCode": 400, "body": json.dumps({"error": "No body in request"})}

            reqBody = json.loads(event['body'])

            if "student" not in reqBody or "answers" not in reqBody:
                return {"statusCode": 400, "body": json.dumps({"error": "Missing required fields"})}

            exam_id = str(uuid.uuid4())
            student = reqBody['student']
            answers = reqBody['answers']

            exam = {
                "exam_id": exam_id,
                "student": student,
                "answers": answers,
            }
            
            table.put_item(Item=exam)

            # Publish message to SNS
            message = {
                "exam_id": exam_id,
                "student": student,
            }
            response = sns.publish(
                TopicArn=SNS_TOPIC_ARN,
                Message=json.dumps(message),
                Subject="Exam Submission Confirmation"
            )

            statusCode = 201
            body = {
                "exam_id": exam_id,
                "response": response
            }
    except Exception as e:
        statusCode = 500
        body = {
            "error": str(e)
        }
    res = {
        "statusCode": statusCode,
        "headers": headers,
        "body": json.dumps(body)
    }
    return res;
