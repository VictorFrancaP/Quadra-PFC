import { describe, it, expect, vi, beforeEach } from "vitest";
import { JoinChatUseCase } from "../../../../src/application/usecases/chat/JoinChatUseCase";
import { ChatNotFoundError } from "../../../../src/shared/errors/chat-error/ChatNotFoundError";
import { AccessDeniedChatError } from "../../../../src/shared/errors/chat-error/AccessDeniedChatError";
import { Chat } from "../../../../src/domain/entities/Chat";

const mockUserId = "user-requester-id";
const mockChatId = "valid-chat-room-id";

const mockChatValid = {
  id: mockChatId,
  participantIds: [mockUserId, "other-id"],
};
const mockChatUnauthorized = {
  id: "unauth-chat",
  participantIds: ["rogue-id", "other-id"],
};
const mockFindChatByIdRepository = { findChatById: vi.fn() };

let joinChatUseCase: JoinChatUseCase;

describe("JoinChatUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindChatByIdRepository.findChatById.mockResolvedValue(
      mockChatValid as Chat
    );

    joinChatUseCase = new JoinChatUseCase(mockFindChatByIdRepository);
  });

  it("deve resolver com sucesso (void) se o chat for encontrado e o usuário for participante", async () => {
    const mockRequest = { userId: mockUserId, chatId: mockChatId };

    await expect(joinChatUseCase.execute(mockRequest)).resolves.toBeUndefined();

    expect(mockFindChatByIdRepository.findChatById).toHaveBeenCalledWith(
      mockChatId
    );
  });

  it("deve lançar ChatNotFoundError se o chat não for encontrado", async () => {
    mockFindChatByIdRepository.findChatById.mockResolvedValue(null);
    const mockRequest = { userId: mockUserId, chatId: "invalid-chat-id" };
    await expect(joinChatUseCase.execute(mockRequest)).rejects.toThrow(
      ChatNotFoundError
    );
  });

  it("deve lançar AccessDeniedChatError se o usuário NÃO for participante do chat", async () => {
    mockFindChatByIdRepository.findChatById.mockResolvedValue(
      mockChatUnauthorized as Chat
    );
    const mockRequest = { userId: mockUserId, chatId: mockChatId };
    await expect(joinChatUseCase.execute(mockRequest)).rejects.toThrow(
      AccessDeniedChatError
    );
  });

  it("deve lançar AccessDeniedChatError se o array participantIds estiver vazio (usuário é o único, mas não está listado)", async () => {
    mockFindChatByIdRepository.findChatById.mockResolvedValue({
      id: mockChatId,
      participantIds: [],
    } as Chat);
    const mockRequest = { userId: mockUserId, chatId: mockChatId };
    await expect(joinChatUseCase.execute(mockRequest)).rejects.toThrow(
      AccessDeniedChatError
    );
  });
});
