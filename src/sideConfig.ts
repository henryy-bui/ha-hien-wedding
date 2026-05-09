export type Side = 'groom' | 'bride' | 'combined'

export interface VenueData {
  name: string
  address: string
  coords: string
  details: string[]
}

export interface SideData {
  /** First line of Hero — e.g. "Nhà Trai trân trọng kính mời..." */
  invitationFrom: string
  /** Ceremony name shown in WeddingDetails — "Lễ Thành Hôn" / "Lễ Vu Quy" / "Lễ Thành Hôn" */
  eventName: string
  ceremonyTime: string
  receptionTime: string
  venue: VenueData
}

export const SIDE_CONFIG: Record<Side, SideData> = {
  groom: {
    invitationFrom: 'Nhà Trai trân trọng kính mời bạn đến tham dự lễ cưới của',
    eventName: 'Lễ Thành Hôn',
    ceremonyTime: '10:00 sáng',
    receptionTime: '11:30 sáng',
    venue: {
      name: 'Tư gia Nhà Trai',
      address: 'Xóm Chẽ, Trường Sơn, Lục Nam, Bắc Ninh',
      coords: '21.2409791,106.5760376',
      details: [],
    },
  },
  bride: {
    invitationFrom: 'Nhà Gái trân trọng kính mời bạn đến tham dự lễ cưới của',
    eventName: 'Lễ Vu Quy',
    ceremonyTime: '8:00 sáng',
    receptionTime: '10:00 sáng',
    venue: {
      name: 'Tư gia Nhà Gái',
      // TODO: replace with bride family's actual address + coordinates
      address: '[Cập nhật địa chỉ nhà gái]',
      coords: '21.2409791,106.5760376',
      details: [],
    },
  },
  combined: {
    invitationFrom: 'Trân trọng kính mời bạn đến tham dự lễ cưới của',
    eventName: 'Lễ Thành Hôn',
    ceremonyTime: '10:00 sáng',
    receptionTime: '11:30 sáng',
    venue: {
      name: 'Tại gia đình chúng tôi',
      address: 'Xóm Chẽ, Trường Sơn, Lục Nam, Bắc Ninh',
      coords: '21.2409791,106.5760376',
      details: [],
    },
  },
}
