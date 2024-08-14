import React from "react";
import { PromotionProps } from "../Promotion";

interface Props {
    item: PromotionProps;
}
function PromotionItem({item}: Props): React.JSX.Element {
  return <div>
    <img
        src={item.image}
        alt="Khuyễn Mãi"
        className="mx-2 rounded-2xl w-[300px] h-[300px]"
    />
  </div>;
}

export default PromotionItem;
