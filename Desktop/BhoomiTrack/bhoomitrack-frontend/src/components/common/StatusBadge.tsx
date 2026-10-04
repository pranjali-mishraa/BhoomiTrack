interface StatusBadgeProps {
    status: string;
  }
  
  const StatusBadge = ({ status }: StatusBadgeProps) => {
    const normalizedStatus = status.toUpperCase();
  
    const getStatusClasses = () => {
      if (
        [
          "COMPLETED",
          "APPROVED",
          "ACQUIRED",
          "COMPENSATION_PAID",
          "POSSESSION_TAKEN",
          "REHABILITATED",
          "DISBURSED",
          "VERIFIED",
        ].includes(normalizedStatus)
      ) {
        return "bg-green-50 text-green-700 border-green-200";
      }
  
      if (
        [
          "IN_PROGRESS",
          "PROPOSAL_SUBMITTED",
          "SURVEY_IN_PROGRESS",
          "COMPENSATION_IN_PROGRESS",
          "POSSESSION_IN_PROGRESS",
          "ASSISTANCE_DISBURSED",
        ].includes(normalizedStatus)
      ) {
        return "bg-blue-50 text-blue-700 border-blue-200";
      }
  
      if (
        [
          "DELAYED",
          "RETURNED",
          "DISPUTED",
          "PENDING",
          "IDENTIFIED",
          "ELIGIBLE",
        ].includes(normalizedStatus)
      ) {
        return "bg-amber-50 text-amber-700 border-amber-200";
      }
  
      if (
        [
          "REJECTED",
          "CANCELLED",
          "FAILED",
        ].includes(normalizedStatus)
      ) {
        return "bg-red-50 text-red-700 border-red-200";
      }
  
      return "bg-slate-50 text-slate-700 border-slate-200";
    };
  
    const formatStatus = (value: string) => {
      return value
        .toLowerCase()
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
    };
  
    return (
      <span
        className={`inline-flex items-center rounded border px-2.5 py-1 text-xs font-medium ${getStatusClasses()}`}
      >
        {formatStatus(normalizedStatus)}
      </span>
    );
  };
  
  export default StatusBadge;