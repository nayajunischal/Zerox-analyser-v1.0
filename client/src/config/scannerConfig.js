import CodeIcon from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import ScheduleIcon from '@mui/icons-material/Schedule';

export const scannerConfig = {
    left: [
        {
            id: 'code',
            title: 'Code Scanner',
            description: 'Scan source code files for security vulnerabilities and code quality issues',
            icon: CodeIcon,
            color: {
                main: '#0284c7',
                dark: '#0369a1'
            },
            buttonText: 'Start New Scan'
        },
        {
            id: 'dynamic',
            title: 'Dynamic Scanner',
            description: 'Perform real-time security analysis on live web applications',
            icon: LanguageIcon,
            color: {
                main: '#7c3aed',
                dark: '#6d28d9'
            },
            buttonText: 'Start Dynamic Scan'
        },
        {
            id: 'forensic',
            title: 'Forensic Scanner',
            description: 'Scan web server logs for breach attempts',
            icon: StorageIcon,
            color: {
                main: '#f97316',
                dark: '#ea580c'
            },
            buttonText: 'Start Forensic Scan'
        }
    ],
    right: [
        {
            id: 'breaches',
            title: 'Score & Breaches',
            description: 'Detect breaches on the surface, deep and dark web',
            icon: SecurityIcon,
            color: {
                main: '#22c55e',
                dark: '#16a34a'
            },
            buttonText: 'Manage Breaches'
        },
        {
            id: 'browser',
            title: 'Sandcat Browser',
            description: 'Audit and inspect web apps',
            icon: LanguageIcon,
            color: {
                main: '#f59e0b',
                dark: '#d97706'
            },
            buttonText: 'Open Browser'
        },
        {
            id: 'scheduler',
            title: 'Scan Scheduler',
            description: 'Create, view and manage scheduled scans',
            icon: ScheduleIcon,
            color: {
                main: '#f97316',
                dark: '#ea580c'
            },
            buttonText: 'Schedule Scan'
        }
    ]
}; 