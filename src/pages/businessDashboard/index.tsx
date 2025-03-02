import { useGetBusinessAnalyticsQuery } from "@/store/service/businessApi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Loader2 } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BusinessDashboard = () => {
  const { data, isLoading } = useGetBusinessAnalyticsQuery();

  const chartData = {
    labels: data?.map((business) => business.businessName),
    datasets: [
      {
        label: "COMMENTS",
        data: data?.map(
          (business) =>
            business.data?.find((interaction) => interaction.type === "COMMENT")
              ?.count || 0
        ),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "VISITS",
        data: data?.map(
          (business) =>
            business.data?.find((interaction) => interaction.type === "VISIT")
              ?.count || 0
        ),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Business Interaction Dashboard",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.raw} interactions`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Business Name",
        },
      },
      y: {
        title: {
          display: true,
          text: "Interactions Count",
        },
        min: 0,
      },
    },
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );

  if (!data?.length) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Business Interaction Analytics
        </h2>
        No Interaction Yet
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
        Business Interaction Analytics
      </h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default BusinessDashboard;
