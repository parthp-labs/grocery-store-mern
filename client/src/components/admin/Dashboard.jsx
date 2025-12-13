
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
import {
  faFemale,
  faFileInvoice,
  faMale,
  faMoneyBill,
  faTransgender,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useGetStatsQuery } from "../../redux/api/dashboardApi";
import { getLastSixMonths } from "../utils/utilityFunctions";
import { BarChart, DoughnutChart } from "./Charts.jsx";

function Dashboard() {
  const { data, isLoading } = useGetStatsQuery();
  const [chart1Data, setChart1Data] = useState({ labels: [], datasets: [] });
  const [genderRatioData, setGenderRatioData] = useState({
    datasets: [],
    labels: [],
  });
  const lastSixMonths = getLastSixMonths();

  useEffect(() => {
    console.log(getLastSixMonths());
    if (data) {
      console.log(data);
      setChart1Data({
        labels: lastSixMonths,
        datasets: [
          {
            label: "Revenue",
            data: data.stats.orderMonthlyRevenue,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Orders",
            data: data.stats.orderMonthCounts,
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      });

      setGenderRatioData({
        labels: ["Male", "Female"],
        datasets: [
          {
            data: [data.stats.userRatio.male, data.stats.userRatio.female],
          },
        ],
      });
    }
  }, [data]);

  return (
    <div className="admin__dashboard">
      <div className="admin__dashboard__stats">
        <div className="stats__card">
          <div className="stats__card__header">
            <i>
              <FontAwesomeIcon icon={faMoneyBill} />
            </i>
            <span>Revenue</span>
          </div>
          <h2 className="stats__card__value">Rs. {data?.stats.totalRevenue}</h2>
        </div>
        <div className="stats__card">
          <div className="stats__card__header">
            <i>
              <FontAwesomeIcon icon={faProductHunt} />
            </i>
            <span>Items</span>
          </div>
          <h2 className="stats__card__value">{data?.stats.totalItems}</h2>
        </div>
        <div className="stats__card">
          <div className="stats__card__header">
            <i>
              <FontAwesomeIcon icon={faUser} />
            </i>
            <span>Users</span>
          </div>

          <h2 className="stats__card__value">{data?.stats.totalUsers}</h2>
        </div>
        <div className="stats__card">
          <div className="stats__card__header">
            <i>
              <FontAwesomeIcon icon={faFileInvoice} />
            </i>
            <span>Orders</span>
          </div>
          <h2 className="stats__card__value">{data?.stats.totalOrders}</h2>
        </div>
      </div>
      <div className="dashboard__chart__container dashboard_section">
        <h3>Revenue & Orders</h3>
        <BarChart
          labels={getLastSixMonths()}
          data1={data?.stats.orderMonthlyRevenue}
          data2={data?.stats.orderMonthCounts}
          title1="Revenue"
          title2="Orders"
        />
      </div>

      <div className="dashboard__section dashboard__doughnut__charts">
        <div className="dashboard__chart__container gender__ratio__chart">
          <h3>Gender Ratio</h3>

          <DoughnutChart
            labels={["Female", "Male"]}
            data={[data?.stats.userRatio.female, data?.stats.userRatio.male]}
            bgColor={["hsl(340, 82%, 56%)", "rgba(53, 162, 235, 0.8)"]}
          />
          <div className="gender__ratio__indicator">
            <p>
              <FontAwesomeIcon icon={faFemale} />
            </p>
            <p>
              <FontAwesomeIcon icon={faMale} />
            </p>
          </div>
        </div>

        <div className="dashboard__chart__container gender__ratio__chart">
          <h3>Orders Status</h3>

          <DoughnutChart
            labels={["Processing", "Delivered", "Cancelled"]}
            data={[
              data?.stats.processingOrdersCount,
              data?.stats.deliveredOrdersCount,
              data?.stats.cancelledOrdersCount,
            ]}
            bgColor={["#249bc8", "#3cc032", "#dd2222"]}
          />
        </div>
        <div className="dashboard__chart__container gender__ratio__chart">
          <h3>Revenue Distribution for Items</h3>

          <DoughnutChart
            labels={
              data?.stats.chart.revenueDistribution.revenueDistributionItems
            }
            data={
              data?.stats.chart.revenueDistribution.revenueDistributionAmount
            }
            bgColor={["#249bc8", "#3cc032", "#dd2222"]}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
