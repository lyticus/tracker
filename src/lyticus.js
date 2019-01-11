import SegmentFacade from "./facades/segment";

export default function Lyticus(clientName, clientProvider) {
  switch (clientName) {
    case "segment":
      return new SegmentFacade(clientProvider);
    default:
      throw new Error("Client not supported");
  }
}
