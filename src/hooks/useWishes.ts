import { useEffect, useState } from "react";

export interface Wish {
  /** Guest's display name */
  name: string;
  /** "groom" / "bride" / "" — used for theming the card accent */
  side: string;
  /** The Lời chúc message body */
  note: string;
  /** ISO timestamp of when the wish was recorded */
  timestamp: string;
}

interface WishesPayload {
  ok: boolean;
  wishes?: Wish[];
}

interface State {
  wishes: Wish[];
  loading: boolean;
  error: boolean;
}

const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT;
const MOCK = import.meta.env.VITE_RSVP_MOCK === true;
const POLL_MS = 60_000; // refetch every 60 s so live submissions appear during the day

// Sample wishes used when VITE_RSVP_MOCK=1 — lets the overlay UI be previewed
// without standing up the Apps Script backend. Cover both sides, both
// attending statuses, and varied note lengths so the layout is exercised.
const MOCK_WISHES: Wish[] = [
  {
    name: "Nguyễn Minh Anh",
    side: "bride",
    note: "Chúc Hà & Hiền trăm năm hạnh phúc, đầu bạc răng long! Mình rất mong chờ ngày đặc biệt này.",
    timestamp: "2026-05-09T08:30:00.000Z",
  },
  {
    name: "Trần Quang Huy",
    side: "groom",
    note: "Chúc mừng anh chị! Hẹn gặp ở Bắc Ninh nhé.",
    timestamp: "2026-05-08T14:12:00.000Z",
  },
  {
    name: "Lê Thị Hương",
    side: "bride",
    note: "Tiếc quá mình không về kịp được. Gửi cả nhà thật nhiều yêu thương — chúc hai bạn một đám cưới thật rực rỡ và một đời an yên bên nhau ❤️",
    timestamp: "2026-05-08T10:05:00.000Z",
  },
  {
    name: "Phạm Văn Đức",
    side: "groom",
    note: "Chúc hai bạn luôn yêu thương và thấu hiểu nhau. Cười nhiều, giận ít, mỗi ngày là một ngày mới.",
    timestamp: "2026-05-07T19:48:00.000Z",
  },
  {
    name: "Vũ Thanh Mai",
    side: "bride",
    note: "Sẽ có mặt ngày 30/05! Chuẩn bị áo dài rồi đây 🥰",
    timestamp: "2026-05-07T11:20:00.000Z",
  },
];

/**
 * Fetches the public wishes feed from the Apps Script GET endpoint and
 * polls periodically. Only returns wishes that have a name + a non-empty
 * note (the script enforces this; we filter again as a belt-and-braces).
 */
export function useWishes(): State {
  const [state, setState] = useState<State>(() => {
    if (MOCK) return { wishes: MOCK_WISHES, loading: false, error: false };
    return { wishes: [], loading: Boolean(ENDPOINT), error: false };
  });

  useEffect(() => {
    if (MOCK) return; // Mock mode is static — skip the network entirely.
    if (!ENDPOINT) return;

    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const tick = async () => {
      try {
        const url = `${ENDPOINT}${
          ENDPOINT.includes("?") ? "&" : "?"
        }action=wishes`;
        const res = await fetch(url, { signal: controller.signal });
        const data = (await res.json()) as WishesPayload;
        if (cancelled) return;
        const wishes = (data.wishes ?? []).filter((w) => w.name && w.note);
        setState({ wishes, loading: false, error: false });
      } catch (err) {
        if (cancelled || (err as { name?: string }).name === "AbortError")
          return;
        setState((prev) => ({ ...prev, loading: false, error: true }));
      } finally {
        if (!cancelled) timer = setTimeout(tick, POLL_MS);
      }
    };

    tick();

    return () => {
      cancelled = true;
      controller.abort();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return state;
}
