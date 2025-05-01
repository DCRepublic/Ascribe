import type {
  HocuspocusProvider,
  onUnsyncedChangesParameters,
} from "@hocuspocus/provider";
import { useState } from "react";
import prisma from "@/app/lib/prisma";
import CircleIcon from "@mui/icons-material/Circle";

const CollaborationStatus = (props: { provider: HocuspocusProvider }) => {
  const { provider } = props;
  provider.configuration.websocketProvider.connect();

  const [unsyncedChanges, setUnsyncedChanges] = useState(0);

  provider.on("unsyncedChanges", (changes: onUnsyncedChangesParameters) =>
    setUnsyncedChanges(changes.number)
  );

  return (
    <div className="absolute justify-self-end ml-5">
      <p>
        Status:{" "}
        {provider.configuration.websocketProvider.status == "connected" ? (
          <CircleIcon color="success" fontSize="small" />
        ) : (
          <CircleIcon color="error" fontSize="small" />
        )}
      </p>

      <p>Changes: {unsyncedChanges}</p>
    </div>
  );
};

export default CollaborationStatus;
