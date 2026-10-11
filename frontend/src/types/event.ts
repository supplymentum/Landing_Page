export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  status: "PRÓXIMO" | "PASADO";
  imageUrl: string;
  description: string;
  registrationLink?: string;
}
