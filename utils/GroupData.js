/** @format */

// Nhóm dữ liệu theo district
const groupByDistrict = (data) => {
  return data.reduce((acc, item) => {
    const district = item.district;

    if (!acc[district]) {
      acc[district] = [];
    }
    acc[district].push(item);

    return acc;
  }, {});
};

// Nhóm dữ liệu theo province
const groupByProvince = (data) => {
  return data.reduce((acc, item) => {
    const province = item.province;

    if (!acc[province]) {
      acc[province] = [];
    }
    acc[province].push(item);

    return acc;
  }, {});
};

// Nhóm dữ liệu theo ngày từ createdAt
const groupByDate = (data) => {
  return data.reduce((acc, item) => {
    const date = new Date(item.createdAt).toISOString().split("T")[0]; // Format: YYYY-MM-DD

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);

    return acc;
  }, {});
};

// Xuất tất cả các hàm
module.exports = {
  groupByDistrict,
  groupByProvince,
  groupByDate,
};
