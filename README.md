# ScanCodeShield - PHP Code Static Analysis Tool
Basic script to detect vulnerabilities into a PHP source code, it is using Regular Expression to find sinkholes.

```bash
# HELP
┌[parrot]─[Bishal Aryal]─[/home/cisco/project/final-year-sast-tool]
└╼cisco$python3 scancodeshield.py    
usage: scancodeshield.py [-h] [--dir DIR] [--plain]

optional arguments:
  -h, --help  show this help message and exit
  --dir DIR   Provide Directory to analyse
  --plain     Plain in output (without Color)
```
Currently detecting :
- Arbitrary Cookie
- Arbitrary File Deletion
- Cross Site Scripting
- File Inclusion / Path Traversal
- File Upload
- Header Injection
- Information Leak
- PHP Object Injection
- Remote Code Execution
- Remote Command Execution
- Server Side Request Forgery
- Server Side Template Injection
- SQL Injection
- URL Redirection
- Weak Cryptographic Hash
- Hardcoded credentials
- High Entropy string

> Use "automate_scanning.sh" to automate the scanning process.
```bash
# Example
┌[parrot]─[Bishal Aryal]─[/home/cisco/project/final-year-sast-tool]
└╼cisco$python3 scancodeshield.py --dir vulnerable_code               
    
Analyzing 'vulnerable_code' source code
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Name            Potential vulnerability found : SQL Injection
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Line              -->6 in vulnerable_code/tainted-sql-string.php
Code              mysql_query($query)
Declaration       Line n°6 : $query = "SELECT * FROM table WHERE Id = '"
```

.
