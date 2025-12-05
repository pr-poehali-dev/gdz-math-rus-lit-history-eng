import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для материалов подготовки к ЕГЭ и ОГЭ
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        params = event.get('queryStringParameters', {}) or {}
        exam_type = params.get('type')
        subject_id = params.get('subject_id')
        
        query = """
            SELECT ep.*, s.name as subject_name, s.icon as subject_icon
            FROM exam_prep ep
            LEFT JOIN subjects s ON ep.subject_id = s.id
            WHERE 1=1
        """
        
        if exam_type:
            query += f" AND ep.exam_type = '{exam_type}'"
        if subject_id:
            query += f" AND ep.subject_id = {int(subject_id)}"
        
        query += " ORDER BY ep.created_at DESC"
        
        cursor.execute(query)
        materials = cursor.fetchall()
        
        result_materials = []
        for material in materials:
            mat_dict = dict(material)
            if 'created_at' in mat_dict and mat_dict['created_at']:
                mat_dict['created_at'] = mat_dict['created_at'].isoformat()
            result_materials.append(mat_dict)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'materials': result_materials
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()