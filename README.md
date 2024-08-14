# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


Tuần 1: Chuẩn bị và nghiên cứu
Trong tuần đầu tiên, tập trung vào xác định các yêu cầu dự án cả về chức năng và phi chức năng. Tiếp theo, nghiên cứu sâu về các công nghệ sẽ sử dụng, bao gồm React, WebRTC và Firebase. Cuối cùng, thiết lập môi trường phát triển, cài đặt Node.js, npm và khởi tạo dự án React bằng Create React App.

Tuần 2: Thiết kế hệ thống và giao diện
Tuần này, bắt đầu bằng việc thiết kế kiến trúc hệ thống tổng thể, tạo sơ đồ kiến trúc và luồng dữ liệu. Sau đó, tạo wireframe cho các trang chính của giao diện người dùng, đồng thời xác định các component React cần thiết cho ứng dụng.

Tuần 3: Cài đặt Firebase và Authentication
Trong tuần thứ ba, tạo dự án Firebase và cấu hình các dịch vụ cần thiết như Authentication, Firebase hosting và Realtime Database/Firestore. Tích hợp Firebase SDK vào dự án React, sau đó xây dựng chức năng đăng ký và đăng nhập người dùng sử dụng Firebase Authentication, đảm bảo các route cần thiết được bảo vệ.

Tuần 4: Phát triển Frontend cơ bản
Tuần này, tạo các component chính và bố trí giao diện cơ bản cho ứng dụng. Sử dụng Tailwind CSS để thiết kế giao diện. Tiếp tục bằng cách sử dụng React-Router-Dom để điều hướng giữa các trang và quản lý state ứng dụng bằng local storage

Tuần 5: Tích hợp WebRTC và xử lý media
Tuần thứ năm, tập trung vào thiết lập WebRTC và kết nối Peer-to-Peer giữa các người dùng. Sử dụng getUserMedia API để truy cập camera và microphone của người dùng, sau đó hiển thị video và audio trong ứng dụng.

Tuần 6: Xây dựng Signal Server với Firebase
Trong tuần này, thiết lập cấu trúc dữ liệu trong Firebase để sử dụng làm Signal Server, giúp trao đổi thông tin kết nối giữa các client. Thực hiện mã nguồn cho Signal Server và thử nghiệm trao đổi tín hiệu và kết nối giữa các client. Cho phép các người dùng có thể trò chuyện video trực tiếp với nhau, hoặc chat text realtime

Tuần 7: Kiểm thử và cải thiện hiệu năng
Tuần này, tiến hành kiểm thử đơn vị (unit testing) và kiểm thử tích hợp (integration testing) để đảm bảo các chức năng hoạt động đúng. Sửa lỗi và tối ưu hóa mã nguồn. Sau đó, thực hiện kiểm thử hệ thống trên các thiết bị và trình duyệt khác nhau để đảm bảo tính tương thích và hiệu năng tốt.

Tuần 8: Triển khai và viết báo cáo
Trong tuần cuối cùng, triển khai ứng dụng lên Firebase Hosting và thực hiện kiểm thử ứng dụng trực tuyến. Hoàn thành viết báo cáo bao gồm các phần từ giới thiệu, cơ sở lý thuyết, thiết kế, triển khai, kiểm thử, đến kết luận. Cuối cùng, chỉnh sửa báo cáo dựa trên phản hồi từ giảng viên hoặc nhóm, chuẩn bị và nộp báo cáo hoàn chỉnh.