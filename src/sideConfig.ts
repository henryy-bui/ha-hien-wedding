export type Side = "groom" | "bride" | "combined";

export interface VenueData {
  name: string;
  address: string;
  coords: string;
  details: string[];
}

export interface SideData {
  /** First line of Hero — e.g. "Nhà Trai trân trọng kính mời..." */
  invitationFrom: string;
  /** Ceremony name shown in WeddingDetails — "Lễ Thành Hôn" / "Lễ Vu Quy" / "Lễ Thành Hôn" */
  eventName: string;
  ceremonyTime: string;
  receptionTime: string;
  venue: VenueData;
}

export const SIDE_CONFIG: Record<Side, SideData> = {
  groom: {
    invitationFrom: "LỄ THÀNH HÔN",
    eventName: "Lễ Thành Hôn",
    ceremonyTime: "11:00 sáng",
    receptionTime: "11:30 sáng",
    venue: {
      name: "Tư gia Nhà Trai",
      address: "Xóm Chẽ, Trường Sơn, Lục Nam, Bắc Ninh",
      coords: "21.2409791,106.5760376",
      details: [],
    },
  },
  bride: {
    invitationFrom: "LỄ VU QUY",
    eventName: "Lễ Vu Quy",
    ceremonyTime: "8:00 sáng",
    receptionTime: "10:00 sáng",
    venue: {
      name: "Tư gia Nhà Gái",
      address: "Thị Trấn Hưng Nhân, Hưng Hà, Thái Bình",
      coords: "20.61588, 106.1453",
      details: [],
    },
  },
  combined: {
    invitationFrom: "Trân trọng kính mời bạn đến tham dự lễ cưới của chúng tôi",
    eventName: "Lễ Thành Hôn",
    ceremonyTime: "10:00 sáng",
    receptionTime: "11:30 sáng",
    venue: {
      name: "Tại gia đình chúng tôi",
      address: "Xóm Chẽ, Trường Sơn, Lục Nam, Bắc Ninh",
      coords: "21.2409791,106.5760376",
      details: [],
    },
  },
};
