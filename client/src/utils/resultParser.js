export const parseResults = (output) => {
    if (!output) return { vulnerabilities: [], summary: { total: 0, bySeverity: {}, byType: {} } };
    
    const lines = output.split('\n');
    const results = [];
    
    let currentVuln = null;
    let inVulnSection = false;
    
    // Skip the ASCII art header
    let startIndex = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Analyzing') && lines[i].includes('source code')) {
            startIndex = i + 1;
            break;
        }
    }
    
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines and separator lines
        if (!line || line.startsWith('----')) continue;
        
        // Start of a new vulnerability section
        if (line.includes('Potential vulnerability found :')) {
            // Save previous vulnerability if exists
            if (currentVuln) {
                results.push(currentVuln);
            }
            
            // Extract vulnerability type
            const vulnType = line.split('Potential vulnerability found :')[1]?.trim() || 'Unknown';
            
            // Determine severity based on vulnerability type
            let severity = determineSeverity(vulnType);
            
            currentVuln = {
                file: '',
                type: vulnType,
                line: '',
                details: [],
                severity: severity,
                code: ''
            };
            
            inVulnSection = true;
            continue;
        }
        
        // If we're in a vulnerability section, parse the details
        if (inVulnSection && currentVuln) {
            // Line information
            if (line.startsWith('Line')) {
                const lineMatch = line.match(/-->\s*(\d+)\s*in\s*(.*)/);
                if (lineMatch) {
                    currentVuln.line = lineMatch[1];
                    currentVuln.file = lineMatch[2];
                }
            }
            // Code information
            else if (line.startsWith('Code')) {
                currentVuln.code = line.replace('Code', '').trim();
            }
            // Declaration information
            else if (line.startsWith('Declaration')) {
                currentVuln.details.push(line);
            }
            // End of vulnerability section
            else if (line.includes('Found') && line.includes('vulnerabilities in')) {
                // Save the last vulnerability
                if (currentVuln) {
                    results.push(currentVuln);
                    currentVuln = null;
                }
                inVulnSection = false;
            }
        }
    }
    
    // Add the last vulnerability if exists
    if (currentVuln) {
        results.push(currentVuln);
    }
    
    // Generate summary
    const summary = generateSummary(results);
    
    return {
        vulnerabilities: results,
        summary: summary
    };
};

const determineSeverity = (vulnType) => {
    if (vulnType.includes('SQL Injection') || 
        vulnType.includes('Remote Command Execution') || 
        vulnType.includes('Command Injection')) {
        return 'Critical';
    } else if (vulnType.includes('XSS') || 
               vulnType.includes('File Inclusion') ||
               vulnType.includes('Hardcoded Credential') ||
               vulnType.includes('PHP Object Injection')) {
        return 'High';
    } else if (vulnType.includes('Information') ||
               vulnType.includes('High Entropy String') ||
               vulnType.includes('Weak Cryptographic')) {
        return 'Medium';
    } else {
        return 'Low';
    }
};

const generateSummary = (results) => {
    const summary = {
        total: results.length,
        bySeverity: {
            Critical: results.filter(r => r.severity === 'Critical').length,
            High: results.filter(r => r.severity === 'High').length,
            Medium: results.filter(r => r.severity === 'Medium').length,
            Low: results.filter(r => r.severity === 'Low').length
        },
        byType: {}
    };
    
    // Count vulnerabilities by type
    results.forEach(result => {
        if (!summary.byType[result.type]) {
            summary.byType[result.type] = 0;
        }
        summary.byType[result.type]++;
    });
    
    return summary;
};

export const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
        case 'critical': return '#d32f2f';
        case 'high': return '#f44336';
        case 'medium': return '#ff9800';
        case 'low': return '#4caf50';
        default: return '#757575';
    }
}; 