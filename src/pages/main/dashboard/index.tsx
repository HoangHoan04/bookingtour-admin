import BaseView from "@/components/ui/BaseView";
import { usePaginationCustomer } from "@/hooks/customer";
import { usePaginationTour } from "@/hooks/tour";
import { usePaginationTourGuide } from "@/hooks/tour-guide";
import { usePaginationNew } from "@/hooks/new";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { PrimeIcons } from "primereact/api";

const COLORS = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
  "#ec4899",
];

const MOCK_REVENUE = [
  { month: "Jan", revenue: 15400, bookings: 120 },
  { month: "Feb", revenue: 12500, bookings: 98 },
  { month: "Mar", revenue: 22000, bookings: 160 },
  { month: "Apr", revenue: 18000, bookings: 130 },
  { month: "May", revenue: 24000, bookings: 190 },
  { month: "Jun", revenue: 28000, bookings: 220 },
  { month: "Jul", revenue: 35000, bookings: 280 },
];

export default function Dashboard() {
  const { total: totalCustomers } = usePaginationCustomer({
    skip: 0,
    take: 100,
    where: {} as any,
  });
  const { total: totalTours, data: tours } = usePaginationTour({
    skip: 0,
    take: 100,
    where: {} as any,
  });
  const { total: totalGuides } = usePaginationTourGuide({
    skip: 0,
    take: 10,
    where: {} as any,
  });
  const { total: totalNews } = usePaginationNew({
    skip: 0,
    take: 10,
    where: {} as any,
  });

  // Generate dynamic data from real API if available, else mock
  const totalBookings = useMemo(() => {
    return (
      tours?.reduce((acc, tour) => acc + (tour.bookingCount || 0), 0) || 1245
    );
  }, [tours]);

  const toursByCategory = useMemo(() => {
    if (tours?.length) {
      const result: Record<string, number> = {};
      tours.forEach((t) => {
        const cat = t.category || "Khác";
        result[cat] = (result[cat] || 0) + 1;
      });
      return Object.entries(result).map(([name, value]) => ({ name, value }));
    }
    return [
      { name: "Khám phá", value: 45 },
      { name: "Nghỉ dưỡng", value: 30 },
      { name: "Mạo hiểm", value: 15 },
      { name: "Văn hóa", value: 10 },
    ];
  }, [tours]);

  const statCards = [
    {
      title: "Tổng khách hàng",
      value: totalCustomers || 234,
      icon: PrimeIcons.USERS,
      color: "from-blue-500 to-cyan-400",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Chuyến tham quan",
      value: totalTours || 42,
      icon: PrimeIcons.MAP,
      color: "from-emerald-500 to-teal-400",
      trend: "+5.2%",
      trendUp: true,
    },
    {
      title: "Lượt đặt tour",
      value: totalBookings,
      icon: PrimeIcons.SHOPPING_CART,
      color: "from-orange-500 to-amber-400",
      trend: "+18.4%",
      trendUp: true,
    },
    {
      title: "Hướng dẫn viên",
      value: totalGuides || 18,
      icon: PrimeIcons.ID_CARD,
      color: "from-purple-500 to-indigo-400",
      trend: "-2.1%",
      trendUp: false,
    },
    {
      title: "Bài viết",
      value: totalNews || 18,
      icon: PrimeIcons.FILE,
      color: "from-purple-500 to-indigo-400",
      trend: "-2.1%",
      trendUp: false,
    },
  ];

  return (
    <BaseView>
      <div className="p-6  min-h-screen font-sans">
        <div className="mb-8">
          <h1 className="text-3xl font-bold  tracking-tight">
            Tổng quan hệ thống 👋
          </h1>
          <p className="text-slate-500 mt-2">
            Theo dõi các chỉ số quan trọng và hoạt động kinh doanh mới nhất.
          </p>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${stat.color} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}
              ></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold ">
                    {stat.value.toLocaleString()}
                  </h3>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br ${stat.color} shadow-inner`}
                >
                  <i className={`${stat.icon} text-xl`}></i>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span
                  className={`flex items-center font-medium ${
                    stat.trendUp ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  <i
                    className={
                      stat.trendUp
                        ? "pi pi-arrow-up-right mr-1 text-xs"
                        : "pi pi-arrow-down-right mr-1 text-xs"
                    }
                  ></i>
                  {stat.trend}
                </span>
                <span className="text-slate-400 ml-2">so với tháng trước</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2  rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold ">
                Doanh thu & Lượt đặt (Tháng)
              </h2>
              <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                <option>Năm 2026</option>
                <option>Năm 2025</option>
              </select>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={MOCK_REVENUE}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow:
                        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: any) => [
                      `$${Number(value).toLocaleString()}`,
                      "Doanh thu",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#0ea5e9" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className=" rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold  mb-6">Danh mục Tour</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={toursByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {toursByCategory.map((index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
              {toursByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-slate-600">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold ">
                    {category.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          <div className=" rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold  mb-6">Thống kê Lượt Đặt Tour</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MOCK_REVENUE}
                  barSize={24}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f1f5f9" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className=" rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold ">Mới cập nhật</h2>
              <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                Xem tất cả
              </button>
            </div>
            <div className="flex-1 overflow-auto pr-2">
              <div className="space-y-4">
                {tours?.slice(0, 5).map((tour, idx) => (
                  <div
                    key={tour.id || idx}
                    className="flex items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-4 shrink-0">
                      <i className="pi pi-map scale-125"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold  truncate">
                        {tour.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {tour.location}
                      </p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <div className="text-sm font-bold text-emerald-600">
                        {tour.bookingCount || 0} đặt
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        <i className="pi pi-star-fill text-yellow-400 text-[10px] mr-1"></i>
                        {Math.round(tour.rating || 5)}.0
                      </div>
                    </div>
                  </div>
                ))}
                {(!tours || tours.length === 0) && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                    <i className="pi pi-inbox text-4xl mb-3 opacity-50"></i>
                    <p>Chưa có dữ liệu tour mới</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseView>
  );
}
