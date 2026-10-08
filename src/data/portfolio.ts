import type { Experience, Project } from '@/types/portfolio';

export const profile = {
  name: 'Gowtham Jaganathan',
  base: 'Canberra, AU',
  description:
    'Cloud-focused engineer in Canberra. I build serverless AWS systems, React front ends and automated delivery pipelines.',
  linkedin: 'https://www.linkedin.com/in/gowtham-jaganathan-0b5354280/',
  github: 'https://github.com/gowthamjaganathan244',
  contact:
    'Open to software, cloud and DevOps roles in Canberra, Sydney, Melbourne and remote across Australia. Full working rights.',
};
export const navigation = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'lab', label: 'Lab' },
  { id: 'experience', label: 'Flight log' },
  { id: 'certs', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];
export const roles = ['Software Developer', 'Cloud Developer', 'Platform Engineer'];
export const ticker = [
  'AWS Lambda',
  'API Gateway',
  'S3',
  'DynamoDB',
  'Cognito',
  'IAM',
  'GitHub Actions',
  'React',
  'TypeScript',
  'Python',
  'Flask',
  'Terraform',
  'Azure AD',
  'Locust',
  'Lighthouse',
];
export const metrics = [
  { value: 3, suffix: '', label: 'AWS certifications' },
  { value: 6, suffix: '', label: 'teams and roles shipped with' },
  { value: 2, suffix: '+', label: 'years hands-on development' },
  { value: 100, suffix: '%', label: 'login success in UAT' },
];
export const education = [
  {
    degree: 'Master of Information Technology and Systems',
    detail: "University of Canberra, 2025. Dean's Award of Excellence 2024 and 2025",
  },
  {
    degree: 'Bachelor of Engineering, Computer Science',
    detail: 'Knowledge Institute of Technology, Anna University, 2020',
  },
];
export const skills = [
  {
    category: 'cloud/',
    title: 'AWS and Azure',
    items: ['Lambda', 'API Gateway', 'S3', 'Cognito', 'EC2', 'IAM', 'VPC', 'Azure AD'],
  },
  {
    category: 'delivery/',
    title: 'CI/CD and DevOps',
    items: ['GitHub Actions', 'Git', 'Jira', 'Confluence', 'Agile'],
  },
  {
    category: 'lang/',
    title: 'Languages',
    items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'Swift', 'HTML', 'CSS'],
  },
  {
    category: 'web/',
    title: 'Frameworks',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Flask', 'REST APIs'],
  },
  { category: 'data/', title: 'Databases', items: ['DynamoDB', 'MongoDB', 'MySQL', 'Amazon RDS'] },
  {
    category: 'quality/',
    title: 'Testing and automation',
    items: ['Integration tests', 'Locust', 'UAT', 'Lighthouse', 'Power Automate'],
  },
];
export const projects: Project[] = [
  {
    id: 'secure-vault',
    title: 'Secure Vault',
    status: 'serverless · AWS',
    description:
      'A private file platform using authenticated access and presigned downloads so stored objects are never exposed publicly.',
    technologies: ['API Gateway', 'Lambda', 'S3', 'DynamoDB', 'Cognito'],
    branching: true,
    caption: 'client → cognito → api gateway → lambda → s3 / dynamodb',
    workflow: [
      {
        id: 'client',
        label: 'Client',
        title: 'Client',
        detail: 'Signed-in users request uploads, file listings and downloads from the browser.',
      },
      {
        id: 'cognito',
        label: 'Cognito',
        title: 'Cognito',
        detail: 'Cognito handles user identity so application code does not store user passwords.',
      },
      {
        id: 'api',
        label: 'API Gateway',
        title: 'API Gateway',
        detail:
          'The managed API entry point receives authenticated requests and forwards them to backend logic.',
      },
      {
        id: 'lambda',
        label: 'Lambda',
        title: 'Lambda',
        detail:
          'Lambda applies backend rules and issues short-lived access rather than exposing storage directly.',
      },
      {
        id: 's3',
        label: 'S3',
        title: 'S3',
        detail:
          'Private objects remain in S3; presigned URLs grant temporary upload or download access.',
      },
      {
        id: 'ddb',
        label: 'DynamoDB',
        title: 'DynamoDB',
        detail: 'File metadata is stored separately and updated through the backend workflow.',
      },
    ],
  },
  {
    id: 'cloudpress',
    title: 'CloudPress AI Secure',
    status: 'in progress',
    description:
      'A secure AI knowledge platform with role-based access, permission-aware retrieval and CI/CD-driven delivery.',
    technologies: ['React', 'TypeScript', 'AWS', 'Terraform'],
    caption: 'user → react/typescript → rbac → aws retrieval → grounded answer',
    workflow: [
      {
        id: 'user',
        label: 'User',
        title: 'User',
        detail: 'The user searches and asks questions through the application interface.',
      },
      {
        id: 'react',
        label: 'React + TS',
        title: 'React + TypeScript',
        detail:
          'The frontend captures queries, renders results and keeps the experience strongly typed.',
      },
      {
        id: 'rbac',
        label: 'RBAC',
        title: 'Role-based access',
        detail:
          'Access rules are checked before protected knowledge is allowed into the retrieval path.',
      },
      {
        id: 'aws',
        label: 'AWS / RAG',
        title: 'AWS retrieval',
        detail: 'The AWS backend performs permission-aware retrieval against the knowledge layer.',
      },
      {
        id: 'answer',
        label: 'Grounded answer',
        title: 'Answer',
        detail:
          'Only retrieved context the user is allowed to access is used to produce the answer.',
      },
    ],
  },
  {
    id: 'desk-booking',
    title: 'Smart Desk Booking',
    status: 'Bluebird Advisory',
    description:
      'A booking platform with real-time availability, check-in tracking, analytics and automated email workflows behind Azure AD SSO.',
    technologies: ['React', 'Power Automate', 'SharePoint', 'Azure AD'],
    caption: 'employee → react → azure ad → sharepoint → power automate',
    workflow: [
      {
        id: 'employee',
        label: 'Employee',
        title: 'Employee',
        detail: 'Employees search availability, reserve a desk and manage their bookings.',
      },
      {
        id: 'react',
        label: 'React',
        title: 'React app',
        detail: 'React provides the booking interface, availability views and check-in experience.',
      },
      {
        id: 'azure',
        label: 'Azure AD',
        title: 'Azure AD',
        detail: 'Azure AD provides single sign-on before users can access the booking experience.',
      },
      {
        id: 'sharepoint',
        label: 'SharePoint',
        title: 'SharePoint',
        detail:
          'SharePoint stores booking data used to calculate availability and prevent conflicts.',
      },
      {
        id: 'automate',
        label: 'Power Automate',
        title: 'Power Automate',
        detail: 'Power Automate handles downstream email and workflow automation around bookings.',
      },
    ],
  },
  {
    id: 'capability-mapping',
    title: 'Capability-Mapping Automation',
    status: 'Canberra Cyber Hub',
    description:
      'Survey and CRM workflows that improved field-mapping accuracy and the quality of directory data.',
    technologies: ['Power Automate', 'HubSpot', 'Drupal', 'Microsoft Forms'],
    caption: 'forms → power automate → field mapping → hubspot → drupal',
    workflow: [
      {
        id: 'forms',
        label: 'Forms',
        title: 'Microsoft Forms',
        detail:
          'Survey submissions capture organisation and capability information in a consistent input flow.',
      },
      {
        id: 'automate',
        label: 'Power Automate',
        title: 'Power Automate',
        detail: 'Automated flows move submitted data into the downstream mapping and CRM workflow.',
      },
      {
        id: 'mapping',
        label: 'Mapping',
        title: 'Field mapping',
        detail:
          'Fields are standardised so the same capability data remains consistent across systems.',
      },
      {
        id: 'hubspot',
        label: 'HubSpot',
        title: 'HubSpot',
        detail: 'Mapped records feed CRM workflows with cleaner, more reliable organisation data.',
      },
      {
        id: 'drupal',
        label: 'Drupal directory',
        title: 'Drupal directory',
        detail:
          'The resulting information supports directory features and higher-quality published data.',
      },
    ],
  },
];
export const experience: Experience[] = [
  {
    role: 'Capstone Project Developer, Bluebird Advisory',
    timeframe: 'Feb 2025 – May 2025',
    description:
      'Delivered a desk-booking app integrated with Microsoft 365 and Azure AD SSO, reaching 100% login success in UAT. Added conflict handling to prevent duplicate bookings and validated accessibility with Lighthouse.',
  },
  {
    role: 'Student Intern, Canberra Cyber Hub',
    timeframe: 'Dec 2024 – Feb 2025',
    description:
      'Built Drupal webforms and directory features and standardised field mappings across Microsoft Forms, Power Automate and HubSpot CRM.',
  },
  {
    role: 'Team Member, Endeavour Group',
    timeframe: 'Nov 2023 – Present',
    description:
      'Resolve point-of-sale and delivery workflow issues in a high-volume environment, using Tableau dashboards to support order accuracy.',
  },
  {
    role: 'Software Engineer Intern, eShipz',
    timeframe: 'Dec 2020 – Dec 2021',
    description:
      'Built Python, Flask and MongoDB services and partner API integrations. Migrated legacy Python 2 services to Python 3 and load tested with Locust.',
  },
  {
    role: 'Frontend Developer Intern, Gewissen Digital Services',
    timeframe: 'Feb 2020 – Nov 2020',
    description:
      'Built responsive sites with HTML, CSS, Bootstrap and JavaScript, and fixed cross-browser layout issues.',
  },
  {
    role: 'iOS Developer Intern, MobiPhoenix Systems',
    timeframe: 'Dec 2018 – Feb 2019',
    description: 'Built a Swift news reader with offline caching and pull-to-refresh.',
  },
];
export const certifications = [
  { title: 'Solutions Architect', level: 'Associate' },
  { title: 'Developer', level: 'Associate' },
  { title: 'AI Practitioner', level: 'Foundational' },
];
