import { z } from "zod";
import { slugSchema } from "../../shared/api/schemas";

export const VOTES_STORAGE_KEY = "tsim:votes:v1";

// Zod çok değerli literal için z.union veya z.enum(sadece string) kullanılır.
// 1|2|3|4|5 tipini güvenli elde etmek için union yazıyoruz:
export const starsSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
export type Stars = z.infer<typeof starsSchema>;

export const myVotesSchema = z.record(slugSchema, starsSchema);
export type MyVotes = Readonly<z.infer<typeof myVotesSchema>>;

export type VoteAction =
  | { type: "voted"; itemId: string; stars: Stars }
  | { type: "vote_removed"; itemId: string }
  | { type: "all_cleared" };

function assertNever(x: never): never {
  throw new Error(`Beklenmeyen action türü: ${JSON.stringify(x)}`);
}

export function votesReducer(state: MyVotes, action: VoteAction): MyVotes {
  switch (action.type) {
    case "voted": {
      // Oy zaten aynıysa state'i bozma
      if (state[action.itemId] === action.stars) return state;
      return { ...state, [action.itemId]: action.stars };
    }
    case "vote_removed": {
      //  Silinecek öğe zaten yoksa state'i bozma
      if (!(action.itemId in state)) return state;

      const newState = { ...state };
      delete newState[action.itemId];
      return newState;
    }
    case "all_cleared": {
      // Zaten boşsa yeni boş nesne üretme
      if (Object.keys(state).length === 0) return state;
      return {};
    }
    default:
      return assertNever(action);
  }
}
