import clearExpiredBlacklistTokens from './jobs/clear-expired-blacklist-tokens';

const jobs = [clearExpiredBlacklistTokens];

export function startCronJobs(): void {
  console.info('[INFO] Starting cron jobs...');
  jobs.forEach((job) => {
    job.start();
  });
}

export async function stopCronJobs(): Promise<void> {
  console.info('[INFO] Stopping cron jobs...');
  const promises = jobs.map((job) => job.stop());
  await Promise.all(promises);
}
