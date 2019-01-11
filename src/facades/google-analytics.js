import AbstractFacade from "./abstract";

export default class GoogleAnalyticsFacade extends AbstractFacade {
  constructor(clientProvider, configuration) {
    super(clientProvider, configuration);
  }
  identify() {
    throw new Error("Unsupported method");
  }
  page(name) {
    this.clientProvider()("config", this.configuration.trackingId, {
      page_title: name
    });
  }
  track(type, name) {
    this.clientProvider()("event", type, {
      event_label: name
    });
  }
}
