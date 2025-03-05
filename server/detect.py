#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import re
import math
from indicators import *
from feature import *

result_count = 0
result_files = 0

def shannon_entropy(data, iterator):
    """
    Calculates the Shannon entropy of a string. This metric is a measure of the unpredictability
    or randomness of the data, used to detect potentially sensitive information like passwords.
    
    Parameters:
    - data: The string to calculate entropy for.
    - iterator: A collection of unique characters to consider in the entropy calculation.
    
    Returns:
    - The Shannon entropy value as a float.
    """
    if not data:
        return 0
    entropy = 0
    for x in iterator:
        p_x = float(data.count(x))/len(data)
        if p_x > 0:
            entropy += - p_x*math.log(p_x, 2)
    return entropy


def analysis(path, plain):
    """
    Analyzes a single file's source code to identify security vulnerabilities such as hardcoded credentials
    and strings with high entropy, which could indicate sensitive data.
    
    Parameters:
    - path: Path to the file to analyze.
    - plain: Boolean flag indicating whether output should be formatted as plain text.
    """

    global result_count
    global result_files
    result_files += 1
    with open(path, 'r', encoding='utf-8', errors='replace') as content_file:

        # Clean source for a better detection
        content = content_file.read()
        content = clean_source_and_format(content)

        # Hardcoded credentials (work as an exception, it's not function based)
        credz = ['pass', 'secret', 'token', 'pwd', 'api-key']
        for credential in credz:
            content_pure = content.replace(' ', '')

            # detect all variables
            regex_var_detect = r"\$[\w\s]+\s?=\s?[\"'].*[\"']|define\([\"'].*[\"']\)"
            regex = re.compile(regex_var_detect , re.I)
            matches = regex.findall(content_pure)
            
            # If we find a variable with a constant for a given indicator
            for vuln_content in matches:
                if credential in vuln_content.lower():
                    payload = ["", "Hardcoded Credential", []]
                    add_vuln_var(payload, plain, path, vuln_content, content, regex_var_detect)

        
        # High Entropy String
        content_pure = content.replace(' ', '')
        regex_var_detect = r".*?=\s?[\"'].*?[\"'].*?"
        regex = re.compile(regex_var_detect , re.I)
        matches = regex.findall(content_pure)
        BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        HEX_CHARS = "1234567890abcdefABCDEF"

        for vuln_content in matches:
            payload = ["", "High Entropy String", []]
            if shannon_entropy(vuln_content, BASE64_CHARS) >= 4.1 or \
                shannon_entropy(vuln_content, HEX_CHARS) >= 2.5:
                add_vuln_var(payload, plain, path, vuln_content, content, regex_var_detect)
                
        
        # Detection of RCE/SQLI/LFI/RFI/RFU/XSS/...
        for payload in payloads:
            regex = re.compile(payload[0] + regex_indicators)
            matches = regex.findall(content.replace(" ", "(PLACEHOLDER"))

            for vuln_content in matches:

                # Handle "require something" vs "require(something)"
                # Dirty trick to force a parenthesis before the function's argument
                vuln_content = list(vuln_content)
                for i in range(len(vuln_content)):
                    vuln_content[i] = vuln_content[i].replace("(PLACEHOLDER", " ")
                    vuln_content[i] = vuln_content[i].replace("PLACEHOLDER", "")

                occurence = 0

                # Security hole detected, is it protected ?
                if not check_protection(payload[2], vuln_content):
                    declaration_text, line = "", ""

                    # Managing multiple variable in a single line/function
                    sentence = "".join(vuln_content)
                    regex = re.compile(regex_indicators[2:-2])
                    for vulnerable_var in regex.findall(sentence):
                        false_positive = False
                        occurence += 1

                        # No declaration for $_GET, $_POST ...
                        if not check_exception(vulnerable_var[1]):
                            # Look for the declaration of $something = xxxxx
                            false_positive, declaration_text, line = check_declaration(
                                content,
                                vulnerable_var[1],
                                path)

                            # Set false positive if protection is in the variable's declaration
                            is_protected = check_protection(payload[2], declaration_text)
                            false_positive = is_protected if is_protected else false_positive

                        # Display all the vuln
                        line_vuln = find_line_vuln(payload, vuln_content, content)

                        # Check for not $dest="constant"; $dest='cste'; $dest=XX;
                        if "$_" not in vulnerable_var[1]:
                            if "$" not in declaration_text.replace(vulnerable_var[1], ''):
                                false_positive = True

                        if not false_positive:
                            result_count = result_count + 1
                            display(path, payload, vuln_content, line_vuln, declaration_text, line, vulnerable_var[1], occurence, plain)


def recursive(dir, progress, plain):
    """
    Recursively scans directories for PHP files and analyzes them for vulnerabilities.
    
    Parameters:
    - dir: The directory to start scanning from.
    - progress: The current depth of recursion, used for displaying progress.
    - plain: Indicates whether to use plain text for progress indicators.
    """
    progress += 1
    progress_indicator = '⬛'
    if plain:
        progress_indicator = "█"
    try:
        for name in os.listdir(dir):

            print('\tAnalyzing : ' + progress_indicator * progress + '\r', end="\r"),

            # Targetting only PHP Files
            if os.path.isfile(os.path.join(dir, name)):
                if ".php" in os.path.join(dir, name):
                    analysis(dir + "/" + name, plain)
            else:
                recursive(dir + "/" + name, progress, plain)

    except OSError as e:
        print("Error 404 - Not Found, maybe you need more right ?" + " " * 30)
        exit(-1)

def scanresults():
    """
    Prints a summary of the scan results, including the number of vulnerabilities found and the number of files analyzed.
    """
    global result_count
    global result_files
    print("Found {} vulnerabilities in {} files".format(result_count, result_files))



def add_vuln_var(payload, plain, path, vuln_content, page_content, regex_var_detect, occurence=1):
    """
    Adds a found vulnerability to the results and displays it.
    
    Parameters:
    - payload: The vulnerability details to add.
    - plain: Indicates whether output should be plain text.
    - path: The file path where the vulnerability was found.
    - vuln_content: The specific content that was identified as vulnerable.
    - page_content: The content of the entire page.
    - regex_var_detect: The regex pattern used to detect the vulnerability.
    - occurence: The occurrence count of the vulnerability (default is 1).
    """
    line_vuln = -1
    splitted_content = page_content.split('\n')
    for i in range(len(splitted_content)):
        regex = re.compile(regex_var_detect, re.I)
        matches = regex.findall(splitted_content[i])
        if len(matches) > 0:
            line_vuln = i


    display(
        path,           
        payload,        
        vuln_content,   
        line_vuln,     
        vuln_content,  
        str(line_vuln), 
        vuln_content,   
        occurence,      
        plain          
    )

    # increment the global vulnerability count
    global result_count
    result_count = result_count + 1
