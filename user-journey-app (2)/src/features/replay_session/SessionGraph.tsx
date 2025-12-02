import React from "react";
import { Graphistry } from "@graphistry/client-api-react";

interface SessionGraphProps {
  isPlaying: boolean;
  isDarkMode: boolean;
}

// Thin wrapper around the official Graphistry React component.
//
// The 3-layer semantics (Applications / Navigation / Clicks) are
// encoded in the Graphistry dataset + workbook rather than in
// this React layout. Use a dataset that already has those levels
// configured and styling set up in Graphistry.
const SessionGraph: React.FC<SessionGraphProps> = () => {
  return (
    <div className="w-full h-full">
      <Graphistry
        // TODO: Replace with your real Graphistry dataset ID that
        // encodes the 3 layers (applications, navigation, clicks).
        dataset="REPLACE_WITH_GRAPHISTRY_DATASET_ID"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default SessionGraph;
