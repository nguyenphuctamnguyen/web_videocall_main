import React from "react";
import { images } from "../../assets/index.tsx";

function HeroComponent(): React.JSX.Element {
  return (
    <div>
      <div className="text-center mt-20 ">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-text to-[#57511d]">
          HOAI THUONG
        </h1>
        <span>Beauty Academy</span>
      </div>

      <div className="flex mx-20 text-base mt-10">
        <div>
          <p className="flex-1 mr-20 leading-loose">
            Hoai Thuong Beauty là thương hiệu uy tín, chất lượng với hơn 80 chi
            nhánh trong và ngoài nước. Hoai Thuong Beauty đi đầu trong ngành Làm
            đẹp- Thẩm mỹ.
          </p>
          <br/>
          <p className="flex-1 mr-20 leading-loose">
            Hoai Thuong Beauty không ngừng cập nhật những xu hướng mới nhất từ
            các nước phát triển, ứng dụng thành công tại Việt Nam Thương hiệu
            xây dựng hệ thống cơ sở vật chất sang trọng, đẳng cấp với phòng dịch
            vụ tiêu chuẩn 5 sao, phòng chờ khách vip thoải mái, tiện nghi. Cùng
            với hội đồng bác sĩ chuyên khoa giàu kinh nghiệm, Seoul Center cam
            kết đem lại những trải nghiệm làm đẹp tốt nhất, tạo dựng niềm tin
            cho hàng triệu khách hàng.
          </p>

          <button className="bg-[#F0E68C] px-20 py-5 rounded-lg mt-5 text-white">
            Đặt lịch ngay
          </button>
        </div>
        <img src={images.spaBanner} className="object-contain w-[40%] rounded-3xl drop-shadow-lg" />
      </div>
    </div>
  );
}

export default HeroComponent;
