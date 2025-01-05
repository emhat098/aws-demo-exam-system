import boto3
import uuid
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ExamQuestions')

def lambda_handler(event, context):
    body = {}
    statusCode = 200
    headers = {
        "Content-Type": "application/json"
    }

    try:
        if event['routeKey'] == "POST /create-question":
            if "body" not in event or not event["body"]:
                return {"statusCode": 400, "body": json.dumps({"error": "No body in request"})}

            reqBody = json.loads(event['body'])

            if "question_text" not in reqBody or "question_type" not in reqBody or "question_answer" not in reqBody:
                return {"statusCode": 400, "reqBody": json.dumps({"error": "Missing required fields"})}

            question_id = str(uuid.uuid4())
            question_text = reqBody['question_text']
            question_type = reqBody['question_type']
            question_answer = reqBody['question_answer']
            question = {
                "question_id": question_id,
                "question_text": question_text,
                "question_type": question_type,
                "question_answer": question_answer,
            }
            
            table.put_item(Item=question)
            statusCode = 201
            body = question_id
        elif event['routeKey'] == "GET /questions":
            query_params = event.get("queryStringParameters", {}) or {}

            limit = int(query_params.get("limit", 10))  # Default to 10 items per page
            page_token = query_params.get("page_token")  # page_token should be a string (JSON)

            query_kwargs = {
                "Limit": limit
            }

            # Ensure page_token is valid before parsing
            if page_token:
                try:
                    query_kwargs["ExclusiveStartKey"] = json.loads(page_token)
                except json.JSONDecodeError:
                    return {"statusCode": 400, "body": json.dumps({"error": "Invalid page_token format"})}
                
            # Get total count of questions (for UI pagination)
            total_response = table.scan(Select="COUNT")
            total_items = total_response.get("Count", 0)
            total_pages = (total_items // limit) + (1 if total_items % limit > 0 else 0)

            response = table.scan(**query_kwargs)  # Use `scan()` if querying all data
            questions = response.get("Items", [])

            # Calculate current page (based on previous token existence)
            current_page = int(query_params.get("current_page", 1))

            statusCode = 200
            body = {
                "questions": questions,
                "pagination": {
                    "currentPage": current_page,
                    "pageSize": limit,
                    "totalItems": total_items,
                    "totalPages": total_pages,
                    "nextPageToken": json.dumps(response.get("LastEvaluatedKey")) if "LastEvaluatedKey" in response else None
                }
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
