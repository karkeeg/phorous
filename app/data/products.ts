export type Product = {
  id: string;
  name: string;
  variant: string;
  price: number;
  gsm: number;
  image: string;
  alt: string;
};

export const products: Product[] = [
  {
    id: "heavyweight-crew-ink",
    name: "The Heavyweight Crew",
    variant: "Ink",
    price: 88,
    gsm: 300,
    image: "/assets/4e13f1be-0714-4987-99c5-f7e7a91d8a44.jpg",
    alt: "Ink heavyweight crew tee, flat lay",
  },
  {
    id: "field-tee-sage",
    name: "The Field Tee",
    variant: "Dry Sage",
    price: 78,
    gsm: 240,
    image: "/assets/bb5f034c-21be-4b4a-a2a6-8f5aabccd1b9.jpg",
    alt: "Sage and ink tees with raw cotton sprigs",
  },
  {
    id: "box-cut-bone",
    name: "The Box Cut",
    variant: "Bone",
    price: 84,
    gsm: 280,
    image: "/assets/5894605f-3742-4fcc-8db1-a7e264d40afb.jpg",
    alt: "Bone box-cut tee, flat lay",
  },
  {
    id: "everyday-crew-stone",
    name: "The Everyday Crew",
    variant: "Stone",
    price: 76,
    gsm: 260,
    image: "/assets/1a6022ef-7c66-411e-b784-23b0333f39cd.jpg",
    alt: "Stone everyday crew tee",
  },
  {
    id: "weekend-crew-charcoal",
    name: "The Weekend Crew",
    variant: "Charcoal",
    price: 82,
    gsm: 320,
    image: "/assets/4e13f1be-0714-4987-99c5-f7e7a91d8a44.jpg",
    alt: "Charcoal weekend crew tee, flat lay",
  },
  {
    id: "studio-tee-olive",
    name: "The Studio Tee",
    variant: "Olive",
    price: 80,
    gsm: 250,
    image: "/assets/bb5f034c-21be-4b4a-a2a6-8f5aabccd1b9.jpg",
    alt: "Olive studio tee, flat lay",
  },
  {
    id: "relaxed-cut-chalk",
    name: "The Relaxed Cut",
    variant: "Chalk",
    price: 86,
    gsm: 270,
    image: "/assets/5894605f-3742-4fcc-8db1-a7e264d40afb.jpg",
    alt: "Chalk relaxed-cut tee, flat lay",
  },
  {
    id: "standard-crew-clay",
    name: "The Standard Crew",
    variant: "Clay",
    price: 74,
    gsm: 265,
    image: "/assets/1a6022ef-7c66-411e-b784-23b0333f39cd.jpg",
    alt: "Clay standard crew tee",
  },
];
