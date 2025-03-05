from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import logging
import shlex
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def strip_ansi_codes(text):
    """Remove ANSI escape sequences from text"""
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    return ansi_escape.sub('', text)

@app.route('/api/scan', methods=['POST'])
def scan_code():
    logger.info("Received scan request")
    try:
        data = request.json
        logger.info(f"Request data: {data}")
        target_path = data.get('targetPath', '../vulnerable_code')
        logger.info(f"Target path: {target_path}")
        
        # Check if zeroXanalyser.py exists
        if not os.path.exists('zeroXanalyser.py'):
            logger.error("zeroXanalyser.py not found")
            return jsonify({
                'success': False,
                'error': "zeroXanalyser.py not found in the server directory"
            }), 404
        
        # Set environment variables for proper encoding
        env = os.environ.copy()
        env['PYTHONIOENCODING'] = 'utf-8'
        env['PYTHONUNBUFFERED'] = '1'  # Ensure unbuffered output
        
        cmd = ['python3', 'zeroXanalyser.py', '--dir', target_path]
        logger.info(f"Running command: {' '.join(cmd)}")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False,
            env=env,
            encoding='utf-8'  # Explicitly specify UTF-8 encoding
        )
        
        # Clean the output by stripping ANSI codes
        cleaned_stdout = strip_ansi_codes(result.stdout)
        cleaned_stderr = strip_ansi_codes(result.stderr)
        
        if result.returncode != 0:
            logger.error(f"Command failed with return code {result.returncode}")
            logger.error(f"Error output: {cleaned_stderr}")
            return jsonify({
                'success': False,
                'output': cleaned_stdout,
                'error': cleaned_stderr
            }), 500
        
        logger.info("Scan completed successfully")
        return jsonify({
            'success': True,
            'output': cleaned_stdout,
            'error': cleaned_stderr
        })
    except subprocess.CalledProcessError as e:
        logger.error(f"Process error: {str(e)}")
        return jsonify({
            'success': False,
            'output': e.stdout,
            'error': e.stderr
        }), 500
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Add a simple test endpoint
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Server is running!"})

if __name__ == '__main__':
    logger.info("Starting Flask server on port 5001")
    app.run(debug=True, port=5001, host='0.0.0.0') 