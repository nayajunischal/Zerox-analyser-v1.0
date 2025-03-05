#!/usr/bin/python
# -*- coding: utf-8 -*-

import time
import sys
import argparse
from detect import *

if __name__ == "__main__":
    # Set up an argument parser to handle command-line inputs
    parser = argparse.ArgumentParser()
    parser.add_argument('--dir', action='store', dest='dir', help="Provide Directory to analyse")
    parser.add_argument('--plain', action='store_true', dest='plain', help="Plain in output (without Color)")
    results = parser.parse_args()

    # Check if a directory has been specified and proceed with the analysis.
    if results.dir is not None:
        """Check if a directory has been specified and proceed with the analysis.
          To browse files recursively, higher threshold"""
        sys.setrecursionlimit(1000000) 
        ascii_art = r"""
 __________                 ____  ___    _____                .__                              
\____    /___________  ____\   \/  /   /  _  \   ____ _____  |  | ___.__. ______ ___________  
  /     // __ \_  __ \/  _ \\     /   /  /_\  \ /    \\__  \ |  |<   |  |/  ___// __ \_  __ \ 
 /     /\  ___/|  | \(  <_> )     \  /    |    \   |  \/ __ \|  |_\___  |\___ \\  ___/|  | \/ 
/_______ \___  >__|   \____/___/\  \ \____|__  /___|  (____  /____/ ____/____  >\___  >__|    
        \/   \/                  \_/         \/     \/     \/     \/         \/     \/      
                                          
                                                                    Made By: Anubhav Dhakal | ZeroX Analyser
"""
        print(ascii_art)
        print("\n{}Analyzing '{}' source code{}".format('' if results.plain else '\033[1m', results.dir, '' if results.plain else '\033[0m'))
        time.sleep(5)
        if os.path.isfile(results.dir):
            analysis(results.dirm, results.plain)
        else:
            recursive(results.dir, 0, results.plain)
        scanresults()

    else:
        parser.print_help()
