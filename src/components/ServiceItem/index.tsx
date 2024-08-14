import React from "react";
import { serviceProps } from "../Service/index.tsx";
import { formartPrice } from "../../utils/helper.tsx";

interface Props {
  item: serviceProps;
}
export default function ServiceItems({ item }: Props): React.JSX.Element {
  return (
    <div className="relative">
      <img
        src={item.image}
        className="object-contain w-[100%] rounded-3xl border-text border-[5px]"
      />
      <div className="absolute  flex justify-center w-[100%] h-fit transform -translate-y-1/2">
        <div className="bg-gradient-to-r from-[#772880] to-[#ed0761] w-fit px-10 py-2 rounded-full self-center origin-center">
          <p className="text-center animate-pulse text-text font-bold">
            {formartPrice(item.price)}
          </p>
        </div>
      </div>
      <p className="text-center mt-6 font-semibold text-text">{item.name}</p>
    </div>
  );
}
