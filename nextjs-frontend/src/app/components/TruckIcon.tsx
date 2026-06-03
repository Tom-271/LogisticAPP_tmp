"use client";

import dynamic from "next/dynamic";

const LocalShippingIcon = dynamic(
  () => import("@mui/icons-material/LocalShipping"),
  { ssr: false }
);

export default function TruckIcon() {
  return <LocalShippingIcon className="text-white" fontSize="large" />;
}
