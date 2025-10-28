// Importando bee-queue para filas
import BeeQueue from "bee-queue";

// Importando dotenv para utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// Importando interfaces implementadas e usecase
// (Mova as instâncias para fora do 'process')
import { FindReservationByIdRepository } from "../../../../infrastruture/repository/reservation/FindReservationByIdRepository"; // Ajuste o path se necessário
import { UpdateReservationRepository } from "../../../../infrastruture/repository/reservation/UpdateReservationRepository"; // Ajuste o path se necessário
import { ExpiredReservationUseCase } from "../../../../application/usecases/reservation/ExpiredReservationUseCase"; // Ajuste o path se necessário
// Importe sua instância do Prisma Client (ou como você gerencia a conexão DB)
// import { prismaClient } from '../../../../database'; // Exemplo

console.log("--- 🚀 Iniciando Worker de Reservas ---");

// --- 1. Configuração Redis ---
const redisHost = process.env.REDIS_HOST_LOCAL || "127.0.0.1"; // Usa localhost como fallback
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisConfig = {
  host: redisHost,
  port: redisPort,
};
console.log(
  `[Worker Reserva] Conectando ao Redis em ${redisHost}:${redisPort}`
);

// --- 2. Instâncias Criadas UMA VEZ (Fora do 'process') ---
// Crie as instâncias dos repositórios passando a conexão do banco (ex: prismaClient)
// Se seus repositórios não precisam de injeção, apenas instancie: new Find...()
const findReservationByIdRepository =
  new FindReservationByIdRepository(/* prismaClient */);
const updateReservationRepository =
  new UpdateReservationRepository(/* prismaClient */);

// Instancia o Use Case com os repositórios
const expiredReservationUseCase = new ExpiredReservationUseCase(
  findReservationByIdRepository,
  updateReservationRepository
);
// --------------------------------------------------------

// --- 3. Instância da Fila ---
const queueName = "reservation-queue"; // Nome da fila (deve ser o mesmo usado na API)
const reservationWorkerQueue = new BeeQueue(queueName, {
  redis: redisConfig,
  isWorker: true, // Indica que esta instância processará jobs
  // Opções adicionais úteis para workers:
  removeOnSuccess: true, // Remove jobs da fila após sucesso
  removeOnFailure: false, // Mantém jobs falhados na fila para inspeção (ou define um número)
  stallInterval: 5000,
});
// ----------------------------

// --- 4. Lógica de Processamento ---
reservationWorkerQueue.process(async (job) => {
  const { reservationId, expectedStatus } = job.data;

  // Log inicial (bom ter timestamp)
  console.log(
    `[Worker Reserva][${new Date().toLocaleTimeString()}] ⏳ Iniciando job para Reserva ID: ${reservationId}`
  );

  try {
    // Chama o Use Case (já instanciado)
    await expiredReservationUseCase.execute({ reservationId, expectedStatus });

    // Log de Sucesso
    console.log(
      `[Worker Reserva][${new Date().toLocaleTimeString()}] ✅ Job concluído para Reserva ID: ${reservationId}`
    );
  } catch (err: any) {
    // --- 5. Tratamento de Erro Melhorado ---
    // Loga o erro COMPLETO
    console.error(
      `[Worker Reserva][${new Date().toLocaleTimeString()}] ❌ ERRO ao processar Reserva ID: ${reservationId}`,
      err
    );
    // Lança o erro novamente para que Bee-Queue saiba que falhou
    // Isso permite retentativas (se configuradas) ou marca o job como falhado.
    throw err;
    // ------------------------------------
  }
});
// ----------------------------

// --- 6. Eventos da Fila (Opcional, mas útil para monitoramento) ---
reservationWorkerQueue.on("ready", () => {
  console.log(
    `[Worker Reserva] ✅ Pronto e ouvindo a fila "${queueName}" no Redis.`
  );
});

reservationWorkerQueue.on("error", (err) => {
  console.error(
    `[Worker Reserva] ❌ Erro GERAL na fila "${queueName}":`,
    err.message
  );
});

reservationWorkerQueue.on("failed", (job, err) => {
  console.error(
    `[Worker Reserva] ⚠️ Job ${job.id} (Reserva ${job.data.reservationId}) FALHOU:`,
    err.message
  );
});

reservationWorkerQueue.on("succeeded", (job, result) => {
  // Já logamos o sucesso dentro do try, mas pode adicionar mais detalhes aqui se quiser
  // console.log(`[Worker Reserva] Job ${job.id} (Reserva ${job.data.reservationId}) bem-sucedido.`);
});
// -------------------------------------------------------------

console.log(
  `[Worker Reserva] Worker configurado para a fila "${queueName}". Aguardando conexão e jobs...`
);

// Opcional: Lógica para fechar conexões graciosamente ao encerrar o worker (Ctrl+C)
// process.on('SIGINT', async () => {
//   console.log('[Worker Reserva] Encerrando worker...');
//   await reservationWorkerQueue.close();
//   // Feche conexão com DB (prismaClient.$disconnect()) se necessário
//   console.log('[Worker Reserva] Worker encerrado.');
//   process.exit(0);
// });
