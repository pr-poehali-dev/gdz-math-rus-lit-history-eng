import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для получения и добавления видеоуроков
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
            
            query = """
                SELECT v.*, g.name as grade_name, s.name as subject_name
                FROM videos v
                LEFT JOIN grades g ON v.grade_id = g.id
                LEFT JOIN subjects s ON v.subject_id = s.id
                WHERE 1=1
            """
            
            if grade_id:
                query += f" AND v.grade_id = {int(grade_id)}"
            if subject_id:
                query += f" AND v.subject_id = {int(subject_id)}"
            
            query += " ORDER BY v.created_at DESC"
            
            cursor.execute(query)
            videos = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'videos': [dict(video) for video in videos]
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'create':
                grade_id = body_data.get('grade_id')
                subject_id = body_data.get('subject_id')
                title = body_data.get('title')
                description = body_data.get('description', '')
                video_url = body_data.get('video_url')
                thumbnail_url = body_data.get('thumbnail_url', '')
                duration = body_data.get('duration', 0)
                
                cursor.execute(
                    """INSERT INTO videos 
                    (grade_id, subject_id, title, description, video_url, thumbnail_url, duration)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, title, video_url, grade_id, subject_id""",
                    (grade_id, subject_id, title, description, video_url, thumbnail_url, duration)
                )
                conn.commit()
                video = cursor.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'video': dict(video)
                    }, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            elif action == 'view':
                video_id = body_data.get('video_id')
                
                cursor.execute(
                    "UPDATE videos SET views = views + 1 WHERE id = %s RETURNING views",
                    (video_id,)
                )
                conn.commit()
                result = cursor.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'views': result['views'] if result else 0
                    }),
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
