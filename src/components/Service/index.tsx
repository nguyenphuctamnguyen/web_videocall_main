import React from "react";
import { images } from "../../assets/index.tsx";
import ServiceItems from "../ServiceItem/index.tsx";

const dataService: any = [
  {
    name: "Dịch vụ 1",
    id: 1,
    image: images.dv2,
    price: 199000,
  },
  {
    name: "Dịch vụ 2",
    id: 1,
    image: images.dv3,
    price: 199000,
  },
  {
    name: "Dịch vụ 3",
    id: 1,
    image: images.dv2,
    price: 199000,
  },
  {
    name: "Dịch vụ 4",
    id: 1,
    image: images.dv3,
    price: 199000,
  },
  {
    name: "Dịch vụ 5",
    id: 1,
    image: images.dv2,
    price: 199000,
  },
  {
    name: "Dịch vụ 6",
    id: 1,
    image: images.dv3,
    price: 199000,
  },
  {
    name: "Dịch vụ 7",
    id: 1,
    image: images.dv2,
    price: 199000,
  },
  {
    name: "Dịch vụ 8",
    id: 1,
    image: images.dv3,
    price: 199000,
  },
];

export type serviceProps = {
  name: string;
  price: number;
  id: number;
  image: string;
};

export default function ServiceComponent(): React.JSX.Element {
  const renderService = (item: serviceProps, index: number) => {
    return <ServiceItems item={item} key={index} />;
  };

  return (
    <div className="mt-20">
      <h1
        className="text-center
        text-5xl
        bg-gradient-to-b
        from-text 
        to-[#57511d] 
        text-transparent 
        bg-clip-text
        font-bold
        "
      >
        TOP DỊCH VỤ DƯỢC YÊU THÍCH
      </h1>

      <div className="grid-cols-4 grid gap-10 mt-10 mx-20">{dataService.map(renderService)}</div>
    </div>
  );
}
