export type Side = "groom" | "bride" | "combined";

export interface VenueData {
  name: string;
  address: string;
  coords: string;
  details: string[];
  oldAddress?: string;
}

export interface EventData {
  /** Display name shown in the details card (e.g., "Lễ Thành Hôn", "Tiệc Cưới"). */
  name: string;
  /** Day of month in May 2026 — used by WeddingCalendar to highlight cells. */
  day: number;
  /** Short weekday label rendered next to the time (e.g., "T7", "CN"). */
  weekday: string;
  /** Vietnamese long form for the calendar caption (e.g., "Thứ Bảy, 30.05.2026"). */
  dateLabel: string;
  /** Start time as displayed (e.g., "16:00 chiều"). */
  time: string;
}

export interface SideData {
  /** First line of Hero — e.g. "LỄ THÀNH HÔN" / "LỄ VU QUY" */
  invitationFrom: string;
  /** Chronological events this side's guests are invited to. */
  events: EventData[];
  venue: VenueData;
  groomBrideNames: string[];
}

export const SIDE_CONFIG: Record<Side, SideData> = {
  groom: {
    invitationFrom: "LỄ THÀNH HÔN",
    events: [
      {
        name: "Lễ Thành Hôn",
        day: 31,
        weekday: "CN",
        dateLabel: "Chủ Nhật, 31.05.2026",
        time: "11:00 sáng",
      },
      {
        name: "Tiệc Mừng",
        day: 31,
        weekday: "CN",
        dateLabel: "Chủ Nhật, 31.05.2026",
        time: "11:30 sáng",
      },
    ],
    venue: {
      name: "Tư gia Nhà Trai",
      address: "Xóm Chẽ, Trường Sơn, Bắc Ninh (Bắc Giang cũ)",
      coords: "21.2409791,106.5760376",
      details: [],
    },
    groomBrideNames: ["Văn Hà", "Thanh Hiền"],
  },
  bride: {
    invitationFrom: "LỄ VU QUY",
    events: [
      {
        name: "Tiệc Cưới",
        day: 30,
        weekday: "T7",
        dateLabel: "Thứ Bảy, 30.05.2026",
        time: "16:00 chiều",
      },
      {
        name: "Lễ Vu Quy",
        day: 31,
        weekday: "CN",
        dateLabel: "Chủ Nhật, 31.05.2026",
        time: "7:00 sáng",
      },
    ],
    venue: {
      name: "Tư gia Nhà Gái",
      address: "TDP Thị An, Tiền Phong, xã Long Hưng, tỉnh Hưng Yên",
      oldAddress: "Thị trấn Hưng Nhân, Thái Bình cũ",
      coords: "20.61588, 106.1453",
      details: [],
    },
    groomBrideNames: ["Thanh Hiền", "Văn Hà"],
  },
  combined: {
    invitationFrom: "Trân trọng kính mời bạn đến tham dự lễ cưới của chúng tôi",
    events: [
      {
        name: "Lễ Thành Hôn",
        day: 31,
        weekday: "CN",
        dateLabel: "Chủ Nhật, 31.05.2026",
        time: "10:00 sáng",
      },
      {
        name: "Tiệc Mừng",
        day: 31,
        weekday: "CN",
        dateLabel: "Chủ Nhật, 31.05.2026",
        time: "11:30 sáng",
      },
    ],
    venue: {
      name: "Tại gia đình chúng tôi",
      address: "Xóm Chẽ, Trường Sơn, Lục Nam, Bắc Ninh",
      coords: "21.2409791,106.5760376",
      details: [],
    },
    groomBrideNames: ["Văn Hà", "Thanh Hiền"],
  },
};
