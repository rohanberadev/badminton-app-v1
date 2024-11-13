import { create } from "zustand";

type Player = {
  id: string;
  name: string;
  points: number;
};

interface MatchStoreState {
  matchStarted: boolean;
  setMatchStarted: (matchStarted: boolean) => void;
  matchType: "DUMMY" | "OFFICIAL";
  setMatchType: (type: "DUMMY" | "OFFICIAL") => void;
  player1: Player | null;
  setPlayer1: (player: Player) => void;
  incrementPlayer1Point: () => void;
  decrementPlayer1Point: () => void;
  player2: Player | null;
  setPlayer2: (player: Player) => void;
  incrementPlayer2Point: () => void;
  decrementPlayer2Point: () => void;
  resetMatch: () => void;
  initialTarget: number;
  initializeTarget: (target: number) => void;
  target: number;
  setTarget: (target: number) => void;
  status: "Ongoing" | "Complete";
  setStatus: (status: "Ongoing" | "Complete") => void;
  resetPoints: () => void;
  winner: string | null;
  loser: string | null;
  setWinner: (id: string) => void;
  setLoser: (id: string) => void;
  setPlayer1Points: (points: number) => void;
  setPlayer2Points: (points: number) => void;
}

export const matchStore = create<MatchStoreState>((set) => ({
  matchStarted: false,

  setMatchStarted: (matchStarted: boolean) =>
    set((state) => ({ ...state, matchStarted: matchStarted })),

  matchType: "OFFICIAL",

  setMatchType: (type: "DUMMY" | "OFFICIAL") =>
    set((state) => ({ ...state, matchType: type })),

  player1: null,

  setPlayer1: (player: Player) =>
    set((state) => ({
      ...state,
      player1: { id: player.id, name: player.name, points: player.points },
    })),

  incrementPlayer1Point: () =>
    set((state) => ({
      player1: { ...state.player1!, points: state.player1?.points! + 1 },
    })),

  decrementPlayer1Point: () =>
    set((state) => ({
      ...state,
      player1: { ...state.player1!, points: state.player1?.points! - 1 },
    })),

  player2: null,

  setPlayer2: (player: Player) =>
    set((state) => ({
      ...state,
      player2: { id: player.id, name: player.name, points: player.points },
    })),

  incrementPlayer2Point: () =>
    set((state) => ({
      ...state,
      player2: { ...state.player2!, points: state.player2?.points! + 1 },
    })),

  decrementPlayer2Point: () =>
    set((state) => ({
      ...state,
      player2: { ...state.player2!, points: state.player2?.points! - 1 },
    })),

  initialTarget: 11,

  target: 11,

  resetMatch: () =>
    set((state) => ({
      ...state,
      matchStarted: false,
      player1: null,
      player2: null,
      status: "Ongoing",
      winner: null,
      loser: null,
    })),

  setTarget: (target: number) => set((state) => ({ ...state, target: target })),

  initializeTarget: (target: number) =>
    set((state) => ({ target: target, initialTarget: target })),

  status: "Ongoing",

  setStatus: (status: "Ongoing" | "Complete") =>
    set((state) => ({ status: status })),

  resetPoints: () =>
    set((state) => ({
      player1: { ...state.player1!, points: 0 },
      player2: { ...state.player2!, points: 0 },
      target: state.initialTarget,
    })),

  winner: null,
  loser: null,
  setWinner: (id: string) => set((state) => ({ winner: id })),
  setLoser: (id: string) => set((state) => ({ loser: id })),
  setPlayer1Points: (points: number) =>
    set((state) => ({ player1: { ...state.player1!, points: points } })),

  setPlayer2Points: (points: number) =>
    set((state) => ({ player2: { ...state.player2!, points: points } })),
}));
