import AgentAvgEarnings from "@/components/Dashboard/CallCenter/AgentAvgEarnings";
import AgentsPerformanceOverview from "@/components/Dashboard/CallCenter/AgentsPerformanceOverview";
import CallCenterGeography from "@/components/Dashboard/CallCenter/CallCenterGeography";
import InboundCalls from "@/components/Dashboard/CallCenter/InboundCalls";
import OutboundCalls from "@/components/Dashboard/CallCenter/OutboundCalls";
import Overview from "@/components/Dashboard/CallCenter/Overview";
import RecentCalls from "@/components/Dashboard/CallCenter/RecentCalls";
import { getCurrentUserFromHeaders } from "@/lib/server-auth";

export default async function Page() {
  // Get authenticated user from middleware
  const user = await getCurrentUserFromHeaders();

  return (
    <>
      {/* Welcome Message */}
      {user && (
        <div className="mb-[25px] p-4 bg-white dark:bg-zinc-800 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Welcome back, {user.email}! 👋
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            User ID: {user.userId}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <Overview />
        </div>

        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-[25px]">
            <InboundCalls />

            <OutboundCalls />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        {/* <AgentsPerformanceOverview /> */}

        {/* <CallCenterGeography /> */}
      </div>
    </>
  );
}
