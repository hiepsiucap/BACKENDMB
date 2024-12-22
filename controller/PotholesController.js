/** @format */
const PothHoles = require("../model/Potholes");
const SensorData = require("../model/SensorData");
const Report = require("../model/Report");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");
const User = require("../model/User");
const isPointOnLineWithTolerance = require("../utils/CheckPothole");
const Potholes = require("../model/Potholes");
const {
  groupByDate,
  groupByDistrict,
  groupByProvince,
} = require("../utils/GroupData");
const CreatePotholes = async (req, res) => {
  const { user } = req;
  const {
    latitude,
    longitude,
    severity,
    accelerometerX,
    accelerometerY,
    province,
    district,
    accelerometerZ,
    currentKilometer,
  } = req.body;

  const poth = await PothHoles.create({
    latitude,
    longitude,
    severity,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    province,
    district,
  });
  if (poth) {
    const sensorData = await SensorData.create({
      pothole: poth._id,
      accelerometerX,
      accelerometerY,
      accelerometerZ,
      currentKilometer,
    });
    const report = await Report.create({
      pothole: poth._id,
      user: user.User_id,
      content: "Create PothHole",
    });
    return res.status(StatusCodes.OK).json({ report, sensorData, poth });
  }
  return res.status(StatusCodes.CONFLICT).json({ msg: "Không thể tạo poth" });
};
const findPothole = async (req, res) => {
  const { longitude, latitude, distance } = req.query;
  const pothHoles = await PothHoles.find({
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], distance / 6378.1],
      },
    },
  });
  return res.status(StatusCodes.OK).json({ pothHoles });
};
const PotholeDeleteAll = async (req, res) => {
  await PothHoles.deleteMany({});
  res.status(StatusCodes.OK).json({ msg: "Xoá tất cả dữ liệu thành công" });
};
const UpdateImagePothole = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  console.log(req.file);
  if (!req.file || !id) {
    throw new CustomAPIError.BadRequestError("Vui lòng điền đầy đủ thông tin");
  }
  const pothole = await Potholes.findOne({ _id: id });
  if (!pothole) {
    throw new CustomAPIError.BadRequestError("Không tồn tại ổ gà");
  }
  pothole.imagePath = req.file.path;
  await pothole.save();
  return res.status(StatusCodes.OK).json({ pothole });
};
const findPotholeWayPoint = async (req, res) => {
  const { waypoint } = req.body;
  const filterpothole = [];
  const listPothole = await PothHoles.find({});
  waypoint.forEach((wp) => {
    const tempdata = listPothole.forEach((ph) => {
      isPointOnLineWithTolerance({
        latitude1: wp.latitude1,
        longitude1: wp.longitude1,
        latitude2: wp.latitude2,
        longitude2: wp.longitude2,
        latitude3: ph.latitude,
        longitude3: ph.longitude,
      });
    });
  });
};
const getPotholesByUserId = async (userId) => {
  try {
    const reports = await Report.find({ user: userId })
      .populate("pothole") // Populate để lấy dữ liệu chi tiết của pothole
      .exec();

    const pothHole = reports.map((report) => report.pothole);
    return pothHole; // Lấy ra danh sách potholes
  } catch (error) {
    console.error("Error fetching potholes:", error);
    throw error;
  }
};
const findPothHoleSurrond = async (req, res) => {
  const { longitude, latitude } = req.query;
  const pothHoles = await PothHoles.find({
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], 5 / 6378100],
      },
    },
  });
  return res.status(StatusCodes.OK).json({ PothHoles: pothHoles });
};
const FindAllPothHole = async (req, res) => {
  const CreateReportPothHole = await PothHoles.find({});
  return res
    .status(StatusCodes.OK)
    .json({ totalpothole: CreatePotholes.length });
};
const GetAllPothole = async (req, res) => {
  const AllPothole = await Potholes.find({});
  const getUserPothole = await getPotholesByUserId(req.user.User_id);
  const filteredPotholes = getUserPothole?.filter(
    (pothole) => pothole !== null
  );
  console.log(filteredPotholes);
  const returnPothHole = AllPothole?.map((ph) => {
    return {
      severity: ph.severity,
      province: ph.province,
      district: ph.district,
      createdAt: ph.createdAt,
      isUser: filteredPotholes?.find((phole) => phole._id.equals(ph._id))
        ? 1
        : 0,
    };
  });
  return res.status(StatusCodes.OK).json({ data: returnPothHole });
};
const CreatePotholesWithImage = async (req, res) => {
  const { user } = req;
  const {
    latitude,
    longitude,
    severity,
    accelerometerX,
    province,
    district,
    accelerometerY,
    accelerometerZ,
    currentKilometer,
  } = req.body;
  console.log(accelerometerX);

  const poth = req?.file
    ? await PothHoles.create({
        latitude,
        longitude,
        severity,
        imagePath: req?.file?.path || "",
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        province,
        district,
      })
    : await PothHoles.create({
        latitude,
        longitude,
        severity,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      });

  if (poth) {
    const sensorData = await SensorData.create({
      pothole: poth._id,
      accelerometerX,
      accelerometerY,
      accelerometerZ,
      currentKilometer,
    });
    const report = await Report.create({
      pothole: poth._id,
      user: user.User_id,
      content: "Create PothHole",
    });
    return res.status(StatusCodes.OK).json({ report, sensorData, poth });
  }
  return res.status(StatusCodes.CONFLICT).json({ msg: "Không thể tạo poth" });
};
const getDashBoard = async (req, res) => {
  const AllPothole = await getPotholesByUserId(req.user.User_id);
  console.log(AllPothole);
  const TotalPothole = await PothHoles.find({});
  const filteredPotholes = AllPothole.filter((pothole) => pothole !== null);
  const groupedByDateListUser = groupByDate(filteredPotholes);
  const groupedByDistrictListUser = groupByDistrict(filteredPotholes);
  const groupedByProvinceListUser = groupByProvince(filteredPotholes);
  const groupedByDateListTotal = groupByDate(TotalPothole);
  const groupedByDistrictListTotal = groupByDistrict(TotalPothole);
  const groupedByProvinceListTotal = groupByProvince(TotalPothole);
  const user = await User.findById({ _id: req.user.User_id });
  return res.status(StatusCodes.OK).json({
    userpothole: filteredPotholes.length,
    totalpothole: TotalPothole.length,
    totaldistance: user.totalkilometer,
    allUser: filteredPotholes,
    allTotal: TotalPothole,
    user: {
      groupbydate: groupedByDateListUser,
      groupbydistrict: groupedByDistrictListUser,
      groupbyprovince: groupedByProvinceListUser,
    },
    total: {
      groupbydate: groupedByDateListTotal,
      groupbydistrict: groupedByDistrictListTotal,
      groupbyprovince: groupedByProvinceListTotal,
    },
  });
};
module.exports = {
  CreatePotholes,
  findPothole,
  FindAllPothHole,
  findPothHoleSurrond,
  PotholeDeleteAll,
  GetAllPothole,
  UpdateImagePothole,
  getDashBoard,
  CreatePotholesWithImage,
};
