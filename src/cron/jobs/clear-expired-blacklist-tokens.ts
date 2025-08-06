import { prisma } from '../../database';
import { CronJob } from 'cron';

const SYSTEM_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const clearExpiredBlacklistTokens = async (): Promise<void> => {
  const now = new Date();
  await prisma.jwtBlacklist.deleteMany({
    where: {
      expiresAt: {
        lt: now
      }
    }
  });
};

const job = CronJob.from({
  name: 'clear-expired-blacklist-tokens',
  cronTime: '0 * * * *',
  onTick: async () => {
    const start = performance.now();
    await clearExpiredBlacklistTokens();
    const end = performance.now();
    const now = new Date();
    console.info(
      `[INFO] Cron job ${job.name} completed in ${end - start}ms at ${now.toISOString()}`
    );
  },
  start: false,
  timeZone: SYSTEM_TIME_ZONE
});

export default job;
