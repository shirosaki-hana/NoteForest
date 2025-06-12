export function writelog(level: string, message: string): void {

  const timestamp = new Date().toISOString();
  console.log(`[${level.toUpperCase()}] ${timestamp} | ${message}`);
  
}