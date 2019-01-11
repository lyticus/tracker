import AbstractFacade from "./abstract";

export default class SegmentFacade extends AbstractFacade {
  constructor(clientProvider) {
    super(clientProvider);
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
