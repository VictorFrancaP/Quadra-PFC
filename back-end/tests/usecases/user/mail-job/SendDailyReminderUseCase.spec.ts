import { describe, it, expect, vi, beforeEach } from "vitest";
import { SendDailyReminderUseCase } from "../../../../src/application/usecases/user/mail-job/SendDailyReminderUseCase";
import { emailQueue } from "../../../../src/shared/providers/jobs/queues/email-queue";

const mockFindUserOwnersRepository = {
  findUserOwners: vi.fn(),
};

const mockFindSoccerOwnerRepository = {
  findSoccerOwner: vi.fn(),
};

type MockOwner = { id: string; email: string; name: string };

const owner1: MockOwner = {
  id: "owner-1",
  email: "owner1@mail.com",
  name: "Alice",
};
const owner2: MockOwner = {
  id: "owner-2",
  email: "owner2@mail.com",
  name: "Bob",
};
const owner3: MockOwner = {
  id: "owner-3",
  email: "owner3@mail.com",
  name: "Charlie",
};

let sendDailyReminderUseCase: SendDailyReminderUseCase;

vi.spyOn(emailQueue, "add").mockImplementation(vi.fn());

const emailQueueAddSpy = vi.mocked(emailQueue.add);

describe("SendDailyReminderUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    sendDailyReminderUseCase = new SendDailyReminderUseCase(
      mockFindUserOwnersRepository,
      mockFindSoccerOwnerRepository
    );
  });

  it("deve enviar o lembrete apenas para proprietários com quadras ATIVAS", async () => {
    mockFindUserOwnersRepository.findUserOwners.mockResolvedValue([
      owner1,
      owner2,
      owner3,
    ]);

    mockFindSoccerOwnerRepository.findSoccerOwner.mockImplementation(
      async (ownerId) => {
        if (ownerId === owner1.id) {
          return {
            id: "s1",
            isActive: true,
            userName: "Quadra Alice",
            userId: owner1.id,
          };
        }
        if (ownerId === owner3.id) {
          return {
            id: "s3",
            isActive: false,
            userName: "Quadra Charlie",
            userId: owner3.id,
          };
        }
        return null;
      }
    );

    await sendDailyReminderUseCase.execute();

    expect(mockFindSoccerOwnerRepository.findSoccerOwner).toHaveBeenCalledTimes(
      3
    );

    expect(emailQueueAddSpy).toHaveBeenCalledTimes(1);

    expect(emailQueueAddSpy).toHaveBeenCalledWith(
      "send-mail",
      expect.objectContaining({ email: owner1.email, name: "Quadra Alice" })
    );
  });

  it("não deve fazer nada se nenhum proprietário for encontrado", async () => {
    mockFindUserOwnersRepository.findUserOwners.mockResolvedValue([]);

    await sendDailyReminderUseCase.execute();

    expect(
      mockFindSoccerOwnerRepository.findSoccerOwner
    ).not.toHaveBeenCalled();
    expect(emailQueueAddSpy).not.toHaveBeenCalled();
  });

  it("deve continuar o loop e pular proprietários sem quadra ou com quadra inativa", async () => {
    mockFindUserOwnersRepository.findUserOwners.mockResolvedValue([
      owner1,
      owner2,
    ]);
    mockFindSoccerOwnerRepository.findSoccerOwner.mockImplementation(
      async (ownerId) => {
        if (ownerId === owner1.id) {
          return {
            id: "s1",
            isActive: true,
            userName: "Quadra Alice",
            userId: owner1.id,
          };
        }
        return null;
      }
    );

    await sendDailyReminderUseCase.execute();

    expect(mockFindSoccerOwnerRepository.findSoccerOwner).toHaveBeenCalledTimes(
      2
    );

    expect(emailQueueAddSpy).toHaveBeenCalledTimes(1);
    expect(emailQueueAddSpy).toHaveBeenCalledWith(
      "send-mail",
      expect.objectContaining({ email: owner1.email })
    );
  });
});
