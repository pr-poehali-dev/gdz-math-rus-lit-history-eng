import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для получения задач по классу, предмету и сложности
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            grade_id = params.get('grade_id')
            subject_id = params.get('subject_id')
            difficulty = params.get('difficulty')
            page_number = params.get('page_number')
            
            query = """
                SELECT t.*, g.name as grade_name, s.name as subject_name
                FROM tasks t
                LEFT JOIN grades g ON t.grade_id = g.id
                LEFT JOIN subjects s ON t.subject_id = s.id
                WHERE 1=1
            """
            conditions = []
            
            if grade_id:
                query += f" AND t.grade_id = {int(grade_id)}"
            if subject_id:
                query += f" AND t.subject_id = {int(subject_id)}"
            if difficulty:
                query += f" AND t.difficulty = '{difficulty}'"
            if page_number:
                query += f" AND t.page_number = {int(page_number)}"
            
            query += " ORDER BY t.page_number, t.task_number"
            
            cursor.execute(query)
            tasks = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'tasks': [dict(task) for task in tasks]
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'create':
                grade_id = body_data.get('grade_id')
                subject_id = body_data.get('subject_id')
                page_number = body_data.get('page_number')
                task_number = body_data.get('task_number')
                difficulty = body_data.get('difficulty', 'medium')
                question = body_data.get('question')
                answer = body_data.get('answer')
                explanation = body_data.get('explanation', '')
                created_by = body_data.get('user_id')
                
                cursor.execute(
                    """INSERT INTO tasks 
                    (grade_id, subject_id, page_number, task_number, difficulty, question, answer, explanation, created_by)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, grade_id, subject_id, page_number, task_number, difficulty, question, answer""",
                    (grade_id, subject_id, page_number, task_number, difficulty, question, answer, explanation, created_by)
                )
                conn.commit()
                task = cursor.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'task': dict(task)
                    }, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            elif action == 'solve':
                task_id = body_data.get('task_id')
                user_id = body_data.get('user_id')
                user_answer = body_data.get('user_answer')
                
                cursor.execute("SELECT answer FROM tasks WHERE id = %s", (task_id,))
                task = cursor.fetchone()
                
                if not task:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Задача не найдена'}),
                        'isBase64Encoded': False
                    }
                
                is_correct = str(user_answer).strip().lower() == str(task['answer']).strip().lower()
                
                cursor.execute(
                    "INSERT INTO solutions (task_id, user_id, user_answer, is_correct) VALUES (%s, %s, %s, %s)",
                    (task_id, user_id, user_answer, is_correct)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'is_correct': is_correct,
                        'correct_answer': task['answer']
                    }, ensure_ascii=False),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
