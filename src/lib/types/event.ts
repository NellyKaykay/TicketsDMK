export interface Venue {
  id: string;
  name: string;
  city?: string;
  address?: string;
}

export interface TicketType {
  id: string;
  name: string;
  price_cents: number;
  currency: string;
  capacity: number;
  sold: number;
  sort_order?: number;
  color?: string;
  zone_code?: string;
}

export interface EventItem {
  id: string;
  title: string;
  artist?: string;
  date?: string;
  description?: string;
  flyer_url?: string;
  venue_id?: string | null;
  venues?: Venue[];
  ticket_types?: TicketType[];
  layout?: {
    zones?: any[];
    [key: string]: any;
  } | any[];
}

export interface SelectedSeat {
  id: string;
  zone_code: string;
  row: string;
  seat_number: number;
}

export interface EventResponse {
  event: EventItem;
}
