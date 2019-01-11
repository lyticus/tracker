export default class AbstractFacade {
  constructor(clientProvider) {
    if (new.target === AbstractFacade) {
      throw new TypeError("Abstract constructor");
    }
    this.clientProvider = clientProvider;
  }
  identify() {
    throw new Error("Must override abstract method");
  }
  page() {
    throw new Error("Must override abstract method");
  }
  track() {
    throw new Error("Must override abstract method");
  }
  addDocumentTracker(eventType, selectorStrings) {
    document.addEventListener(eventType, event => {
      const { target } = event;
      for (let index = 0; index < selectorStrings.length; index++) {
        const selectorString = selectorStrings[index];
        if (target.matches(selectorString)) {
          let name = null;
          let properties = null;
          // Parse id
          if (target.id) {
            name = target.id;
          }
          // Parse attributes
          if (target.attributes) {
            // -- Ignore
            const ingoreAttribute = target.attributes.getNamedItem(
              "data-track-ignore"
            );
            if (ingoreAttribute) {
              return;
            }
            // -- Name
            const nameAttribute = target.attributes.getNamedItem(
              "data-track-name"
            );
            if (nameAttribute) {
              name = nameAttribute.value;
            }
            // -- Properties
            const propertiesAttribute = target.attributes.getNamedItem(
              "data-track-properties"
            );
            if (propertiesAttribute) {
              properties = propertiesAttribute.value;
            }
          }
          if (name) {
            track(eventType, name, properties);
          }
          break;
        }
      }
    });
  }
}
