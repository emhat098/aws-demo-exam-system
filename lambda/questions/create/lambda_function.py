import boto3
import uuid
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ExamQuestions')

def lambda_handler(event, context):
    try:
        if "body" not in event or not event["body"]:
            return {"statusCode": 400, "body": json.dumps({"error": "No body in request"})}

        body = json.loads(event['body'])

        if "question_text" not in body or "question_type" not in body or "question_answer" not in body:
            return {"statusCode": 400, "body": json.dumps({"error": "Missing required fields"})}

        question_id = str(uuid.uuid4())
        question_text = body['question_text']
        question_type = body['question_type']
        question_answer = body['question_answer']
        question = {
            "question_id": question_id,
            "question_text": question_text,
            "question_type": question_type,
            "question_answer": question_answer,
        }
        
        table.put_item(Item=question)
        
        return {
            "statusCode": 201,
            "body": json.dumps({
                "message": "Question is created",
                "result": question_id,
            })
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }