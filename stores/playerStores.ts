import { create } from "zustand";

export type Player = {
  id: string;
  rank: number;
  name: string;
  currentRating: number;
  previousRating: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
};

interface PlayerStoreState {
  players: Array<Player>;
  addPlayer: (player: Player) => void;
  editPlayerName: (id: string, name: string) => void;
  setPlayers: (players: Array<Player> | any) => void;
}

export const playerStore = create<PlayerStoreState>((set) => ({
  players: [],

  addPlayer: (player: Player) =>
    set((state) => ({ players: [...state.players!, player] })),

  editPlayerName: (id: string, name: string) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.id === id ? { ...player, name: name } : player
      ),
    })),

  setPlayers: (players: Array<Player> | any) =>
    set((state) => ({ players: players })),
}));
