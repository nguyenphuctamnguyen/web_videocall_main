import React from "react";
import { images } from "../../assets/index.tsx";

const listTabHeader: any = [
  { title: "Giới thiệu", id: 1 },
  { title: "Ưu đãi", id: 2 },
  { title: "Công nghệ", id: 3 },
  { title: "Khách hàng", id: 4 },
  { title: "Khuyến mãi", id: 5 },
  { title: "Dịch vụ", id: 6 },
];
type TabProps = {
  title: string;
  id: number;
};



export default function HeaderComponent() {
  const renderListTab = (item: TabProps, index: number) => {
    return (
      <button className="mx-10" key={index}>
        <span className="text-text">{item.title}</span>
      </button>
    );
  };
  return (
    <div className="bg-white px-20 shadow-lg flex items-center">
      <img src={images.logo} className="w-[60px] h-[60px]" />
      <div className="flex flex-1 justify-center">{listTabHeader.map(renderListTab)}</div>
    </div>
  );
}
