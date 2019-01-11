export default function Lyticus(clientName, clientProvider) {
  switch (clientName) {
    case "segment":
      return require("./facades/segment")(clientProvider);
    default:
      throw new Error("Client not supported");
  }
}
