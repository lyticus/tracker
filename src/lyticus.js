import GoogleAnalyticsFacade from "./facades/google-analytics";
import SegmentFacade from "./facades/segment";

export default function Lyticus(clientName, clientProvider, configuration) {
  switch (clientName) {
    case "google-analytics":
      return new GoogleAnalyticsFacade(clientProvider, configuration);
    case "segment":
      return new SegmentFacade(clientProvider, configuration);
    default:
      throw new Error("Client not supported");
  }
}
