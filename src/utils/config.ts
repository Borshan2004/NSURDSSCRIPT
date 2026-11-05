/**
 * Global Configuration for NSU RDS Test Automation.
 * 
 * To change the test environment URL, update BASE_URL here or set the
 * BASE_URL environment variable (e.g. in CI or terminal: $env:BASE_URL="...").
 * This is the SINGLE SOURCE OF TRUTH for the portal URL across the entire project.
 */
export const BASE_URL: string = process.env.BASE_URL || 'http://10.102.11.254/rds_live_php84/';

