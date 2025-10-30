export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Aurora Lamp",
    price: 129000,
    image: "/gambar1.jpg",
    description: "Lampu dekorasi modern dengan cahaya lembut dan elegan."
  },
  {
    id: 2,
    name: "Velvet Chair",
    price: 349000,
    image: "/gambar2.jpg",
    description: "Kursi beludru mewah dengan desain minimalis dan nyaman."
  },
  {
    id: 3,
    name: "Marble Vase",
    price: 89000,
    image: "/gambar3.jpg",
    description: "Vas marmer bergaya skandinavia, cocok untuk ruang tamu."
  },
  {
    id: 4,
    name: "Desk Organizer",
    price: 59000,
    image: "/gambar4.jpg",
    description: "Organizer meja kayu solid, menyimpan alat kerja dengan rapi."
  },
  {
    id: 5,
    name: "Nordic Clock",
    price: 179000,
    image: "/gambar5.jpg",
    description: "Jam dinding gaya nordic dengan warna netral dan elegan."
  },
  {
    id: 6,
    name: "Canvas Art",
    price: 259000,
    image: "/gambar6.jpg",
    description: "Lukisan kanvas bergaya abstrak untuk mempercantik ruangan."
  },
  {
    id: 7,
    name: "Cozy Blanket",
    price: 199000,
    image: "/gambar7.jpg",
    description: "Selimut tebal dengan tekstur lembut dan hangat."
  },
  {
    id: 8,
    name: "Wooden Tray",
    price: 79000,
    image: "/gambar8.jpg",
    description: "Nampan kayu alami serbaguna dengan desain klasik."
  },
  {
    id: 9,
    name: "Aroma Diffuser",
    price: 159000,
    image: "/gambar9.jpg",
    description: "Penyebar aroma ruangan dengan desain modern minimalis."
  },
  {
    id: 10,
    name: "Minimal Mug",
    price: 69000,
    image: "/gambar10.jpg",
    description: "Cangkir keramik matte bergaya minimalis."
  }
];
