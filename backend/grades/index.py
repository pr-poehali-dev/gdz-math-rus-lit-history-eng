import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для получения информации о классах и предметах
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
        resource = params.get('resource', 'grades')
        
        if resource == 'grades':
            cursor.execute("SELECT * FROM grades ORDER BY grade_number")
            grades = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'grades': [dict(grade) for grade in grades]
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif resource == 'subjects':
            cursor.execute("SELECT * FROM subjects WHERE id NOT IN (21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37) ORDER BY name")
            subjects = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'subjects': [dict(subject) for subject in subjects]
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif resource == 'textbook_solutions':
            grade_id = params.get('grade_id')
            subject_id = params.get('subject_id')
            textbook_id = params.get('textbook_id')
            
            query = """
                SELECT ts.*, t.title as textbook_title, t.author, g.name as grade_name, s.name as subject_name
                FROM textbook_solutions ts
                LEFT JOIN textbooks t ON ts.textbook_id = t.id
                LEFT JOIN grades g ON ts.grade_id = g.id
                LEFT JOIN subjects s ON ts.subject_id = s.id
                WHERE 1=1
            """
            
            if grade_id:
                query += f" AND ts.grade_id = {int(grade_id)}"
            if subject_id:
                query += f" AND ts.subject_id = {int(subject_id)}"
            if textbook_id:
                query += f" AND ts.textbook_id = {int(textbook_id)}"
            
            query += " ORDER BY ts.page_number, ts.task_number"
            
            cursor.execute(query)
            solutions = cursor.fetchall()
            
            result_solutions = []
            for solution in solutions:
                sol_dict = dict(solution)
                if 'created_at' in sol_dict and sol_dict['created_at']:
                    sol_dict['created_at'] = sol_dict['created_at'].isoformat()
                result_solutions.append(sol_dict)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'solutions': result_solutions
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif resource == 'textbooks':
            grade_id = params.get('grade_id')
            subject_id = params.get('subject_id')
            year = params.get('year')
            
            query = """
                SELECT t.*, g.name as grade_name, s.name as subject_name, s.icon as subject_icon
                FROM textbooks t
                LEFT JOIN grades g ON t.grade_id = g.id
                LEFT JOIN subjects s ON t.subject_id = s.id
                WHERE 1=1
            """
            
            if grade_id:
                query += f" AND t.grade_id = {int(grade_id)}"
            if subject_id:
                query += f" AND t.subject_id = {int(subject_id)}"
            if year:
                query += f" AND t.year = {int(year)}"
            
            query += " ORDER BY t.year DESC, t.title"
            
            cursor.execute(query)
            textbooks = cursor.fetchall()
            
            result_textbooks = []
            for textbook in textbooks:
                tb_dict = dict(textbook)
                if 'created_at' in tb_dict and tb_dict['created_at']:
                    tb_dict['created_at'] = tb_dict['created_at'].isoformat()
                result_textbooks.append(tb_dict)
            
            years_query = "SELECT DISTINCT year FROM textbooks WHERE year IS NOT NULL ORDER BY year DESC"
            cursor.execute(years_query)
            years_result = cursor.fetchall()
            available_years = [row['year'] for row in years_result]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'textbooks': result_textbooks,
                    'available_years': available_years
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Unknown resource'}),
                'isBase64Encoded': False
            }
    
    finally:
        cursor.close()
        conn.close()