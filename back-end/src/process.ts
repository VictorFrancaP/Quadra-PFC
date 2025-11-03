// Importando cronjob para executar tarefa
import { startEmailCronJob } from "./shared/providers/jobs/scheduler/startEmailCronJob";

// chamando cron job
startEmailCronJob();
