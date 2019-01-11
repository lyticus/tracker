import AbstractFacade from "./abstract";

export default class SegmentFacade extends AbstractFacade {
  constructor(clientProvider, configuration) {
    super(clientProvider, configuration);
  }
  identify({ userId = undefined, traits }) {
    this.clientProvider().identify(userId, traits);
  }
  page(name) {
    this.clientProvider().page(name);
  }
  track(type, name, properties) {
    this.clientProvider().track(`${type}--${name}`, properties);
  }
}
